/**
 * Canvas Module
 * Manipulação do Canvas HTML5 para desenho do banner
 */

export const CANVAS_WIDTH = 1400;
export const CANVAS_HEIGHT = 1400;

/**
 * Estado global da aplicação
 */
export const AppState = {
    state: {
        categoryName: 'Peças de Cima',
        categorySubtitle: 'Compre agora >',
        backgroundColor: '#F5F5F5',
        bandColor: '#1A1A1A',
        titleColor: '#FFFFFF',
        subtitleColor: '#CCCCCC',
        borderThickness: 0,
        borderRadius: 0,
        bottomBandHeight: 300,
        imageScale: 100,
        imagePositionX: 0,
        imagePositionY: 0,
        imageOpacity: 100,
        fontFamily: 'Poppins',
        titleSize: 72,
        subtitleSize: 24,
        titleWeight: 700,
        shadowOpacity: 0,
        uploadedImage: null,
        autoColor: true,
    },
    setState(newState) {
        this.state = { ...this.state, ...newState };
    },
    getState() {
        return { ...this.state };
    },
};

/**
 * Inicializa o canvas
 */
export function initCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    return ctx;
}

/**
 * Limpa o canvas
 */
export function clearCanvas(ctx) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * Desenha o fundo
 */
export function drawBackground(ctx, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.restore();
}

/**
 * Desenha a imagem com object-fit: cover
 */
export function drawImage(ctx, img, options = {}) {
    if (!img || !img.complete) return;

    const {
        scaleX = 1, scaleY = 1,
        offsetX = 0, offsetY = 0,
        opacity = 1,
    } = options;

    ctx.save();
    ctx.globalAlpha = opacity;

    const bandHeight = AppState.state.bottomBandHeight;
    const availableHeight = CANVAS_HEIGHT - bandHeight;
    const availableWidth = CANVAS_WIDTH;

    const imgRatio = img.width / img.height;
    const renderAreaRatio = availableWidth / availableHeight;

    let renderWidth, renderHeight;

    if (imgRatio > renderAreaRatio) {
        renderHeight = availableHeight * 1.15;
        renderWidth = renderHeight * imgRatio;
    } else {
        renderWidth = availableWidth * 1.15;
        renderHeight = renderWidth / imgRatio;
    }

    renderWidth *= scaleX;
    renderHeight *= scaleY;

    const centerX = CANVAS_WIDTH / 2;
    const centerY = availableHeight / 2;

    const finalX = centerX + (offsetX * renderWidth / 100);
    const finalY = centerY + (offsetY * renderHeight / 100);

    ctx.drawImage(
        img,
        finalX - renderWidth / 2,
        finalY - renderHeight / 2,
        renderWidth,
        renderHeight
    );

    ctx.restore();
}

/**
 * Desenha a faixa inferior
 */
export function drawBottomBand(ctx, options = {}) {
    const {
        height = AppState.state.bottomBandHeight,
        color = AppState.state.bandColor,
        borderRadius = AppState.state.borderRadius,
    } = options;

    ctx.save();
    ctx.fillStyle = color;

    const y = CANVAS_HEIGHT - height;

    if (borderRadius > 0 && y < borderRadius) {
        ctx.beginPath();
        ctx.moveTo(0, y + borderRadius);
        ctx.arcTo(0, y, borderRadius, y, borderRadius);
        ctx.lineTo(CANVAS_WIDTH - borderRadius, y);
        ctx.arcTo(CANVAS_WIDTH, y, CANVAS_WIDTH, y + borderRadius, borderRadius);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.lineTo(0, CANVAS_HEIGHT);
        ctx.closePath();
    } else {
        ctx.fillRect(0, y, CANVAS_WIDTH, height);
    }

    ctx.restore();
}

/**
 * Desenha o título
 */
export function drawTitle(ctx, options = {}) {
    const state = AppState.state;
    const {
        text = state.categoryName || 'TÍTULO',
        fontSize = state.titleSize,
        fontWeight = state.titleWeight,
        fontFamily = state.fontFamily,
        color = state.titleColor,
    } = options;

    ctx.save();

    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const bandY = CANVAS_HEIGHT - state.bottomBandHeight / 2;

    if (state.shadowOpacity > 0) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }

    const maxWidth = CANVAS_WIDTH - 100;
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 1.15;
    const totalHeight = lines.length * lineHeight;
    const startY = bandY - totalHeight / 2 + lineHeight / 2;

    lines.forEach((line, i) => {
        ctx.fillText(line, CANVAS_WIDTH / 2, startY + i * lineHeight);
    });

    ctx.restore();
}

/**
 * Desenha o subtítulo
 */
export function drawSubtitle(ctx, options = {}) {
    const state = AppState.state;
    const {
        text = state.categorySubtitle || 'Compre agora >',
        fontSize = state.subtitleSize,
        fontFamily = state.fontFamily,
        color = state.subtitleColor,
    } = options;

    ctx.save();

    ctx.font = `500 ${fontSize}px "${fontFamily}", sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '0.05em';

    const y = CANVAS_HEIGHT - state.bottomBandHeight + 80;

    if (state.shadowOpacity > 0) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
    }

    ctx.fillText(text, CANVAS_WIDTH / 2, y);

    ctx.restore();
}

/**
 * Desenha a moldura
 */
export function drawBorder(ctx, options = {}) {
    const {
        thickness = AppState.state.borderThickness,
        color = AppState.state.bandColor,
        borderRadius = AppState.state.borderRadius,
    } = options;

    if (thickness <= 0) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness * 2;

    if (borderRadius > 0) {
        ctx.beginPath();
        ctx.moveTo(borderRadius, 0);
        ctx.lineTo(CANVAS_WIDTH - borderRadius, 0);
        ctx.arcTo(CANVAS_WIDTH, 0, CANVAS_WIDTH, borderRadius, borderRadius);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - borderRadius);
        ctx.arcTo(CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_WIDTH - borderRadius, CANVAS_HEIGHT, borderRadius);
        ctx.lineTo(borderRadius, CANVAS_HEIGHT);
        ctx.arcTo(0, CANVAS_HEIGHT, 0, CANVAS_HEIGHT - borderRadius, borderRadius);
        ctx.lineTo(0, borderRadius);
        ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
        ctx.stroke();
    } else {
        ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    ctx.restore();
}

/**
 * Desenha decorações
 */
export function drawDecorations(ctx, decorations = []) {
    ctx.save();

    decorations.forEach(dec => {
        if (dec.type === 'line') {
            ctx.globalAlpha = dec.opacity || 0.3;
            ctx.strokeStyle = dec.color || '#FFFFFF';
            ctx.lineWidth = dec.width || 1;
            ctx.beginPath();
            ctx.moveTo(dec.x1 || 0, dec.y1 || 0);
            ctx.lineTo(dec.x2 || CANVAS_WIDTH, dec.y2 || 0);
            ctx.stroke();
        } else if (dec.type === 'circle') {
            ctx.globalAlpha = dec.opacity || 0.1;
            ctx.strokeStyle = dec.color || '#FFFFFF';
            ctx.lineWidth = dec.strokeWidth || 2;
            ctx.beginPath();
            ctx.arc(dec.x || CANVAS_WIDTH/2, dec.y || CANVAS_HEIGHT/2, dec.radius || 100, 0, Math.PI * 2);
            ctx.stroke();
        }
    });

    ctx.restore();
}

/**
 * Renderiza o banner completo
 */
export function renderBanner(canvas, aiData = {}) {
    const ctx = initCanvas(canvas);
    clearCanvas(ctx);

    // 1. Fundo
    drawBackground(ctx, aiData.backgroundColor || AppState.state.backgroundColor);

    // 2. Decorações
    drawDecorations(ctx, aiData.decorations || []);

    // 3. Imagem
    if (AppState.state.uploadedImage) {
        drawImage(ctx, AppState.state.uploadedImage, {
            scaleX: AppState.state.imageScale / 100,
            scaleY: AppState.state.imageScale / 100,
            offsetX: AppState.state.imagePositionX,
            offsetY: AppState.state.imagePositionY,
            opacity: AppState.state.imageOpacity / 100,
        });
    }

    // 4. Faixa inferior
    drawBottomBand(ctx, aiData);

    // 5. Título
    drawTitle(ctx, aiData);

    // 6. Subtítulo
    drawSubtitle(ctx, aiData);

    // 7. Moldura
    drawBorder(ctx, aiData);
}

/**
 * Redimensiona canvas para preview
 */
export function resizeCanvasForPreview(canvas) {
    const container = canvas.parentElement;
    if (!container) return;

    const maxWidth = container.clientWidth - 48;
    const maxHeight = container.clientHeight - 48;
    const size = Math.min(maxWidth, maxHeight, CANVAS_WIDTH);

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
}

/**
 * Canvas para Blob
 */
export function canvasToBlob(canvas, type = 'image/png', quality = 1.0) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error('Falha ao converter'));
        }, type, quality);
    });
}

/**
 * Canvas para DataURL
 */
export function canvasToDataURL(canvas, type = 'image/png', quality = 1.0) {
    return canvas.toDataURL(type, quality);
}