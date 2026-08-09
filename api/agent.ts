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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

    const prompt = `
Você é o $Agent, o assistente e canal oficial de e-commerce da loja "${payload.storeContext.storeName}".
Sua missão é filtrar produtos para o cliente, oferecendo os cupons ativos da loja e calculando o cashback da loja.

INFORMAÇÕES DA LOJA (WHITE-LABEL CANAL):
- Loja: ${payload.storeContext.storeName}
- Cashback da Loja: ${payload.storeContext.config?.cashbackPercentage || 5}%
- Cupons da Loja: ${JSON.stringify(payload.storeContext.config?.activeCoupons || [])}

DADOS DO CLIENTE:
- Nome: ${payload.userProfile.name}
- Tamanho Roupas: ${payload.userProfile.sizes.clothing}
- Tamanho Sapatos: ${payload.userProfile.sizes.shoes}
- Orçamento Máximo: R$ ${payload.userProfile.maxBudget || 'Sem limite'}

INTENÇÃO / BUSCA DO CLIENTE: "${payload.userQuery || 'Recomende produtos perfeitos para meu perfil'}"

CATÁLOGO DA LOJA:
${JSON.stringify(payload.storeContext.catalog.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  sizes: p.availableSizes,
  tags: p.tags
})), null, 2)}

RESPONDA EXATAMENTE NO FORMATO JSON ABAIXO:
{
  "naturalLanguageReply": "Explicacao amigavel recomendando produtos e mencionando o desconto do cupom da loja e cashback em portugues",
  "recommendedProductIds": ["prod-001", "prod-002"],
  "activeFilters": {
    "size": "${payload.userProfile.sizes.clothing}",
    "maxPrice": ${payload.userProfile.maxBudget || 'null'}
  },
  "reasoningSummary": "Agente da Loja: Cupom DECO10 ativado e cashback calculado"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const defaultCoupon = payload.storeContext.config?.activeCoupons?.[0];
    const topPrice = payload.storeContext.catalog[0]?.price || 300;
    const estCashback = Math.round((topPrice * ((payload.storeContext.config?.cashbackPercentage || 5) / 100)) * 100) / 100;

    const responsePayload: AgentResponsePayload = {
      naturalLanguageReply: parsed.naturalLanguageReply || 'Aqui estão as melhores recomendações com descontos e cashback da loja!',
      recommendedProductIds: parsed.recommendedProductIds || payload.storeContext.catalog.map(p => p.id),
      activeFilters: parsed.activeFilters || {},
      appliedCoupon: defaultCoupon,
      estimatedCashback: estCashback,
      reasoningSummary: parsed.reasoningSummary || 'Processado via Gemini AI',
      providerUsed: payload.provider || 'gemini',
    };

    return res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error('Agent Execution Error:', error);
    const fallback = runLocalRuleEngine(req.body);
    return res.status(200).json(fallback);
  }
}
