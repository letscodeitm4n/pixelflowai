import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer } from '../utils/fetch-image';
import { sendSuccess, sendError } from '../utils/response';

export async function inspectHandler(req: Request, res: Response): Promise<void> {
  try {
    const { url, image } = req.body;
    
    const { buffer: inputBuffer, detectedFormat } = await fetchImageBuffer({ url, image });
    const metadata = await sharp(inputBuffer).metadata();
    const sizeBytes = inputBuffer.length;

    // Estimate compression savings by actually compressing a small sample
    let estimatedWebPSavings = 'N/A';
    let estimatedAVIFSavings = 'N/A';

    try {
      const webpBuffer = await sharp(inputBuffer).webp({ quality: 75 }).toBuffer();
      estimatedWebPSavings = `~${((1 - webpBuffer.length / sizeBytes) * 100).toFixed(0)}%`;
    } catch { /* format may not support conversion */ }

    try {
      const avifBuffer = await sharp(inputBuffer).avif({ quality: 65 }).toBuffer();
      estimatedAVIFSavings = `~${((1 - avifBuffer.length / sizeBytes) * 100).toFixed(0)}%`;
    } catch { /* format may not support conversion */ }

    sendSuccess(res, {
      format: metadata.format || detectedFormat,
      width: metadata.width,
      height: metadata.height,
      channels: metadata.channels,
      colorSpace: metadata.space,
      sizeBytes,
      sizeHuman: formatBytes(sizeBytes),
      hasAlpha: metadata.hasAlpha || false,
      hasEXIF: !!metadata.exif,
      hasICCProfile: !!metadata.icc,
      density: metadata.density,
      estimatedWebPSavings,
      estimatedAVIFSavings,
    });
  } catch (error) {
    sendError(res, error);
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
