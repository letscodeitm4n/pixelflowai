import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer, ApiError } from '../utils/fetch-image';
import { sendSuccess, sendError, bufferToBase64 } from '../utils/response';

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

    let pipeline = sharp(inputBuffer);
    
    switch (outputFormat) {
      case 'png':  pipeline = pipeline.png(); break;
      case 'jpg':  pipeline = pipeline.jpeg({ quality: 90 }); break;
      case 'webp': pipeline = pipeline.webp({ quality: 85 }); break;
      case 'avif': pipeline = pipeline.avif({ quality: 80 }); break;
    }

    const outputBuffer = await pipeline.toBuffer();

    sendSuccess(res, {
      originalFormat: detectedFormat,
      outputFormat,
      originalSize: inputBuffer.length,
      convertedSize: outputBuffer.length,
      image: bufferToBase64(outputBuffer, outputFormat),
    });
  } catch (error) {
    sendError(res, error);
  }
}
