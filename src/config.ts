export const CONFIG = {
  network: 'eip155:196', // X Layer
  port: parseInt(process.env.PORT || '4000', 10),
  maxImageSize: 20 * 1024 * 1024, // 20MB
  fetchTimeout: 10000, // 10 seconds
  rateLimitWindowMs: 60 * 1000, // 1 minute
  rateLimitMax: 60, // 60 requests per minute per IP
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
    description: 'Compress images by 70-90% via WebP/AVIF conversion. Reduce file sizes dramatically while maintaining visual quality.',
    price: '$0.01',
    mimeType: 'application/json',
    endpoint: '/v1/compress',
    method: 'POST',
  },
  convert: {
    name: 'Format Converter',
    description: 'Convert images between PNG, JPG, WebP, and AVIF formats. Optimize for web delivery or compatibility.',
    price: '$0.01',
    mimeType: 'application/json',
    endpoint: '/v1/convert',
    method: 'POST',
  },
  resize: {
    name: 'Image Resizer',
    description: 'Resize images to custom width, height, and aspect ratio. Supports cover, contain, fill, inside, and outside fit modes.',
    price: '$0.01',
    mimeType: 'application/json',
    endpoint: '/v1/resize',
    method: 'POST',
  },
  'strip-exif': {
    name: 'Privacy EXIF Cleaner',
    description: 'Strip all EXIF metadata including GPS coordinates, camera info, and timestamps from images. Protect user privacy.',
    price: '$0.005',
    mimeType: 'application/json',
    endpoint: '/v1/strip-exif',
    method: 'POST',
  },
  inspect: {
    name: 'Image Inspector',
    description: 'Free diagnostic analysis of any image. Returns format, dimensions, color space, file size, and estimated compression savings.',
    price: '$0.00',
    mimeType: 'application/json',
    endpoint: '/v1/inspect',
    method: 'POST',
  },
};
