import { AgentRequestPayload, AgentResponsePayload, AIProviderType } from './types';

/**
 * Intelligent Rule-based Fallback & Local Filter Engine
 * Used when no API Key is provided or as a baseline comparator.
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

  let reply = `Encontrei ${matchingProducts.length} opções alinhadas ao seu perfil (${userProfile.name}, tamanho ${userProfile.sizes.clothing}).`;
  if (userProfile.maxBudget) {
    reply += ` Apliquei o filtro de orçamento de até R$ ${userProfile.maxBudget}.`;
  }

  return {
    naturalLanguageReply: reply,
    recommendedProductIds: recommendedIds.length > 0 ? recommendedIds : storeContext.catalog.map((p) => p.id),
    activeFilters: {
      size: userProfile.sizes.clothing,
      maxPrice: userProfile.maxBudget,
    },
    reasoningSummary: `Filtro local aplicado: Tamanho ${userProfile.sizes.clothing}, estilo [${userProfile.stylePreferences.join(', ')}].`,
    providerUsed: 'custom',
  };
}
