import express from 'express';
import { callNvidiaAPI } from '../services/nvidia.js';

const router = express.Router();

function sanitizeInput(text) {
  return String(text).trim().substring(0, 500);
}

router.post('/message', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim().length === 0) {
      throw new Error('Mensagem não pode estar vazia');
    }

    const sanitizedMessage = sanitizeInput(message);

    const systemPrompt = `Você é FinanIA, assistente de educação financeira familiar.

Responda de forma:
- Clara e direta
- Simples e prática
- Encorajadora
- SEM markdown complexo
- SEM tabelas ou formatação excessiva

Foque em:
- Organização financeira
- Planejamento familiar
- Dicas práticas de economia
- Controle de gastos

NUNCA ofereça:
- Conselhos de investimentos arriscados
- Promessas de lucro
- Informações técnicas complexas

Resposta máxima: 120 palavras.
Use parágrafos curtos.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-6),
      { role: 'user', content: sanitizedMessage }
    ];

    const response = await callNvidiaAPI(messages, 400);

    res.json({
      success: true,
      response
    });

  } catch (error) {
    console.error('Erro no chat:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Erro ao processar mensagem'
    });
  }
});

export default router;
