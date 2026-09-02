import React from 'react';
import { Product, UserProfile } from '@cagent/shared';
import {
  Flame,
  Target,
  Compass,
  TrendingUp,
  Bot,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { handleImageError } from '../../utils/imageFallback';
import { ThemeFilter } from '../../types/chat';

interface HomeStorefrontViewProps {
  userProfile: UserProfile;
  products: Product[];
  activeThemeFilter: ThemeFilter | null;
  cashbackPercentage: number;
  onOpenChat: (initialQuery?: string) => void;
  onSelectProductToBuy: (product: Product) => void;
  onClearThemeFilter: () => void;
  onNavigateFilters: () => void;
}

export function HomeStorefrontView({
  userProfile,
  products,
  activeThemeFilter,
  cashbackPercentage,
  onOpenChat,
  onSelectProductToBuy,
  onClearThemeFilter,
  onNavigateFilters,
}: HomeStorefrontViewProps) {

  return (
    <div className="flex-1 flex flex-col p-8 max-w-6xl mx-auto w-full gap-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      
      {/* Ultra Clean Header Bar */}
      <div className="pb-4 border-b border-border/80 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-foreground tracking-tight">
            Vitrine $Agent
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Artigos esportivos recomendados para o seu tamanho {userProfile.sizes.clothing} e calçado {userProfile.sizes.shoes}
          </p>
        </div>

        {activeThemeFilter ? (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-primary/10 border border-primary/30">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs text-primary font-semibold">
              Vitrine priorizada pelo filtro <strong>{activeThemeFilter.name}</strong>
            </span>
            <button
              onClick={onClearThemeFilter}
              className="p-1 rounded-full text-primary/70 hover:text-primary hover:bg-primary/10 transition"
              title="Remover filtro ativo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onNavigateFilters}
            className="text-xs px-3.5 py-2 rounded-2xl bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition font-medium"
          >
            Configurar filtro temático
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FEATURED EXPERIENCE CARDS: Novidades, Seu Estilo, Vibes, etc  */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-bold text-lg text-foreground">Coleções &amp; Ocasiões</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Novidades Card */}
          <div 
            onClick={() => onOpenChat('Mostrar novidades esportivas e lançamentos')}
            className="glass-card rounded-3xl p-5 border border-border hover:border-amber-500/50 cursor-pointer group transition flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-background text-amber-400 font-mono-tech border border-border">
                Lançamentos
              </span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-foreground group-hover:text-amber-400 transition">Novidades</h4>
              <p className="text-xs text-muted-foreground mt-1">Últimas camisas de time, chuteiras e artigos esportivos 2026.</p>
            </div>

            <span className="text-[11px] text-foreground font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Explorar</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </span>
          </div>

          {/* Seu Estilo (100% Match) Card */}
          <div 
            onClick={() => onOpenChat('Filtrar produtos no meu tamanho M e calçado 41')}
            className="glass-card rounded-3xl p-5 border border-primary/40 hover:border-primary cursor-pointer group transition flex flex-col justify-between gap-4 relative overflow-hidden bg-primary/6"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold font-mono-tech">
                Match 100%
              </span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition">Seu Estilo</h4>
              <p className="text-xs text-foreground mt-1">Filtrado no seu tamanho M, tênis 41 e paleta de cores favorita.</p>
            </div>

            <span className="text-[11px] text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Ver meu match</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Vibes & Ocasiões Card */}
          <div 
            onClick={() => onOpenChat('Mostrar sugestões para treino, maratona e dia de jogo')}
            className="glass-card rounded-3xl p-5 border border-border hover:border-cyan-500/50 cursor-pointer group transition flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-background text-cyan-400 font-mono-tech border border-border">
                Ocasiões
              </span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-foreground group-hover:text-cyan-400 transition">Vibes &amp; Ocasiões</h4>
              <p className="text-xs text-muted-foreground mt-1">Looks para dia de jogo do Fluminense, treino de corrida e academia.</p>
            </div>

            <span className="text-[11px] text-foreground font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Navegar por vibe</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </span>
          </div>

          {/* Tendências Card */}
          <div 
            onClick={() => onOpenChat('Quais são os itens mais vendidos e em alta?')}
            className="glass-card rounded-3xl p-5 border border-border hover:border-purple-500/50 cursor-pointer group transition flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-background text-purple-400 font-mono-tech border border-border">
                Em Alta
              </span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-foreground group-hover:text-purple-400 transition">Tendências</h4>
              <p className="text-xs text-muted-foreground mt-1">Os itens mais desejados da rede de lojas Deco Mesh.</p>
            </div>

            <span className="text-[11px] text-foreground font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Ver tendências</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
            </span>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FEATURED PRODUCT CATALOG GRID WITH DIVERSIFIED BADGES         */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-foreground">Vitrine Principal</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Catálogo diversificado com atributos e cashback em tempo real</p>
          </div>
          <Button onClick={() => onOpenChat()} variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span>Filtrar com $Agent</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            // Diversified badge calculation
            let badgeText = `Tam: ${product.availableSizes[0]}`;
            let badgeStyle = 'bg-background/80 border border-border text-foreground';

            const matchesThemeFilter = !!activeThemeFilter?.colors.length &&
              product.colors.some((c) => activeThemeFilter.colors.includes(c));

            if (matchesThemeFilter) {
              badgeText = activeThemeFilter!.name;
              badgeStyle = 'bg-primary text-primary-foreground font-bold';
            } else if (product.availableSizes.includes(userProfile.sizes.clothing)) {
              badgeText = `Match Tam. ${userProfile.sizes.clothing}`;
              badgeStyle = 'bg-primary text-primary-foreground font-bold';
            } else if (product.availableSizes.includes(userProfile.sizes.shoes)) {
              badgeText = `Match Calçado ${userProfile.sizes.shoes}`;
              badgeStyle = 'bg-cyan-400 text-primary-foreground font-bold';
            } else if (product.originalPrice) {
              badgeText = 'Oferta Especial';
              badgeStyle = 'bg-purple-500 text-foreground font-bold';
            } else if (product.category === 'Camisas de Time') {
              badgeText = 'Edição Oficial';
              badgeStyle = 'bg-amber-400 text-primary-foreground font-bold';
            }

            return (
              <div 
                key={product.id}
                className="glass-card rounded-3xl p-4 border border-border flex flex-col justify-between gap-4 group hover:border-border-strong transition"
              >
                {/* Product Image Box */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-card relative border border-border">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                  />
                  
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-foreground text-[10px] font-medium border border-border">
                    {product.storeName}
                  </span>

                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] ${badgeStyle}`}>
                    {badgeText}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{product.category}</span>
                    <span className="text-primary font-medium">Tamanhos: {product.availableSizes.join(', ')}</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-foreground truncate" title={product.name}>
                    {product.name}
                  </h4>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-border/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-base text-foreground">R$ {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-faint line-through">R$ {product.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-primary font-mono-tech block mt-0.5">
                      + R$ {product.cashbackReward || Math.round(product.price * (cashbackPercentage / 100))} Cashback
                    </span>
                  </div>

                  <Button 
                    onClick={() => onSelectProductToBuy(product)}
                    size="sm"
                    className="gap-1.5 bg-card border border-border-strong hover:bg-primary hover:border-primary hover:text-primary-foreground font-bold text-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Comprar</span>
                  </Button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
