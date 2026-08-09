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
  ShoppingBag, 
  Bot, 
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Plus,
  User,
  Sliders,
  X,
  Send,
  SlidersHorizontal,
  Palette
} from 'lucide-react';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  query: string;
  response?: AgentResponsePayload;
}

export default function App() {
  // Account / Personal Context Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Chat History & Active Chat Session
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'chat-1',
      title: 'Look para Casamento Diurno',
      timestamp: 'Hoje, 14:20',
      query: 'Procuro um vestido leve de linho ou seda para casamento diurno até R$ 450',
    },
    {
      id: 'chat-2',
      title: 'Blazer para Reunião de Trabalho',
      timestamp: 'Ontem',
      query: 'Blazer oversized em alfaiataria elegante no meu tamanho M',
    },
    {
      id: 'chat-3',
      title: 'Streetwear Tech & Jaquetas',
      timestamp: '3 dias atrás',
      query: 'Jaqueta puffer térmica impermeável com tecido respirável',
    }
  ]);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');

  // Input & Agent State
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<AgentResponsePayload | null>(null);

  // BYOK Key State
  const [apiKey, setApiKey] = useState('');

  // Sidebar States (Mobile visibility + Desktop Collapsed)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filter products based on agent recommended IDs
  const activeProductIds = agentResponse?.recommendedProductIds;
  const displayedProducts = activeProductIds 
    ? MOCK_STORE_CONTEXT.catalog.filter(p => activeProductIds.includes(p.id))
    : MOCK_STORE_CONTEXT.catalog;

  const handleRunAgent = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: queryText,
          userProfile: userProfile,
          storeContext: MOCK_STORE_CONTEXT,
          customApiKey: apiKey || undefined,
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

      setAgentResponse(data);

      const newSession: ChatSession = {
        id: `chat-${Date.now()}`,
        title: queryText.length > 25 ? `${queryText.substring(0, 25)}...` : queryText,
        timestamp: 'Agora',
        query: queryText,
        response: data,
      };
      setChatSessions(prev => [newSession, ...prev]);
      setActiveChatId(newSession.id);
    } catch (err) {
      console.warn('Endpoint Serverless indisponível, executando motor local de contexto', err);
      const fallback = runLocalRuleEngine({
        userQuery: queryText,
        userProfile: userProfile,
        storeContext: MOCK_STORE_CONTEXT,
      });
      setAgentResponse(fallback);
    } finally {
      setLoading(false);
      setCurrentQuery('');
    }
  };

  const handleNewChat = () => {
    setActiveChatId('');
    setAgentResponse(null);
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

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            title="Novo Chat & Contexto"
            className={`w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-emerald-500/15 ${
              isSidebarCollapsed ? 'px-0' : 'px-4'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3] shrink-0" />
            {!isSidebarCollapsed && <span>Novo Chat & Contexto</span>}
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
                onClick={() => {
                  setActiveChatId(session.id);
                  if (session.response) {
                    setAgentResponse(session.response);
                  } else {
                    handleRunAgent(session.query);
                  }
                }}
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

        {/* Bottom User Account Shortcut */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={() => setIsProfileModalOpen(true)}
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
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN WORKSPACE: Clean Header + Agent Workspace + Storefront   */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar bg-slate-950">
        
        {/* Clean Top Navbar */}
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsSidebarOpen(!isSidebarOpen);
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Alternar Sidebar"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <span className="font-heading font-semibold text-sm text-slate-200 tracking-tight">
              Vitrine Contextual & Agente de Busca
            </span>
          </div>

          {/* Theme & Palette Customizer Button */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition flex items-center gap-2 text-xs font-medium"
            title="Personalizar Tema do $Agent"
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Tema & Cores</span>
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-6 flex flex-col gap-8">
          
          {/* Conversational Prompt & Chat Hero Box */}
          <section className="glass-panel rounded-3xl p-6 border border-slate-800/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-white">Como o $Agent pode ajudar você hoje?</h2>
                <p className="text-xs text-slate-400">Personalização em tempo real cruzando seu perfil com o catálogo da loja.</p>
              </div>
            </div>

            {/* Input Search Form */}
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: 'Procuro um look elegante de verão para evento ao ar livre'..."
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunAgent(currentQuery)}
                className="w-full pl-5 pr-36 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition shadow-inner"
              />
              <button
                onClick={() => handleRunAgent(currentQuery)}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs tracking-wide flex items-center gap-2 hover:opacity-95 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    Analisando...
                  </span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Perguntar $Agent</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-400">
              <span className="text-[11px] font-mono-tech text-slate-500">Sugestões rápidas:</span>
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
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300 transition text-[11px]"
                >
                  💡 {sug}
                </button>
              ))}
            </div>
          </section>

          {/* Active Agent Feedback Banner */}
          {agentResponse && (
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 text-sm">$Agent Context Response</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-tech">
                    {agentResponse.providerUsed.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-200 mt-2 text-sm leading-relaxed">{agentResponse.naturalLanguageReply}</p>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono-tech">{agentResponse.reasoningSummary}</span>
                  <button onClick={() => setAgentResponse(null)} className="text-slate-400 hover:text-white underline">
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Listing Grid (PLP) */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading font-bold text-xl text-white">Vitrine Adaptada ao Seu Perfil</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                  {displayedProducts.length} itens encontrados
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => {
                const isMatch = activeProductIds?.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className={`glass-card rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 ${
                      isMatch ? 'ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/10' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isMatch && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] tracking-wide uppercase shadow-lg">
                          ✨ Match $Agent
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur text-slate-300 text-[11px] font-medium border border-slate-800">
                        {product.storeName}
                      </span>
                    </div>

                    {/* Product Specs */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>{product.category}</span>
                          <span className="text-emerald-400 font-medium">Tam: {product.availableSizes.join(', ')}</span>
                        </div>
                        <h4 className="font-heading font-bold text-lg text-white group-hover:text-emerald-400 transition">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{product.description}</p>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Preço</span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-heading font-extrabold text-xl text-white">R$ {product.price}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-slate-500 line-through">R$ {product.originalPrice}</span>
                            )}
                          </div>
                        </div>

                        <button className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950 font-bold text-xs transition flex items-center gap-1.5">
                          <span>Comprar</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDITAR MEU PERFIL & FILTROS CONTEXTUAIS                */}
      {/* ------------------------------------------------------------- */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Meu Perfil Contextual</h3>
                  <p className="text-xs text-slate-400">Edite suas preferências permanentes de compra</p>
                </div>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Edit Form */}
            <div className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Meu Nome</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Tamanho Roupa</label>
                  <select
                    value={userProfile.sizes.clothing}
                    onChange={(e) => setUserProfile({
                      ...userProfile,
                      sizes: { ...userProfile.sizes, clothing: e.target.value as any }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    {['PP', 'P', 'M', 'G', 'GG', '36', '38', '40', '42'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Tamanho Sapato</label>
                  <input
                    type="text"
                    value={userProfile.sizes.shoes}
                    onChange={(e) => setUserProfile({
                      ...userProfile,
                      sizes: { ...userProfile.sizes, shoes: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Teto de Orçamento Máximo (R$)</label>
                <input
                  type="number"
                  value={userProfile.maxBudget || ''}
                  onChange={(e) => setUserProfile({
                    ...userProfile,
                    maxBudget: e.target.value ? Number(e.target.value) : undefined
                  })}
                  placeholder="Ex: 500"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
            >
              Salvar Alterações do Meu Perfil
            </button>
          </div>
        </div>
      )}

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
    </div>
  );
}
