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

// ─── Free Service Endpoints ───────────────────────────────────────
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
    service: 'PixelFlow AI',
    version: '1.1.0',
    mode: 'FREE',
    playground: '/test',
    services: Object.values(SERVICES).map((s) => ({
      name: s.name,
      endpoint: s.endpoint,
      price: s.price,
    })),
    timestamp: new Date().toISOString(),
  });
});

// Clean JSON API Homepage for AI Agents & OKX.AI Crawlers
app.get('/', (_req, res) => {
  res.json({
    name: 'PixelFlow AI',
    tagline: 'High-speed image optimization, format conversion, and resizing API for AI agents.',
    version: '1.1.0',
    mode: 'FREE',
    playground: '/test',
    health: '/health',
    services: Object.values(SERVICES).map((s) => ({
      name: s.name,
      endpoint: s.endpoint,
      method: s.method,
      price: s.price,
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
  console.log(`\n🚀 PixelFlow AI running on 0.0.0.0:${CONFIG.port} (FREE MODE)`);
});
