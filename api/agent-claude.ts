import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { AgentRequestPayload, AgentResponsePayload, runLocalRuleEngine, buildAgentPrompt } from '@cagent/shared';

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
    const apiKey = payload.customApiKey || process.env.ANTHROPIC_API_KEY;

    // If no Anthropic API key (BYOK), fallback gracefully to the local rule engine
    if (!apiKey) {
      const fallbackResult = runLocalRuleEngine(payload);
      return res.status(200).json(fallbackResult);
    }

    const anthropic = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || 'claude-opus-5';

    const prompt = buildAgentPrompt(payload);

    const message = await anthropic.messages.create({
      model,
      max_tokens: 2048,
      // Filtragem estruturada não precisa de raciocínio estendido; desabilitar
      // thinking evita que ele consuma o max_tokens reservado para o JSON de resposta.
      thinking: { type: 'disabled' },
      system: 'Você é um assistente de e-commerce agêntico. Responda APENAS com um objeto JSON válido, sem markdown, sem texto antes ou depois.',
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('');

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
      reasoningSummary: parsed.reasoningSummary || 'Processado via Claude (Anthropic)',
      providerUsed: 'anthropic',
    };

    return res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error('Agent Execution Error (Anthropic):', error);
    const fallback = runLocalRuleEngine(req.body);
    return res.status(200).json(fallback);
  }
}
