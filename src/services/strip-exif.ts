import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';

export async function stripExifHandler(req: Request, res: Response): Promise<void> {
  try {
    const { url, image } = req.body;
    
    const { buffer: inputBuffer } = await fetchImageBuffer({ url, image });
    
    const metadata = await sharp(inputBuffer).metadata();
    
    const metadataFields: string[] = [];
    if (metadata.exif) metadataFields.push('EXIF');
    if (metadata.icc) metadataFields.push('ICC Color Profile');
    if (metadata.iptc) metadataFields.push('IPTC');
    if (metadata.xmp) metadataFields.push('XMP');
    if (metadata.tifftagPhotoshop) metadataFields.push('Photoshop Data');

    const outputBuffer = await sharp(inputBuffer)
      .rotate()
      .withMetadata({ orientation: undefined })
      .toBuffer();

    const outputFormat = metadata.format || 'png';

    sendImageResult(req, res, outputBuffer, outputFormat, {
      metadataRemoved: metadataFields.length > 0 ? metadataFields : ['None detected'],
      originalSize: inputBuffer.length,
      cleanedSize: outputBuffer.length,
    });
  } catch (error) {
    sendError(res, error);
  }
}
