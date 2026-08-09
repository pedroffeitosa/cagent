import React from 'react';
import { Store, Building2, Globe, Check, X, ArrowUpRight, Coins } from 'lucide-react';
import { Button } from './ui/button';

interface StoreMeshModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoreMeshModal({ isOpen, onClose }: StoreMeshModalProps) {
  if (!isOpen) return null;

  const stores = [
    {
      name: 'Deco Storefront Mesh (Atual)',
      tagline: 'Loja Oficial do Canal $Agent',
      badge: 'Loja Principal',
      isCurrent: true,
    },
    {
      name: 'Deco Urban Wear Partner',
      tagline: 'Moda Streetwear & Acessórios Premium',
      badge: 'Parceiro Mesh Conectado',
    },
    {
      name: 'Deco Tech & Lifestyle',
      tagline: 'Eletrônicos & Wearables Inteligentes',
      badge: 'Parceiro Mesh Conectado',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6 text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-cyan-400" />
            <h3 className="font-heading font-bold text-base text-white">Rede de Lojas Deco Mesh</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mesh Network Explanation Banner */}
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
          <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-cyan-300 text-xs">Deco Interoperable Mesh Network</h4>
            <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
              Seu saldo de carteira e bônus de cashback podem ser utilizados para realizar compras em qualquer loja parceira da rede Deco Mesh!
            </p>
          </div>
        </div>

        {/* Stores List */}
        <div className="flex flex-col gap-3">
          {stores.map((s, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
              s.isCurrent ? 'bg-slate-950 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <Building2 className={`w-4 h-4 ${s.isCurrent ? 'text-emerald-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">{s.name}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{s.tagline}</span>
                </div>
              </div>

              {s.isCurrent ? (
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-tech shrink-0">
                  Atual
                </span>
              ) : (
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <Button onClick={onClose} variant="secondary" className="w-full">
          Fechar Rede de Lojas
        </Button>

      </div>
    </div>
  );
}
