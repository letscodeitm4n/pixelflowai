import { Request, Response } from 'express';
import { ApiError } from './fetch-image.js';

export function sendSuccess(res: Response, data: Record<string, any>): void {
  res.json({
    success: true,
    ...data,
    timestamp: new Date().toISOString(),
  });
}

export function sendError(res: Response, error: unknown): void {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  } else {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Unexpected error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      detail: errMsg,
      timestamp: new Date().toISOString(),
    });
  }
}

export function sendImageResult(
  req: Request,
  res: Response,
  outputBuffer: Buffer,
  format: string,
  stats: Record<string, any>
): void {
  // If client explicitly requests JSON metadata via ?format=json
  const wantsJson = req.query.format === 'json';

  if (wantsJson) {
    sendSuccess(res, {
      ...stats,
      format,
      image: bufferToBase64(outputBuffer, format),
    });
    return;
  }

  // DEFAULT PRODUCT BEHAVIOR: Deliver actual raw binary image file directly!
  const mimeMap: Record<string, string> = {
    webp: 'image/webp',
    avif: 'image/avif',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
  };

  const contentType = mimeMap[format] || `image/${format}`;
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', outputBuffer.length);
  res.setHeader('Content-Disposition', `inline; filename="pixelflow-${Date.now()}.${format}"`);
  res.send(outputBuffer);
}

export function bufferToBase64(buffer: Buffer, format: string): string {
  const mimeMap: Record<string, string> = {
    webp: 'image/webp',
    avif: 'image/avif',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    tiff: 'image/tiff',
  };
  const mime = mimeMap[format] || `image/${format}`;
  return `data:${mime};base64,${buffer.toString('base64')}`;
}
