// PixelFlow AI - Convert Service (Smart Inflation-Prevention Logic)
import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer, ApiError } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';

type OutputFormat = 'png' | 'jpg' | 'webp' | 'avif';

export async function convertHandler(req: Request, res: Response): Promise<void> {
  try {
    const { url, image, outputFormat } = req.body;
    
    if (!outputFormat) {
      throw new ApiError(400, '"outputFormat" is required. Supported: png, jpg, webp, avif');
    }

    const validFormats: OutputFormat[] = ['png', 'jpg', 'webp', 'avif'];
    if (!validFormats.includes(outputFormat as OutputFormat)) {
      throw new ApiError(400, `Invalid outputFormat: ${outputFormat}. Supported: ${validFormats.join(', ')}`);
    }

    const { buffer: inputBuffer, detectedFormat } = await fetchImageBuffer({ url, image });
    const originalSize = inputBuffer.length;

    let pipeline = sharp(inputBuffer);
    
    switch (outputFormat) {
      case 'png':
        pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
        break;
      case 'jpg':
        pipeline = pipeline.jpeg({ quality: 85, progressive: true });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality: 80, effort: 5 });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality: 75, effort: 5 });
        break;
    }

    let outputBuffer = await pipeline.toBuffer();

    // SAFETY CHECK: Guarantee PNG size never inflates beyond original
    if (outputFormat === 'png' && outputBuffer.length > originalSize) {
      outputBuffer = await sharp(inputBuffer)
        .png({ quality: 75, compressionLevel: 9 })
        .toBuffer();
    }

    sendImageResult(req, res, outputBuffer, outputFormat, {
      originalFormat: detectedFormat,
      outputFormat,
      originalSize,
      convertedSize: outputBuffer.length,
    });
  } catch (error) {
    sendError(res, error);
  }
}
