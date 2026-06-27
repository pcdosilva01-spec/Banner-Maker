/**
 * Export Module
 * Funções para exportação do banner em PNG e JPEG
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT } from './canvas.js';

/**
 * Configurações de exportação
 */
export const ExportConfig = {
    PNG: {
        mimeType: 'image/png',
        quality: 1.0,
        extension: 'png',
    },
    JPEG: {
        mimeType: 'image/jpeg',
        quality: 0.95,
        extension: 'jpg',
    },
};

/**
 * Exporta canvas como imagem
 * @param {HTMLCanvasElement} canvas - Elemento canvas
 * @param {string} format - 'png' ou 'jpeg'
 * @param {string} filename - Nome do arquivo (sem extensão)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function exportCanvas(canvas, format = 'png', filename = 'banner') {
    try {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('Canvas inválido');
        }

        const config = format.toLowerCase() === 'jpeg' || format.toLowerCase() === 'jpg'
            ? ExportConfig.JPEG
            : ExportConfig.PNG;

        // Cria fundo branco para JPEG (transparente fica preto)
        if (config === ExportConfig.JPEG) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = CANVAS_WIDTH;
            tempCanvas.height = CANVAS_HEIGHT;
            const ctx = tempCanvas.getContext('2d');

            // Fundo branco
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Desenha o canvas original
            ctx.drawImage(canvas, 0, 0);

            canvas = tempCanvas;
        }

        // Converte para blob primeiro (mais eficiente para download)
        const blob = await canvasToBlob(canvas, config.mimeType, config.quality);

        // Cria URL do blob
        const url = URL.createObjectURL(blob);

        // Gera nome do arquivo com timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fullName = `${filename}_${timestamp}.${config.extension}`;

        // Trigger download
        downloadFile(url, fullName);

        // Limpa URL após delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        return {
            success: true,
            url,
            filename: fullName,
        };
    } catch (error) {
        console.error('Erro na exportação:', error);
        return {
            success: false,
            error: error.message || 'Falha ao exportar imagem',
        };
    }
}

/**
 * Converte canvas para Blob
 * @param {HTMLCanvasElement} canvas
 * @param {string} mimeType
 * @param {number} quality
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas, mimeType, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Falha ao converter canvas'));
                }
            },
            mimeType,
            quality
        );
    });
}

/**
 * Trigger download de arquivo
 * @param {string} url - URL do arquivo
 * @param {string} filename - Nome do arquivo
 */
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Exporta como PNG de alta qualidade
 * @param {HTMLCanvasElement} canvas
 * @param {string} filename
 * @returns {Promise<Object>}
 */
export async function exportAsPNG(canvas, filename = 'banner') {
    return exportCanvas(canvas, 'png', filename);
}

/**
 * Exporta como JPEG de alta qualidade
 * @param {HTMLCanvasElement} canvas
 * @param {string} filename
 * @returns {Promise<Object>}
 */
export async function exportAsJPEG(canvas, filename = 'banner') {
    return exportCanvas(canvas, 'jpeg', filename);
}

/**
 * Exporta como DataURL (para preview ou upload)
 * @param {HTMLCanvasElement} canvas
 * @param {string} format
 * @param {number} quality
 * @returns {string} DataURL
 */
export function exportAsDataURL(canvas, format = 'png', quality = 1.0) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        return null;
    }

    const mimeType = format.toLowerCase() === 'jpeg' || format.toLowerCase() === 'jpg'
        ? ExportConfig.JPEG.mimeType
        : ExportConfig.PNG.mimeType;

    return canvas.toDataURL(mimeType, quality);
}

/**
 * Exporta para clipboard (copy-paste)
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<boolean>}
 */
export async function exportToClipboard(canvas) {
    try {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            return false;
        }

        // Tenta usar API nativa do clipboard
        if (navigator.clipboard && navigator.clipboard.write) {
            const blob = await canvasToBlob(canvas, ExportConfig.PNG.mimeType, 1.0);
            const item = new ClipboardItem({ [ExportConfig.PNG.mimeType]: blob });
            await navigator.clipboard.write([item]);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Erro ao copiar para clipboard:', error);
        return false;
    }
}

/**
 * Valida se o canvas está pronto para exportação
 * @param {HTMLCanvasElement} canvas
 * @returns {boolean}
 */
export function isCanvasReady(canvas) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        return false;
    }

    // Verifica dimensões
    if (canvas.width !== CANVAS_WIDTH || canvas.height !== CANVAS_HEIGHT) {
        console.warn('Canvas não está nas dimensões corretas');
    }

    // Verifica se tem conteúdo (像素 não são todos transparentes)
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return false;
    }

    const imageData = ctx.getImageData(0, 0, 1, 1);
    return imageData.data.length > 0;
}

/**
 * Gera preview em thumbnail
 * @param {HTMLCanvasElement} canvas
 * @param {number} maxSize - Tamanho máximo do thumbnail
 * @returns {string} DataURL do thumbnail
 */
export function generateThumbnail(canvas, maxSize = 200) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        return null;
    }

    const scale = Math.min(maxSize / canvas.width, maxSize / canvas.height);
    const width = Math.floor(canvas.width * scale);
    const height = Math.floor(canvas.height * scale);

    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = width;
    thumbCanvas.height = height;

    const ctx = thumbCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, width, height);

    return thumbCanvas.toDataURL(ExportConfig.PNG.mimeType);
}

/**
 * Exporta múltiplos formatos de uma vez
 * @param {HTMLCanvasElement} canvas
 * @param {string[]} formats - Array de formatos ['png', 'jpeg']
 * @param {string} filename
 * @returns {Promise<Object[]>}
 */
export async function exportMultiple(canvas, formats = ['png', 'jpeg'], filename = 'banner') {
    const results = [];

    for (const format of formats) {
        const result = await exportCanvas(canvas, format, filename);
        results.push({ format, ...result });
    }

    return results;
}

/**
 * Prepara canvas para impressão
 * @param {HTMLCanvasElement} canvas
 * @returns {string} DataURL em alta resolução
 */
export function prepareForPrint(canvas) {
    // Para impressão, usamos qualidade máxima
    return exportAsDataURL(canvas, 'png', 1.0);
}

/**
 * Calcula tamanho do arquivo estimado
 * @param {string} dataURL
 * @returns {number} Tamanho em bytes
 */
export function estimateFileSize(dataURL) {
    // Remove prefixo data:image/png;base64,
    const base64 = dataURL.split(',')[1];
    if (!base64) {
        return 0;
    }

    // Calcula tamanho aproximado
    const padding = (base64.match(/=+$/) || [''])[0].length;
    const fileSize = (base64.length * 3) / 4 - padding;

    return Math.floor(fileSize);
}

/**
 * Formata tamanho de arquivo para exibição
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Otimiza imagem para web
 * @param {HTMLCanvasElement} canvas
 * @param {Object} options
 * @returns {Promise<string>} DataURL otimizada
 */
export async function optimizeForWeb(canvas, options = {}) {
    const {
        format = 'jpeg',
        quality = 0.85,
        maxWidth = 1920,
        maxHeight = 1920,
    } = options;

    let exportCanvas = canvas;
    let width = canvas.width;
    let height = canvas.height;

    // Redimensiona se necessário
    if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);

        exportCanvas = document.createElement('canvas');
        exportCanvas.width = width;
        exportCanvas.height = height;

        const ctx = exportCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvas, 0, 0, width, height);
    }

    return exportAsDataURL(exportCanvas, format, quality);
}