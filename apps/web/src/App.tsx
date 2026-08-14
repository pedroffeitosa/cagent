import React, { useState } from 'react';
import {
  MOCK_USER_PROFILES,
  MOCK_STORE_CONTEXT,
  UserProfile,
  Product,
  AgentResponsePayload,
  AIProviderType,
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
  Coins,
  Wallet,
  Ticket,
  Store,
  Search,
  Filter,
  ShoppingCart,
  Share2,
  History,
  ChevronDown,
  ChevronUp,
  Home
} from 'lucide-react';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { DemoScriptToolbar } from './components/DemoScriptToolbar';
import { UserProfilePopover } from './components/UserProfilePopover';
import { PreferencesModal } from './components/PreferencesModal';
import { ProductCheckoutModal } from './components/ProductCheckoutModal';
import { WalletModal } from './components/WalletModal';
import { CouponsModal } from './components/CouponsModal';
import { StoreMeshModal } from './components/StoreMeshModal';
import { CustomFiltersModal } from './components/CustomFiltersModal';
import { CartDrawerModal } from './components/CartDrawerModal';
import { ShareContextModal } from './components/ShareContextModal';
import { HomeStorefrontView } from './components/views/HomeStorefrontView';
import { WalletView } from './components/views/WalletView';
import { CouponsView } from './components/views/CouponsView';
import { StoreBootstrapView } from './components/views/StoreBootstrapView';
import { CustomFiltersView } from './components/views/CustomFiltersView';
import { CompareProductsView } from './components/views/CompareProductsView';
import { LandingPage } from './components/views/LandingPage';
import { handleImageError } from './utils/imageFallback';

const PROVIDER_LABELS: Record<string, string> = {
  gemini: 'Gemini',
  openai: 'OpenAI',
  anthropic: 'Claude',
  custom: 'Regras Locais',
};

// Um endpoint serverless dedicado por provider — adicionar um novo provider ao BYOK
// é criar `api/agent-<provider>.ts` (ver api/_shared.ts) e registrar a rota aqui.
const PROVIDER_ENDPOINTS: Partial<Record<AIProviderType, string>> = {
  gemini: '/api/agent',
  anthropic: '/api/agent-claude',
  openai: '/api/agent-openai',
};

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

type MainViewType = 'home' | 'chat' | 'wallet' | 'coupons' | 'store' | 'filters' | 'compare';

export default function App() {
  // Landing Page Gate: shown before the client enters the storefront demo
  const [hasEnteredApp, setHasEnteredApp] = useState(false);

  // Active View Mode (Home vs Chat vs Wallet Page vs Coupons Page vs Store Bootstrap Page vs Filters Page vs Compare Page)
  const [activeMainView, setActiveMainView] = useState<MainViewType>('home');

  // Account / Personal Context Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [selectedCheckoutProduct, setSelectedCheckoutProduct] = useState<Product | null>(null);

  // BYOK: Provedor de IA ativo (Fork & Connect ready para Gemini, OpenAI ou Anthropic)
  const [aiProvider, setAiProvider] = useState<AIProviderType>('gemini');
  const [customApiKey, setCustomApiKey] = useState('');

  // Collapsible Past Chats Toggle
  const [showPastChats, setShowPastChats] = useState(false);

  // Shopping Cart State
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([
    { product: MOCK_STORE_CONTEXT.catalog[0], quantity: 1 },
    { product: MOCK_STORE_CONTEXT.catalog[1], quantity: 1 },
  ]);

  // Right Vitrine Sidebar Visibility Toggle
  const [isRightRailOpen, setIsRightRailOpen] = useState(true);

  // Top Header Feature Modals & Drawers
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isCouponsModalOpen, setIsCouponsModalOpen] = useState(false);
  const [isStoreMeshModalOpen, setIsStoreMeshModalOpen] = useState(false);
  const [isCustomFiltersModalOpen, setIsCustomFiltersModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Chat History & Active Chat Sessions
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
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
        }
      ]
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

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as { product: Product; quantity: number }[]);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  // Get active session and past sessions
  const activeSession = chatSessions.find(s => s.id === activeChatId) || chatSessions[0];
  const pastSessions = chatSessions.filter(s => s.id !== activeSession?.id);

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
    setActiveMainView('chat');

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
          storeContext: MOCK_STORE_CONTEXT,
        });
      } else {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userQuery: queryText,
            userProfile: userProfile,
            storeContext: MOCK_STORE_CONTEXT,
            provider: aiProvider,
            customApiKey: customApiKey || undefined,
          }),
        });

        if (response.ok) {
          data = await response.json();
        } else {
          data = runLocalRuleEngine({
            userQuery: queryText,
            userProfile: userProfile,
            storeContext: MOCK_STORE_CONTEXT,
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
    setActiveMainView('chat');
    setCurrentQuery('');
  };

  // Interactive Demo Script Tour State (1-Click Pitch Steps 1..5)
  const [demoStep, setDemoStep] = useState<number>(1);

  const handleSelectDemoStep = (stepId: number) => {
    setDemoStep(stepId);
    switch (stepId) {
      case 1:
        // Passo 1: Perfil Pedro (0m00s - 0m30s)
        setUserProfile(MOCK_USER_PROFILES[0]);
        setActiveMainView('home');
        setIsProfilePopoverOpen(true);
        setSelectedCheckoutProduct(null);
        setIsShareModalOpen(false);
        break;
      case 2:
        // Passo 2: Busca Chuteira (0m30s - 1m15s)
        setIsProfilePopoverOpen(false);
        setUserProfile(MOCK_USER_PROFILES[0]);
        setSelectedCheckoutProduct(null);
        setIsShareModalOpen(false);
        const queryText = 'Preciso de uma chuteira para jogar em campo de grama sintética no Rio de Janeiro';
        setCurrentQuery(queryText);
        handleRunAgent(queryText);
        break;
      case 3:
        // Passo 3: Batalha Swords (1m15s - 2m00s)
        setIsProfilePopoverOpen(false);
        setSelectedCheckoutProduct(null);
        setIsShareModalOpen(false);
        setCartItems([
          { product: MOCK_STORE_CONTEXT.catalog[2] || MOCK_STORE_CONTEXT.catalog[0], quantity: 1 },
          { product: MOCK_STORE_CONTEXT.catalog[3] || MOCK_STORE_CONTEXT.catalog[1], quantity: 1 },
        ]);
        setActiveMainView('compare');
        break;
      case 4:
        // Passo 4: Checkout 1-Clique com Cashback (2m00s - 2m30s)
        setIsProfilePopoverOpen(false);
        setIsShareModalOpen(false);
        const checkoutItem = MOCK_STORE_CONTEXT.catalog[2] || MOCK_STORE_CONTEXT.catalog[0];
        setSelectedCheckoutProduct(checkoutItem);
        setActiveMainView('home');
        break;
      case 5:
        // Passo 5: Compartilhamento QR Code Mobile (2m30s - 3m00s)
        setIsProfilePopoverOpen(false);
        setSelectedCheckoutProduct(null);
        setIsShareModalOpen(true);
        break;
      default:
        break;
    }
  };

  if (!hasEnteredApp) {
    return <LandingPage onEnter={() => setHasEnteredApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">

      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR: Collapsible ($Agent -> $A) + Simplified Chat    */}
      {/* ------------------------------------------------------------- */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-20 relative ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        } ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo Section (Clicking $Agent or $A returns to Home) */}
        <div className={`h-16 border-b border-slate-800/80 flex items-center shrink-0 ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setActiveMainView('home')}
            title="Voltar para Início (Loja $Agent)"
          >
            <span className="logo-agent-financial text-2xl tracking-tighter transition-all group-hover:opacity-90">
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

        {/* Back to Landing Page Link */}
        {!isSidebarCollapsed && (
          <button
            onClick={() => setHasEnteredApp(false)}
            title="Voltar para a página inicial do projeto"
            className="mx-3 mt-3 text-left text-[10px] text-slate-500 hover:text-emerald-400 transition font-mono-tech shrink-0"
          >
            ← Sobre o $Agent
          </button>
        )}

        {/* Bottom-Aligned Controls (Página Inicial + Nova conversa + Chat Atual + Chats Anteriores) */}
        <div className="flex-1 flex flex-col justify-end p-3 gap-2 overflow-y-auto custom-scrollbar">
          
          {/* Home Button */}
          <button
            onClick={() => setActiveMainView('home')}
            title="Página Inicial da Loja"
            className={`w-full py-2.5 rounded-2xl border transition shadow-sm font-semibold text-xs tracking-wide flex items-center gap-2 ${
              activeMainView === 'home'
                ? 'bg-slate-800 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800/50'
            } ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            <Home className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isSidebarCollapsed && <span>Página Inicial</span>}
          </button>

          {/* New Chat Button (Gemini Style Subtle) */}
          <button
            onClick={handleNewChat}
            title="Conversar com $Agent IA"
            className={`w-full py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-white font-semibold text-xs tracking-wide flex items-center gap-2 hover:bg-slate-800/50 transition shadow-sm ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-4'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isSidebarCollapsed && <span>Nova conversa</span>}
          </button>

          {/* Active Current Chat */}
          {!isSidebarCollapsed && (
            <div className="px-3 pt-2 text-[11px] font-mono-tech text-slate-500 uppercase tracking-wider">
              Chat com IA
            </div>
          )}

          {activeSession && (
            <button
              title={activeSession.title}
              onClick={() => {
                setActiveChatId(activeSession.id);
                setActiveMainView('chat');
              }}
              className={`w-full text-left rounded-xl text-xs flex items-center transition group ${
                activeMainView === 'chat'
                  ? 'bg-slate-800 text-emerald-400 font-medium border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              } ${isSidebarCollapsed ? 'justify-center p-3' : 'p-3 gap-3'}`}
            >
              <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
              {!isSidebarCollapsed && (
                <div className="truncate flex-1">
                  <span className="truncate block font-medium text-slate-200">{activeSession.title}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{activeSession.timestamp}</span>
                </div>
              )}
            </button>
          )}

          {/* Past Chats Collapsible Section */}
          {pastSessions.length > 0 && !isSidebarCollapsed && (
            <div className="pt-2 border-t border-slate-800/60 flex flex-col gap-1">
              <button
                onClick={() => setShowPastChats(!showPastChats)}
                className="w-full px-3 py-1.5 rounded-xl text-left flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition font-medium"
              >
                <div className="flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>Chats anteriores ({pastSessions.length})</span>
                </div>
                {showPastChats ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
              </button>

              {/* Past Chats Dropdown */}
              {showPastChats && (
                <div className="flex flex-col gap-1 pl-2 pt-1 animate-in fade-in duration-150">
                  {pastSessions.map((session) => (
                    <button
                      key={session.id}
                      title={session.title}
                      onClick={() => {
                        setActiveChatId(session.id);
                        setActiveMainView('chat');
                      }}
                      className="w-full text-left rounded-xl p-2.5 text-xs flex items-center gap-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition group"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
                      <div className="truncate flex-1">
                        <span className="truncate block font-medium text-slate-300">{session.title}</span>
                        <span className="text-[10px] text-slate-500 block">{session.timestamp}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

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
                onError={handleImageError}
              />
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">{userProfile.name}</span>
                  <span className="text-[10px] text-emerald-400 font-medium block">
                    VIP • Saldo: R$ {(userProfile.walletBalance || 42.50).toFixed(2).replace('.', ',')}
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
      {/* MAIN WORKSPACE: Header + View Switcher                       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950">
        
        {/* Interactive Pitch Demo Tour Bar (1-Click Steps 1..5) */}
        <DemoScriptToolbar
          currentStep={demoStep}
          onSelectStep={handleSelectDemoStep}
          onResetDemo={() => handleSelectDemoStep(1)}
        />

        {/* Top Navbar Header with Breadcrumbs + Search Input + Actions */}
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            
            {/* Dynamic Breadcrumb Header */}
            <div className="flex items-center gap-2 font-heading font-semibold text-sm text-slate-200 tracking-tight shrink-0">
              <button
                onClick={() => setActiveMainView('home')}
                className="hover:text-emerald-400 transition flex items-center gap-1.5"
                title="Voltar para Página Inicial (Loja $Agent)"
              >
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Loja $Agent</span>
              </button>

              {activeMainView !== 'home' && (
                <>
                  <span className="text-slate-600 font-mono-tech text-xs">/</span>
                  <span className="text-emerald-400 text-xs font-medium">
                    {activeMainView === 'chat' && 'Conversa Agêntica com IA'}
                    {activeMainView === 'wallet' && 'Minha Carteira & Cashback'}
                    {activeMainView === 'coupons' && 'Meus Cupons Exclusivos'}
                    {activeMainView === 'store' && 'Rede de Lojas Deco'}
                    {activeMainView === 'filters' && 'Filtros Personalizados'}
                    {activeMainView === 'compare' && 'Comparador de Atributos'}
                  </span>
                </>
              )}
            </div>

            {/* Header Search Input Bar (Linear / Raycast Style) */}
            <div className="relative flex-1 max-w-xs hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar com $Agent..."
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunAgent(currentQuery)}
                className="w-full pl-8 pr-10 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500/50 transition shadow-inner"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono-tech text-slate-500 px-1 rounded bg-slate-900 border border-slate-800/80 pointer-events-none">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Top Header Feature Actions (Share, Filters, Store, Ticket, ShoppingCart, Wallet) */}
          <div className="flex items-center gap-2">
            
            {/* Share Context Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
              title="Compartilhar Busca Agêntica"
            >
              <Share2 className="w-4 h-4 text-slate-300" />
            </button>

            {/* Custom Filters Button */}
            <button
              onClick={() => setActiveMainView('filters')}
              className={`p-2 rounded-xl bg-slate-950/80 border transition ${
                activeMainView === 'filters' ? 'border-emerald-500 text-emerald-400' : 'border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Filtros Personalizados & Temáticos"
            >
              <Filter className="w-4 h-4" />
            </button>

            {/* Store Mesh Button */}
            <button
              onClick={() => setActiveMainView('store')}
              className={`p-2 rounded-xl bg-slate-950/80 border transition ${
                activeMainView === 'store' ? 'border-cyan-400 text-cyan-400' : 'border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Rede de Lojas Deco Mesh"
            >
              <Store className="w-4 h-4" />
            </button>

            {/* Coupons Button */}
            <button
              onClick={() => setActiveMainView('coupons')}
              className={`p-2 rounded-xl bg-slate-950/80 border transition ${
                activeMainView === 'coupons' ? 'border-amber-400 text-amber-400' : 'border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Meus Cupons Exclusivos"
            >
              <Ticket className="w-4 h-4" />
            </button>

            {/* Shopping Cart Button (Left of Wallet Saldo) */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition relative"
              title="Meu Carrinho de Compras"
            >
              <ShoppingCart className="w-4 h-4 text-slate-300" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[9px] flex items-center justify-center font-mono-tech">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>

            {/* Wallet & Saldo Chip (Far Right) */}
            <button
              onClick={() => setActiveMainView('wallet')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border transition ${
                activeMainView === 'wallet' ? 'border-emerald-500 text-emerald-400' : 'border-slate-800 hover:border-emerald-500/40 text-slate-200'
              }`}
              title="Minha Carteira & Cashback"
            >
              <Wallet className="w-4 h-4 text-slate-300" />
              <span className="font-mono-tech font-bold text-emerald-400 tracking-tight text-xs">
                R${(userProfile.walletBalance || 42.50).toFixed(2).replace('.', ',')}
              </span>
            </button>

          </div>
        </header>

        {/* View Content Renderer */}
        {activeMainView === 'home' && (
          <HomeStorefrontView
            userProfile={userProfile}
            products={MOCK_STORE_CONTEXT.catalog}
            onOpenChat={(initialQuery) => {
              if (initialQuery) {
                handleRunAgent(initialQuery);
              } else {
                setActiveMainView('chat');
              }
            }}
            onSelectProductToBuy={(product) => setSelectedCheckoutProduct(product)}
          />
        )}

        {activeMainView === 'wallet' && (
          <WalletView userProfile={userProfile} onBackToChat={() => setActiveMainView('home')} />
        )}

        {activeMainView === 'coupons' && (
          <CouponsView onBackToChat={() => setActiveMainView('home')} />
        )}

        {activeMainView === 'store' && (
          <StoreBootstrapView onBackToChat={() => setActiveMainView('home')} />
        )}

        {activeMainView === 'filters' && (
          <CustomFiltersView
            userProfile={userProfile}
            onBackToChat={() => setActiveMainView('home')}
            onApplyPresetFilter={(name, colors) => {
              handleRunAgent(`Filtrar por ${name} nas cores ${colors.join(', ')}`);
            }}
          />
        )}

        {activeMainView === 'compare' && (
          <CompareProductsView
            products={cartItems.map(i => i.product)}
            userProfile={userProfile}
            onBackToCart={() => {
              setActiveMainView('chat');
              setIsCartDrawerOpen(true);
            }}
            onSelectProductToBuy={(product) => {
              setSelectedCheckoutProduct(product);
              setActiveMainView('home');
            }}
          />
        )}

        {/* MAIN VIEW: Gemini Chat Workspace + Optional Right Product Rail */}
        {activeMainView === 'chat' && (
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
                        O $Agent cruza seu perfil contextual (teto R$ {userProfile.maxBudget || '450'}) com o catálogo da loja.
                      </p>
                    </div>

                    {/* Quick Suggestion Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-lg">
                      {[
                        'Camisa Oficial Fluminense Tricolor',
                        'Camisa Seleção Brasileira Amarela',
                        'Tênis de Corrida Nike Air Zoom',
                        'Chuteira Society Tiempo Legend Pro'
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
                          <div className="flex items-center gap-2">
                            <span className="font-mono-tech flex-1">{msg.responsePayload.reasoningSummary}</span>
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 font-mono-tech text-[9px]">
                              via {PROVIDER_LABELS[msg.responsePayload.providerUsed] || msg.responsePayload.providerUsed}
                            </span>
                          </div>
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

            {/* Right Column: Optional Compact Product Rail ("Vitrine da Loja") */}
            {isRightRailOpen && (
              <div className="w-80 lg:w-96 bg-slate-900/40 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4 shrink-0 animate-in slide-in-from-right duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <h4 className="font-heading font-bold text-sm text-white">Vitrine $Agent Loja</h4>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {displayedProducts.length} itens
                    </span>
                    <button
                      onClick={() => setIsRightRailOpen(false)}
                      className="p-1 text-slate-500 hover:text-slate-300 transition"
                      title="Ocultar Vitrine Lateral"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                            onError={handleImageError}
                          />
                          {isMatch && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[8px]">
                              Match
                            </span>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between text-xs min-w-0">
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 gap-1">
                              <span className="truncate">{product.category}</span>
                              <span className="text-emerald-400 font-medium shrink-0">{product.storeName}</span>
                            </div>
                            <h5 className="font-heading font-bold text-xs text-white truncate mt-0.5 group-hover:text-emerald-400 transition" title={product.name}>
                              {product.name}
                            </h5>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                            <span className="font-heading font-extrabold text-sm text-white">
                              R$ {product.price}
                            </span>

                            <button 
                              onClick={() => handleAddToCart(product)}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950 font-bold text-[10px] transition"
                            >
                              Comprar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Share Context Modal */}
      <ShareContextModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userProfile={userProfile}
        queryTitle={activeSession?.title || 'Busca Contextual'}
        recommendedProducts={displayedProducts}
      />

      {/* Cart Drawer Modal */}
      <CartDrawerModal
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        userProfile={userProfile}
        onOpenComparePage={() => setActiveMainView('compare')}
      />

      {/* Product Checkout Modal */}
      <ProductCheckoutModal
        isOpen={!!selectedCheckoutProduct}
        onClose={() => setSelectedCheckoutProduct(null)}
        product={selectedCheckoutProduct}
        userProfile={userProfile}
      />

      {/* Top Header Feature Modals (Quick Popup triggers) */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        userProfile={userProfile}
      />

      <CouponsModal
        isOpen={isCouponsModalOpen}
        onClose={() => setIsCouponsModalOpen(false)}
      />

      <StoreMeshModal
        isOpen={isStoreMeshModalOpen}
        onClose={() => setIsStoreMeshModalOpen(false)}
      />

      <CustomFiltersModal
        isOpen={isCustomFiltersModalOpen}
        onClose={() => setIsCustomFiltersModalOpen(false)}
        userProfile={userProfile}
        onApplyPresetFilter={(name, colors) => {
          handleRunAgent(`Filtrar por ${name} nas cores ${colors.join(', ')}`);
        }}
      />

      {/* Full Linear-Style Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
        aiProvider={aiProvider}
        onProviderChange={setAiProvider}
        customApiKey={customApiKey}
        onApiKeyChange={setCustomApiKey}
      />

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
    </div>
  );
}
