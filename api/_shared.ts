import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  AgentRequestPayload,
  AgentResponsePayload,
  AIProviderType,
  buildAgentPrompt,
  resolveActiveCoupon,
  runLocalRuleEngine,
} from '@cagent/shared';

export function applyCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

function parseModelJson(raw: string): any {
  const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
}

function buildResponsePayload(
  payload: AgentRequestPayload,
  parsed: any,
  providerUsed: AIProviderType,
  fallbackReasoning: string
): AgentResponsePayload {
  // Cashback é calculado sobre o produto que a IA de fato recomendou (primeiro
  // da lista), não sobre o primeiro item do catálogo inteiro — senão o valor
  // mostrado ao cliente fica descolado do que ele realmente vai comprar.
  const recommendedIds = parsed.recommendedProductIds || payload.storeContext.catalog.map((p) => p.id);
  const topRecommended = payload.storeContext.catalog.find((p) => p.id === recommendedIds[0]);
  const topPrice = topRecommended?.price ?? payload.storeContext.catalog[0]?.price ?? 300;

  const activeCoupon = resolveActiveCoupon(payload.storeContext.config, payload.redeemedCouponCode) ?? undefined;
  const estCashback = Math.round((topPrice * ((payload.storeContext.config?.cashbackPercentage || 5) / 100)) * 100) / 100;

  return {
    naturalLanguageReply: parsed.naturalLanguageReply || 'Aqui estão as melhores recomendações com descontos e cashback da loja!',
    recommendedProductIds: recommendedIds,
    activeFilters: parsed.activeFilters || {},
    appliedCoupon: activeCoupon,
    estimatedCashback: estCashback,
    reasoningSummary: parsed.reasoningSummary || fallbackReasoning,
    providerUsed,
  };
}

/**
 * Every provider endpoint (Gemini, Claude, OpenAI, ...) needs identical plumbing:
 * CORS, method guard, prompt building, JSON parsing and a graceful fallback to the
 * local rule engine when there's no API key or the call fails. To add a new provider
 * to this template, implement `callModel` and register a `providerUsed` id — nothing
 * else in this file needs to change.
 */
export function createAgentHandler(
  providerUsed: AIProviderType,
  getApiKey: (payload: AgentRequestPayload) => string | undefined,
  callModel: (apiKey: string, prompt: string) => Promise<string>,
  fallbackReasoning: string
) {
  return async function handler(req: VercelRequest, res: VercelResponse) {
    applyCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const payload: AgentRequestPayload = req.body;

    try {
      const apiKey = getApiKey(payload);
      if (!apiKey) {
        return res.status(200).json(runLocalRuleEngine(payload));
      }

      const prompt = buildAgentPrompt(payload);
      const raw = await callModel(apiKey, prompt);
      const parsed = parseModelJson(raw);

      return res.status(200).json(buildResponsePayload(payload, parsed, providerUsed, fallbackReasoning));
    } catch (error) {
      console.error(`Agent Execution Error (${providerUsed}):`, error);
      return res.status(200).json(runLocalRuleEngine(payload));
    }
  };
}
