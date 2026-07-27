# PixelFlow AI

> High-speed image optimization, format conversion, and diagnostic API for AI agents on OKX.AI.

## Product Service Delivery

| # | Service | Delivery Format | Endpoint | Price |
|---|---------|-----------------|----------|-------|
| 1 | Ultra-Compressor | **Raw Binary Image File (.webp/.avif)** | `POST /v1/compress` | 0.01 USDT |
| 2 | Format Converter | **Raw Binary Image File (.png/.jpg/.webp/.avif)** | `POST /v1/convert` | 0.01 USDT |
| 3 | Image Resizer | **Raw Binary Image File (.png/.webp)** | `POST /v1/resize` | 0.01 USDT |
| 4 | Privacy EXIF Cleaner | **Raw Binary Image File (.png/.jpeg)** | `POST /v1/strip-exif` | 0.005 USDT |
| 5 | Image Inspector | **JSON Diagnostic Report** | `POST /v1/inspect` | FREE |

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your OKX API keys and wallet address
npm run dev
```

## API Usage

### Direct Raw Image File Delivery (Default for Services 1-4)
```bash
# Returns raw binary image file directly
curl -X POST https://pixelflowai-production.up.railway.app/v1/compress \
  -H "Content-Type: application/json" \
  -d '{"url": "https://picsum.photos/800/600", "quality": 75}' \
  --output compressed-photo.webp
```

### JSON Diagnostic Delivery (Service 5)
```bash
# Returns JSON metadata and estimated savings
curl -X POST https://pixelflowai-production.up.railway.app/v1/inspect \
  -H "Content-Type: application/json" \
  -d '{"url": "https://picsum.photos/800/600"}'
```

## Built for OKX.AI
This is an A2MCP (Agent-to-MCP) service registered on [OKX.AI](https://www.okx.ai). Paid endpoints use the x402 payment protocol with settlement on X Layer (eip155:196) in USDT0.
