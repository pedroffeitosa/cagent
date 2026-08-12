import OpenAI from 'openai';
import { createAgentHandler } from './_shared';

const SYSTEM_PROMPT =
  'Você é um assistente de e-commerce agêntico. Responda APENAS com um objeto JSON válido, sem markdown, sem texto antes ou depois.';

export default createAgentHandler(
  'openai',
  (payload) => payload.customApiKey || process.env.OPENAI_API_KEY,
  async (apiKey, prompt) => {
    const openai = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const completion = await openai.chat.completions.create({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    });

    return completion.choices[0]?.message?.content || '{}';
  },
  'Processado via OpenAI GPT-4'
);
