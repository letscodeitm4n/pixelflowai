# ⚡ PixelFlow AI

> **High-Speed Image Processing, Format Conversion, & Resizing Engine for AI Agents on OKX.AI**

![PixelFlow Banner](https://static.okx.com/cdn/web3/wallet/marketplace/headimages/agent/avatar/ef64b6a6-bc3a-4fb3-91db-4fd1581de2ca.png)

[![Agent ID](https://img.shields.io/badge/OKX%20Agent%20ID-%239859-blue?style=flat-square)](https://www.okx.ai)
[![Protocol](https://img.shields.io/badge/Protocol-x402%20v2-green?style=flat-square)](https://x402.org)
[![Network](https://img.shields.io/badge/Network-X%20Layer%20%28eip155%3A196%29-purple?style=flat-square)](https://www.okx.com/xlayer)
[![Payment Asset](https://img.shields.io/badge/Payment-USDT0%20%280.001%20USDT%2Fuse%29-emerald?style=flat-square)](https://www.okx.com/xlayer)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

---

## 🌟 Overview

**PixelFlow AI** is an autonomous micro-service engine designed specifically for AI agents, web applications, and content pipelines. It provides high-efficiency image compression, multi-format conversion, and precise dimension resizing powered by WebAssembly/Sharp graphics processing.

All paid endpoints enforce native on-chain micro-payments via the **OKX Agent Payments Protocol (x402 v2)** on X Layer.

---

## 🛠️ Micro-Services & Pricing

| # | Service Name | Endpoint | Fee | Delivery Format | Description |
|---|---|---|---|---|---|
| 1 | **Ultra-Compressor** | `POST /v1/compress` | **0.001 USDT** | Raw Image / JSON | Compress images by 70–90% via WebP/AVIF while maintaining visual quality. |
| 2 | **Format Converter** | `POST /v1/convert` | **0.001 USDT** | Raw Image / JSON | Convert between PNG, JPG, WebP, and AVIF formats seamlessly. |
| 3 | **Image Resizer** | `POST /v1/resize` | **0.001 USDT** | Raw Image / JSON | Resize images to exact width, height, and aspect ratio fit modes (`cover`, `contain`, `fill`, `inside`, `outside`). |

---

## 💳 Payment Architecture (x402 Protocol v2)

PixelFlow implements the official **OKX Agent Payments Protocol (x402 v2)**:

- **Network**: X Layer Mainnet (`eip155:196`)
- **Asset**: USDT0 (`0x779ded0c9e1022225f8e0630b35a9b54be713736`)
- **Pay-To Address**: `0xae003877641ed159f45296904014ac1616d50f76`
- **Fee per Call**: **0.001 USDT** (`1000` atomic units, 6 decimals)
- **Challenge Header**: `PAYMENT-REQUIRED` (base64-encoded x402 v2 payload with `maxTimeoutSeconds: 600`)
- **Authorization Header**: `PAYMENT-SIGNATURE` (EIP-3009 off-chain signature authorization)

---

## 🚀 Quick Start (Local Development)

### 1. Installation

```bash
git clone https://github.com/letscodeitm4n/pixelflowai.git
cd pixelflowai
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```env
PORT=4000
PAY_TO_ADDRESS=0xae003877641ed159f45296904014ac1616d50f76
```

### 3. Run Server

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

---

## 🤖 Interacting via OKX Onchain OS CLI

### 1. Probe Endpoint (Quote Challenge)

```bash
onchainos payment quote https://pixelflowai-production.up.railway.app/v1/compress \
  --method POST \
  --param image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
```

**Response Output:**
```json
{
  "ok": true,
  "data": {
    "paymentId": "pay_...",
    "summary": "Will pay 0.001 USDT (exact, X Layer)",
    "candidates": [
      {
        "scheme": "exact",
        "chainName": "X Layer",
        "amountHuman": "0.001",
        "tokenSymbol": "USDT"
      }
    ]
  }
}
```

### 2. Execute Payment & Retrieve Result

```bash
onchainos payment pay --payment-id <paymentId> --selected-index 0 --yes
```

---

## 📖 API Usage & Delivery Modes

### Mode A: Raw Binary Image Stream (Default)

Ideal for web apps, HTML `<img>` tags, or direct asset downloads:

```bash
curl -X POST https://pixelflowai-production.up.railway.app/v1/compress \
  -H "Content-Type: application/json" \
  -H "PAYMENT-SIGNATURE: <base64_authorization>" \
  -d '{"image": "data:image/png;base64,...", "quality": 75, "format": "webp"}' \
  --output optimized.webp
```

### Mode B: Structured JSON Metadata

Add `?format=json` to receive structured JSON metadata alongside the base64-encoded image string:

```bash
curl -X POST "https://pixelflowai-production.up.railway.app/v1/compress?format=json" \
  -H "Content-Type: application/json" \
  -H "PAYMENT-SIGNATURE: <base64_authorization>" \
  -d '{"image": "data:image/png;base64,...", "quality": 75}'
```

**JSON Response Example:**
```json
{
  "success": true,
  "originalSize": 34820,
  "compressedSize": 8420,
  "savings": "75.8%",
  "quality": 75,
  "format": "webp",
  "image": "data:image/webp;base64,UklGR...",
  "timestamp": "2026-07-28T05:57:56.199Z"
}
```

---

## 🌐 Playgrounds

- 📺 **Demo Video Playground**: [https://pixelflowai-production.up.railway.app/test1](https://pixelflowai-production.up.railway.app/test1) (Unprotected for recording demo videos)
- 🧪 **Interactive Web Playground**: [https://pixelflowai-production.up.railway.app/test](https://pixelflowai-production.up.railway.app/test) (Full UI test environment)
- ❤️ **Health Check**: [https://pixelflowai-production.up.railway.app/health](https://pixelflowai-production.up.railway.app/health)

---

## 📄 License

[MIT License](LICENSE) © 2026 PixelFlow AI
