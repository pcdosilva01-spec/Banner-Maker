/**
 * Prompt Builder Module
 * Construtor de prompts para IA gerar layouts profissionais
 * Cria prompts detalhados baseados em princípios de design
 */

/**
 * Tipos de prompt para diferentes cenários
 */
export const PromptTypes = {
    FASHION: 'fashion',
    MINIMAL: 'minimal',
    BOLD: 'bold',
    ELEGANT: 'elegant',
    TRENDY: 'trendy',
};

/**
 * Princípios de design aplicados aos prompts
 */
export const DesignPrinciples = {
    GOLDEN_RATIO: '1.618:1 golden ratio proportions',
    RULE_OF_THIRDS: 'rule of thirds composition',
    VISUAL_HIERARCHY: 'clear visual hierarchy with typography scale',
    WHITE_SPACE: 'generous white space for luxury feel',
    CONTRAST: 'high contrast for accessibility (WCAG AA minimum)',
    BALANCE: 'symmetrical or asymmetrical balance',
    GESTALT: 'gestalt principles of proximity and similarity',
};

/**
 * Construtor de prompt principal
 * @param {Object} inputData - Dados de entrada do usuário
 * @returns {string} Prompt completo para a IA
 */
export function buildPrompt(inputData) {
    const {
        categoryName,
        categorySubtitle,
        colorPreference,
        style = 'premium',
        targetAudience = 'general',
    } = inputData;

    const header = buildHeader();
    const context = buildContext(categoryName, categorySubtitle, targetAudience);
    const specs = buildTechnicalSpecs();
    const designGuidelines = buildDesignGuidelines(style);
    const colorGuidelines = buildColorGuidelines(colorPreference, style);
    const typographyGuidelines = buildTypographyGuidelines();
    const layoutGuidelines = buildLayoutGuidelines();
    const decorationGuidelines = buildDecorationGuidelines(style);
    const constraints = buildConstraints();
    const outputFormat = buildOutputFormat();

    return `${header}

${context}

${specs}

${designGuidelines}

${colorGuidelines}

${typographyGuidelines}

${layoutGuidelines}

${decorationGuidelines}

${constraints}

${outputFormat}`;
}

/**
 * Constrói o header do prompt definindo o papel da IA
 */
function buildHeader() {
    return `Você é um designer gráfico sênior especializado em e-commerce de moda e luxo.
Sua tarefa é criar especificações para um banner quadrado (1400x1400 pixels) extremamente profissional e elegante.

O banner deve ter aparência premium, semelhante a marcas como Zara, Nike, Adidas, Reserva.
Use princípios de design editorial de moda e minimalismo contemporâneo.`;
}

/**
 * Constrói o contexto da categoria
 */
function buildContext(categoryName, categorySubtitle, targetAudience) {
    return `## CONTEXTO DO PROJETO

**Categoria:** ${categoryName}
**Subtítulo:** ${categorySubtitle || 'Compre agora >'}
**Público-alvo:** ${targetAudience}

O banner será usado em e-commerce de moda, Instagram e campanhas de marketing digital.
O tom deve ser: profissional, aspirational, clean, moderno.`;
}

/**
 * Constrói as especificações técnicas
 */
function buildTechnicalSpecs() {
    return `## ESPECIFICAÇÕES TÉCNICAS

- Tamanho: 1400 x 1400 pixels (quadrado, 1:1 aspect ratio)
- Formato: Digital (RGB color space)
- Qualidade: Alta resolução para web e social media
- Safe zone: Margem interna de 50px para elementos críticos`;
}

/**
 * Constrói diretrizes de design
 */
function buildDesignGuidelines(style) {
    const styleDescriptions = {
        premium: `**Estilo PREMIUM/LUXO:** Minimalismo sofisticado, muito espaço em branco, tipografia grande e bold, cores neutras com 1 cor de destaque.`,
        minimal: `**Estilo MINIMALISTA:** Less is more, máximo 3 elementos principais, paleta monocromática, tipografia sans-serif clean.`,
        bold: `**Estilo BOLD:** Cores vibrantes, tipografia extra bold, alto contraste, elementos gráficos marcantes.`,
        elegant: `**Estilo ELEGANTE:** Cores sofisticadas (preto, branco, dourado), tipografia refinada, linhas delicadas.`,
        trendy: `**Estilo TRENDY:** Cores da temporada, elementos gráficos atuais, apelo para Gen-Z e Millennials.`,
    };

    return `## DIRETRIZES DE DESIGN

${styleDescriptions[style] || styleDescriptions.premium}

### Princípios Fundamentais:
1. Hierarquia Visual clara
2. Contraste WCAG AA (mínimo 4.5:1)
3. Generous white space
4. Grid de 8px
5. Golden ratio quando aplicável`;
}

/**
 * Constrói diretrizes de cores
 */
function buildColorGuidelines(colorPreference, style) {
    const userColor = colorPreference ? `O usuário preferiu ${colorPreference} como base.` : '';

    return `## PALETA DE CORES

${userColor}

**Diretrizes:**
- Fundo: limpo, não competir com imagem (whites, light grays, ou blacks profundos)
- Faixa Inferior: alto contraste com título (preto, branco, navy, burgundy)
- Título: máximo contraste com faixa
- Evitar: cores neon, gradientes baratos, muitas cores competindo`;
}

/**
 * Constrói diretrizes de tipografia
 */
function buildTypographyGuidelines() {
    return `## TIPOGRAFIA

**Título Principal:**
- Tamanho: 64px - 96px
- Peso: 600-800 (SemiBold a ExtraBold)
- Fontes: Poppins, Montserrat, Outfit, DM Sans, Manrope, Plus Jakarta Sans

**Subtítulo:**
- Tamanho: 18px - 28px
- Peso: 400-500
- Letter-spacing: 0.05em - 0.1em`;
}

/**
 * Constrói diretrizes de layout
 */
function buildLayoutGuidelines() {
    return `## LAYOUT E COMPOSIÇÃO

**Zona Superior (0-75%):** Imagem do produto/modelo com fundo limpo
**Zona Inferior (75-100%):** Faixa horizontal sólida com título e subtítulo

Use grid de 8px, margens de 50px, e alinhamento centralizado.`;
}

/**
 * Constrói diretrizes de decoração
 */
function buildDecorationGuidelines() {
    return `## ELEMENTOS DECORATIVOS

Usar com moderação: linhas finas (1-2px, 20-40% opacity), formas geométricas sutis (5-15% opacity).
Regra: Se não adiciona clareza ou beleza, remova.`;
}

/**
 * Constrói constraints
 */
function buildConstraints() {
    return `## EVITAR

1. Contraste baixo / texto ilegível
2. Poluição visual / excesso de elementos
3. Alinhamentos incorretos
4. Cores conflitantes
5. Texto deformado
6. Elementos sobrepostos sem hierarchy`;
}

/**
 * Constrói formato de output
 */
function buildOutputFormat() {
    return `## OUTPUT FORMAT (JSON)

{
  "backgroundColor": "#F5F5F5",
  "bandColor": "#1A1A1A",
  "titleColor": "#FFFFFF",
  "subtitleColor": "#CCCCCC",
  "titleSize": 72,
  "subtitleSize": 24,
  "titleWeight": 700,
  "fontFamily": "Montserrat",
  "borderThickness": 0,
  "borderRadius": 0,
  "decorations": [],
  "designReasoning": "Breve explicação"
}`;
}

/**
 * Cria prompt para regeneração
 */
export function buildRegeneratePrompt(currentState) {
    return `Mantendo "${currentState.categoryName}", gere nova variação.
Mude: paleta de cores, estilo (claro/escuro), peso da fonte, elementos.
Mantenha legibilidade e design principles.
FORMATO: JSON igual ao anterior.`;
}

/**
 * Valida dados da IA
 */
export function validateAIData(data) {
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const sanitize = (t, d) => (t && typeof t === 'string') ? t.substring(0, 50).replace(/[<>]/g, '') : d;
    const validColors = ['#F5F5F5', '#1A1A1A', '#FFFFFF', '#CCCCCC', '#000000'];
    const validFonts = ['Poppins', 'Montserrat', 'Outfit', 'DM Sans', 'Manrope', 'Plus Jakarta Sans'];
    const validWeights = [300, 400, 500, 600, 700, 800, 900];

    const isValidColor = (c) => /^#[0-9A-Fa-f]{6}$/.test(c);

    return {
        backgroundColor: isValidColor(data?.backgroundColor) ? data.backgroundColor : '#F5F5F5',
        bandColor: isValidColor(data?.bandColor) ? data.bandColor : '#1A1A1A',
        titleColor: isValidColor(data?.titleColor) ? data.titleColor : '#FFFFFF',
        subtitleColor: isValidColor(data?.subtitleColor) ? data.subtitleColor : '#CCCCCC',
        borderThickness: clamp(parseInt(data?.borderThickness) || 0, 0, 40),
        borderRadius: clamp(parseInt(data?.borderRadius) || 0, 0, 100),
        title: sanitize(data?.title, 'TÍTULO'),
        subtitle: sanitize(data?.subtitle, 'Compre agora >'),
        titleSize: clamp(parseInt(data?.titleSize) || 72, 32, 120),
        subtitleSize: clamp(parseInt(data?.subtitleSize) || 24, 14, 48),
        titleWeight: validWeights.includes(parseInt(data?.titleWeight)) ? parseInt(data.titleWeight) : 700,
        fontFamily: validFonts.includes(data?.fontFamily) ? data.fontFamily : 'Montserrat',
        decorations: Array.isArray(data?.decorations) ? data.decorations.slice(0, 5) : [],
        designReasoning: sanitize(data?.designReasoning, ''),
    };
}

/**
 * Gera seed aleatória
 */
export function generateSeed() {
    return Math.floor(Math.random() * 1000000);
}