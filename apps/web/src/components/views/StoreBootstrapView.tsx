import React from 'react';
import { Store, Building2, Globe, ArrowLeft, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface StoreBootstrapViewProps {
  onBackToChat: () => void;
}

export function StoreBootstrapView({ onBackToChat }: StoreBootstrapViewProps) {
  const connectedStores = [
    {
      name: 'Deco Sports & Performance',
      tagline: 'Sua loja principal de artigos esportivos, futebol & corrida',
      cashback: '5% de Cashback',
      coupons: ['DECO10', 'AGENT50', 'VIPFLUMESH'],
      status: 'Loja Atual',
      isCurrent: true,
    },
    {
      name: 'Deco Urban Wear Partner',
      tagline: 'Moda Streetwear & Acessórios Premium',
      cashback: '5% de Cashback',
      coupons: ['URBAN15'],
      status: 'Loja Parceira',
      isCurrent: false,
    },
    {
      name: 'Deco Tech & Wearables',
      tagline: 'Eletrônicos, Smartwatches & Tech de Corrida',
      cashback: '5% de Cashback',
      coupons: ['TECH20'],
      status: 'Loja Parceira',
      isCurrent: false,
    },
  ];

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
            <h2 className="font-heading font-bold text-2xl text-white">Rede de Lojas &amp; Parceiros Deco</h2>
            <p className="text-xs text-slate-400 mt-0.5">Conheça a loja oficial e a rede de parceiros onde seu saldo e cashback são aceitos</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 font-mono-tech font-bold flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          Deco Interoperable Mesh
        </span>
      </div>

      {/* User-Centric Hero Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-cyan-400" />
            <h3 className="font-heading font-bold text-lg text-white">Experiência de Compra Integrada</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Seu perfil de tamanhos, preferências e saldo de cashback funcionam em perfeita harmonia. Acumule pontos e bônus na loja oficial e utilize seu saldo em qualquer loja parceira conectada.
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Cashback Unificado na Carteira</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Cupons Exclusivos do Lojista</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Sincronia Web &amp; App Mobile</span>
          </div>
        </div>
      </div>

      {/* Connected Stores Network */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-bold text-lg text-white">Lojas Conectadas</h3>

        <div className="flex flex-col gap-4">
          {connectedStores.map((s) => (
            <div
              key={s.name}
              className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition ${
                s.isCurrent ? 'bg-slate-900/80 border-emerald-500/40 shadow-xl' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <Building2 className={`w-6 h-6 ${s.isCurrent ? 'text-emerald-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-base text-white truncate max-w-[280px]" title={s.name}>{s.name}</h4>
                    {s.isCurrent && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-tech">
                        Loja Atual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{s.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono-tech">Regra da Loja</span>
                  <span className="font-mono-tech font-bold text-emerald-400 text-sm">{s.cashback}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono-tech">Cupons da Loja</span>
                  <span className="font-mono-tech font-bold text-amber-400 text-xs">{s.coupons.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
