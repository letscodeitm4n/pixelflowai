import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer, ApiError } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';

type OutputFormat = 'auto' | 'png' | 'jpg' | 'jpeg' | 'webp' | 'avif';

export async function compressHandler(req: Request, res: Response): Promise<void> {
  try {
    const { url, image, quality = 75, format = 'auto' } = req.body;
    
    // Validate quality
    const q = Number(quality);
    if (isNaN(q) || q < 1 || q > 100) {
      throw new ApiError(400, 'Quality must be between 1 and 100');
    }

    const { buffer: inputBuffer, detectedFormat } = await fetchImageBuffer({ url, image });
    const originalSize = inputBuffer.length;

    let targetFormat = format;
    if (!targetFormat || targetFormat === 'auto' || targetFormat === 'original') {
      targetFormat = detectedFormat || 'png';
    }

    // Normalize format string
    let normFormat = targetFormat.toLowerCase();
    if (normFormat === 'jpeg') normFormat = 'jpg';

    let pipeline = sharp(inputBuffer);
    
    switch (normFormat) {
      case 'png':
        pipeline = pipeline.png({ quality: q, compressionLevel: 9 });
        break;
      case 'jpg':
        pipeline = pipeline.jpeg({ quality: q });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality: q });
        break;
      case 'webp':
      default:
        normFormat = 'webp';
        pipeline = pipeline.webp({ quality: q });
        break;
    }

    const outputBuffer = await pipeline.toBuffer();
    const compressedSize = outputBuffer.length;
    const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    sendImageResult(req, res, outputBuffer, normFormat, {
      originalSize,
      compressedSize,
      savings: `${savings}%`,
      quality: q,
      format: normFormat,
    });
  } catch (error) {
    sendError(res, error);
  }
}
