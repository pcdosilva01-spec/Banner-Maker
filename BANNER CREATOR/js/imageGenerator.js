/**
 * Image Generator Module
 * Processamento de imagens, upload e manipulação
 */

/**
 * Configurações de upload
 */
const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MIN_DIMENSION: 400,
};

/**
 * Faz upload e processa uma imagem
 * @param {File} file
 * @returns {Promise<{success: boolean, image?: HTMLImageElement, error?: string}>}
 */
export async function uploadImage(file) {
    if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        return { success: false, error: 'Use PNG, JPG ou WEBP.' };
    }

    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
        return { success: false, error: 'Máximo 10MB.' };
    }

    try {
        const imageData = await readFileAsDataURL(file);
        const img = await createImageElement(imageData);

        if (img.width < UPLOAD_CONFIG.MIN_DIMENSION || img.height < UPLOAD_CONFIG.MIN_DIMENSION) {
            return {
                success: false,
                error: `Mínimo ${UPLOAD_CONFIG.MIN_DIMENSION}px.`,
            };
        }

        return { success: true, image: img };
    } catch (error) {
        console.error('Erro no upload:', error);
        return { success: false, error: 'Erro ao processar imagem.' };
    }
}

/**
 * Lê arquivo como DataURL
 */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Erro ao ler'));
        reader.readAsDataURL(file);
    });
}

/**
 * Cria elemento Image
 */
function createImageElement(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Erro ao carregar'));
        img.src = url;
    });
}

/**
 * Gera placeholder
 */
export function generatePlaceholder(category) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1400;
    canvas.height = 1100;

    // Gradiente
    const gradient = ctx.createLinearGradient(0, 0, 1400, 1100);
    gradient.addColorStop(0, '#F5F5F5');
    gradient.addColorStop(1, '#E8E8E8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1400, 1100);

    // Ícone
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(550, 350, 300, 300);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(625, 450);
    ctx.lineTo(700, 525);
    ctx.lineTo(775, 450);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(700, 525);
    ctx.lineTo(700, 600);
    ctx.stroke();

    // Texto
    ctx.font = 'bold 100px "Poppins", sans-serif';
    ctx.fillStyle = '#BBBBBB';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(category.toUpperCase(), 700, 750);

    const img = new Image();
    img.src = canvas.toDataURL('image/png');

    return img;
}

/**
 * Extrai cor dominante
 */
export async function getDominantColor(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 100;
    canvas.height = 100;
    ctx.drawImage(img, 0, 0, 100, 100);

    const imageData = ctx.getImageData(0, 0, 100, 100);
    const data = imageData.data;

    const colorCount = {};
    let maxCount = 0;
    let dominantColor = '#808080';

    for (let i = 0; i < data.length; i += 16) {
        const r = Math.floor(data[i] / 32) * 32;
        const g = Math.floor(data[i + 1] / 32) * 32;
        const b = Math.floor(data[i + 2] / 32) * 32;

        const key = `${r},${g},${b}`;
        colorCount[key] = (colorCount[key] || 0) + 1;

        if (colorCount[key] > maxCount) {
            maxCount = colorCount[key];
            dominantColor = rgbToHex(r, g, b);
        }
    }

    return dominantColor;
}

/**
 * RGB para Hex
 */
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
}

/**
 * Gera paleta de cores
 */
export function generateColorPalette(baseColor) {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return generateDefaultPalette();

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return {
        base: baseColor,
        lighter: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 30, 95)),
        darker: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 10)),
        complement: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    };
}

function generateDefaultPalette() {
    return {
        base: '#7C3AED',
        lighter: '#EDE9FE',
        darker: '#4C1D95',
        complement: '#3AED7C',
    };
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
        h *= 360;
    }

    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
        const v = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return Math.round(255 * v).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Comprime imagem
 */
export async function compressImage(img, quality = 0.85) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Aplica filtros
 */
export function applyFilters(img, filters = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    let filter = '';
    if (filters.brightness) filter += `brightness(${filters.brightness}%) `;
    if (filters.contrast) filter += `contrast(${filters.contrast}%) `;
    if (filters.saturation) filter += `saturate(${filters.saturation}%) `;
    if (filters.grayscale) filter += `grayscale(${filters.grayscale}%) `;

    ctx.filter = filter.trim();
    ctx.drawImage(img, 0, 0);

    return canvas;
}

/**
 * Valida URL de imagem
 */
export async function isValidImageUrl(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        return contentType?.startsWith('image/');
    } catch {
        return false;
    }
}

/**
 * Pré-carrega imagens
 */
export async function preloadImages(urls) {
    const images = await Promise.all(
        urls.map(url => new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = url;
        }))
    );
    return images.filter(img => img !== null);
}