export type AIProviderType = 'gemini' | 'openai' | 'anthropic' | 'custom';

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
}

export interface StoreContext {
  storeId: string;
  storeName: string;
  currency: string;
  catalog: Product[];
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
  reasoningSummary: string;
  providerUsed: AIProviderType;
}

export interface LLMProviderAdapter {
  providerName: AIProviderType;
  generateContextualResponse(payload: AgentRequestPayload): Promise<AgentResponsePayload>;
}
