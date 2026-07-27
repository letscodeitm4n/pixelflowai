export const CONFIG = {
  network: 'eip155:196', // X Layer
  asset: '0x779ded0c9e1022225f8e0630b35a9b54be713736', // USDT0
  port: parseInt(process.env.PORT || '4000', 10),
  maxImageSize: 25 * 1024 * 1024, // 25MB
  rateLimitWindowMs: 60 * 1000, // 1 minute
  rateLimitMax: 100, // 100 requests per minute
} as const;

export interface ServiceDefinition {
  name: string;
  description: string;
  price: string; // e.g. '$0.01'
  mimeType: string;
  endpoint: string;
  method: string;
}

export const SERVICES: Record<string, ServiceDefinition> = {
  compress: {
    name: 'Ultra-Compressor',
    description: 'Compress images by 70-90% via WebP/AVIF conversion. Reduces file sizes while preserving visual quality.',
    price: '$0.01',
    mimeType: 'application/json',
    endpoint: '/v1/compress',
    method: 'POST',
  },
  convert: {
    name: 'Format Converter',
    description: 'Convert images between PNG, JPG, WebP, and AVIF formats.',
    price: '$0.01',
    mimeType: 'application/json',
    endpoint: '/v1/convert',
    method: 'POST',
  },
  resize: {
    name: 'Image Resizer',
    description: 'Resize images to custom width and height with cover, contain, fill, inside, and outside fit modes.',
    price: '$0.01',
    mimeType: 'application/json',
    endpoint: '/v1/resize',
    method: 'POST',
  },
};
