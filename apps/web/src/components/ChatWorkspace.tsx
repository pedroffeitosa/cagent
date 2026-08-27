import React from 'react';
import { Product, UserProfile } from '@cagent/shared';
import {
  Sparkles,
  Bot,
  ChevronLeft,
  ShoppingBag,
  Gift,
  Coins,
  Send,
  X,
} from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';
import { PROVIDER_LABELS } from '../lib/providers';
import { ChatSession } from '../types/chat';

const QUICK_SUGGESTIONS = [
  'Camisa Oficial Fluminense Tricolor',
  'Camisa Seleção Brasileira Amarela',
  'Tênis de Corrida Nike Air Zoom',
  'Chuteira Society Tiempo Legend Pro',
];

interface ChatWorkspaceProps {
  activeSession?: ChatSession;
  userProfile: UserProfile;
  currentQuery: string;
  onQueryChange: (value: string) => void;
  onSubmitQuery: (query: string) => void;
  loading: boolean;
  displayedProducts: Product[];
  activeProductIds?: string[];
  isRightRailOpen: boolean;
  onToggleRail: (open: boolean) => void;
  onAddToCart: (product: Product) => void;
}

export function ChatWorkspace({
  activeSession,
  userProfile,
  currentQuery,
  onQueryChange,
  onSubmitQuery,
  loading,
  displayedProducts,
  activeProductIds,
  isRightRailOpen,
  onToggleRail,
  onAddToCart,
}: ChatWorkspaceProps) {
  return (
    <div className="flex-1 flex overflow-hidden">

      {/* Left Column: Gemini Style Chat Experience */}
      <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto custom-scrollbar border-r border-border/80 relative">

        {/* Chat Stream Messages */}
        <div className="flex-1 flex flex-col gap-6 max-w-3xl w-full mx-auto pb-4">

          {/* Empty Chat Greeting (Gemini Style) */}
          {(!activeSession || activeSession.messages.length === 0) && (
            <div className="my-auto flex flex-col items-center justify-center text-center gap-4 py-12 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl text-foreground">
                  Olá, {userProfile.name.split(' ')[0]}! O que você quer pesquisar e comprar hoje?
                </h2>
                <p className="text-xs text-muted-foreground mt-2 max-w-md">
                  O $Agent cruza seu perfil contextual (teto R$ {userProfile.maxBudget || '450'}) com o catálogo da loja.
                </p>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-lg">
                {QUICK_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => {
                      onQueryChange(sug);
                      onSubmitQuery(sug);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-card border border-border hover:border-primary/50 hover:text-primary transition text-xs"
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
                <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}

              <div className={`max-w-xl text-xs rounded-2xl p-4 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                  : 'glass-panel border border-border text-foreground rounded-tl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>

                {/* Agent Response Meta & Coupon Calculation */}
                {msg.responsePayload && (
                  <div className="mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech flex-1">{msg.responsePayload.reasoningSummary}</span>
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground font-mono-tech text-[9px]">
                        via {PROVIDER_LABELS[msg.responsePayload.providerUsed] || msg.responsePayload.providerUsed}
                      </span>
                    </div>
                    {msg.responsePayload.appliedCoupon && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-background/80 border border-primary/20">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          Cupom {msg.responsePayload.appliedCoupon.code}
                        </span>
                        <span className="text-primary font-bold flex items-center gap-1">
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
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmitQuery(currentQuery)}
            className="w-full pl-5 pr-14 py-4 rounded-2xl bg-card border border-border text-foreground placeholder-faint text-sm focus:outline-none focus:border-primary transition shadow-inner"
          />
          <button
            onClick={() => onSubmitQuery(currentQuery)}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-primary hover:bg-primary text-primary-foreground font-bold transition disabled:opacity-50"
            title="Enviar mensagem"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin block" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>

      {/* Right Column: Optional Compact Product Rail ("Vitrine da Loja") */}
      {isRightRailOpen && (
        <div className="w-80 lg:w-96 bg-card/40 backdrop-blur-xl p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4 shrink-0 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <h4 className="font-heading font-bold text-sm text-foreground">Vitrine $Agent Loja</h4>

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-elevated text-muted-foreground border border-border-strong">
                {displayedProducts.length} itens
              </span>
              <button
                onClick={() => onToggleRail(false)}
                className="p-1 text-faint hover:text-foreground transition"
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
                  className={`glass-card rounded-2xl p-3 flex gap-3 group transition-all duration-300 hover:border-border-strong ${
                    isMatch ? 'ring-1 ring-primary/60 shadow-lg shadow-primary/5' : ''
                  }`}
                >
                  {/* Compact Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-card shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                    />
                    {isMatch && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-bold text-[8px]">
                        Match
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between text-xs min-w-0">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground gap-1">
                        <span className="truncate">{product.category}</span>
                        <span className="text-primary font-medium shrink-0">{product.storeName}</span>
                      </div>
                      <h5 className="font-heading font-bold text-xs text-foreground truncate mt-0.5 group-hover:text-primary transition" title={product.name}>
                        {product.name}
                      </h5>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <span className="font-heading font-extrabold text-sm text-foreground">
                        R$ {product.price}
                      </span>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="px-2.5 py-1 rounded-lg bg-card border border-border-strong hover:bg-primary hover:border-primary hover:text-primary-foreground font-bold text-[10px] transition"
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

      {/* Collapsed Rail Reopen Tab */}
      {!isRightRailOpen && (
        <button
          onClick={() => onToggleRail(true)}
          title="Mostrar Vitrine da Loja"
          className="w-8 shrink-0 bg-card/40 border-l border-border/80 flex flex-col items-center justify-center gap-2 text-faint hover:text-primary hover:bg-card/70 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <ShoppingBag className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}
