import React, { useState } from 'react';
import { Product, UserProfile } from '@cagent/shared';
import { 
  X, 
  Check, 
  Sparkles, 
  Coins, 
  Gift, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2 
} from 'lucide-react';
import { Button } from './ui/button';

interface ProductCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  userProfile: UserProfile;
}

export function ProductCheckoutModal({
  isOpen,
  onClose,
  product,
  userProfile,
}: ProductCheckoutModalProps) {
  const [isPurchased, setIsPurchased] = useState(false);

  if (!isOpen || !product) return null;

  const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
  const discountAmount = Math.round(product.price * 0.1);
  const finalPrice = product.price - discountAmount;
  const cashbackBonus = product.cashbackReward || Math.round(finalPrice * 0.05);

  const handleCheckout = () => {
    setIsPurchased(true);
    setTimeout(() => {
      setIsPurchased(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-bold text-base text-white">Checkout Assistido pelo $Agent</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isPurchased ? (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-white">Pedido Realizado com Sucesso!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">
                Seu pedido de <strong>{product.name}</strong> foi confirmado. 💰 R$ {cashbackBonus} de cashback foram creditados em sua conta!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs overflow-y-auto custom-scrollbar">
            
            {/* Left Product Preview Column */}
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 relative border border-slate-800">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] tracking-wide uppercase">
                  ✨ Match 100% $Agent
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono-tech">{product.category} • {product.storeName}</span>
                <h4 className="font-heading font-bold text-lg text-white mt-0.5 truncate" title={product.name}>{product.name}</h4>
                <p className="text-slate-400 mt-1 text-xs leading-relaxed">{product.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: $Agent Match Diagnostic & Financial Breakdown */}
            <div className="flex flex-col justify-between gap-6">
              
              {/* Raio-X de Match Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-300 text-xs uppercase tracking-wide">Raio-X de Match do Seu Perfil</span>
                </div>

                <div className="flex flex-col gap-2 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Tamanho:</strong> {userProfile.sizes.clothing} em estoque confirmado.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Orçamento:</strong> R$ {finalPrice} dentro do seu limite de R$ {userProfile.maxBudget || '450'}.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Estilo:</strong> Atende suas preferências de {userProfile.stylePreferences[0]}.</span>
                  </div>
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Preço Original:</span>
                  <span className="line-through font-mono-tech">R$ {originalPrice}</span>
                </div>

                <div className="flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" />
                    Cupom DECO10 (10% OFF):
                  </span>
                  <span className="font-mono-tech">- R$ {discountAmount}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-white">
                  <span className="font-bold text-sm">Preço Final Agêntico:</span>
                  <span className="font-heading font-extrabold text-xl text-emerald-400">R$ {finalPrice}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between text-emerald-300 text-[11px] mt-1 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    Cashback a Receber:
                  </span>
                  <span className="font-mono-tech text-sm text-emerald-400">+ R$ {cashbackBonus}</span>
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
