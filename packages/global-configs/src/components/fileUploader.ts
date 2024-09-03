import path from "path"
import app from "./app";

const mediaDirectory = `tmp`

export default {
    mediaDirectory: mediaDirectory,
    mediaPath: path.join(app.rootDir, mediaDirectory),
    maxFileSize: 5242880,
    maxFileUploadLimit: 5,
    allowedFileExtensions: [
        'png',
        'jpeg',
        'jpg',
        'json',
        'mp4',
        'html',
        'svg',
        'pdf'
    ],
    allowedMimeTypes: [
        'application/octet-stream',
        'image/png',
        'image/jpeg',
        'application/json',
        'video/mp4',
        'text/html',
        'image/svg+xml',
        'application/pdf',
    ]
}

