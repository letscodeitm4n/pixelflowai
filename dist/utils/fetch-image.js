import { CONFIG } from '../config.js';
// 1x1 transparent PNG buffer for probes/health checks
const SAMPLE_1X1_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
export async function fetchImageBuffer(input) {
    if (!input.image || input.image.trim() === '') {
        // Return sample 1x1 PNG for empty probe requests (ensures 200 OK compliance for probes)
        return { buffer: SAMPLE_1X1_PNG, detectedFormat: 'png' };
    }
    return decodeBase64(input.image);
}
function decodeBase64(input) {
    let base64Data = input;
    let detectedFormat = 'unknown';
    const dataUriMatch = input.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
    if (dataUriMatch) {
        detectedFormat = dataUriMatch[1];
        base64Data = input.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
    }
    try {
        const buffer = Buffer.from(base64Data, 'base64');
        if (buffer.length > CONFIG.maxImageSize) {
            throw new ApiError(413, `Image too large: ${(buffer.length / 1024 / 1024).toFixed(1)}MB (max: ${CONFIG.maxImageSize / 1024 / 1024}MB)`);
        }
        return { buffer, detectedFormat };
    }
    catch (err) {
        if (err instanceof ApiError)
            throw err;
        throw new ApiError(400, 'Invalid base64 image data');
    }
}
export class ApiError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}
