import sharp from 'sharp';
import { fetchImageBuffer, ApiError } from '../utils/fetch-image.js';
import { sendError, sendImageResult } from '../utils/response.js';
const PROBE_SAMPLE_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
export async function convertHandler(req, res) {
    try {
        const { image, outputFormat = 'png' } = req.body || {};
        if (!image || typeof image !== 'string' || image.trim() === '') {
            sendImageResult(req, res, PROBE_SAMPLE_PNG, 'png', {
                status: 'healthy',
                message: 'PixelFlow Format Converter Active (0.00 USDT/use)',
            });
            return;
        }
        const validFormats = ['png', 'jpg', 'webp', 'avif'];
        let normFormat = outputFormat.toLowerCase();
        if (normFormat === 'jpeg')
            normFormat = 'jpg';
        if (!validFormats.includes(normFormat)) {
            throw new ApiError(400, `Invalid outputFormat: ${outputFormat}. Supported: ${validFormats.join(', ')}`);
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
    }
    catch (error) {
        sendError(res, error);
    }
}
