import React, { useState } from 'react';
import { Ticket, Gift, Check, X, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface CouponsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CouponsModal({ isOpen, onClose }: CouponsModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [redeemed, setRedeemed] = useState(false);

  if (!isOpen) return null;

  const coupons = [
    {
      code: 'DECO10',
      discount: '10% OFF',
      description: 'Desconto exclusivo no canal agêntico $Agent em todas as compras.',
      badge: 'Aplicado Automaticamente',
      isApplied: true,
    },
    {
      code: 'AGENT50',
      discount: 'R$ 50,00 OFF',
      description: 'Bônus especial no primeiro pedido utilizando o assistente $Agent.',
      badge: 'Disponível',
      isApplied: false,
    },
  ];

  const handleRedeem = () => {
    if (!couponCode.trim()) return;
    setRedeemed(true);
    setTimeout(() => {
      setRedeemed(false);
      setCouponCode('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6 text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-base text-white">Meus Cupons Exclusivos</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Coupon Redeem Box */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Digite o código do cupom..."
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono-tech text-xs uppercase focus:outline-none focus:border-amber-400"
          />
          <Button onClick={handleRedeem} className="px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold">
            {redeemed ? <Check className="w-4 h-4 stroke-[3]" /> : 'Resgatar'}
          </Button>
        </div>

        {/* Coupons List */}
        <div className="flex flex-col gap-3">
          {coupons.map((c) => (
            <div key={c.code} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 relative overflow-hidden">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-tech font-extrabold text-sm text-amber-400">{c.code}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
                    {c.discount}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">{c.description}</p>
              </div>

              {c.isApplied && (
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-tech shrink-0">
                  Ativo
                </span>
              )}
            </div>
          ))}
        </div>

        <Button onClick={onClose} variant="secondary" className="w-full">
          Fechar Cupons
        </Button>

      </div>
    </div>
  );
}
