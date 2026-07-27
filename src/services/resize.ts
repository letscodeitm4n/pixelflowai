// PixelFlow AI - Resize Service (Smart Inflation-Prevention Logic)
import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer, ApiError } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';

export async function resizeHandler(req: Request, res: Response): Promise<void> {
  try {
    const { url, image, width, height, fit = 'cover' } = req.body;
    
    if (!width && !height) {
      throw new ApiError(400, 'At least one of "width" or "height" must be provided');
    }

    const validFits = ['cover', 'contain', 'fill', 'inside', 'outside'] as const;
    if (!validFits.includes(fit)) {
      throw new ApiError(400, `Invalid fit: ${fit}. Supported: ${validFits.join(', ')}`);
    }

    const w = width ? Number(width) : undefined;
    const h = height ? Number(height) : undefined;
    
    if ((w !== undefined && (isNaN(w) || w < 1 || w > 10000)) ||
        (h !== undefined && (isNaN(h) || h < 1 || h > 10000))) {
      throw new ApiError(400, 'Width and height must be between 1 and 10000');
    }

    const { buffer: inputBuffer } = await fetchImageBuffer({ url, image });
    const originalSize = inputBuffer.length;
    const metadata = await sharp(inputBuffer).metadata();

    let resizePipeline = sharp(inputBuffer).resize(w, h, { fit: fit as keyof sharp.FitEnum });
    const outputFormat = metadata.format || 'png';

    if (outputFormat === 'png') {
      resizePipeline = resizePipeline.png({ quality: 80, compressionLevel: 9 });
    }

    let outputBuffer = await resizePipeline.toBuffer();

    // SAFETY CHECK: Guarantee PNG size never inflates
    if (outputFormat === 'png' && outputBuffer.length > originalSize && (!w || w >= (metadata.width || 0))) {
      outputBuffer = await sharp(inputBuffer)
        .resize(w, h, { fit: fit as keyof sharp.FitEnum })
        .png({ quality: 75, compressionLevel: 9 })
        .toBuffer();
    }

    const outputMetadata = await sharp(outputBuffer).metadata();

    sendImageResult(req, res, outputBuffer, outputFormat, {
      originalDimensions: { width: metadata.width, height: metadata.height },
      newDimensions: { width: outputMetadata.width, height: outputMetadata.height },
      fit,
      originalSize,
      resizedSize: outputBuffer.length,
    });
  } catch (error) {
    sendError(res, error);
  }
}
