// PixelFlow AI - Strip EXIF Service (Smart Inflation-Prevention Logic)
import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';

export async function stripExifHandler(req: Request, res: Response): Promise<void> {
  try {
    const { url, image } = req.body;
    
    const { buffer: inputBuffer } = await fetchImageBuffer({ url, image });
    const originalSize = inputBuffer.length;
    
    const metadata = await sharp(inputBuffer).metadata();
    
    const metadataFields: string[] = [];
    if (metadata.exif) metadataFields.push('EXIF');
    if (metadata.icc) metadataFields.push('ICC Color Profile');
    if (metadata.iptc) metadataFields.push('IPTC');
    if (metadata.xmp) metadataFields.push('XMP');
    if (metadata.tifftagPhotoshop) metadataFields.push('Photoshop Data');

    const outputFormat = metadata.format || 'png';
    let pipeline = sharp(inputBuffer).rotate();

    if (outputFormat === 'png') {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
    } else if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      pipeline = pipeline.jpeg({ quality: 90 });
    } else if (outputFormat === 'webp') {
      pipeline = pipeline.webp({ quality: 85 });
    }

    let outputBuffer = await pipeline.toBuffer();

    // SAFETY CHECK: Guarantee PNG size never inflates
    if (outputFormat === 'png' && outputBuffer.length > originalSize) {
      outputBuffer = await sharp(inputBuffer)
        .rotate()
        .png({ quality: 75, compressionLevel: 9 })
        .toBuffer();
    }

    sendImageResult(req, res, outputBuffer, outputFormat, {
      metadataRemoved: metadataFields.length > 0 ? metadataFields : ['None detected'],
      originalSize,
      cleanedSize: outputBuffer.length,
    });
  } catch (error) {
    sendError(res, error);
  }
}
