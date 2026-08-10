import React, { useState } from 'react';
import { Ticket, Gift, Check, ArrowLeft, Sparkles, Copy } from 'lucide-react';
import { MOCK_STORE_CONFIG } from '@cagent/shared';
import { Button } from '../ui/button';

interface CouponsViewProps {
  onBackToChat: () => void;
}

// Metadados de exibição por código — os dados de desconto vêm sempre do mock (fonte única).
const COUPON_META: Record<string, { badge: string; isApplied: boolean; category: string }> = {
  DECO10: { badge: 'Ativo Automaticamente', isApplied: true, category: 'Geral' },
  AGENT50: { badge: 'Primeira Compra', isApplied: false, category: 'Boas-vindas' },
  VIPFLUMESH: { badge: 'Exclusivo VIP', isApplied: false, category: 'Temático' },
  CORRIDA20: { badge: 'Performance', isApplied: false, category: 'Corrida & Maratona' },
};

export function CouponsView({ onBackToChat }: CouponsViewProps) {
  const [couponCode, setCouponCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = MOCK_STORE_CONFIG.activeCoupons.map((c) => ({
    code: c.code,
    discount: c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `R$ ${c.discountValue.toFixed(2).replace('.', ',')} OFF`,
    description: c.description,
    badge: COUPON_META[c.code]?.badge ?? 'Oferta Especial',
    isApplied: COUPON_META[c.code]?.isApplied ?? false,
    category: COUPON_META[c.code]?.category ?? 'Geral',
  }));

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-5xl mx-auto w-full gap-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChat}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            title="Voltar ao Chat"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading font-bold text-2xl text-white">Meus Cupons Exclusivos & Ofertas</h2>
            <p className="text-xs text-slate-400 mt-0.5">Cupons personalizados de marketing direto entre a loja e o cliente</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 font-mono-tech font-bold">
          {coupons.length} Cupons Ativos
        </span>
      </div>

      {/* Redeem Coupon Header Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">Tem um código promocional?</h3>
            <p className="text-xs text-slate-400 mt-0.5">Insira o código do seu lojista para ativar descontos adicionais</p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Digite o código..."
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono-tech text-xs uppercase focus:outline-none focus:border-amber-400 w-full md:w-56"
          />
          <Button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6">
            Resgatar
          </Button>
        </div>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between gap-4 group hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono-tech text-slate-400 uppercase">{c.category}</span>
                <h4 className="font-mono-tech font-extrabold text-2xl text-amber-400 mt-0.5">{c.code}</h4>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
                {c.discount}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 font-mono-tech border border-slate-800">
                {c.badge}
              </span>

              <button
                onClick={() => handleCopy(c.code)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
