# Guia de Início Rápido

## Passos para usar o E-Commerce Banner Generator

### Passo 1: Iniciar o Proxy (obrigatório para IA)

Abra o terminal na pasta do projeto e execute:

```bash
node proxy-server.js
```

Você verá:
```
🚀 Proxy Server rodando em http://localhost:3000
Endpoints:
  POST /api/generate - NVIDIA Chat Completions
```

**Mantenha este terminal aberto enquanto usa a aplicação.**

### Passo 2: Abrir a Aplicação

- **Opção 1:** Duplo clique em `index.html`
- **Opção 2:** Use Live Server no VS Code
- **Opção 3:** `python -m http.server 8000` e acesse `http://localhost:8000`

### Passo 3: Criar Banner

#### Com IA (Recomendado):
1. Digite a categoria: "Vestidos", "Jeans", "Peças de Cima", etc.
2. Clique em **"Gerar com IA"**
3. Aguarde alguns segundos
4. A IA escolherá cores, fontes e layout automaticamente

#### Manual:
1. Ajuste as cores nos seletores
2. Escolha a fonte
3. Ajuste tamanhos e posições
4. Clique em **"Gerar Banner"**

### Passo 4: Upload de Imagem (Opcional)

1. Clique na área pontilhada ou arraste uma imagem
2. A imagem será automaticamente encaixada
3. Use os controles de **Escala**, **Posição X/Y** para ajustar

### Passo 5: Exportar

- **PNG:** Qualidade máxima, sem perda, fundo transparente se houver
- **JPG:** Arquivo menor, ideal para web

---

## Solução de Problemas

### "Erro na IA" / "Failed to fetch"

**Causa:** Proxy não está rodando

**Solução:**
```bash
node proxy-server.js
```

### Banner não aparece

**Causa:** Imagem não carregou

**Solução:** Clique em "Gerar Banner" novamente ou faça upload de uma imagem

### Cores não mudam

**Solução:** Verifique se os color pickers estão com valores válidos (hex de 6 dígitos)

---

## Atalhos de Teclado

- `Ctrl+S` - Exportar PNG (pode ser implementado)
- `Ctrl+Z` - Resetar (pode ser implementado)

---

## Dicas de Design

1. **Contraste:** Texto claro em fundo escuro ou vice-versa
2. **Hierarquia:** Título grande (72px+), subtítulo menor (24px)
3. **Espaço:** Não preencha tudo, use espaço em branco
4. **Cores:** Máximo 3 cores principais
5. **Fonte:** Use no máximo 2 fontes diferentes

---

## Exemplos de Categorias

| Categoria | Subtítulo Sugerido |
|-----------|-------------------|
| Peças de Cima | Compre agora > |
| Vestidos | Nova Coleção |
| Jeans | Clássicos & Modernos |
| Calçados | Passo Firme |
| Moda Praia | Verão 2026 |
| Fitness | Performance & Estilo |
| Masculino | Estilo Moderno |
| Infantil | Diversão & Conforto |
| Promoções | Até 70% OFF |
| Lançamentos | Chegou Agora |

---

## Suporte

Para dúvidas ou problemas, verifique:
1. Console do navegador (F12)
2. Terminal do proxy
3. Arquivo `.env` com API key válida