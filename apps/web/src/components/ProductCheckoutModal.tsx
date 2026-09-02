import React, { useState } from 'react';
import { Coupon, Product, UserProfile, computeProductMatchDetails } from '@cagent/shared';
import {
  X,
  Check,
  Sparkles,
  Coins,
  Gift,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from './ui/button';
import { handleImageError } from '../utils/imageFallback';

interface ProductCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  userProfile: UserProfile;
  onCheckoutComplete: (payload: { productName: string; amount: number; cashbackEarned: number }) => void;
  activeCoupon: Coupon | null;
  cashbackPercentage: number;
}

export function ProductCheckoutModal({
  isOpen,
  onClose,
  product,
  userProfile,
  onCheckoutComplete,
  activeCoupon,
  cashbackPercentage,
}: ProductCheckoutModalProps) {
  const [isPurchased, setIsPurchased] = useState(false);

  if (!isOpen || !product) return null;

  const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
  const discountAmount = !activeCoupon
    ? 0
    : activeCoupon.discountType === 'percentage'
      ? Math.round(product.price * (activeCoupon.discountValue / 100))
      : Math.min(activeCoupon.discountValue, product.price);
  const finalPrice = product.price - discountAmount;
  const cashbackBonus = product.cashbackReward || Math.round(finalPrice * (cashbackPercentage / 100));
  const match = computeProductMatchDetails(product, userProfile);

  const handleCheckout = () => {
    setIsPurchased(true);
    onCheckoutComplete({ productName: product.name, amount: finalPrice, cashbackEarned: cashbackBonus });
    setTimeout(() => {
      setIsPurchased(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-border/80 flex items-center justify-between bg-background/60 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-base text-foreground">Checkout Assistido pelo $Agent</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isPurchased ? (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-foreground">Pedido Realizado com Sucesso!</h3>
              <p className="text-xs text-foreground mt-1 max-w-sm">
                Seu pedido de <strong>{product.name}</strong> foi confirmado. 💰 R$ {cashbackBonus} de cashback foram creditados em sua conta!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs overflow-y-auto custom-scrollbar">
            
            {/* Left Product Preview Column */}
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-card relative border border-border">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full font-bold text-[10px] tracking-wide uppercase ${
                  match.score >= 70 ? 'bg-primary text-primary-foreground' : match.score >= 40 ? 'bg-amber-400 text-primary-foreground' : 'bg-red-400 text-primary-foreground'
                }`}>
                  ✨ Match {match.score}% $Agent
                </span>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-mono-tech">{product.category} • {product.storeName}</span>
                <h4 className="font-heading font-bold text-lg text-foreground mt-0.5 truncate" title={product.name}>{product.name}</h4>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{product.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-background border border-border text-muted-foreground text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: $Agent Match Diagnostic & Financial Breakdown */}
            <div className="flex flex-col justify-between gap-6">
              
              {/* Raio-X de Match Box */}
              <div className="p-4 rounded-2xl bg-background/80 border border-primary/20 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="font-bold text-primary text-xs uppercase tracking-wide">Raio-X de Match do Seu Perfil</span>
                </div>

                <div className="flex flex-col gap-2 text-[11px]">
                  <div className="flex items-center gap-2 text-foreground">
                    {match.sizeMatch ? (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span>
                      <strong>Tamanho:</strong>{' '}
                      {match.sizeMatch
                        ? `${userProfile.sizes.clothing} em estoque confirmado.`
                        : `disponível em ${product.availableSizes.join(', ')} — não bate com o seu ${userProfile.sizes.clothing}/${userProfile.sizes.shoes}.`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    {match.budgetMatch ? (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span>
                      <strong>Orçamento:</strong>{' '}
                      {match.budgetMatch
                        ? `R$ ${finalPrice} dentro do seu limite de R$ ${userProfile.maxBudget || '450'}.`
                        : `R$ ${product.price} acima do seu limite de R$ ${userProfile.maxBudget}.`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    {match.styleMatch ? (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span>
                      <strong>Estilo:</strong>{' '}
                      {match.styleMatch
                        ? `Atende suas preferências de ${userProfile.stylePreferences[0]}.`
                        : `Fora do seu estilo habitual (${userProfile.stylePreferences[0] || 'sem preferência definida'}).`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="p-4 rounded-2xl bg-background border border-border flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Preço Original:</span>
                  <span className="line-through font-mono-tech">R$ {originalPrice}</span>
                </div>

                {activeCoupon && (
                  <div className="flex items-center justify-between text-amber-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      Cupom {activeCoupon.code} ({activeCoupon.discountType === 'percentage' ? `${activeCoupon.discountValue}% OFF` : `R$ ${activeCoupon.discountValue} OFF`}):
                    </span>
                    <span className="font-mono-tech">- R$ {discountAmount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-border flex items-center justify-between text-foreground">
                  <span className="font-bold text-sm">Preço Final Agêntico:</span>
                  <span className="font-heading font-extrabold text-xl text-primary">R$ {finalPrice}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between text-primary text-[11px] mt-1 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-primary" />
                    Cashback a Receber:
                  </span>
                  <span className="font-mono-tech text-sm text-primary">+ R$ {cashbackBonus}</span>
                </div>
              </div>

              {/* 1-Click Buy Action */}
              <Button onClick={handleCheckout} size="lg" className="w-full py-3.5 flex items-center justify-center gap-2">
                <span>Finalizar Pedido com 1-Clique</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
