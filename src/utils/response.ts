import { Response } from 'express';
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
    console.error('Unexpected error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
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
