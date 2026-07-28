import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer, ApiError } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';

export async function convertHandler(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body || {};
    const query = req.query || {};
    const image = body.image || query.image || body.params?.image;
    const outputFormat = body.outputFormat || body.format || query.outputFormat || query.format;
    const targetFormat = outputFormat || 'png';

    // Return clear Usage API Documentation when no image parameter is provided
    if (!image || typeof image !== 'string' || image.trim() === '') {
      res.status(200).json({
        success: true,
        service: 'PixelFlow Format Converter',
        status: 'online',
        price: '0.01 USDT/use',
        endpoint: 'POST /v1/convert',
        description: 'Convert images between PNG, JPG, WebP, and AVIF formats.',
        parameters: {
          image: 'base64 data URI string (e.g. "data:image/jpeg;base64,...")',
          outputFormat: 'png | jpg | webp | avif (required)',
        },
        samplePayload: {
          image: 'data:image/jpeg;base64,...',
          outputFormat: 'png',
        },
      });
      return;
    }

    const validFormats = ['png', 'jpg', 'webp', 'avif'];
    let normFormat = targetFormat.toLowerCase();
    if (normFormat === 'jpeg') normFormat = 'jpg';

    if (!validFormats.includes(normFormat)) {
      throw new ApiError(400, `Invalid format: ${targetFormat}. Supported: ${validFormats.join(', ')}`);
    }

    const { buffer: inputBuffer, detectedFormat } = await fetchImageBuffer({ image });

    let pipeline = sharp(inputBuffer);

    switch (normFormat) {
      case 'png':
        pipeline = pipeline.png({ palette: true });
        break;
      case 'jpg':
        pipeline = pipeline.jpeg({ quality: 90 });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality: 85 });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality: 80 });
        break;
    }

    const outputBuffer = await pipeline.toBuffer();

    sendImageResult(req, res, outputBuffer, normFormat, {
      originalFormat: detectedFormat,
      outputFormat: normFormat,
      originalSize: inputBuffer.length,
      convertedSize: outputBuffer.length,
    });
  } catch (error) {
    sendError(res, error);
  }
}
