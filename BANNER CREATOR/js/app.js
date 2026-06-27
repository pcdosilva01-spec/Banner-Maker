/**
 * Main Application Module
 * Controlador principal da aplicação E-Commerce Banner Generator
 */

import { AppState, renderBanner, resizeCanvasForPreview } from './canvas.js';
import { uploadImage, generatePlaceholder, getDominantColor } from './imageGenerator.js';
import { buildPrompt, buildRegeneratePrompt, validateAIData } from './promptBuilder.js';
import { exportAsPNG, exportAsJPEG } from './export.js';

/**
 * Configurações da API NVIDIA
 * Usa proxy local se disponível para evitar CORS
 */
const API_CONFIG = {
    endpoint: window.API_ENDPOINT || 'http://localhost:3000/api/generate',
    directEndpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'meta/llama-3.1-70b-instruct',
    apiKey: null,
    useProxy: true,
};

/**
 * Carrega API key do .env (via meta tag ou variável global)
 */
function loadApiKey() {
    // Tenta pegar de variável global (injetada via script)
    if (window.NVIDIA_API_KEY) {
        API_CONFIG.apiKey = window.NVIDIA_API_KEY;
        return true;
    }
    return false;
}

/**
 * Elementos do DOM
 */
const DOM = {
    canvas: null,
    categoryName: null,
    categorySubtitle: null,
    colorPreference: null,
    btnAutoColor: null,
    btnGenerateAI: null,
    btnGenerate: null,
    btnRegenerate: null,
    btnReset: null,
    btnExportPNG: null,
    btnExportJPG: null,
    imageUpload: null,
    uploadArea: null,
    imagePreviewContainer: null,
    imagePreview: null,
    btnRemoveImage: null,
    loadingOverlay: null,
    loadingText: null,
    toastContainer: null,
    infoPanel: null,

    // Controles de layout
    borderThickness: null,
    borderRadius: null,
    bottomBandHeight: null,
    imageScale: null,
    imagePositionX: null,
    imagePositionY: null,

    // Controles de tipografia
    fontFamily: null,
    titleSize: null,
    subtitleSize: null,
    titleWeight: null,

    // Controles de cores
    backgroundColor: null,
    bandColor: null,
    titleColor: null,
    subtitleColor: null,

    // Controles de efeitos
    shadowOpacity: null,
    imageOpacity: null,
};

/**
 * Mapeamento de elementos DOM
 */
function initializeDOM() {
    DOM.canvas = document.getElementById('banner-canvas');
    DOM.categoryName = document.getElementById('category-name');
    DOM.categorySubtitle = document.getElementById('category-subtitle');
    DOM.colorPreference = document.getElementById('color-preference');
    DOM.btnAutoColor = document.getElementById('btn-auto-color');
    DOM.btnGenerateAI = document.getElementById('btn-generate-ai');
    DOM.btnGenerate = document.getElementById('btn-generate');
    DOM.btnRegenerate = document.getElementById('btn-regenerate');
    DOM.btnReset = document.getElementById('btn-reset');
    DOM.btnExportPNG = document.getElementById('btn-export-png');
    DOM.btnExportJPG = document.getElementById('btn-export-jpg');
    DOM.imageUpload = document.getElementById('image-upload');
    DOM.uploadArea = document.getElementById('upload-area');
    DOM.imagePreviewContainer = document.getElementById('image-preview-container');
    DOM.imagePreview = document.getElementById('image-preview');
    DOM.btnRemoveImage = document.getElementById('btn-remove-image');
    DOM.loadingOverlay = document.getElementById('loading-overlay');
    DOM.loadingText = document.getElementById('loading-text');
    DOM.toastContainer = document.getElementById('toast-container');
    DOM.infoPanel = document.getElementById('info-panel');

    // Layout controls
    DOM.borderThickness = document.getElementById('border-thickness');
    DOM.borderRadius = document.getElementById('border-radius');
    DOM.bottomBandHeight = document.getElementById('bottom-band-height');
    DOM.imageScale = document.getElementById('image-scale');
    DOM.imagePositionX = document.getElementById('image-position-x');
    DOM.imagePositionY = document.getElementById('image-position-y');

    // Typography controls
    DOM.fontFamily = document.getElementById('font-family');
    DOM.titleSize = document.getElementById('title-size');
    DOM.subtitleSize = document.getElementById('subtitle-size');
    DOM.titleWeight = document.getElementById('title-weight');

    // Color controls
    DOM.backgroundColor = document.getElementById('background-color');
    DOM.bandColor = document.getElementById('band-color');
    DOM.titleColor = document.getElementById('title-color');
    DOM.subtitleColor = document.getElementById('subtitle-color');

    // Effects controls
    DOM.shadowOpacity = document.getElementById('shadow-opacity');
    DOM.imageOpacity = document.getElementById('image-opacity');
}

/**
 * Atualiza valores dos sliders
 */
function updateSliderValues() {
    const updateSlider = (slider, valueId, suffix = '') => {
        if (slider && valueId) {
            const valueEl = document.getElementById(valueId);
            if (valueEl) {
                valueEl.textContent = slider.value + suffix;
            }
        }
    };

    updateSlider(DOM.borderThickness, 'border-thickness-value', 'px');
    updateSlider(DOM.borderRadius, 'border-radius-value', 'px');
    updateSlider(DOM.bottomBandHeight, 'bottom-band-height-value', 'px');
    updateSlider(DOM.imageScale, 'image-scale-value', '%');
    updateSlider(DOM.imagePositionX, 'image-position-x-value', '%');
    updateSlider(DOM.imagePositionY, 'image-position-y-value', '%');
    updateSlider(DOM.titleSize, 'title-size-value', 'px');
    updateSlider(DOM.subtitleSize, 'subtitle-size-value', 'px');
    updateSlider(DOM.shadowOpacity, 'shadow-opacity-value', '%');
    updateSlider(DOM.imageOpacity, 'image-opacity-value', '%');
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
    // Text inputs
    DOM.categoryName?.addEventListener('input', handleCategoryChange);
    DOM.categorySubtitle?.addEventListener('input', handleCategoryChange);

    // Color picker
    DOM.colorPreference?.addEventListener('input', () => {
        AppState.setState({ autoColor: false });
    });

    DOM.btnAutoColor?.addEventListener('click', () => {
        AppState.setState({ autoColor: true });
        DOM.colorPreference.value = '#7C3AED';
        showToast('info', 'Auto Cor', 'IA escolherá as cores automaticamente');
    });

    // Buttons
    DOM.btnGenerateAI?.addEventListener('click', handleAIGenerate);
    DOM.btnGenerate?.addEventListener('click', handleManualGenerate);
    DOM.btnRegenerate?.addEventListener('click', handleRegenerate);
    DOM.btnReset?.addEventListener('click', handleReset);
    DOM.btnExportPNG?.addEventListener('click', () => handleExport('png'));
    DOM.btnExportJPG?.addEventListener('click', () => handleExport('jpeg'));

    // Image upload
    DOM.imageUpload?.addEventListener('change', handleImageUpload);
    DOM.btnRemoveImage?.addEventListener('click', handleRemoveImage);

    // Drag and drop
    setupDragAndDrop();

    // Sliders
    const sliders = [
        DOM.borderThickness, DOM.borderRadius, DOM.bottomBandHeight,
        DOM.imageScale, DOM.imagePositionX, DOM.imagePositionY,
        DOM.titleSize, DOM.subtitleSize, DOM.shadowOpacity, DOM.imageOpacity,
    ];

    sliders.forEach(slider => {
        slider?.addEventListener('input', (e) => {
            updateSliderValues();
            updateStateFromControls();
            renderBanner(DOM.canvas);
        });
    });

    // Selects
    DOM.fontFamily?.addEventListener('change', () => {
        updateStateFromControls();
        renderBanner(DOM.canvas);
    });

    DOM.titleWeight?.addEventListener('change', () => {
        updateStateFromControls();
        renderBanner(DOM.canvas);
    });

    // Color pickers
    const colorPickers = [
        DOM.backgroundColor, DOM.bandColor, DOM.titleColor, DOM.subtitleColor,
    ];

    colorPickers.forEach(picker => {
        picker?.addEventListener('input', () => {
            updateStateFromControls();
            renderBanner(DOM.canvas);
        });
    });

    // Window resize
    window.addEventListener('resize', () => {
        resizeCanvasForPreview(DOM.canvas);
    });
}

/**
 * Configura drag and drop
 */
function setupDragAndDrop() {
    const uploadArea = DOM.uploadArea;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    uploadArea?.addEventListener('dragenter', () => {
        uploadArea.classList.add('drag-over');
    });

    uploadArea?.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea?.addEventListener('drop', (e) => {
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    });

    uploadArea?.addEventListener('click', () => {
        DOM.imageUpload?.click();
    });
}

/**
 * Atualiza estado a partir dos controles
 */
function updateStateFromControls() {
    const newState = {
        categoryName: DOM.categoryName?.value || 'Peças de Cima',
        categorySubtitle: DOM.categorySubtitle?.value || 'Compre agora >',
        backgroundColor: DOM.backgroundColor?.value || '#F5F5F5',
        bandColor: DOM.bandColor?.value || '#1A1A1A',
        titleColor: DOM.titleColor?.value || '#FFFFFF',
        subtitleColor: DOM.subtitleColor?.value || '#CCCCCC',
        borderThickness: parseInt(DOM.borderThickness?.value) || 0,
        borderRadius: parseInt(DOM.borderRadius?.value) || 0,
        bottomBandHeight: parseInt(DOM.bottomBandHeight?.value) || 300,
        imageScale: parseInt(DOM.imageScale?.value) || 100,
        imagePositionX: parseInt(DOM.imagePositionX?.value) || 0,
        imagePositionY: parseInt(DOM.imagePositionY?.value) || 0,
        imageOpacity: parseInt(DOM.imageOpacity?.value) || 100,
        fontFamily: DOM.fontFamily?.value || 'Poppins',
        titleSize: parseInt(DOM.titleSize?.value) || 72,
        subtitleSize: parseInt(DOM.subtitleSize?.value) || 24,
        titleWeight: parseInt(DOM.titleWeight?.value) || 700,
        shadowOpacity: parseInt(DOM.shadowOpacity?.value) || 0,
    };

    AppState.setState(newState);
}

/**
 * Handle mudança de categoria
 */
function handleCategoryChange() {
    updateStateFromControls();
    renderBanner(DOM.canvas);
}

/**
 * Handle upload de imagem
 */
async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        await handleFile(file);
    }
}

/**
 * Processa arquivo de imagem
 */
async function handleFile(file) {
    showLoading(true, 'Processando imagem...');

    const result = await uploadImage(file);

    showLoading(false);

    if (result.success) {
        AppState.setState({ uploadedImage: result.image });

        // Atualiza preview
        DOM.imagePreview.src = result.image.src;
        DOM.imagePreviewContainer.style.display = 'block';
        DOM.uploadArea.style.display = 'none';

        // Extrai cor dominante se autoColor estiver ativo
        if (AppState.state.autoColor) {
            const dominantColor = await getDominantColor(result.image);
            DOM.colorPreference.value = dominantColor;
        }

        renderBanner(DOM.canvas);
        showToast('success', 'Imagem carregada', 'Sua imagem foi adicionada ao banner');
    } else {
        showToast('error', 'Erro no upload', result.error);
    }
}

/**
 * Handle remove imagem
 */
function handleRemoveImage() {
    AppState.setState({ uploadedImage: null });
    DOM.imagePreview.src = '';
    DOM.imagePreviewContainer.style.display = 'none';
    DOM.uploadArea.style.display = 'block';
    DOM.imageUpload.value = '';
    renderBanner(DOM.canvas);
    showToast('info', 'Imagem removida');
}

/**
 * Handle geração com IA
 */
async function handleAIGenerate() {
    updateStateFromControls();

    const categoryName = DOM.categoryName?.value || 'Peças de Cima';
    const categorySubtitle = DOM.categorySubtitle?.value || 'Compre agora >';
    const colorPreference = AppState.state.autoColor ? null : DOM.colorPreference?.value;

    showLoading(true, 'Gerando com IA...');

    try {
        loadApiKey();

        if (!API_CONFIG.apiKey) {
            throw new Error('API key não configurada. Verifique o arquivo .env');
        }

        const prompt = buildPrompt({
            categoryName,
            categorySubtitle,
            colorPreference,
            style: 'premium',
        });

        // Tenta proxy primeiro, depois direto
        const endpoint = API_CONFIG.useProxy ? API_CONFIG.endpoint : API_CONFIG.directEndpoint;

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        // Proxy não precisa de auth header (já está no servidor)
        if (!API_CONFIG.useProxy) {
            headers['Authorization'] = `Bearer ${API_CONFIG.apiKey}`;
        }

        let response;
        try {
            response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model: API_CONFIG.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um designer gráfico especialista em e-commerce de moda. Responda APENAS com JSON válido, sem markdown, sem explicações extras.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
                }),
            });
        } catch (fetchError) {
            // CORS error - tenta fallbackético
            if (API_CONFIG.useProxy) {
                console.warn('Proxy falhou, tentando direto...');
                API_CONFIG.useProxy = false;
                showToast('warning', 'Tentando fallback...', 'Erro de CORS - tentando conexão direta');
                // Tenta novamente sem proxy (pode falhar por CORS)
                return handleAIGenerate();
            } else {
                throw new Error('Não foi possível conectar à API. Inicie o proxy: node proxy-server.js');
            }
        }

        if (!response?.ok) {
            let errorMsg = 'Falha na API';
            try {
                const error = await response?.json();
                errorMsg = error.message || error.error?.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || '';

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Resposta inválida da IA');
        }

        const aiData = JSON.parse(jsonMatch[0]);
        const validatedData = validateAIData(aiData);

        // Aplica dados ao estado
        applyAIData(validatedData);

        showToast('success', 'Banner gerado!', 'Design criado pela IA com sucesso');

    } catch (error) {
        console.error('Erro IA:', error);
        showToast('error', 'Erro na IA', error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Aplica dados da IA
 */
function applyAIData(aiData) {
    if (aiData.backgroundColor) DOM.backgroundColor.value = aiData.backgroundColor;
    if (aiData.bandColor) DOM.bandColor.value = aiData.bandColor;
    if (aiData.titleColor) DOM.titleColor.value = aiData.titleColor;
    if (aiData.subtitleColor) DOM.subtitleColor.value = aiData.subtitleColor;
    if (aiData.borderThickness) DOM.borderThickness.value = aiData.borderThickness;
    if (aiData.borderRadius) DOM.borderRadius.value = aiData.borderRadius;
    if (aiData.titleSize) DOM.titleSize.value = aiData.titleSize;
    if (aiData.subtitleSize) DOM.subtitleSize.value = aiData.subtitleSize;
    if (aiData.titleWeight) DOM.titleWeight.value = aiData.titleWeight;
    if (aiData.fontFamily) DOM.fontFamily.value = aiData.fontFamily;

    updateStateFromControls();
    updateSliderValues();
    renderBanner(DOM.canvas, aiData);
}

/**
 * Handle geração manual
 */
function handleManualGenerate() {
    updateStateFromControls();
    renderBanner(DOM.canvas);
    showToast('success', 'Banner atualizado', 'Seu banner foi gerado');
}

/**
 * Handle regeneração
 */
async function handleRegenerate() {
    updateStateFromControls();

    showLoading(true, 'Gerando variação...');

    try {
        loadApiKey();

        if (!API_CONFIG.apiKey) {
            throw new Error('API key não configurada');
        }

        const prompt = buildRegeneratePrompt(AppState.state);

        const endpoint = API_CONFIG.useProxy ? API_CONFIG.endpoint : API_CONFIG.directEndpoint;

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (!API_CONFIG.useProxy) {
            headers['Authorization'] = `Bearer ${API_CONFIG.apiKey}`;
        }

        let response;
        try {
            response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model: API_CONFIG.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um designer gráfico. Responda APENAS com JSON válido.'
                        },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.8,
                    max_tokens: 500,
                }),
            });
        } catch (fetchError) {
            if (API_CONFIG.useProxy) {
                API_CONFIG.useProxy = false;
                showToast('warning', 'Tentando fallback...', 'Erro de CORS');
                return handleRegenerate();
            } else {
                throw new Error('Inicie o proxy: node proxy-server.js');
            }
        }

        if (!response?.ok) {
            throw new Error('Falha na API');
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || '';

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Resposta inválida');

        const aiData = JSON.parse(jsonMatch[0]);
        const validatedData = validateAIData(aiData);

        applyAIData(validatedData);
        showToast('success', 'Variação gerada!', 'Novo design criado');

    } catch (error) {
        showToast('error', 'Erro', error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Handle reset
 */
function handleReset() {
    const defaults = {
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
    };

    AppState.setState(defaults);

    // Atualiza controles
    if (DOM.categoryName) DOM.categoryName.value = defaults.categoryName;
    if (DOM.categorySubtitle) DOM.categorySubtitle.value = defaults.categorySubtitle;
    if (DOM.backgroundColor) DOM.backgroundColor.value = defaults.backgroundColor;
    if (DOM.bandColor) DOM.bandColor.value = defaults.bandColor;
    if (DOM.titleColor) DOM.titleColor.value = defaults.titleColor;
    if (DOM.subtitleColor) DOM.subtitleColor.value = defaults.subtitleColor;
    if (DOM.borderThickness) DOM.borderThickness.value = defaults.borderThickness;
    if (DOM.borderRadius) DOM.borderRadius.value = defaults.borderRadius;
    if (DOM.bottomBandHeight) DOM.bottomBandHeight.value = defaults.bottomBandHeight;
    if (DOM.imageScale) DOM.imageScale.value = defaults.imageScale;
    if (DOM.imagePositionX) DOM.imagePositionX.value = defaults.imagePositionX;
    if (DOM.imagePositionY) DOM.imagePositionY.value = defaults.imagePositionY;
    if (DOM.imageOpacity) DOM.imageOpacity.value = defaults.imageOpacity;
    if (DOM.fontFamily) DOM.fontFamily.value = defaults.fontFamily;
    if (DOM.titleSize) DOM.titleSize.value = defaults.titleSize;
    if (DOM.subtitleSize) DOM.subtitleSize.value = defaults.subtitleSize;
    if (DOM.titleWeight) DOM.titleWeight.value = defaults.titleWeight;
    if (DOM.shadowOpacity) DOM.shadowOpacity.value = defaults.shadowOpacity;

    // Remove imagem
    handleRemoveImage();

    updateSliderValues();
    renderBanner(DOM.canvas);
    showToast('info', 'Resetado', 'Configurações restauradas');
}

/**
 * Handle exportação
 */
async function handleExport(format) {
    const filename = `banner-${AppState.state.categoryName.toLowerCase().replace(/\s+/g, '-')}`;

    if (format === 'png') {
        const result = await exportAsPNG(DOM.canvas, filename);
        if (result.success) {
            showToast('success', 'PNG exportado', result.filename);
        } else {
            showToast('error', 'Erro na exportação', result.error);
        }
    } else {
        const result = await exportAsJPEG(DOM.canvas, filename);
        if (result.success) {
            showToast('success', 'JPG exportado', result.filename);
        } else {
            showToast('error', 'Erro na exportação', result.error);
        }
    }
}

/**
 * Mostra loading overlay
 */
function showLoading(show, text = '') {
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.style.display = show ? 'flex' : 'none';
    }
    if (DOM.loadingText && text) {
        DOM.loadingText.textContent = text;
    }
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.setAttribute('aria-busy', show ? 'true' : 'false');
    }
}

/**
 * Mostra toast notification
 */
function showToast(type, title, message = '') {
    if (!DOM.toastContainer) return;

    const icons = {
        success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>',
        error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
        warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
        info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${icons[type]}
        </svg>
        <div class="toast-content">
            <p class="toast-title">${title}</p>
            ${message ? `<p class="toast-message">${message}</p>` : ''}
        </div>
        <button class="toast-close" aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `;

    DOM.toastContainer.appendChild(toast);

    toast.querySelector('.toast-close')?.addEventListener('click', () => {
        removeToast(toast);
    });

    setTimeout(() => removeToast(toast), 4000);
}

/**
 * Remove toast
 */
function removeToast(toast) {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

/**
 * Inicialização da aplicação
 */
async function initializeApp() {
    console.log('Inicializando E-Commerce Banner Generator...');

    // Carrega API key
    loadApiKey();

    // Inicializa DOM
    initializeDOM();

    // Verifica elementos críticos
    if (!DOM.canvas) {
        console.error('Canvas não encontrado');
        return;
    }

    // Gera placeholder inicial
    const placeholder = generatePlaceholder('Peças de Cima');
    AppState.setState({ uploadedImage: placeholder });

    // Renderiza banner inicial
    renderBanner(DOM.canvas);

    // Atualiza valores dos sliders
    updateSliderValues();

    // Configura event listeners
    setupEventListeners();

    // Redimensiona canvas
    resizeCanvasForPreview(DOM.canvas);

    console.log('Aplicação inicializada com sucesso!');
}

// Inicializa quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Exporta AppState para outros módulos
export { AppState };