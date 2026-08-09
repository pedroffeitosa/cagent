import React, { useState } from 'react';
import { 
  MOCK_USER_PROFILES, 
  MOCK_STORE_CONTEXT, 
  UserProfile, 
  AgentResponsePayload,
  runLocalRuleEngine
} from '@cagent/shared';
import { 
  Sparkles, 
  Bot, 
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Plus,
  User,
  X,
  SlidersHorizontal,
  Send,
  ShoppingBag,
  Gift,
  Coins
} from 'lucide-react';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { UserProfilePopover } from './components/UserProfilePopover';
import { PreferencesModal } from './components/PreferencesModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  responsePayload?: AgentResponsePayload;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

export default function App() {
  // Account / Personal Context Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  // Chat History & Active Chat Sessions
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'chat-1',
      title: 'Look para Casamento Diurno',
      timestamp: 'Hoje, 14:20',
      messages: [
        {
          id: 'msg-1',
          sender: 'user',
          text: 'Procuro um vestido leve de linho ou seda para casamento diurno até R$ 450',
          timestamp: '14:20',
        },
        {
          id: 'msg-2',
          sender: 'agent',
          text: 'Encontrei as melhores opções no seu tamanho M e dentro do seu orçamento!',
          responsePayload: runLocalRuleEngine({
            userQuery: 'Procuro um vestido leve de linho ou seda para casamento diurno até R$ 450',
            userProfile: MOCK_USER_PROFILES[0],
            storeContext: MOCK_STORE_CONTEXT,
          }),
          timestamp: '14:21',
        }
      ]
    },
    {
      id: 'chat-2',
      title: 'Blazer para Reunião de Trabalho',
      timestamp: 'Ontem',
      messages: [
        {
          id: 'msg-3',
          sender: 'user',
          text: 'Blazer oversized em alfaiataria elegante no meu tamanho M',
          timestamp: 'Ontem',
        }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState<string>('chat-1');

  // Input & Agent State
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Sidebar States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Get active session
  const activeSession = chatSessions.find(s => s.id === activeChatId);
  const latestAgentResponse = activeSession?.messages
    .slice()
    .reverse()
    .find(m => m.sender === 'agent' && m.responsePayload)?.responsePayload;

  // Recommended IDs from latest agent response
  const activeProductIds = latestAgentResponse?.recommendedProductIds;
  const displayedProducts = activeProductIds 
    ? MOCK_STORE_CONTEXT.catalog.filter(p => activeProductIds.includes(p.id))
    : MOCK_STORE_CONTEXT.catalog;

  const handleRunAgent = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: queryText,
      timestamp: 'Agora',
    };

    let targetSessionId = activeChatId;

    // If no active session, create a new session
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
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: queryText,
          userProfile: userProfile,
          storeContext: MOCK_STORE_CONTEXT,
        }),
      });

      let data: AgentResponsePayload;
      if (response.ok) {
        data = await response.json();
      } else {
        data = runLocalRuleEngine({
          userQuery: queryText,
          userProfile: userProfile,
          storeContext: MOCK_STORE_CONTEXT,
        });
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
        storeContext: MOCK_STORE_CONTEXT,
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
    setCurrentQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR: Collapsible ($Agent -> $A) + Chat History       */}
      {/* ------------------------------------------------------------- */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-20 relative ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        } ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo Section ($Agent when expanded vs $A when collapsed) */}
        <div className={`h-16 border-b border-slate-800/80 flex items-center shrink-0 ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          <div className="flex items-center gap-2">
            <span className="logo-agent-financial text-2xl tracking-tighter transition-all">
              {isSidebarCollapsed ? '$A' : '$Agent'}
            </span>
          </div>

          {/* Desktop Collapse / Expand Toggle Button (< or >) */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title={isSidebarCollapsed ? 'Expandir Sidebar' : 'Recolher Sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button (Gemini Style Subtle) */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            title="Nova conversa"
            className={`w-full py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 hover:bg-slate-800/50 transition shadow-sm ${
              isSidebarCollapsed ? 'px-0' : 'px-4'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isSidebarCollapsed && <span>Nova conversa</span>}
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar flex flex-col gap-1">
          {!isSidebarCollapsed && (
            <div className="px-3 py-1 text-[11px] font-mono-tech text-slate-500 uppercase tracking-wider">
              Conversas & Buscas
            </div>
          )}

          {chatSessions.map((session) => {
            const isActive = session.id === activeChatId;
            return (
              <button
                key={session.id}
                title={session.title}
                onClick={() => setActiveChatId(session.id)}
                className={`w-full text-left rounded-xl text-xs flex items-center transition group ${
                  isSidebarCollapsed ? 'justify-center p-3' : 'p-3 gap-3'
                } ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 font-medium border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {!isSidebarCollapsed && (
                  <div className="truncate flex-1">
                    <span className="truncate block font-medium text-slate-200">{session.title}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{session.timestamp}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Account Popover Trigger */}
        <div className="p-3 border-t border-slate-800/80 relative">
          <button
            onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
            title={`Meu Perfil: ${userProfile.name}`}
            className={`w-full rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 text-left flex items-center transition group ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'p-3 justify-between gap-3'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 shrink-0"
              />
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">{userProfile.name}</span>
                  <span className="text-[10px] text-emerald-400 font-medium block">
                    Tam: {userProfile.sizes.clothing} | R$ {userProfile.maxBudget || '∞'}
                  </span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <SlidersHorizontal className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition shrink-0" />
            )}
          </button>

          {/* Linear-Style User Popover */}
          <UserProfilePopover
            isOpen={isProfilePopoverOpen}
            onClose={() => setIsProfilePopoverOpen(false)}
            userProfile={userProfile}
            onOpenPreferences={() => setIsPreferencesModalOpen(true)}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
          />
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN WORKSPACE: Gemini Chat Interface + Right Product Rail    */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950">
        
        {/* Clean Top Navbar */}
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 px-6 flex items-center justify-between shrink-0">
          <span className="font-heading font-semibold text-sm text-slate-200 tracking-tight">
            Vitrine Contextual & Agente de Busca
          </span>

          <span className="text-xs text-slate-400 font-mono-tech">
            {activeSession ? activeSession.title : 'Nova conversa'}
          </span>
        </header>

        {/* Workspace Body: Split View (Gemini Chat Left vs Product Rail Right) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Gemini Style Chat Experience */}
          <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto custom-scrollbar border-r border-slate-800/80 relative">
            
            {/* Chat Stream Messages */}
            <div className="flex-1 flex flex-col gap-6 max-w-3xl w-full mx-auto pb-4">
              
              {/* Empty Chat Greeting (Gemini Style) */}
              {(!activeSession || activeSession.messages.length === 0) && (
                <div className="my-auto flex flex-col items-center justify-center text-center gap-4 py-12 animate-in fade-in zoom-in-95">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-2xl text-white">
                      Olá, {userProfile.name.split(' ')[0]}! O que você quer pesquisar e comprar hoje?
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 max-w-md">
                      O $Agent cruza seu perfil contextual (tamanho {userProfile.sizes.clothing}, teto R$ {userProfile.maxBudget || '450'}) com o catálogo da loja.
                    </p>
                  </div>

                  {/* Quick Suggestion Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-lg">
                    {[
                      'Vestido leve de linho',
                      'Blazer oversized para trabalho',
                      'Camiseta tech anti-suor',
                      'Jaqueta puffer streetwear'
                    ].map((sug) => (
                      <button
                        key={sug}
                        onClick={() => {
                          setCurrentQuery(sug);
                          handleRunAgent(sug);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300 transition text-xs"
                      >
                        💡 {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Message History */}
              {activeSession && activeSession.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'agent' && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}

                  <div className={`max-w-xl text-xs rounded-2xl p-4 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none'
                      : 'glass-panel border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>

                    {/* Agent Response Meta & Coupon Calculation */}
                    {msg.responsePayload && (
                      <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col gap-2">
                        <span className="font-mono-tech">{msg.responsePayload.reasoningSummary}</span>
                        {msg.responsePayload.appliedCoupon && (
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <Gift className="w-3 h-3" />
                              Cupom {msg.responsePayload.appliedCoupon.code}
                            </span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              + R$ {msg.responsePayload.estimatedCashback} Cashback
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Gemini Input Form */}
            <div className="max-w-3xl w-full mx-auto relative pt-2">
              <input
                type="text"
                placeholder="O que você deseja pesquisar e comprar hoje?..."
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunAgent(currentQuery)}
                className="w-full pl-5 pr-14 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition shadow-inner"
              />
              <button
                onClick={() => handleRunAgent(currentQuery)}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition disabled:opacity-50"
                title="Enviar mensagem"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin block" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Compact Product Rail ("Passeio na Loja") */}
          <div className="w-80 lg:w-96 bg-slate-900/40 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <h4 className="font-heading font-bold text-sm text-white">Vitrine da Loja</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {displayedProducts.length} itens
              </span>
            </div>

            {/* Vertical Stack of Products */}
            <div className="flex flex-col gap-3">
              {displayedProducts.map((product) => {
                const isMatch = activeProductIds?.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className={`glass-card rounded-2xl p-3 flex gap-3 group transition-all duration-300 hover:border-slate-700 ${
                      isMatch ? 'ring-1 ring-emerald-500/60 shadow-lg shadow-emerald-500/5' : ''
                    }`}
                  >
                    {/* Compact Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isMatch && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[8px]">
                          Match
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{product.category}</span>
                          <span className="text-emerald-400 font-medium">Tam: {product.availableSizes[0]}</span>
                        </div>
                        <h5 className="font-heading font-bold text-xs text-white truncate mt-0.5 group-hover:text-emerald-400 transition">
                          {product.name}
                        </h5>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <span className="font-heading font-extrabold text-sm text-white">
                          R$ {product.price}
                        </span>

                        <button className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950 font-bold text-[10px] transition">
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Full Linear-Style Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
      />

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
    </div>
  );
}
