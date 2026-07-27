import express from 'express';
import { CONFIG, SERVICES } from './config.js';
import { compressHandler } from './services/compress.js';
import { convertHandler } from './services/convert.js';
import { resizeHandler } from './services/resize.js';
import { PLAYGROUND_HTML } from './views/ui.js';

const app = express();

app.use(express.json({ limit: '35mb' }));

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction): void {
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
    if (now > entry.resetTime) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ─── OKX Payment Middleware (x402 Protocol) ───────────────────────
const hasPaymentCredentials =
  process.env.OKX_API_KEY &&
  process.env.OKX_SECRET_KEY &&
  process.env.OKX_PASSPHRASE &&
  process.env.PAY_TO_ADDRESS;

if (hasPaymentCredentials) {
  Promise.all([
    import('@okxweb3/x402-express'),
    import('@okxweb3/x402-core'),
    import('@okxweb3/x402-evm/exact/server'),
  ])
    .then(([{ paymentMiddleware, x402ResourceServer }, { OKXFacilitatorClient }, { ExactEvmScheme }]) => {
      const facilitatorClient = new OKXFacilitatorClient({
        apiKey: process.env.OKX_API_KEY!,
        secretKey: process.env.OKX_SECRET_KEY!,
        passphrase: process.env.OKX_PASSPHRASE!,
      });

      const resourceServer = new x402ResourceServer(facilitatorClient);
      resourceServer.register(CONFIG.network, new ExactEvmScheme());

      const PAY_TO = process.env.PAY_TO_ADDRESS!;

      const routesConfig: any = {
        [`POST ${SERVICES.compress.endpoint}`]: {
          accepts: [{ scheme: 'exact', network: CONFIG.network, asset: CONFIG.asset, payTo: PAY_TO, price: SERVICES.compress.price }],
          description: SERVICES.compress.description,
          mimeType: SERVICES.compress.mimeType,
        },
        [`POST ${SERVICES.convert.endpoint}`]: {
          accepts: [{ scheme: 'exact', network: CONFIG.network, asset: CONFIG.asset, payTo: PAY_TO, price: SERVICES.convert.price }],
          description: SERVICES.convert.description,
          mimeType: SERVICES.convert.mimeType,
        },
        [`POST ${SERVICES.resize.endpoint}`]: {
          accepts: [{ scheme: 'exact', network: CONFIG.network, asset: CONFIG.asset, payTo: PAY_TO, price: SERVICES.resize.price }],
          description: SERVICES.resize.description,
          mimeType: SERVICES.resize.mimeType,
        },
      };

      app.use(paymentMiddleware(routesConfig, resourceServer));

      console.log('✅ OKX x402 Payment Middleware activated for X Layer (eip155:196) with USDT0');
      registerRoutes();
    })
    .catch((err) => {
      console.error('⚠️ Failed to load OKX Payment SDK:', err.message);
      registerRoutes();
    });
} else {
  console.log('📦 Open access mode active (price: 0 USDT/use)');
  registerRoutes();
}

function registerRoutes(): void {
  // Service Endpoints
  app.post('/v1/compress', compressHandler);
  app.post('/v1/convert', convertHandler);
  app.post('/v1/resize', resizeHandler);

  // Interactive Playground UI at GET /test
  app.get('/test', (_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(PLAYGROUND_HTML);
  });

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'PixelFlow',
      version: '1.2.4',
      network: CONFIG.network,
      asset: 'USDT0',
      playground: '/test',
      services: Object.values(SERVICES).map((s) => ({
        name: s.name,
        endpoint: s.endpoint,
        price: '0.00 USDT/use',
      })),
      timestamp: new Date().toISOString(),
    });
  });

  // Clean JSON API Homepage for AI Agents & OKX.AI Crawlers
  app.get('/', (_req, res) => {
    res.json({
      name: 'PixelFlow',
      tagline: 'High-speed image optimization, format conversion, and resizing API for AI agents.',
      version: '1.2.4',
      network: CONFIG.network,
      asset: 'USDT0 (0x779ded0c9e1022225f8e0630b35a9b54be713736)',
      playground: '/test',
      health: '/health',
      services: Object.values(SERVICES).map((s) => ({
        name: s.name,
        endpoint: s.endpoint,
        method: s.method,
        price: '0.00 USDT/use',
        description: s.description,
      })),
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
  });

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  });

  app.listen(CONFIG.port, '0.0.0.0', () => {
    console.log(`\n🚀 PixelFlow running on 0.0.0.0:${CONFIG.port}`);
  });
}
