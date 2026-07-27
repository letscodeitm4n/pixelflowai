import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer, ApiError } from '../utils/fetch-image.js';
import { sendSuccess, sendError, bufferToBase64 } from '../utils/response.js';

type OutputFormat = 'webp' | 'avif';

export async function compressHandler(req: Request, res: Response): Promise<void> {
  try {
    const { url, image, quality = 75, format = 'webp' } = req.body;
    
    // Validate format
    const validFormats: OutputFormat[] = ['webp', 'avif'];
    if (!validFormats.includes(format as OutputFormat)) {
      throw new ApiError(400, `Invalid format: ${format}. Supported: ${validFormats.join(', ')}`);
    }
    
    // Validate quality
    const q = Number(quality);
    if (isNaN(q) || q < 1 || q > 100) {
      throw new ApiError(400, 'Quality must be between 1 and 100');
    }

    const { buffer: inputBuffer } = await fetchImageBuffer({ url, image });
    const originalSize = inputBuffer.length;

    let pipeline = sharp(inputBuffer);
    
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality: q });
    } else {
      pipeline = pipeline.avif({ quality: q });
    }

    const outputBuffer = await pipeline.toBuffer();
    const compressedSize = outputBuffer.length;
    const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    sendSuccess(res, {
      originalSize,
      compressedSize,
      savings: `${savings}%`,
      format,
      quality: q,
      image: bufferToBase64(outputBuffer, format),
    });
  } catch (error) {
    sendError(res, error);
  }
}
