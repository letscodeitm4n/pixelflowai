import sharp from 'sharp';
import { fetchImageBuffer, ApiError } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';
export async function resizeHandler(req, res) {
    try {
        const { image, width, height, fit = 'cover' } = req.body || {};
        // Return clear Usage API Documentation when no image parameter is provided
        if (!image || typeof image !== 'string' || image.trim() === '') {
            res.status(200).json({
                success: true,
                service: 'PixelFlow Image Resizer',
                status: 'online',
                price: '0.01 USDT/use',
                endpoint: 'POST /v1/resize',
                description: 'Resize images to custom width and height with cover, contain, fill, inside, and outside fit modes.',
                parameters: {
                    image: 'base64 data URI string (required)',
                    width: 'target width in pixels (1-10000)',
                    height: 'target height in pixels (1-10000)',
                    fit: 'cover | contain | fill | inside | outside (default: cover)',
                },
                samplePayload: {
                    image: 'data:image/png;base64,...',
                    width: 500,
                    height: 500,
                    fit: 'cover',
                },
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
            width: outputMetadata.width,
            height: outputMetadata.height,
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
