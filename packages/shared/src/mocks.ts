import { UserProfile, Product, StoreContext, StoreConfig } from './types';

// Taxonomia unificada de estilos: usada pelos perfis mockados e espelhada
// nos toggles de preferências da UI, para que "match" de estilo seja real.
export const STYLE_TAXONOMY = [
  'Futebol & Fluminense FC',
  'Corrida & Maratona',
  'Futsal & Society',
  'Academia & Fit',
  'Streetwear Esportivo',
  'Ciclismo Urbano',
] as const;

export const MOCK_STORE_CONFIG: StoreConfig = {
  storeId: 'deco-sports-store',
  storeName: 'Deco Sports & Performance (White-Label Store)',
  tagline: 'Canal de Vendas Agêntico Oficial • Powered by $Agent',
  currency: 'BRL',
  cashbackPercentage: 5,
  activeCoupons: [
    {
      code: 'DECO10',
      discountType: 'percentage',
      discountValue: 10,
      description: '10% OFF exclusivo no Canal Agêntico $Agent',
    },
    {
      code: 'AGENT50',
      discountType: 'fixed',
      discountValue: 50,
      description: 'R$ 50 OFF de bônus de primeira compra agêntica',
    },
    {
      code: 'VIPFLUMESH',
      discountType: 'percentage',
      discountValue: 15,
      description: '15% OFF de bônus exclusivo para torcedor Tricolor',
    },
    {
      code: 'CORRIDA20',
      discountType: 'fixed',
      discountValue: 20,
      description: 'R$ 20 OFF em tênis de corrida e acessórios de performance',
    },
  ],
  databaseDriver: 'mock',
  serverEndpoint: 'https://api.deco-sports.com.br',
};

export const MOCK_USER_PROFILES: UserProfile[] = [
  {
    id: 'user-pedro',
    name: 'Pedro França',
    avatarUrl: '/user-pedro.jpg',
    badge: 'VIP • Saldo Cashback Ativo',
    sizes: {
      clothing: 'M',
      shoes: '41',
    },
    stylePreferences: ['Futebol & Fluminense FC', 'Corrida & Maratona', 'Academia & Fit', 'Streetwear Esportivo'],
    favoriteColors: ['Verde', 'Vermelho', 'Branco', 'Azul Marinho', 'Amarelo', 'Preto'],
    maxBudget: 450,
    walletBalance: 42.50,
    restrictions: ['Tecido Respirável Dri-FIT', 'Calçado com Amortecimento Pro'],
    gender: 'Masculino',
    purchaseHistory: [
      {
        id: 'order-pedro-1',
        productName: 'Camisa Oficial Fluminense FC Tricolor 2026',
        date: 'Hoje, 14:21',
        amount: 349,
        cashbackEarned: 17.45,
      },
      {
        id: 'order-pedro-2',
        productName: 'Tênis de Corrida Nike Air Zoom Pegasus Pro',
        date: 'Ontem, 18:40',
        amount: 449,
        cashbackEarned: 22.45,
      },
      {
        id: 'order-pedro-3',
        productName: 'Bônus de Boas-Vindas $Agent Sports',
        date: '05 de Ago',
        amount: 0,
        cashbackEarned: 10.00,
      },
    ],
  },
  {
    id: 'user-carlos',
    name: 'Carlos Eduardo',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badge: 'Estilo Streetwear & Tech',
    sizes: {
      clothing: 'G',
      shoes: '42',
    },
    stylePreferences: ['Streetwear Esportivo', 'Academia & Fit', 'Ciclismo Urbano'],
    favoriteColors: ['Preto', 'Cinza', 'Azul Marinho'],
    maxBudget: 600,
    restrictions: ['Tecido Respirável Dri-FIT'],
    gender: 'Masculino',
    walletBalance: 15.00,
    purchaseHistory: [
      {
        id: 'order-carlos-1',
        productName: 'Jaqueta Térmica Pro Inverno Windbreaker',
        date: '2 dias atrás',
        amount: 289,
        cashbackEarned: 14.45,
      },
      {
        id: 'order-carlos-2',
        productName: 'Relógio Inteligente Smartwatch Garmin Forerunner 55',
        date: '1 semana atrás',
        amount: 450,
        cashbackEarned: 22.50,
      },
    ],
  }
];

export const MOCK_STORE_PRODUCTS: Product[] = [
  {
    id: 'prod-flu-01',
    name: 'Camisa Oficial Fluminense FC Tricolor 2026',
    description: 'Camisa oficial do Fluminense nas cores clássicas verde, vermelho e branco com tecnologia de absorção de suor.',
    price: 349,
    originalPrice: 399,
    category: 'Camisas de Time',
    availableSizes: ['P', 'M', 'G'],
    colors: ['Verde', 'Vermelho', 'Branco'],
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80',
    tags: ['Futebol & Fluminense FC', 'Fluminense FC', 'Futebol', 'Tricolor', 'Camisa de Time'],
    inStock: true,
    storeName: 'Deco Sports',
    cashbackReward: 17.45,
    technicalSpecs: {
      material: 'Poliéster reciclado Dri-FIT com tecnologia de absorção de suor',
      fit: 'Regular Fit atlético',
    },
  },
  {
    id: 'prod-cbf-02',
    name: 'Camisa Oficial Seleção Brasileira Amarela Nike',
    description: 'Manto oficial da Seleção Brasileira com tecido Dri-FIT ADV e escudo de 5 estrelas em alto relevo.',
    price: 379,
    originalPrice: 449,
    category: 'Camisas de Time',
    availableSizes: ['P', 'M', 'G', 'GG'],
    colors: ['Amarelo', 'Verde'],
    imageUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&auto=format&fit=crop&q=80',
    tags: ['Futebol & Fluminense FC', 'Seleção Brasileira', 'Futebol', 'Brasil', 'Camisa de Time'],
    inStock: true,
    storeName: 'Deco Sports',
    cashbackReward: 18.95,
    technicalSpecs: {
      material: 'Dri-FIT ADV 100% poliéster reciclado, ultraleve',
      fit: 'Slim Fit atlético',
    },
  },
  {
    id: 'prod-run-03',
    name: 'Tênis de Corrida Nike Air Zoom Pegasus Pro',
    description: 'Tênis de alta performance para corrida de rua e maratona com máxima capacidade de resposta e amortecimento Zoom Air.',
    price: 449,
    originalPrice: 549,
    category: 'Tênis de Corrida',
    availableSizes: ['39', '40', '41', '42'],
    colors: ['Preto', 'Azul Marinho', 'Verde'],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    tags: ['Corrida & Maratona', 'Amortecimento', 'Tênis de Corrida'],
    inStock: true,
    storeName: 'Deco Sports',
    cashbackReward: 22.45,
    technicalSpecs: {
      material: 'Cabedal em mesh respirável com entressola Zoom Air',
      fit: 'Indicado para pisada neutra a levemente pronada',
      support: 'Amortecimento responsivo de alta performance',
    },
  },
  {
    id: 'prod-soc-04',
    name: 'Chuteira Society Nike Tiempo Legend Pro',
    description: 'Chuteira de grama sintética / society com couro macio premium e travas de borracha multidirecionais.',
    price: 389,
    category: 'Chuteiras',
    availableSizes: ['40', '41', '42'],
    colors: ['Branco', 'Verde', 'Preto'],
    imageUrl: 'https://images.unsplash.com/photo-1768696082264-44f14594ca2c?w=600&auto=format&fit=crop&q=80',
    tags: ['Futebol & Fluminense FC', 'Futsal & Society', 'Chuteira Society', 'Futebol', 'Controle'],
    inStock: true,
    storeName: 'Deco Sports',
    cashbackReward: 19.45,
    technicalSpecs: {
      material: 'Couro sintético premium K-Leather para toque macio',
      cleatType: 'Trava multidirecional baixa (society / grama sintética)',
    },
  },
  {
    id: 'prod-fld-05',
    name: 'Chuteira de Campo Adidas Predator Elite',
    description: 'Chuteira profissional para campo de grama natural com cravos de precisão e zona de impacto em relevo.',
    price: 420,
    originalPrice: 499,
    category: 'Chuteiras',
    availableSizes: ['39', '40', '41'],
    colors: ['Vermelho', 'Preto', 'Branco'],
    imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop&q=80',
    tags: ['Futebol & Fluminense FC', 'Chuteira de Campo', 'Futebol', 'Precisão'],
    inStock: true,
    storeName: 'Deco Sports',
    cashbackReward: 21.00,
    technicalSpecs: {
      material: 'Couro sintético texturizado Controlskin com zona de impacto em relevo',
      cleatType: 'Trava firm ground (FG) para grama natural',
    },
  },
  {
    id: 'prod-fut-06',
    name: 'Tênis de Futsal Joma Top Flex Pro',
    description: 'Tênis clássico de futsal em couro de alta resistência e sola emborrachada antiderrapante que não marca a quadra.',
    price: 310,
    category: 'Chuteiras',
    availableSizes: ['40', '41', '42'],
    colors: ['Verde', 'Vermelho'],
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80',
    tags: ['Futebol & Fluminense FC', 'Futsal & Society', 'Tênis de Futsal', 'Futsal', 'Quadra'],
    inStock: true,
    storeName: 'Deco Sports',
    cashbackReward: 15.50,
    technicalSpecs: {
      material: 'Couro legítimo de alta resistência',
      cleatType: 'Sola lisa emborrachada antiderrapante (não marca a quadra)',
    },
  },
  {
    id: 'prod-watch-07',
    name: 'Relógio Inteligente Smartwatch Garmin Forerunner 55',
    description: 'Smartwatch GPS para corrida com monitor de frequência cardíaca, ritmo, distância e análise de treino em tempo real.',
    price: 450,
    originalPrice: 590,
    category: 'Acessórios & Tech',
    availableSizes: ['Tamanho Único'],
    colors: ['Preto'],
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    tags: ['Corrida & Maratona', 'Academia & Fit', 'Smartwatch', 'Relógio Inteligente'],
    inStock: true,
    storeName: 'Deco Sports',
    cashbackReward: 22.50,
    technicalSpecs: {
      material: 'Bezel de policarbonato reforçado, resistente a impacto',
      support: 'GPS integrado + monitor cardíaco de pulso em tempo real',
    },
  },
  {
    id: 'prod-fit-08',
    name: 'Jaqueta Térmica Pro Inverno Windbreaker',
    description: 'Jaqueta corta-vento e impermeável para treinos de corrida em dias frios.',
    price: 289,
    category: 'Roupas de Frio',
    availableSizes: ['G', 'GG'],
    colors: ['Preto', 'Azul Marinho'],
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
    tags: ['Corrida & Maratona', 'Streetwear Esportivo', 'Inverno', 'Corta-vento'],
    inStock: true,
    storeName: 'Deco Sports',
    cashbackReward: 14.45,
    technicalSpecs: {
      material: 'Tecido corta-vento impermeável com forro térmico',
      fit: 'Regular Fit com ajuste elástico no punho',
    },
  },
  {
    id: 'prod-ball-09',
    name: 'Bola Oficial de Futebol Libertadores Adidas',
    description: 'Bola oficial de jogo com costura selada a quente e tecnologia de voo aerodinâmico estabilizado.',
    price: 179,
    category: 'Bolas & Acessórios',
    availableSizes: ['Tamanho 5'],
    colors: ['Branco', 'Verde', 'Vermelho'],
    imageUrl: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600&auto=format&fit=crop&q=80',
    tags: ['Futebol & Fluminense FC', 'Bola de Futebol', 'Futebol', 'Libertadores'],
    inStock: true,
    storeName: 'Deco Sports',
    cashbackReward: 8.95,
    technicalSpecs: {
      material: 'Costura termosselada com câmara de butil',
      support: 'Tecnologia de voo aerodinâmico estabilizado',
    },
  }
];

export const MOCK_STORE_CONTEXT: StoreContext = {
  storeId: MOCK_STORE_CONFIG.storeId,
  storeName: MOCK_STORE_CONFIG.storeName,
  currency: MOCK_STORE_CONFIG.currency,
  catalog: MOCK_STORE_PRODUCTS,
  config: MOCK_STORE_CONFIG,
};

// Produtos exclusivos da Max Titanium — os outros parceiros reaproveitam o
// catálogo principal (filtrado por marca/categoria), mas Max Titanium é uma
// loja de suplementos, então precisa de itens próprios pra rede parecer real.
const MAX_TITANIUM_PRODUCTS: Product[] = [
  {
    id: 'prod-maxt-10',
    name: 'Whey Protein 3W Max Titanium 900g',
    description: 'Whey concentrado + isolado de rápida absorção, ideal para recuperação pós-treino de academia e corrida.',
    price: 189,
    originalPrice: 229,
    category: 'Suplementos',
    availableSizes: ['900g'],
    colors: ['Preto'],
    imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&auto=format&fit=crop&q=80',
    tags: ['Academia & Fit', 'Suplemento', 'Whey Protein'],
    inStock: true,
    storeName: 'Max Titanium Supplements',
    cashbackReward: 13.23,
    technicalSpecs: {
      material: 'Blend de whey concentrado e isolado',
    },
  },
  {
    id: 'prod-maxt-11',
    name: 'Creatina Max Titanium 300g',
    description: 'Creatina monohidratada pura para ganho de força e performance em treinos de alta intensidade.',
    price: 89,
    category: 'Suplementos',
    availableSizes: ['300g'],
    colors: ['Branco'],
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&auto=format&fit=crop&q=80',
    tags: ['Academia & Fit', 'Suplemento', 'Creatina'],
    inStock: true,
    storeName: 'Max Titanium Supplements',
    cashbackReward: 6.23,
  },
];

/**
 * Rede de lojas parceiras (Deco Interoperable Mesh): cada parceiro é um
 * StoreContext real e independente — catálogo, cashback% e cupons próprios —
 * usado por `StoreBootstrapView` pra trocar de loja ativa de verdade em vez
 * de só listar cards decorativos.
 */
export const MOCK_PARTNER_STORES: StoreContext[] = [
  {
    storeId: 'nike-brasil-partner',
    storeName: 'Nike Brasil Official Partner',
    currency: 'BRL',
    catalog: MOCK_STORE_PRODUCTS
      .filter((p) => p.name.includes('Nike'))
      .map((p) => ({ ...p, storeName: 'Nike Brasil Official Partner' })),
    config: {
      storeId: 'nike-brasil-partner',
      storeName: 'Nike Brasil Official Partner',
      tagline: 'Moda Esportiva, Tênis Pegasus Corrida & Chuteiras Tiempo/Mercurial',
      currency: 'BRL',
      cashbackPercentage: 5,
      activeCoupons: [
        { code: 'NIKE10', discountType: 'percentage', discountValue: 10, description: '10% OFF em produtos Nike selecionados' },
        { code: 'DECO10', discountType: 'percentage', discountValue: 10, description: '10% OFF exclusivo no Canal Agêntico $Agent' },
      ],
      databaseDriver: 'mock',
      serverEndpoint: 'https://api.nike-brasil-partner.com.br',
    },
  },
  {
    storeId: 'centauro-esportes-partner',
    storeName: 'Centauro Esportes Partner',
    currency: 'BRL',
    catalog: MOCK_STORE_PRODUCTS
      .filter((p) => ['prod-flu-01', 'prod-ball-09', 'prod-fld-05'].includes(p.id))
      .map((p) => ({ ...p, storeName: 'Centauro Esportes Partner' })),
    config: {
      storeId: 'centauro-esportes-partner',
      storeName: 'Centauro Esportes Partner',
      tagline: 'Artigos Esportivos, Camisas Oficiais de Time (Fluminense FC) & Bolas',
      currency: 'BRL',
      cashbackPercentage: 5,
      activeCoupons: [
        { code: 'CENTAURO15', discountType: 'percentage', discountValue: 15, description: '15% OFF em artigos esportivos Centauro' },
        { code: 'AGENT50', discountType: 'fixed', discountValue: 50, description: 'R$ 50 OFF de bônus de primeira compra agêntica' },
      ],
      databaseDriver: 'mock',
      serverEndpoint: 'https://api.centauro-esportes-partner.com.br',
    },
  },
  {
    storeId: 'max-titanium-supplements',
    storeName: 'Max Titanium Supplements',
    currency: 'BRL',
    catalog: MAX_TITANIUM_PRODUCTS,
    config: {
      storeId: 'max-titanium-supplements',
      storeName: 'Max Titanium Supplements',
      tagline: 'Suplementação Esportiva, Whey Protein, Creatina & Pré-Treino Fit',
      currency: 'BRL',
      cashbackPercentage: 7,
      activeCoupons: [
        { code: 'MAXFIT20', discountType: 'percentage', discountValue: 20, description: '20% OFF em suplementos Max Titanium' },
        { code: 'VIPFLUMESH', discountType: 'percentage', discountValue: 15, description: '15% OFF de bônus exclusivo para torcedor Tricolor' },
      ],
      databaseDriver: 'mock',
      serverEndpoint: 'https://api.max-titanium-partner.com.br',
    },
  },
];

// Rede completa: loja principal + parceiros — fonte única usada pela troca
// de loja ativa (StoreBootstrapView) e por qualquer tela que precise listar
// todos os canais do "Deco Interoperable Mesh".
export const MOCK_ALL_STORES: StoreContext[] = [MOCK_STORE_CONTEXT, ...MOCK_PARTNER_STORES];
