import { AIProviderType } from '@cagent/shared';

export const PROVIDER_LABELS: Record<string, string> = {
  gemini: 'Gemini',
  openai: 'OpenAI',
  anthropic: 'Claude',
  custom: 'Regras Locais',
};

// Um endpoint serverless dedicado por provider — adicionar um novo provider ao BYOK
// é criar `api/agent-<provider>.ts` (ver api/_shared.ts) e registrar a rota aqui.
export const PROVIDER_ENDPOINTS: Partial<Record<AIProviderType, string>> = {
  gemini: '/api/agent',
  anthropic: '/api/agent-claude',
  openai: '/api/agent-openai',
};
