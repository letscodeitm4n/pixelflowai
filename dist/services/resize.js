import sharp from 'sharp';
import { fetchImageBuffer, ApiError } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';
const PROBE_SAMPLE_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
export async function resizeHandler(req, res) {
    try {
        const { image, width, height, fit = 'cover' } = req.body || {};
        if (!image || typeof image !== 'string' || image.trim() === '') {
            sendImageResult(req, res, PROBE_SAMPLE_PNG, 'png', {
                status: 'healthy',
                message: 'PixelFlow Image Resizer Active (0.00 USDT/use)',
            });
            return;
        }
        const validFits = ['cover', 'contain', 'fill', 'inside', 'outside'];
        if (!validFits.includes(fit)) {
            throw new ApiError(400, `Invalid fit: ${fit}. Supported: ${validFits.join(', ')}`);
        }
        const w = width ? Number(width) : undefined;
        const h = height ? Number(height) : undefined;
        if ((w !== undefined && (isNaN(w) || w < 1 || w > 10000)) ||
            (h !== undefined && (isNaN(h) || h < 1 || h > 10000))) {
            throw new ApiError(400, 'Width and height must be between 1 and 10000');
        }
        const { buffer: inputBuffer } = await fetchImageBuffer({ image });
        const metadata = await sharp(inputBuffer).metadata();
        const outputBuffer = await sharp(inputBuffer)
            .resize(w, h, { fit: fit })
            .toBuffer();
        const outputMetadata = await sharp(outputBuffer).metadata();
        const outputFormat = outputMetadata.format || 'png';
        sendImageResult(req, res, outputBuffer, outputFormat, {
            originalDimensions: { width: metadata.width, height: metadata.height },
            newDimensions: { width: outputMetadata.width, height: outputMetadata.height },
            fit,
            originalSize: inputBuffer.length,
            resizedSize: outputBuffer.length,
        });
    }
    catch (error) {
        sendError(res, error);
    }
}
