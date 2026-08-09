import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AgentRequestPayload, AgentResponsePayload, runLocalRuleEngine } from '@cagent/shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: AgentRequestPayload = req.body;
    const apiKey = payload.customApiKey || process.env.GEMINI_API_KEY;

    // If no Gemini API key, fallback gracefully to rule engine
    if (!apiKey) {
      const fallbackResult = runLocalRuleEngine(payload);
      return res.status(200).json(fallbackResult);
    }

    // Call Google Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

    const prompt = `
Você é o $Agent, um assistente inteligente de e-commerce pessoal para a rede Deco.
Sua missão é filtrar e ordenar produtos para o consumidor com base no seu contexto e intenção de busca.

DADOS DO CLIENTE:
- Nome: ${payload.userProfile.name}
- Tamanho Roupas: ${payload.userProfile.sizes.clothing}
- Tamanho Sapatos: ${payload.userProfile.sizes.shoes}
- Estilos Favoritos: ${payload.userProfile.stylePreferences.join(', ')}
- Cores Preferidas: ${payload.userProfile.favoriteColors.join(', ')}
- Orçamento Máximo: R$ ${payload.userProfile.maxBudget || 'Sem limite'}
- Restrições: ${payload.userProfile.restrictions?.join(', ') || 'Nenhuma'}

INTENÇÃO / BUSCA DO CLIENTE: "${payload.userQuery || 'Recomende os melhores produtos para meu perfil'}"

CATÁLOGO DA LOJA:
${JSON.stringify(payload.storeContext.catalog.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  sizes: p.availableSizes,
  colors: p.colors,
  tags: p.tags,
  description: p.description
})), null, 2)}

RESPONDA EXATAMENTE NO FORMATO JSON ABAIXO:
{
  "naturalLanguageReply": "Explicacao amigavel e direta recomendando os produtos certos para o cliente em portugues",
  "recommendedProductIds": ["prod-001", "prod-002"],
  "activeFilters": {
    "size": "${payload.userProfile.sizes.clothing}",
    "maxPrice": ${payload.userProfile.maxBudget || 'null'}
  },
  "reasoningSummary": "Breve justificativa do agente em 1 frase"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean JSON response codeblock if needed
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const responsePayload: AgentResponsePayload = {
      naturalLanguageReply: parsed.naturalLanguageReply || 'Aqui estão as melhores recomendações para você!',
      recommendedProductIds: parsed.recommendedProductIds || payload.storeContext.catalog.map(p => p.id),
      activeFilters: parsed.activeFilters || {},
      reasoningSummary: parsed.reasoningSummary || 'Processado via Gemini AI',
      providerUsed: payload.provider || 'gemini',
    };

    return res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error('Agent Execution Error:', error);
    // Fallback to local rule engine if API fails or quota exceeded
    const fallback = runLocalRuleEngine(req.body);
    fallback.reasoningSummary += ' (Fallback ativado devido a instabilidade na API)';
    return res.status(200).json(fallback);
  }
}
