import React from 'react';
import { Product, UserProfile } from '@cagent/shared';
import { 
  Sparkles, 
  Flame, 
  Target, 
  Compass, 
  TrendingUp, 
  Bot, 
  ArrowRight, 
  Check, 
  ShoppingBag, 
  Coins, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { handleImageError } from '../../utils/imageFallback';

interface HomeStorefrontViewProps {
  userProfile: UserProfile;
  products: Product[];
  onOpenChat: (initialQuery?: string) => void;
  onSelectProductToBuy: (product: Product) => void;
}

export function HomeStorefrontView({
  userProfile,
  products,
  onOpenChat,
  onSelectProductToBuy,
}: HomeStorefrontViewProps) {
  
  // Categorized products for collection cards
  const newArrivals = products.slice(0, 3);
  const matchForUser = products.filter(p => 
    p.availableSizes.includes(userProfile.sizes.clothing) || 
    p.availableSizes.includes(userProfile.sizes.shoes)
  ).slice(0, 4);

  return (
    <div className="flex-1 flex flex-col p-8 max-w-6xl mx-auto w-full gap-10 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER: Personal Greeting & AI Agent Search Trigger       */}
      {/* ------------------------------------------------------------- */}
      <div className="relative rounded-3xl p-8 border border-emerald-500/30 overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-3 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono-tech font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Canal Agêntico $Agent
            </span>
            <span className="text-xs text-slate-400 font-mono-tech">
              Tamanho {userProfile.sizes.clothing} | Calçado {userProfile.sizes.shoes}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white tracking-tight leading-tight">
            Olá, {userProfile.name.split(' ')[0]}! Sua vitrine hiper-personalizada.
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Recomendações curadas em tempo real com base nas suas preferências esportivas, cores favoritas e orçamento máximo (teto R$ {userProfile.maxBudget || '450'}).
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button 
              onClick={() => onOpenChat()} 
              size="lg" 
              className="py-3.5 px-6 gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              <Bot className="w-4 h-4" />
              <span>Iniciar Busca Agêntica com IA</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Status Badge Box */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-3 shrink-0 z-10 w-full md:w-64">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono-tech uppercase">Status do Perfil</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div>
            <span className="font-heading font-bold text-base text-white block">
              VIP • Saldo R$ {(userProfile.walletBalance || 42.50).toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium block mt-0.5">
              5% Cashback ativo em todas as compras
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono-tech">
            <span>Cupom: DECO10</span>
            <span className="text-amber-400 font-bold">10% OFF</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FEATURED EXPERIENCE CARDS: Novidades, Seu Estilo, Vibes, etc  */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-bold text-xl text-white">Experiências Contextuais</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Novidades Card */}
          <div 
            onClick={() => onOpenChat('Mostrar novidades esportivas e lançamentos')}
            className="glass-card rounded-3xl p-5 border border-slate-800 hover:border-amber-500/50 cursor-pointer group transition flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 font-mono-tech border border-slate-800">
                Lançamentos
              </span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-white group-hover:text-amber-400 transition">Novidades</h4>
              <p className="text-xs text-slate-400 mt-1">Últimas camisas de time, chuteiras e artigos esportivos 2026.</p>
            </div>

            <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Explorar</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </span>
          </div>

          {/* Seu Estilo (100% Match) Card */}
          <div 
            onClick={() => onOpenChat('Filtrar produtos no meu tamanho M e calçado 41')}
            className="glass-card rounded-3xl p-5 border border-emerald-500/40 hover:border-emerald-500 cursor-pointer group transition flex flex-col justify-between gap-4 relative overflow-hidden bg-emerald-950/20"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold font-mono-tech">
                Match 100%
              </span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition">Seu Estilo</h4>
              <p className="text-xs text-slate-300 mt-1">Filtrado no seu tamanho M, tênis 41 e paleta de cores favorita.</p>
            </div>

            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Ver meu match</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Vibes & Ocasiões Card */}
          <div 
            onClick={() => onOpenChat('Mostrar sugestões para treino, maratona e dia de jogo')}
            className="glass-card rounded-3xl p-5 border border-slate-800 hover:border-cyan-500/50 cursor-pointer group transition flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-cyan-400 font-mono-tech border border-slate-800">
                Ocasiões
              </span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-white group-hover:text-cyan-400 transition">Vibes &amp; Ocasiões</h4>
              <p className="text-xs text-slate-400 mt-1">Looks para dia de jogo do Fluminense, treino de corrida e academia.</p>
            </div>

            <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Navegar por vibe</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </span>
          </div>

          {/* Tendências Card */}
          <div 
            onClick={() => onOpenChat('Quais são os itens mais vendidos e em alta?')}
            className="glass-card rounded-3xl p-5 border border-slate-800 hover:border-purple-500/50 cursor-pointer group transition flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-purple-400 font-mono-tech border border-slate-800">
                Em Alta
              </span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-white group-hover:text-purple-400 transition">Tendências</h4>
              <p className="text-xs text-slate-400 mt-1">Os itens mais desejados da rede de lojas Deco Mesh.</p>
            </div>

            <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Ver tendências</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
            </span>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FEATURED PRODUCT CATALOG GRID                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-white">Vitrine em Destaque</h3>
            <p className="text-xs text-slate-400 mt-0.5">Catálogo contextualizado com bônus de cashback e tamanhos disponíveis</p>
          </div>
          <Button onClick={() => onOpenChat()} variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filtrar com $Agent</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              className="glass-card rounded-3xl p-4 border border-slate-800 flex flex-col justify-between gap-4 group hover:border-slate-700 transition"
            >
              {/* Product Image Box */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 relative border border-slate-800">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur text-slate-300 text-[10px] font-medium border border-slate-800">
                  {product.storeName}
                </span>

                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                  Match {userProfile.sizes.clothing}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{product.category}</span>
                  <span className="text-emerald-400 font-medium">Tam: {product.availableSizes.join(', ')}</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-white truncate" title={product.name}>
                  {product.name}
                </h4>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-heading font-extrabold text-base text-white block">R$ {product.price}</span>
                  <span className="text-[10px] text-emerald-400 font-mono-tech block">
                    + R$ {product.cashbackReward || Math.round(product.price * 0.05)} Cashback
                  </span>
                </div>

                <Button 
                  onClick={() => onSelectProductToBuy(product)}
                  size="sm"
                  className="gap-1.5 bg-slate-900 border border-slate-700 hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950 font-bold text-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Comprar</span>
                </Button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
