import React from 'react';
import { Product, UserProfile } from '@cagent/shared';
import { Swords, ArrowLeft, Sparkles, Check, X, ShieldCheck, Coins, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { handleImageError } from '../../utils/imageFallback';

interface CompareProductsViewProps {
  products: Product[];
  userProfile: UserProfile;
  onBackToCart: () => void;
  onSelectProductToBuy: (product: Product) => void;
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80';

export function CompareProductsView({
  products,
  userProfile,
  onBackToCart,
  onSelectProductToBuy,
}: CompareProductsViewProps) {
  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4 animate-in fade-in">
        <Swords className="w-12 h-12 text-slate-600 stroke-[1.5]" />
        <h3 className="font-heading font-bold text-xl text-white">Nenhum item para comparar</h3>
        <p className="text-xs text-slate-400 max-w-sm">Adicione 2 ou mais produtos ao carrinho para comparar seus atributos com o $Agent.</p>
        <Button onClick={onBackToCart} variant="secondary">Voltar ao Carrinho</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8 max-w-6xl mx-auto w-full gap-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCart}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            title="Voltar ao Carrinho"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-emerald-400" />
              <h2 className="font-heading font-bold text-2xl text-white">Comparador Agêntico de Atributos</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Batalha de especificações cruzadas com seu perfil contextual</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-tech font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Análise $Agent Ativa
        </span>
      </div>

      {/* AI Recommendation Summary Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-emerald-300 text-sm">Veredito do $Agent para {userProfile.name}</span>
          <p className="text-slate-200 mt-1 leading-relaxed">
            Ambos os produtos estão dentro do seu orçamento máximo (teto R$ {userProfile.maxBudget || '450'}) e atendem ao seu tamanho {userProfile.sizes.clothing}. Para melhor performance esportiva, o <strong>{products[0].name}</strong> oferece excelente absorção de suor e conforto térmico.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className={`grid gap-6 ${products.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {products.map((product) => (
          <div key={product.id} className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between gap-6 group hover:border-slate-700 transition">
            
            {/* Header & Product Image */}
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 relative border border-slate-800">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                  onError={handleImageError}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur text-slate-300 text-[10px] font-medium border border-slate-800">
                  {product.storeName}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-mono-tech uppercase">{product.category}</span>
                <h4 className="font-heading font-bold text-base text-white mt-0.5 line-clamp-2" title={product.name}>
                  {product.name}
                </h4>
              </div>
            </div>

            {/* Attributes Comparison Table */}
            <div className="flex flex-col gap-3 border-t border-b border-slate-800/80 py-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Preço:</span>
                <span className="font-heading font-bold text-white text-sm">R$ {product.price}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cashback Ganho:</span>
                <span className="font-mono-tech font-bold text-emerald-400">+ R$ {product.cashbackReward || Math.round(product.price * 0.05)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tamanhos Disponíveis:</span>
                <span className="font-mono-tech text-slate-200">{product.availableSizes.join(', ')}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Compatibilidade Perfil:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  Match 100%
                </span>
              </div>
            </div>

            {/* Action */}
            <Button onClick={() => onSelectProductToBuy(product)} className="w-full flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Escolher Este Produto</span>
            </Button>

          </div>
        ))}
      </div>

    </div>
  );
}
