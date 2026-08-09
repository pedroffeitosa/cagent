import React, { useState } from 'react';
import { 
  MOCK_USER_PROFILES, 
  MOCK_STORE_CONTEXT, 
  UserProfile, 
  Product, 
  AgentResponsePayload,
  runLocalRuleEngine
} from '@cagent/shared';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ShoppingBag, 
  UserCheck, 
  Bot, 
  Tag, 
  Zap, 
  ShieldCheck, 
  RotateCcw,
  Key,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeUser, setActiveUser] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<AgentResponsePayload | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Filter products based on agent recommended IDs or local context
  const activeProductIds = agentResponse?.recommendedProductIds;
  const displayedProducts = activeProductIds 
    ? MOCK_STORE_CONTEXT.catalog.filter(p => activeProductIds.includes(p.id))
    : MOCK_STORE_CONTEXT.catalog;

  const handleRunAgent = async (query: string) => {
    setLoading(true);
    setIsDrawerOpen(true);

    try {
      // Call Vercel Serverless Function or Local Engine Fallback
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: query,
          userProfile: activeUser,
          storeContext: MOCK_STORE_CONTEXT,
          customApiKey: apiKey || undefined,
        }),
      });

      if (response.ok) {
        const data: AgentResponsePayload = await response.json();
        setAgentResponse(data);
      } else {
        // Fallback to local rule engine if dev server without serverless route
        const local = runLocalRuleEngine({
          userQuery: query,
          userProfile: activeUser,
          storeContext: MOCK_STORE_CONTEXT,
        });
        setAgentResponse(local);
      }
    } catch (err) {
      console.warn('Backend endpoint unavailable, running local context engine', err);
      const local = runLocalRuleEngine({
        userQuery: query,
        userProfile: activeUser,
        storeContext: MOCK_STORE_CONTEXT,
      });
      setAgentResponse(local);
    } finally {
      setLoading(false);
    }
  };

  const resetContext = () => {
    setAgentResponse(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header & Storefront Navigation */}
      <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Hackathon Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-blue-600 p-[2px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">$Agent</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">Deco Mesh</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Contextual & Personal Commerce Agent</p>
            </div>
          </div>

          {/* Profile Switcher (Demo Feature) */}
          <div className="flex items-center gap-3 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-medium text-slate-400 pl-2 hidden md:inline">Perfil Ativo:</span>
            {MOCK_USER_PROFILES.map((usr) => {
              const isActive = usr.id === activeUser.id;
              return (
                <button
                  key={usr.id}
                  onClick={() => {
                    setActiveUser(usr);
                    setAgentResponse(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/25 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <img src={usr.avatarUrl} alt={usr.name} className="w-5 h-5 rounded-full object-cover" />
                  <span>{usr.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* BYOK Key & Agent Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="BYOK — Bring Your Own Key"
            >
              <Key className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-emerald-500/20 hover:opacity-95 transition"
            >
              <Bot className="w-4 h-4" />
              <span>Painel $Agent</span>
            </button>
          </div>
        </div>

        {/* BYOK Input Modal/Drawer */}
        {showApiKeyInput && (
          <div className="max-w-7xl mx-auto mt-4 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">BYOK (Bring Your Own Key):</span>
              <span className="text-slate-400">Insira sua própria chave da Gemini API para chamadas personalizadas</span>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="password"
                placeholder="Insira sua GEMINI_API_KEY..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-medium"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Customer Context Banner */}
        <section className="glass-panel rounded-3xl p-6 relative overflow-hidden border border-slate-800">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-32 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src={activeUser.avatarUrl}
                alt={activeUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10"
              />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-heading font-bold text-2xl text-white">{activeUser.name}</h1>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                    {activeUser.badge}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    Tamanho Roupas: <strong className="text-slate-200">{activeUser.sizes.clothing}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    Sapatos: <strong className="text-slate-200">{activeUser.sizes.shoes}</strong>
                  </span>
                  {activeUser.maxBudget && (
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Teto de Orçamento: <strong className="text-emerald-400">R$ {activeUser.maxBudget}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Context Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {activeUser.stylePreferences.map((style) => (
                <span key={style} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
                  ✨ {style}
                </span>
              ))}
              {activeUser.restrictions?.map((res) => (
                <span key={res} className="px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 font-medium">
                  🌱 {res}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Intelligent Search & Prompt Bar */}
        <section className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="O que você está procurando hoje? Ex: 'vestido elegante para evento diurno com bom preço'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAgent(searchQuery)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition shadow-inner"
            />
          </div>
          <button
            onClick={() => handleRunAgent(searchQuery)}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Analisando Contexto...' : 'Aplicar $Agent'}</span>
          </button>
          {agentResponse && (
            <button
              onClick={resetContext}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              title="Limpar Filtros Inteligentes"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </section>

        {/* Active Context Filter Alert */}
        {agentResponse && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3 text-xs">
            <Bot className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-2">
                <span>$Agent Context Filter Ativo</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Provider: {agentResponse.providerUsed.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-300 mt-1">{agentResponse.naturalLanguageReply}</p>
              <p className="text-slate-400 text-[11px] mt-1 font-mono">{agentResponse.reasoningSummary}</p>
            </div>
          </div>
        )}

        {/* Product Grid (PLP) */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="font-heading font-bold text-xl text-white">Vitrine Personalizada Deco</h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                {displayedProducts.length} produtos exibidos
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
                    isMatch ? 'ring-2 ring-emerald-500/80 shadow-xl shadow-emerald-500/10' : ''
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

                  {/* Product Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>{product.category}</span>
                        <span className="text-emerald-400 font-medium">Tam: {product.availableSizes.join(', ')}</span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-white group-hover:text-emerald-400 transition">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Price & Buy Action */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                      <div>
                        <span className="text-xs text-slate-500 block">Preço final</span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading font-extrabold text-xl text-white">R$ {product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-500 line-through">R$ {product.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <button className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950 font-semibold text-xs transition flex items-center gap-1.5">
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
      </main>

      {/* Slide-over Agent Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-emerald-400" />
                  <h3 className="font-heading font-bold text-lg text-white">Assistente $Agent Contextual</h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Status da Inteligência</span>
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Conectado à Rede Deco & Gemini API</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-2">BYOK (Bring Your Own Key)</span>
                  <p className="text-slate-300 text-[11px]">
                    Sua loja pode definir qualquer provedor de IA via `.env` (`AI_PROVIDER=gemini | openai | anthropic`) ou injetar a API Key diretamente no header.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-full py-3 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700 transition"
            >
              Fechar Painel
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
        $Agent (`cagent`) — Desenvolvido durante o Hackathon Agents for Commerce (Deco 2026). Licença MIT.
      </footer>
    </div>
  );
}
