import express from 'express';
import { paymentMiddleware, x402ResourceServer } from '@okxweb3/x402-express';
import { OKXFacilitatorClient } from '@okxweb3/x402-core';
import { ExactEvmScheme } from '@okxweb3/x402-evm/exact/server';
import { CONFIG, SERVICES } from './config';
import { compressHandler } from './services/compress';
import { convertHandler } from './services/convert';
import { resizeHandler } from './services/resize';
import { stripExifHandler } from './services/strip-exif';
import { inspectHandler } from './services/inspect';

const app = express();

// Parse JSON bodies (limit 25MB for base64 images)
app.use(express.json({ limit: '25mb' }));

// Simple rate limiter
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

// Cleanup stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ─── x402 Payment Middleware ─────────────────────────────────────
const hasPaymentCredentials = Boolean(
  process.env.OKX_API_KEY &&
  process.env.OKX_SECRET_KEY &&
  process.env.OKX_PASSPHRASE &&
  process.env.PAY_TO_ADDRESS
);

if (hasPaymentCredentials) {
  try {
    const facilitatorClient = new OKXFacilitatorClient({
      apiKey: process.env.OKX_API_KEY!,
      secretKey: process.env.OKX_SECRET_KEY!,
      passphrase: process.env.OKX_PASSPHRASE!,
    });

    const resourceServer = new x402ResourceServer(facilitatorClient);
    resourceServer.register(CONFIG.network, new ExactEvmScheme());

    const PAY_TO = process.env.PAY_TO_ADDRESS!;

    app.use(
      paymentMiddleware(
        {
          [`POST ${SERVICES.compress.endpoint}`]: {
            accepts: [{ scheme: 'exact', network: CONFIG.network, payTo: PAY_TO, price: SERVICES.compress.price }],
            description: SERVICES.compress.description,
            mimeType: SERVICES.compress.mimeType,
          },
          [`POST ${SERVICES.convert.endpoint}`]: {
            accepts: [{ scheme: 'exact', network: CONFIG.network, payTo: PAY_TO, price: SERVICES.convert.price }],
            description: SERVICES.convert.description,
            mimeType: SERVICES.convert.mimeType,
          },
          [`POST ${SERVICES.resize.endpoint}`]: {
            accepts: [{ scheme: 'exact', network: CONFIG.network, payTo: PAY_TO, price: SERVICES.resize.price }],
            description: SERVICES.resize.description,
            mimeType: SERVICES.resize.mimeType,
          },
          [`POST ${SERVICES['strip-exif'].endpoint}`]: {
            accepts: [{ scheme: 'exact', network: CONFIG.network, payTo: PAY_TO, price: SERVICES['strip-exif'].price }],
            description: SERVICES['strip-exif'].description,
            mimeType: SERVICES['strip-exif'].mimeType,
          },
        },
        resourceServer,
      ),
    );

    console.log('✅ x402 payment middleware initialized');
  } catch (err) {
    console.error('⚠️ Failed to initialize payment middleware:', err);
    console.log('📦 Running in development mode');
  }
} else {
  console.log('📦 No OKX credentials found — running in development mode (free testing enabled)');
}

// ─── Routes ──────────────────────────────────────────────────────
app.post('/v1/compress', compressHandler);
app.post('/v1/convert', convertHandler);
app.post('/v1/resize', resizeHandler);
app.post('/v1/strip-exif', stripExifHandler);
app.post('/v1/inspect', inspectHandler);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'PixelFlow AI',
    version: '1.0.0',
    mode: hasPaymentCredentials ? 'production' : 'development',
    services: Object.values(SERVICES).map((s) => ({
      name: s.name,
      endpoint: s.endpoint,
      price: s.price === '$0.00' ? 'FREE' : s.price,
    })),
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get('/', (_req, res) => {
  res.json({
    name: 'PixelFlow AI',
    tagline: 'High-speed image optimization, format conversion, and diagnostic API for AI agents.',
    docs: '/health',
    version: '1.0.0',
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(CONFIG.port, () => {
  console.log(`\n🚀 PixelFlow AI running on port ${CONFIG.port}`);
  console.log(`\n📋 Available services:`);
  Object.values(SERVICES).forEach((s) => {
    const priceTag = s.price === '$0.00' ? 'FREE' : s.price;
    console.log(`   ${s.method} ${s.endpoint} — ${s.name} (${priceTag})`);
  });
  console.log(`\n🔗 Health check: http://localhost:${CONFIG.port}/health\n`);
});
