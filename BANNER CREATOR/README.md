# E-Commerce Banner Generator

Generator de banners profissionais para e-commerce utilizando Inteligência Artificial e Canvas HTML5.

## 🎯 Visão Geral

Sistema web completo que gera automaticamente banners quadrados (1400x1400px) para categorias de e-commerce. O design é criado automaticamente pela IA seguindo princípios de design profissional (Golden Ratio, hierarquia visual, contraste WCAG AA).

## ✨ Funcionalidades

### Geração com IA
- Análise automática da categoria
- Seleção inteligente de paleta de cores
- Escolha de tipografia adequada
- Geração de elementos decorativos
- Aplicação de princípios de design editorial

### Controles Manuais
- **Layout**: Espessura da moldura, raio da borda, altura da faixa
- **Imagem**: Escala, posição X/Y, opacidade
- **Tipografia**: Fonte, tamanho, peso
- **Cores**: Fundo, faixa, título, subtítulo
- **Efeitos**: Sombra, opacidade

### Exportação
- PNG de alta qualidade (sem perda)
- JPEG otimizado para web
- Download com timestamp automático

### Upload de Imagens
- Drag and drop
- Preview instantâneo
- Auto-fit (object-fit: cover)
- Extração de cor dominante

## 🏗️ Estrutura do Projeto

```
BANNER CREATOR/
├── index.html              # Página principal
├── .env                    # API keys (NVIDIA_API_KEY)
├── .env.example            # Template de configuração
├── .gitignore              # Arquivos ignorados
├── README.md               # Documentação
├── css/
│   ├── variables.css       # Design tokens
│   ├── global.css          # Estilos base
│   └── components.css      # Componentes UI
├── js/
│   ├── app.js              # Application controller
│   ├── canvas.js           | Canvas manipulation
│   ├── imageGenerator.js   # Image processing
│   ├── promptBuilder.js    # AI prompt construction
│   └── export.js           # Export functions
└── assets/
    ├── fonts/              # Fontes customizadas
    ├── icons/              # Ícones SVG
    └── placeholders/       # Imagens placeholder
```

## 🚀 Como Usar

### 1. Configuração Inicial

O arquivo `.env` já contém a API key configurada. **Não é necessário alterar nada.**

### 2. Iniciar Servidor Proxy (necessário para IA funcionar)

Devido a restrições de CORS do navegador, é necessário rodar um proxy local:

```bash
# Abra o terminal na pasta do projeto
node proxy-server.js
```

O proxy iniciará em `http://localhost:3000`

### 3. Abrir a Aplicação

Com o proxy rodando, abra `index.html` em um navegador moderno (Chrome, Firefox, Edge).

**Opções:**
- Duplo clique em `index.html`
- Ou use um servidor local: `python -m http.server 8000`
- Ou Live Server no VS Code

### 4. Gerar Banner

**Opção A - Geração Automática com IA:**
1. Digite o nome da categoria (ex: "Vestidos", "Jeans", "Calçados")
2. Opcional: Digite um subtítulo
3. Clique em "Gerar com IA"
4. Aguarde o processamento
5. Ajuste manualmente se necessário

**Opção B - Geração Manual:**
1. Ajuste todos os controles manualmente
2. Clique em "Gerar Banner"

### 4. Upload de Imagem
- Clique na área de upload ou arraste uma imagem
- A imagem será automaticamente encaixada (cover)
- A cor dominante pode ser extraída automaticamente

### 5. Exportação
- Clique em "Exportar PNG" ou "Exportar JPG"
- O download começará automaticamente

## 🎨 Estilos de Design

A IA suporta diferentes estilos:

| Estilo | Características |
|--------|-----------------|
| **Premium/Luxo** | Minimalismo, espaço em branco, cores neutras |
| **Minimalista** | Menos elementos, paleta monocromática |
| **Bold** | Cores vibrantes, alto contraste |
| **Elegante** | Cores sofisticadas, tipografia refinada |
| **Trendy** | Cores da temporada, appeal jovem |

## 🧠 Integração IA (NVIDIA)

A aplicação utiliza a API NVIDIA NIM para geração de layouts:

### Endpoint
```
POST https://integrate.api.nvidia.com/v1/chat/completions
```

### Model
```
meta/llama-3.1-70b-instruct
```

### Prompt Building
O `promptBuilder.js` cria prompts estruturados com:
- Contexto do projeto
- Especificações técnicas
- Diretrizes de design
- Princípios de design (Golden Ratio, Rule of Thirds, etc.)
- Restrições de acessibilidade (WCAG AA)

### Response Format
A IA retorna JSON com:
```json
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
  "designReasoning": "..."
}
```

## 🎯 Princípios de Design Aplicados

1. **Golden Ratio (1.618:1)** - Proporções harmônicas
2. **Rule of Thirds** - Composição em terços
3. **Visual Hierarchy** - Tipografia com escala clara
4. **White Space** - Espaço negativo para luxo
5. **Contrast** - Contraste mínimo 4.5:1 (WCAG AA)
6. **Grid System** - Grid de 8px
7. **Gestalt** - Proximidade e similaridade

## 🔧 Modules

### `canvas.js`
- `initCanvas()` - Inicializa contexto 2D
- `renderBanner()` - Renderiza banner completo
- `drawBackground()` - Desenha fundo
- `drawImage()` - Desenha imagem (object-fit: cover)
- `drawBottomBand()` - Desenha faixa inferior
- `drawTitle()` / `drawSubtitle()` - Textos
- `drawBorder()` - Moldura
- `drawDecorations()` - Elementos decorativos

### `imageGenerator.js`
- `uploadImage()` - Upload e validação
- `generatePlaceholder()` - Placeholder SVG
- `getDominantColor()` - Análise de cor
- `generateColorPalette()` - Paleta baseada em cor
- `compressImage()` - Compressão JPEG
- `applyFilters()` - Filtros (brightness, contrast, etc.)

### `promptBuilder.js`
- `buildPrompt()` - Construtor de prompt principal
- `buildRegeneratePrompt()` - Prompt para variação
- `validateAIData()` - Validação de resposta IA

### `export.js`
- `exportAsPNG()` / `exportAsJPEG()` - Exportação
- `exportToClipboard()` - Copiar para clipboard
- `generateThumbnail()` - Preview
- `optimizeForWeb()` - Otimização web

### `app.js`
- Controller principal
- Gerenciamento de estado (AppState)
- Event listeners
- Integração com todos os módulos

## 📱 Responsividade

A aplicação funciona em:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Sidebar reduzida
- **Mobile**: Sidebar empilhada, canvas responsivo

## ♿ Acessibilidade

- ARIA labels em todos os controles
- Navegação por teclado
- Contraste de cores adequado
- Focus visible
- Textos semânticos

## 🚫 Regras de Validação

A IA e o sistema nunca geram banners com:
- Cores conflitantes
- Texto ilegível (contraste < 4.5:1)
- Imagem deformada (aspect ratio preservado)
- Alinhamentos incorretos
- Elementos sobrepostos sem hierarquia

## 📦 Dependências

**Nenhuma dependência externa!** Apenas:
- HTML5
- CSS3
- JavaScript ES6+ (Vanilla)
- Google Fonts (CDN)

## 🔐 Segurança

- API key não é exposta no frontend (idealmente usar backend proxy)
- Validação de tipo e tamanho de arquivo
- Sanitização de inputs

## 📝 License

MIT License

## 👨‍💻 Author

Desenvolvido como projeto profissional de E-Commerce Banner Generation.

---

**Dica**: Para melhores resultados, use imagens de alta resolução (mínimo 1000x1000px) com fundo limpo ou sem fundo (PNG transparente).