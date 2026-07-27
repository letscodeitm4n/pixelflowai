import { ApiError } from './fetch-image.js';
export function sendSuccess(res, data) {
    res.json({
        success: true,
        ...data,
        timestamp: new Date().toISOString(),
    });
}
export function sendError(res, error) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    }
    else {
        console.error('Unexpected error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString(),
        });
    }
}
export function sendImageResult(req, res, outputBuffer, format, stats) {
    // If client explicitly requests JSON metadata via ?format=json
    const wantsJson = req.query.format === 'json';
    if (wantsJson) {
        sendSuccess(res, {
            ...stats,
            format,
            image: bufferToBase64(outputBuffer, format),
        });
        return;
    }
    // DEFAULT PRODUCT BEHAVIOR: Deliver actual raw binary image file directly!
    const mimeMap = {
        webp: 'image/webp',
        avif: 'image/avif',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
    };
    const contentType = mimeMap[format] || `image/${format}`;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', outputBuffer.length);
    res.setHeader('Content-Disposition', `inline; filename="pixelflow-${Date.now()}.${format}"`);
    res.send(outputBuffer);
}
export function bufferToBase64(buffer, format) {
    const mimeMap = {
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
