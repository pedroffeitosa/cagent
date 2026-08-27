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

// Raio-X de compatibilidade: pondera tamanho, orçamento, estilo e cor
// contra o perfil real do cliente, em vez de um "Match 100%" fixo.
function computeMatchScore(product: Product, userProfile: UserProfile): number {
  let score = 0;

  if (product.availableSizes.includes(userProfile.sizes.clothing) || product.availableSizes.includes(userProfile.sizes.shoes)) {
    score += 35;
  }
  if (!userProfile.maxBudget || product.price <= userProfile.maxBudget) {
    score += 30;
  }
  if (product.tags.some((t) => userProfile.stylePreferences.includes(t))) {
    score += 20;
  }
  if (product.colors.some((c) => userProfile.favoriteColors.includes(c))) {
    score += 15;
  }

  return score;
}

export function CompareProductsView({
  products,
  userProfile,
  onBackToCart,
  onSelectProductToBuy,
}: CompareProductsViewProps) {
  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4 animate-in fade-in">
        <Swords className="w-12 h-12 text-faint stroke-[1.5]" />
        <h3 className="font-heading font-bold text-xl text-foreground">Nenhum item para comparar</h3>
        <p className="text-xs text-muted-foreground max-w-sm">Adicione 2 ou mais produtos ao carrinho para comparar seus atributos com o $Agent.</p>
        <Button onClick={onBackToCart} variant="secondary">Voltar ao Carrinho</Button>
      </div>
    );
  }

  const bestMatch = products.reduce((best, p) =>
    computeMatchScore(p, userProfile) > computeMatchScore(best, userProfile) ? p : best
  , products[0]);

  return (
    <div className="flex-1 flex flex-col p-8 max-w-6xl mx-auto w-full gap-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCart}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-strong transition"
            title="Voltar ao Carrinho"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-bold text-2xl text-foreground">Comparador Agêntico de Atributos</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Batalha de especificações cruzadas com seu perfil contextual</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-mono-tech font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Análise $Agent Ativa
        </span>
      </div>

      {/* AI Recommendation Summary Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-primary/30 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-primary text-sm">Veredito do $Agent para {userProfile.name}</span>
          <p className="text-foreground mt-1 leading-relaxed">
            Comparando os atributos com seu perfil (tamanho {userProfile.sizes.clothing}, teto R$ {userProfile.maxBudget || '450'}), o <strong>{bestMatch.name}</strong> é o que melhor combina com você.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className={`grid gap-6 ${products.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {products.map((product) => {
          const matchScore = computeMatchScore(product, userProfile);
          return (
          <div key={product.id} className="glass-card rounded-3xl p-6 border border-border flex flex-col justify-between gap-6 group hover:border-border-strong transition">
            
            {/* Header & Product Image */}
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-card relative border border-border">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                  onError={handleImageError}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-foreground text-[10px] font-medium border border-border">
                  {product.storeName}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground font-mono-tech uppercase">{product.category}</span>
                <h4 className="font-heading font-bold text-base text-foreground mt-0.5 line-clamp-2" title={product.name}>
                  {product.name}
                </h4>
              </div>
            </div>

            {/* Attributes Comparison Table */}
            <div className="flex flex-col gap-3 border-t border-b border-border/80 py-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Preço:</span>
                <span className="font-heading font-bold text-foreground text-sm">R$ {product.price}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cashback Ganho:</span>
                <span className="font-mono-tech font-bold text-primary">+ R$ {product.cashbackReward || Math.round(product.price * 0.05)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tamanhos Disponíveis:</span>
                <span className="font-mono-tech text-foreground">{product.availableSizes.join(', ')}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Compatibilidade Perfil:</span>
                <span className={`font-bold flex items-center gap-1 ${matchScore >= 70 ? 'text-primary' : matchScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                  {matchScore >= 40 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5 stroke-[3]" />}
                  Match {matchScore}%
                </span>
              </div>

              {product.technicalSpecs?.material && (
                <div className="flex justify-between items-start gap-3">
                  <span className="text-muted-foreground shrink-0">Material:</span>
                  <span className="text-foreground text-right">{product.technicalSpecs.material}</span>
                </div>
              )}

              {product.technicalSpecs?.fit && (
                <div className="flex justify-between items-start gap-3">
                  <span className="text-muted-foreground shrink-0">Ajuste / Pisada:</span>
                  <span className="text-foreground text-right">{product.technicalSpecs.fit}</span>
                </div>
              )}

              {product.technicalSpecs?.cleatType && (
                <div className="flex justify-between items-start gap-3">
                  <span className="text-muted-foreground shrink-0">Trava:</span>
                  <span className="text-foreground text-right">{product.technicalSpecs.cleatType}</span>
                </div>
              )}

              {product.technicalSpecs?.support && (
                <div className="flex justify-between items-start gap-3">
                  <span className="text-muted-foreground shrink-0">Suporte:</span>
                  <span className="text-foreground text-right">{product.technicalSpecs.support}</span>
                </div>
              )}
            </div>

            {/* Action */}
            <Button onClick={() => onSelectProductToBuy(product)} className="w-full flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Escolher Este Produto</span>
            </Button>

          </div>
        );
        })}
      </div>

    </div>
  );
}
