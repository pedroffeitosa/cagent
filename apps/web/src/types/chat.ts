import { AgentResponsePayload } from '@cagent/shared';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  responsePayload?: AgentResponsePayload;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

export type MainViewType = 'home' | 'chat' | 'wallet' | 'coupons' | 'store' | 'filters' | 'compare';
