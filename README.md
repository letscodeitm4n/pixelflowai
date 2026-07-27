# PixelFlow AI

> High-speed image optimization, format conversion, and diagnostic API for AI agents on OKX.AI.

## Services

| # | Service | Price | Endpoint |
|---|---------|-------|----------|
| 1 | Ultra-Compressor | 0.01 USDT | `POST /v1/compress` |
| 2 | Format Converter | 0.01 USDT | `POST /v1/convert` |
| 3 | Image Resizer | 0.01 USDT | `POST /v1/resize` |
| 4 | Privacy EXIF Cleaner | 0.005 USDT | `POST /v1/strip-exif` |
| 5 | Image Inspector | FREE | `POST /v1/inspect` |

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your OKX API keys and wallet address
npm run dev
```

## API Usage

All endpoints accept either a URL or base64 image:

```bash
# Via URL
curl -X POST http://localhost:4000/v1/inspect \
  -H "Content-Type: application/json" \
  -d '{"url": "https://picsum.photos/800/600.jpg"}'

# Via Base64
curl -X POST http://localhost:4000/v1/inspect \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/png;base64,iVBOR..."}'
```

## Deploy to Railway

1. Push to GitHub
2. Connect repo in Railway dashboard
3. Add environment variables in Railway settings
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OKX_API_KEY` | OKX Developer Portal API key |
| `OKX_SECRET_KEY` | OKX Developer Portal secret key |
| `OKX_PASSPHRASE` | OKX Developer Portal passphrase |
| `PAY_TO_ADDRESS` | Your EVM wallet address (X Layer) |
| `PORT` | Server port (default: 4000) |

## Built for OKX.AI

This is an A2MCP (Agent-to-MCP) service registered on [OKX.AI](https://www.okx.ai). Paid endpoints use the x402 payment protocol with settlement on X Layer (eip155:196) in USDT0.
