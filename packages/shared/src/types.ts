export type AIProviderType = 'gemini' | 'openai' | 'anthropic' | 'custom';

export interface PurchaseHistoryEntry {
  id: string;
  productName: string;
  date: string;
  amount: number;
  cashbackEarned: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  badge?: string;
  sizes: {
    clothing: 'PP' | 'P' | 'M' | 'G' | 'GG' | '36' | '38' | '40' | '42' | '44';
    shoes: string;
  };
  stylePreferences: string[];
  favoriteColors: string[];
  maxBudget?: number;
  restrictions?: string[];
  gender?: 'Feminino' | 'Masculino' | 'Unissex';
  walletBalance?: number;
  purchaseHistory?: PurchaseHistoryEntry[];
}

export interface ProductTechnicalSpecs {
  material?: string;
  fit?: string;
  cleatType?: string;
  support?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  availableSizes: string[];
  colors: string[];
  imageUrl: string;
  tags: string[];
  inStock: boolean;
  storeName: string;
  cashbackReward?: number;
  technicalSpecs?: ProductTechnicalSpecs;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  description: string;
}

export interface StoreConfig {
  storeId: string;
  storeName: string;
  tagline: string;
  currency: string;
  cashbackPercentage: number;
  activeCoupons: Coupon[];
  databaseDriver: 'postgres' | 'supabase' | 'deco-mesh' | 'mock';
  serverEndpoint: string;
}

export interface StoreContext {
  storeId: string;
  storeName: string;
  currency: string;
  catalog: Product[];
  config: StoreConfig;
}

export interface AgentRequestPayload {
  userQuery: string;
  userProfile: UserProfile;
  storeContext: StoreContext;
  provider?: AIProviderType;
  customApiKey?: string;
}

export interface AgentResponsePayload {
  naturalLanguageReply: string;
  recommendedProductIds: string[];
  activeFilters: {
    size?: string;
    maxPrice?: number;
    color?: string;
    style?: string;
  };
  appliedCoupon?: Coupon;
  estimatedCashback?: number;
  reasoningSummary: string;
  providerUsed: AIProviderType;
}

export interface LLMProviderAdapter {
  providerName: AIProviderType;
  generateContextualResponse(payload: AgentRequestPayload): Promise<AgentResponsePayload>;
}
