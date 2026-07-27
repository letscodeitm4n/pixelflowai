// PixelFlow AI - Strip EXIF Service
import sharp from 'sharp';
import { fetchImageBuffer } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';
export async function stripExifHandler(req, res) {
    try {
        const { image } = req.body;
        const { buffer: inputBuffer } = await fetchImageBuffer({ image });
        const originalSize = inputBuffer.length;
        const metadata = await sharp(inputBuffer).metadata();
        const metadataFields = [];
        if (metadata.exif)
            metadataFields.push('EXIF');
        if (metadata.icc)
            metadataFields.push('ICC Color Profile');
        if (metadata.iptc)
            metadataFields.push('IPTC');
        if (metadata.xmp)
            metadataFields.push('XMP');
        if (metadata.tifftagPhotoshop)
            metadataFields.push('Photoshop Data');
        const outputFormat = metadata.format || 'png';
        let pipeline = sharp(inputBuffer).rotate();
        if (outputFormat === 'png') {
            pipeline = pipeline.png({ quality: 80, compressionLevel: 9, palette: true });
        }
        else if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
            pipeline = pipeline.jpeg({ quality: 85, progressive: true });
        }
        else if (outputFormat === 'webp') {
            pipeline = pipeline.webp({ quality: 85 });
        }
        let outputBuffer = await pipeline.toBuffer();
        if (outputFormat === 'png' && outputBuffer.length > originalSize) {
            outputBuffer = await sharp(inputBuffer)
                .rotate()
                .png({ quality: 70, compressionLevel: 9, palette: true })
                .toBuffer();
        }
        sendImageResult(req, res, outputBuffer, outputFormat, {
            metadataRemoved: metadataFields.length > 0 ? metadataFields : ['None detected'],
            originalSize,
            cleanedSize: outputBuffer.length,
        });
    }
    catch (error) {
        sendError(res, error);
    }
}
