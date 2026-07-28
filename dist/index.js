import express from 'express';
import { CONFIG, SERVICES } from './config.js';
import { compressHandler } from './services/compress.js';
import { convertHandler } from './services/convert.js';
import { resizeHandler } from './services/resize.js';
import { PLAYGROUND_HTML, PLAYGROUND_TEST1_HTML } from './views/ui.js';
const app = express();
app.use(express.json({ limit: '35mb' }));
const rateLimitMap = new Map();
function rateLimiter(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + CONFIG.rateLimitWindowMs });
        return next();
    }
    entry.count++;
    if (entry.count > CONFIG.rateLimitMax) {
        res.status(429).json({
            success: false,
            error: 'Rate limit exceeded. Please wait before making more requests.',
            retryAfterMs: entry.resetTime - now,
        });
        return;
    }
    next();
}
app.use(rateLimiter);
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime)
            rateLimitMap.delete(ip);
    }
}, 5 * 60 * 1000);
const PAY_TO = process.env.PAY_TO_ADDRESS || '0xae003877641ed159f45296904014ac1616d50f76';
// ─── OKX x402 v2 Payment Middleware (PAYMENT-REQUIRED header) ───────────────
function enforceX402Payment(price, description, endpoint) {
    return (req, res, next) => {
        // Empty probes without image parameter return 200 OK Usage API JSON for discovery
        if (!req.body || !req.body.image || typeof req.body.image !== 'string' || req.body.image.trim() === '') {
            return next();
        }
        // Check for x402 Payment Authorization / Proof header
        const paymentSig = req.headers['payment-signature'] || req.headers['x-payment'] || req.headers['authorization'];
        if (!paymentSig) {
            // Build x402 v2 payload per OKX Agent Payments Protocol spec
            const challengePayload = {
                x402Version: 2,
                resource: {
                    url: `https://pixelflowai-production.up.railway.app${endpoint}`,
                    description,
                    mimeType: 'application/json',
                },
                accepts: [
                    {
                        scheme: 'exact',
                        network: CONFIG.network,
                        asset: CONFIG.asset,
                        payTo: PAY_TO,
                        amount: '1000', // 0.001 USDT in atomic units (6 decimals)
                        maxTimeoutSeconds: 600,
                    },
                ],
            };
            // Encode as base64 for PAYMENT-REQUIRED header (x402 v2 standard)
            const b64Payload = Buffer.from(JSON.stringify(challengePayload)).toString('base64');
            // Set PAYMENT-REQUIRED header (v2 format that onchainos CLI expects)
            res.setHeader('PAYMENT-REQUIRED', b64Payload);
            // Return 402 with the challenge in the body as well (v1 fallback)
            res.status(402).json(challengePayload);
            return;
        }
        next();
    };
}
// ─── Routes ──────────────────────────────────────────────────────
function registerRoutes() {
    // Official Production Paid Endpoints (0.001 USDT x402 Enforced)
    app.post('/v1/compress', enforceX402Payment(SERVICES.compress.price, SERVICES.compress.description, SERVICES.compress.endpoint), compressHandler);
    app.post('/v1/convert', enforceX402Payment(SERVICES.convert.price, SERVICES.convert.description, SERVICES.convert.endpoint), convertHandler);
    app.post('/v1/resize', enforceX402Payment(SERVICES.resize.price, SERVICES.resize.description, SERVICES.resize.endpoint), resizeHandler);
    // Demo Video Endpoints (Unprotected Direct Image Optimization for Demo Videos)
    app.post('/v1/test1/compress', compressHandler);
    app.post('/v1/test1/convert', convertHandler);
    app.post('/v1/test1/resize', resizeHandler);
    // Demo Video Playground UI at GET /test1
    app.get('/test1', (_req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(PLAYGROUND_TEST1_HTML);
    });
    // Official Interactive Playground UI at GET /test
    app.get('/test', (_req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(PLAYGROUND_HTML);
    });
    // Health check
    app.get('/health', (_req, res) => {
        res.json({
            status: 'healthy',
            service: 'PixelFlow',
            version: '1.6.0',
            network: CONFIG.network,
            asset: 'USDT0 (0x779ded0c9e1022225f8e0630b35a9b54be713736)',
            payTo: PAY_TO,
            demoPlayground: '/test1',
            officialPlayground: '/test',
            services: Object.values(SERVICES).map((s) => ({
                name: s.name,
                endpoint: s.endpoint,
                price: s.price + ' USDT/use',
            })),
            timestamp: new Date().toISOString(),
        });
    });
    // Clean JSON API Homepage for AI Agents & OKX.AI Crawlers
    app.get('/', (_req, res) => {
        res.json({
            name: 'PixelFlow',
            tagline: 'High-speed image optimization, format conversion, and resizing API for AI agents.',
            version: '1.6.0',
            network: CONFIG.network,
            asset: 'USDT0 (0x779ded0c9e1022225f8e0630b35a9b54be713736)',
            payTo: PAY_TO,
            demoPlayground: '/test1',
            officialPlayground: '/test',
            health: '/health',
            services: Object.values(SERVICES).map((s) => ({
                name: s.name,
                endpoint: s.endpoint,
                method: s.method,
                price: s.price + ' USDT/use',
                description: s.description,
            })),
        });
    });
    app.use((_req, res) => {
        res.status(404).json({ success: false, error: 'Endpoint not found' });
    });
    app.use((err, _req, res, _next) => {
        console.error('Unhandled error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    });
    app.listen(CONFIG.port, '0.0.0.0', () => {
        console.log(`\n🚀 PixelFlow v1.5.0 running on 0.0.0.0:${CONFIG.port}`);
    });
}
registerRoutes();
