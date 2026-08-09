import { AgentRequestPayload, AgentResponsePayload } from './types';

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
