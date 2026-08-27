import React from 'react';
import {
  Menu,
  Home,
  Search,
  Share2,
  Filter,
  Store,
  Ticket,
  ShoppingCart,
  Wallet,
} from 'lucide-react';
import { MainViewType } from '../../types/chat';

const VIEW_LABELS: Partial<Record<MainViewType, string>> = {
  chat: 'Conversa Agêntica com IA',
  wallet: 'Minha Carteira & Cashback',
  coupons: 'Meus Cupons Exclusivos',
  store: 'Rede de Lojas Deco',
  filters: 'Filtros Personalizados',
  compare: 'Comparador de Atributos',
};

interface TopHeaderProps {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  activeMainView: MainViewType;
  onNavigateHome: () => void;
  currentQuery: string;
  onQueryChange: (value: string) => void;
  onSubmitQuery: () => void;
  onOpenShareModal: () => void;
  onNavigateFilters: () => void;
  onNavigateStore: () => void;
  onNavigateCoupons: () => void;
  cartItemsCount: number;
  onOpenCart: () => void;
  walletBalance: number;
  onNavigateWallet: () => void;
}

export function TopHeader({
  isSidebarOpen,
  onOpenSidebar,
  activeMainView,
  onNavigateHome,
  currentQuery,
  onQueryChange,
  onSubmitQuery,
  onOpenShareModal,
  onNavigateFilters,
  onNavigateStore,
  onNavigateCoupons,
  cartItemsCount,
  onOpenCart,
  walletBalance,
  onNavigateWallet,
}: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border/80 h-16 px-6 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-4 flex-1 max-w-xl">

        {/* Mobile Sidebar Reopen Button */}
        {!isSidebarOpen && (
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-1.5 -ml-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-elevated/80 transition shrink-0"
            title="Abrir Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Dynamic Breadcrumb Header */}
        <div className="flex items-center gap-2 font-heading font-semibold text-sm text-foreground tracking-tight shrink-0">
          <button
            onClick={onNavigateHome}
            className="hover:text-primary transition flex items-center gap-1.5"
            title="Voltar para Página Inicial (Loja $Agent)"
          >
            <Home className="w-4 h-4 text-primary" />
            <span>Loja $Agent</span>
          </button>

          {activeMainView !== 'home' && (
            <>
              <span className="text-faint font-mono-tech text-xs">/</span>
              <span className="text-primary text-xs font-medium">
                {VIEW_LABELS[activeMainView]}
              </span>
            </>
          )}
        </div>

        {/* Header Search Input Bar (Linear / Raycast Style) */}
        <div className="relative flex-1 max-w-xs hidden sm:block">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar com $Agent..."
            value={currentQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmitQuery()}
            className="w-full pl-8 pr-10 py-1.5 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-faint text-xs focus:outline-none focus:border-primary/50 transition shadow-inner"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono-tech text-faint px-1 rounded bg-card border border-border/80 pointer-events-none">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Top Header Feature Actions (Share, Filters, Store, Ticket, ShoppingCart, Wallet) */}
      <div className="flex items-center gap-2">

        {/* Share Context Button */}
        <button
          onClick={onOpenShareModal}
          className="p-2 rounded-xl bg-background/80 border border-border hover:border-border-strong text-foreground hover:text-foreground transition"
          title="Compartilhar Busca Agêntica"
        >
          <Share2 className="w-4 h-4 text-foreground" />
        </button>

        {/* Custom Filters Button */}
        <button
          onClick={onNavigateFilters}
          className={`p-2 rounded-xl bg-background/80 border transition ${
            activeMainView === 'filters' ? 'border-primary text-primary' : 'border-border text-foreground hover:text-foreground'
          }`}
          title="Filtros Personalizados & Temáticos"
        >
          <Filter className="w-4 h-4" />
        </button>

        {/* Store Mesh Button */}
        <button
          onClick={onNavigateStore}
          className={`p-2 rounded-xl bg-background/80 border transition ${
            activeMainView === 'store' ? 'border-cyan-400 text-cyan-400' : 'border-border text-foreground hover:text-foreground'
          }`}
          title="Rede de Lojas Deco Mesh"
        >
          <Store className="w-4 h-4" />
        </button>

        {/* Coupons Button */}
        <button
          onClick={onNavigateCoupons}
          className={`p-2 rounded-xl bg-background/80 border transition ${
            activeMainView === 'coupons' ? 'border-amber-400 text-amber-400' : 'border-border text-foreground hover:text-foreground'
          }`}
          title="Meus Cupons Exclusivos"
        >
          <Ticket className="w-4 h-4" />
        </button>

        {/* Shopping Cart Button (Left of Wallet Saldo) */}
        <button
          onClick={onOpenCart}
          className="p-2 rounded-xl bg-background/80 border border-border hover:border-border-strong text-foreground hover:text-foreground transition relative"
          title="Meu Carrinho de Compras"
        >
          <ShoppingCart className="w-4 h-4 text-foreground" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground font-extrabold text-[9px] flex items-center justify-center font-mono-tech">
              {cartItemsCount}
            </span>
          )}
        </button>

        {/* Wallet & Saldo Chip (Far Right) */}
        <button
          onClick={onNavigateWallet}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/80 border transition ${
            activeMainView === 'wallet' ? 'border-primary text-primary' : 'border-border hover:border-primary/40 text-foreground'
          }`}
          title="Minha Carteira & Cashback"
        >
          <Wallet className="w-4 h-4 text-foreground" />
          <span className="font-mono-tech font-bold text-primary tracking-tight text-xs">
            R${walletBalance.toFixed(2).replace('.', ',')}
          </span>
        </button>

      </div>
    </header>
  );
}
