import express from 'express';
import { callNvidiaAPI } from '../services/nvidia.js';

const router = express.Router();

function sanitizeInput(text) {
  return String(text).trim().substring(0, 500);
}

function validateFinancialData(data) {
  const required = ['renda', 'gastos', 'reserva', 'dividas'];
  for (let field of required) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`Campo obrigatório: ${field}`);
    }
  }
  return true;
}

router.post('/analyze', async (req, res) => {
  try {
    const { renda, gastos, reserva, dividas, dependentes, objetivos } = req.body;
    
    validateFinancialData({ renda, gastos, reserva, dividas });

    const systemPrompt = `Você é FinanIA, especialista em educação financeira familiar.
Analise os dados fornecidos e forneça uma resposta clara e objetiva com:

1. DIAGNÓSTICO (2-3 frases)
- Situação atual da família

2. PRINCIPAIS PONTOS (3-4 itens)
- O que está bom
- O que precisa melhorar

3. PLANO DE AÇÃO (5 passos)
- Ações práticas e simples

4. DICAS DE ECONOMIA (3-4 sugestões)
- Formas concretas de economizar

Use linguagem simples e direta.
SEM tabelas, SEM markdown complexo, SEM formatação excessiva.
Apenas texto limpo com quebras de linha.
Limite: 250 palavras.`;

    const userPrompt = `Dados Financeiros:
- Renda Mensal: R$ ${renda.toLocaleString('pt-BR')}
- Gastos Mensais: R$ ${gastos.toLocaleString('pt-BR')}
- Reserva de Emergência: R$ ${reserva.toLocaleString('pt-BR')}
- Dívidas: R$ ${dividas.toLocaleString('pt-BR')}
- Dependentes: ${dependentes}
- Objetivos: ${sanitizeInput(objetivos || 'Melhorar saúde financeira')}

Forneça uma análise clara, prática e encorajadora.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const analysis = await callNvidiaAPI(messages, 1024);

    // Calcular score financeiro
    const saldo = renda - gastos;
    const taxaReserva = (reserva / (renda * 6)) * 100;
    const taxaDivida = (dividas / renda) * 100;
    
    let score = 50;
    if (saldo > 0) score += 20;
    if (taxaReserva > 100) score += 20;
    else if (taxaReserva > 50) score += 10;
    if (taxaDivida < 30) score += 10;
    else if (taxaDivida > 50) score -= 20;
    
    score = Math.max(0, Math.min(100, score));

    res.json({
      success: true,
      score: Math.round(score),
      analysis,
      metrics: {
        saldo,
        taxaReserva: Math.round(taxaReserva),
        taxaDivida: Math.round(taxaDivida),
        capacidadeEconomia: Math.round((saldo / renda) * 100)
      }
    });

  } catch (error) {
    console.error('Erro no diagnóstico:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Erro ao processar diagnóstico'
    });
  }
});

export default router;
