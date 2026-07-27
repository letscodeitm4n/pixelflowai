export const CONFIG = {
  network: 'eip155:196', // CAIP-2 format required by OKX Admin for X Layer
  asset: '0x779ded0c9e1022225f8e0630b35a9b54be713736', // Official USDT0 token on X Layer
  port: parseInt(process.env.PORT || '4000', 10),
  maxImageSize: 25 * 1024 * 1024, // 25MB
  rateLimitWindowMs: 60 * 1000, // 1 minute
  rateLimitMax: 120, // 120 requests per minute
} as const;

export interface ServiceDefinition {
  name: string;
  description: string;
  price: string;
  mimeType: string;
  endpoint: string;
  method: string;
}

export const SERVICES: Record<string, ServiceDefinition> = {
  compress: {
    name: 'Ultra-Compressor',
    description: 'Compress PNG, JPG, WebP, and AVIF images by 70-95% while maintaining visual quality. Returns raw image file.',
    price: '0',
    mimeType: 'image/*',
    endpoint: '/v1/compress',
    method: 'POST',
  },
  convert: {
    name: 'Format Converter',
    description: 'Convert images between PNG, JPG, WebP, and AVIF formats with 8-bit palette quantization. Returns raw image file.',
    price: '0',
    mimeType: 'image/*',
    endpoint: '/v1/convert',
    method: 'POST',
  },
  resize: {
    name: 'Image Resizer',
    description: 'Resize images to custom width, height, and fit mode (cover, contain, fill). Returns raw image file.',
    price: '0',
    mimeType: 'image/*',
    endpoint: '/v1/resize',
    method: 'POST',
  },
};
