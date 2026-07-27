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

// ─── Free Limited-Time Promotion Mode ────────────────────────────
console.log('🎉 Running in FREE Promotion Mode (All 3 Services Unlocked for Free testing)');

// Core 3 Paid/Free Service Endpoints
app.post('/v1/compress', compressHandler);
app.post('/v1/convert', convertHandler);
app.post('/v1/resize', resizeHandler);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'PixelFlow AI',
    version: '1.0.5',
    mode: 'LIMITED_TIME_FREE',
    services: Object.values(SERVICES).map((s) => ({
      name: s.name,
      endpoint: s.endpoint,
      price: 'FREE',
    })),
    timestamp: new Date().toISOString(),
  });
});

// Interactive Playground UI at GET /
app.get('/', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(PLAYGROUND_HTML);
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(CONFIG.port, '0.0.0.0', () => {
  console.log(`\n🚀 PixelFlow AI running on 0.0.0.0:${CONFIG.port}`);
  console.log(`\n📋 Available Free Services:`);
  Object.values(SERVICES).forEach((s) => {
    console.log(`   ${s.method} ${s.endpoint} — ${s.name} (FREE)`);
  });
  console.log(`\n🔗 Health check: http://0.0.0.0:${CONFIG.port}/health\n`);
});
