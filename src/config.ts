export const CONFIG = {
  network: 'eip155:196', // X Layer
  port: parseInt(process.env.PORT || '4000', 10),
  maxImageSize: 25 * 1024 * 1024, // 25MB
  fetchTimeout: 10000, // 10 seconds
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
    description: 'Compress images with intelligent quality optimization. Supports PNG, JPG, WebP, and AVIF.',
    price: 'FREE',
    mimeType: 'image/*',
    endpoint: '/v1/compress',
    method: 'POST',
  },
  convert: {
    name: 'Format Converter',
    description: 'Convert images between PNG, JPG, WebP, and AVIF formats with size protection.',
    price: 'FREE',
    mimeType: 'image/*',
    endpoint: '/v1/convert',
    method: 'POST',
  },
  resize: {
    name: 'Image Resizer',
    description: 'Resize images to custom width, height, and aspect ratio.',
    price: 'FREE',
    mimeType: 'image/*',
    endpoint: '/v1/resize',
    method: 'POST',
  },
};
