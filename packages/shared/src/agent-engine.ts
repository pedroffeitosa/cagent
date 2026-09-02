import { AgentRequestPayload, AgentResponsePayload, Coupon, Product, StoreConfig, UserProfile } from './types';

/**
 * Fonte única de resolução do cupom ativo: usada pelo chat/motor de regras
 * (runLocalRuleEngine) e pelas telas web/mobile, para que o cupom exibido
 * nunca divirja do cupom realmente aplicado no checkout.
 */
export function resolveActiveCoupon(config: StoreConfig | undefined, redeemedCouponCode?: string | null): Coupon | null {
  return config?.activeCoupons.find((c) => c.code === redeemedCouponCode)
    ?? config?.activeCoupons.find((c) => c.code === 'DECO10')
    ?? config?.activeCoupons[0]
    ?? null;
}

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

  // Mesmo cupom resolvido pela UI (resolveActiveCoupon): resgatado pelo
  // cliente > DECO10 padrão da loja > primeiro cupom ativo dela — evita que
  // o chat anuncie um cupom diferente do que o checkout de fato aplica.
  const appliedCoupon = resolveActiveCoupon(storeContext.config, payload.redeemedCouponCode) ?? undefined;

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
    reasoningSummary: appliedCoupon
      ? `Agente da Loja: Cupom ${appliedCoupon.code} aplicado + ${cashbackPercent}% Cashback calculado no saldo da sua conta.`
      : `Agente da Loja: ${cashbackPercent}% Cashback calculado no saldo da sua conta.`,
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

/**
 * Reordenação dinâmica da vitrine (PLP): sem nenhuma busca ativa, o catálogo
 * já entra ordenado pelo quanto cada produto combina com tamanho, estilo,
 * cor favorita e orçamento do cliente — em vez da ordem fixa do catálogo.
 *
 * `themeColors` é o boost do filtro temático ativo (Central de Filtros
 * Personalizados — ex.: "Torcedor Tricolor"): pesa mais que a cor favorita
 * padrão do perfil pra garantir que escolher um tema realmente reordene a
 * vitrine, mesmo quando o perfil já favorita várias cores.
 */
export function sortProductsByProfileMatch(products: Product[], userProfile: UserProfile, themeColors?: string[]): Product[] {
  return products
    .map((product, index) => {
      let score = 0;

      if (product.availableSizes.includes(userProfile.sizes.clothing)) score += 3;
      if (product.availableSizes.includes(userProfile.sizes.shoes)) score += 3;

      score += product.tags.filter((tag) => userProfile.stylePreferences.includes(tag)).length * 2;

      if (product.colors.some((c) => userProfile.favoriteColors.includes(c))) score += 2;

      if (themeColors?.length && product.colors.some((c) => themeColors.includes(c))) score += 8;

      if (!userProfile.maxBudget || product.price <= userProfile.maxBudget) score += 1;

      return { product, score, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.product);
}

export interface ProductMatchDetails {
  sizeMatch: boolean;
  budgetMatch: boolean;
  styleMatch: boolean;
  colorMatch: boolean;
  score: number;
}

/**
 * Raio-X de compatibilidade real (Compare + Checkout): pondera tamanho,
 * orçamento, estilo e cor contra o perfil do cliente, em vez de um
 * "Match 100%" fixo. Fonte única usada por Compare (web + mobile) e pelo
 * checkout 1-clique (web + mobile) — antes cada tela tinha sua própria
 * cópia (ou, no caso do checkout, nenhuma checagem real).
 */
export function computeProductMatchDetails(product: Product, userProfile: UserProfile): ProductMatchDetails {
  const sizeMatch = product.availableSizes.includes(userProfile.sizes.clothing) || product.availableSizes.includes(userProfile.sizes.shoes);
  const budgetMatch = !userProfile.maxBudget || product.price <= userProfile.maxBudget;
  const styleMatch = product.tags.some((t) => userProfile.stylePreferences.includes(t));
  const colorMatch = product.colors.some((c) => userProfile.favoriteColors.includes(c));

  const score = (sizeMatch ? 35 : 0) + (budgetMatch ? 30 : 0) + (styleMatch ? 20 : 0) + (colorMatch ? 15 : 0);

  return { sizeMatch, budgetMatch, styleMatch, colorMatch, score };
}
