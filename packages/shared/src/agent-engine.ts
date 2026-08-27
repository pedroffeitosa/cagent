import { AgentRequestPayload, AgentResponsePayload, Product } from './types';

/**
 * Provider-agnostic prompt builder shared by every LLM adapter (Gemini, Anthropic, OpenAI...).
 * Keeping this in one place means a new adapter only has to worry about calling its model
 * and parsing the response — the store/customer context injected into the prompt stays identical.
 */
export function buildAgentPrompt(payload: AgentRequestPayload): string {
  return `
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
- Estilos Preferidos: ${payload.userProfile.stylePreferences.join(', ') || 'Não informado'}

INTENÇÃO / BUSCA DO CLIENTE: "${payload.userQuery || 'Recomende produtos perfeitos para meu perfil'}"

CATÁLOGO DA LOJA:
${JSON.stringify(payload.storeContext.catalog.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  sizes: p.availableSizes,
  tags: p.tags
})), null, 2)}

RESPONDA APENAS COM JSON VÁLIDO, EXATAMENTE NO FORMATO ABAIXO, SEM TEXTO ADICIONAL:
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
}

/**
 * Intelligent Rule-based Fallback & Local Filter Engine
 * Includes Store Marketing & Cashback calculation.
 */
export function runLocalRuleEngine(payload: AgentRequestPayload): AgentResponsePayload {
  const { userQuery, userProfile, storeContext } = payload;
  const queryLower = userQuery.toLowerCase();

  const matchingProducts = storeContext.catalog.filter((prod) => {
    // Size match check
    const sizeMatches = prod.availableSizes.includes(userProfile.sizes.clothing) || 
                        prod.availableSizes.includes(userProfile.sizes.shoes);

    // Budget match
    const budgetOk = userProfile.maxBudget ? prod.price <= userProfile.maxBudget : true;

    // Search query relevance
    const queryMatches = !queryLower || 
      prod.name.toLowerCase().includes(queryLower) ||
      prod.description.toLowerCase().includes(queryLower) ||
      prod.category.toLowerCase().includes(queryLower) ||
      prod.tags.some((t) => t.toLowerCase().includes(queryLower));

    return budgetOk && (queryMatches || sizeMatches);
  });

  // Sort by user preferences match count
  matchingProducts.sort((a, b) => {
    const scoreA = a.tags.filter((t) => userProfile.stylePreferences.includes(t)).length +
                   (a.colors.some((c) => userProfile.favoriteColors.includes(c)) ? 2 : 0);
    const scoreB = b.tags.filter((t) => userProfile.stylePreferences.includes(t)).length +
                   (b.colors.some((c) => userProfile.favoriteColors.includes(c)) ? 2 : 0);
    return scoreB - scoreA;
  });

  const recommendedIds = matchingProducts.map((p) => p.id);

  // Apply default store coupon DECO10 (10% OFF)
  const appliedCoupon = storeContext.config?.activeCoupons?.find(c => c.code === 'DECO10');
  
  // Calculate estimated cashback (5%)
  const topPrice = matchingProducts[0]?.price || 300;
  const cashbackPercent = storeContext.config?.cashbackPercentage || 5;
  const estimatedCashback = Math.round((topPrice * (cashbackPercent / 100)) * 100) / 100;

  let reply = `Encontrei ${matchingProducts.length} produtos perfeitos para o seu perfil no canal da loja!`;
  if (userProfile.maxBudget) {
    reply += ` Apliquei o filtro de orçamento de até R$ ${userProfile.maxBudget}.`;
  }
  if (appliedCoupon) {
    reply += ` 🎁 O cupom ${appliedCoupon.code} (${appliedCoupon.discountValue}% OFF) e R$ ${estimatedCashback} em Cashback foram calculados para você!`;
  }

  return {
    naturalLanguageReply: reply,
    recommendedProductIds: recommendedIds.length > 0 ? recommendedIds : storeContext.catalog.map((p) => p.id),
    activeFilters: {
      size: userProfile.sizes.clothing,
      maxPrice: userProfile.maxBudget,
    },
    appliedCoupon,
    estimatedCashback,
    reasoningSummary: `Agente da Loja: Cupom DECO10 aplicado + ${cashbackPercent}% Cashback calculado no saldo da sua conta.`,
    providerUsed: 'custom',
  };
}

/**
 * Autocomplete leve para o campo de busca: casamento local por texto,
 * sem montar resposta do agente (reasoning/cupom/cashback), pra poder
 * rodar a cada tecla digitada sem custo.
 */
export function getProductSuggestions(query: string, catalog: Product[], limit = 5): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = catalog
    .map((product) => {
      const name = product.name.toLowerCase();
      let score = 0;
      if (name.startsWith(q)) {
        score = 3;
      } else if (name.includes(q)) {
        score = 2;
      } else if (
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        score = 1;
      }
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.product);
}
