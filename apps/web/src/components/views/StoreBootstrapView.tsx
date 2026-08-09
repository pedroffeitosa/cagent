import React from 'react';
import { Store, Building2, Globe, ArrowLeft, ShieldCheck, Check, Sparkles, ShoppingBag } from 'lucide-react';
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
      status: 'Loja Principal',
      isCurrent: true,
      logoColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      name: 'Nike Brasil Official Partner',
      tagline: 'Moda Esportiva, Tênis Pegasus Corrida & Chuteiras Tiempo/Mercurial',
      cashback: '5% de Cashback',
      coupons: ['NIKE10', 'DECO10'],
      status: 'Parceiro Oficial',
      isCurrent: false,
      logoColor: 'text-white bg-slate-900 border-slate-700',
    },
    {
      name: 'Centauro Esportes Partner',
      tagline: 'Artigos Esportivos, Camisas Oficiais de Time (Fluminense FC) & Bolas',
      cashback: '5% de Cashback',
      coupons: ['CENTAURO15', 'AGENT50'],
      status: 'Parceiro Oficial',
      isCurrent: false,
      logoColor: 'text-red-400 bg-red-500/10 border-red-500/30',
    },
    {
      name: 'Max Titanium Supplements',
      tagline: 'Suplementação Esportiva, Whey Protein, Creatina & Pré-Treino Fit',
      cashback: '7% de Cashback',
      coupons: ['MAXFIT20', 'VIPFLUMESH'],
      status: 'Parceiro de Performance',
      isCurrent: false,
      logoColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
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
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading font-bold text-2xl text-white">Rede de Lojas &amp; Parceiros Deco</h2>
            <p className="text-xs text-slate-400 mt-0.5">Conheça as marcas parceiras oficiais onde seu saldo e cashback são aceitos em 1-clique</p>
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
            <h3 className="font-heading font-bold text-lg text-white">Ecossistema de Parceiros Integrados</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Com o $Agent, seu perfil contextual, histórico e saldo de cashback de <strong>Nike, Centauro e Max Titanium</strong> são unificados em uma única experiência de compra.
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Cashback Unificado na Carteira</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Cupons Exclusivos de Grandes Marcas</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Sincronia Web &amp; App Mobile</span>
          </div>
        </div>
      </div>

      {/* Connected Stores Network */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-bold text-lg text-white">Lojas &amp; Marcas Conectadas</h3>

        <div className="flex flex-col gap-4">
          {connectedStores.map((s) => (
            <div
              key={s.name}
              className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition ${
                s.isCurrent ? 'bg-slate-900/80 border-emerald-500/40 shadow-xl' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${s.logoColor}`}>
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-base text-white truncate max-w-[320px]" title={s.name}>{s.name}</h4>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono-tech ${
                      s.isCurrent ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{s.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono-tech">Cashback</span>
                  <span className="font-mono-tech font-bold text-emerald-400 text-sm">{s.cashback}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono-tech">Cupons Ativos</span>
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
