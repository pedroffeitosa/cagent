import { useState } from 'react';
import {
  MOCK_USER_PROFILES,
  MOCK_STORE_CONTEXT,
  StoreContext,
  UserProfile,
  AgentResponsePayload,
  AIProviderType,
  runLocalRuleEngine,
  sortProductsByProfileMatch,
} from '@cagent/shared';
import { PROVIDER_ENDPOINTS } from '../lib/providers';
import { ChatMessage, ChatSession, MainViewType } from '../types/chat';

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'Busca Esportiva & Fluminense',
    timestamp: 'Hoje, 14:20',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Procuro uma camisa oficial do Fluminense Tricolor e chuteira no tamanho 41',
        timestamp: '14:20',
      },
      {
        id: 'msg-2',
        sender: 'agent',
        text: 'Encontrei a Camisa Oficial Tricolor 2026 e a Chuteira Tiempo Legend no seu tamanho!',
        responsePayload: runLocalRuleEngine({
          userQuery: 'Procuro uma camisa oficial do Fluminense Tricolor e chuteira no tamanho 41',
          userProfile: MOCK_USER_PROFILES[0],
          storeContext: MOCK_STORE_CONTEXT,
        }),
        timestamp: '14:21',
      },
    ],
  },
  {
    id: 'chat-2',
    title: 'Tênis de Corrida Maratona',
    timestamp: 'Ontem',
    messages: [
      {
        id: 'msg-3',
        sender: 'user',
        text: 'Tênis Nike Pegasus no meu tamanho 41 com bom amortecimento',
        timestamp: 'Ontem',
      },
    ],
  },
];

interface UseChatSessionsArgs {
  userProfile: UserProfile;
  storeContext: StoreContext;
  aiProvider: AIProviderType;
  customApiKey: string;
  redeemedCouponCode: string | null;
  onNavigate: (view: MainViewType) => void;
}

export function useChatSessions({ userProfile, storeContext, aiProvider, customApiKey, redeemedCouponCode, onNavigate }: UseChatSessionsArgs) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const activeSession = chatSessions.find(s => s.id === activeChatId) || chatSessions[0];
  const pastSessions = chatSessions.filter(s => s.id !== activeSession?.id);

  const latestAgentResponse = activeSession?.messages
    .slice()
    .reverse()
    .find(m => m.sender === 'agent' && m.responsePayload)?.responsePayload;

  const activeProductIds = latestAgentResponse?.recommendedProductIds;
  const displayedProducts = activeProductIds
    ? storeContext.catalog.filter(p => activeProductIds.includes(p.id))
    : sortProductsByProfileMatch(storeContext.catalog, userProfile);

  const handleRunAgent = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    onNavigate('chat');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: queryText,
      timestamp: 'Agora',
    };

    let targetSessionId = activeChatId;

    if (!targetSessionId) {
      const newSessionId = `chat-${Date.now()}`;
      const newSession: ChatSession = {
        id: newSessionId,
        title: queryText.length > 25 ? `${queryText.substring(0, 25)}...` : queryText,
        timestamp: 'Agora',
        messages: [userMsg],
      };
      setChatSessions(prev => [newSession, ...prev]);
      setActiveChatId(newSessionId);
      targetSessionId = newSessionId;
    } else {
      setChatSessions(prev => prev.map(s => s.id === targetSessionId ? { ...s, messages: [...s.messages, userMsg] } : s));
    }

    try {
      const endpoint = PROVIDER_ENDPOINTS[aiProvider];

      let data: AgentResponsePayload;
      if (!endpoint) {
        // Provider sem adapter registrado: cai direto no motor de regras local
        // em vez de silenciosamente disparar a chamada para outro provider.
        data = runLocalRuleEngine({
          userQuery: queryText,
          userProfile: userProfile,
          storeContext: storeContext,
          redeemedCouponCode,
        });
      } else {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userQuery: queryText,
            userProfile: userProfile,
            storeContext: storeContext,
            provider: aiProvider,
            customApiKey: customApiKey || undefined,
            redeemedCouponCode,
          }),
        });

        if (response.ok) {
          data = await response.json();
        } else {
          data = runLocalRuleEngine({
            userQuery: queryText,
            userProfile: userProfile,
            storeContext: storeContext,
            redeemedCouponCode,
          });
        }
      }

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        sender: 'agent',
        text: data.naturalLanguageReply,
        responsePayload: data,
        timestamp: 'Agora',
      };

      setChatSessions(prev => prev.map(s => s.id === targetSessionId ? { ...s, messages: [...s.messages, agentMsg] } : s));
    } catch (err) {
      const fallback = runLocalRuleEngine({
        userQuery: queryText,
        userProfile: userProfile,
        storeContext: storeContext,
        redeemedCouponCode,
      });
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        sender: 'agent',
        text: fallback.naturalLanguageReply,
        responsePayload: fallback,
        timestamp: 'Agora',
      };
      setChatSessions(prev => prev.map(s => s.id === targetSessionId ? { ...s, messages: [...s.messages, agentMsg] } : s));
    } finally {
      setLoading(false);
      setCurrentQuery('');
    }
  };

  const handleNewChat = () => {
    const newSessionId = `chat-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'Nova conversa',
      timestamp: 'Agora',
      messages: [],
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveChatId(newSessionId);
    onNavigate('chat');
    setCurrentQuery('');
  };

  return {
    chatSessions,
    activeChatId,
    setActiveChatId,
    currentQuery,
    setCurrentQuery,
    loading,
    activeSession,
    pastSessions,
    displayedProducts,
    activeProductIds,
    handleRunAgent,
    handleNewChat,
  };
}
