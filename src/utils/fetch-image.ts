import { CONFIG } from '../config';

export interface ImageInput {
  url?: string;
  image?: string; // base64
}

export async function fetchImageBuffer(input: ImageInput): Promise<{ buffer: Buffer; detectedFormat: string }> {
  if (!input.url && !input.image) {
    throw new ApiError(400, 'Either "url" or "image" (base64) must be provided');
  }

  if (input.url) {
    return fetchFromUrl(input.url);
  }

  return decodeBase64(input.image!);
}

async function fetchFromUrl(url: string): Promise<{ buffer: Buffer; detectedFormat: string }> {
  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new ApiError(400, 'Invalid URL provided');
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new ApiError(400, 'URL must use HTTP or HTTPS protocol');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.fetchTimeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'PixelFlow-AI/1.0' },
    });

    if (!response.ok) {
      throw new ApiError(400, `Failed to fetch image: HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/') && !contentType.includes('octet-stream')) {
      throw new ApiError(400, `URL does not point to an image (content-type: ${contentType})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > CONFIG.maxImageSize) {
      throw new ApiError(413, `Image too large: ${(buffer.length / 1024 / 1024).toFixed(1)}MB (max: ${CONFIG.maxImageSize / 1024 / 1024}MB)`);
    }

    const detectedFormat = contentType.replace('image/', '').split(';')[0] || 'unknown';
    return { buffer, detectedFormat };
  } finally {
    clearTimeout(timeout);
  }
}

function decodeBase64(input: string): { buffer: Buffer; detectedFormat: string } {
  let base64Data = input;
  let detectedFormat = 'unknown';

  // Handle data URI format: data:image/png;base64,xxxxx
  const dataUriMatch = input.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
  if (dataUriMatch) {
    detectedFormat = dataUriMatch[1];
    base64Data = input.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
  }

  try {
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > CONFIG.maxImageSize) {
      throw new ApiError(413, `Image too large: ${(buffer.length / 1024 / 1024).toFixed(1)}MB (max: ${CONFIG.maxImageSize / 1024 / 1024}MB)`);
    }
    return { buffer, detectedFormat };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, 'Invalid base64 image data');
  }
}

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
