// src/polyfills.js
import { Buffer } from 'buffer';

// Глобальные полифиллы для работы с современными библиотеками
window.Buffer = Buffer;
window.process = {
    env: {
        NODE_ENV: process.env.NODE_ENV || 'development',
    },
    version: 'v16.0.0',
    versions: {
        node: '16.0.0',
    },
};