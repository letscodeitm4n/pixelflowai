import sharp from 'sharp';
import { Request, Response } from 'express';
import { fetchImageBuffer } from '../utils/fetch-image';
import { sendSuccess, sendError, bufferToBase64 } from '../utils/response';

export async function stripExifHandler(req: Request, res: Response): Promise<void> {
  try {
    const { url, image } = req.body;
    
    const { buffer: inputBuffer } = await fetchImageBuffer({ url, image });
    
    // Get original metadata to report what was removed
    const metadata = await sharp(inputBuffer).metadata();
    
    const metadataFields: string[] = [];
    if (metadata.exif) metadataFields.push('EXIF');
    if (metadata.icc) metadataFields.push('ICC Color Profile');
    if (metadata.iptc) metadataFields.push('IPTC');
    if (metadata.xmp) metadataFields.push('XMP');
    if (metadata.tifftagPhotoshop) metadataFields.push('Photoshop Data');

    // Sharp's rotate() without arguments auto-rotates based on EXIF then strips orientation
    // Combined with toBuffer, this effectively strips all metadata
    const outputBuffer = await sharp(inputBuffer)
      .rotate() // auto-orient based on EXIF, then strip
      .withMetadata({ orientation: undefined }) // remove all metadata
      .toBuffer();

    const outputFormat = metadata.format || 'png';

    sendSuccess(res, {
      metadataRemoved: metadataFields.length > 0 ? metadataFields : ['None detected'],
      originalSize: inputBuffer.length,
      cleanedSize: outputBuffer.length,
      format: outputFormat,
      image: bufferToBase64(outputBuffer, outputFormat),
    });
  } catch (error) {
    sendError(res, error);
  }
}
