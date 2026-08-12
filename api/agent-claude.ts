import Anthropic from '@anthropic-ai/sdk';
import { createAgentHandler } from './_shared';

const SYSTEM_PROMPT =
  'Você é um assistente de e-commerce agêntico. Responda APENAS com um objeto JSON válido, sem markdown, sem texto antes ou depois.';

export default createAgentHandler(
  'anthropic',
  (payload) => payload.customApiKey || process.env.ANTHROPIC_API_KEY,
  async (apiKey, prompt) => {
    const anthropic = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || 'claude-opus-5';

    const message = await anthropic.messages.create({
      model,
      max_tokens: 2048,
      // Filtragem estruturada não precisa de raciocínio estendido; desabilitar
      // thinking evita que ele consuma o max_tokens reservado para o JSON de resposta.
      thinking: { type: 'disabled' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('');
  },
  'Processado via Claude (Anthropic)'
);
