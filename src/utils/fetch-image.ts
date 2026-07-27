import { CONFIG } from '../config.js';

export interface ImageInput {
  image?: string; // base64
}

export async function fetchImageBuffer(input: ImageInput): Promise<{ buffer: Buffer; detectedFormat: string }> {
  if (!input.image) {
    throw new ApiError(400, 'Please upload an image file (base64 data URI)');
  }

  return decodeBase64(input.image);
}

function decodeBase64(input: string): { buffer: Buffer; detectedFormat: string } {
  let base64Data = input;
  let detectedFormat = 'unknown';

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
