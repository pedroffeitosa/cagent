import { GoogleGenerativeAI } from '@google/generative-ai';
import { createAgentHandler } from './_shared';

export default createAgentHandler(
  'gemini',
  (payload) => payload.customApiKey || process.env.GEMINI_API_KEY,
  async (apiKey, prompt) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  },
  'Processado via Gemini AI'
);
