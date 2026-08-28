import React from 'react';
import { StoreContext } from '@cagent/shared';
import { Store, Building2, Globe, ArrowLeft, ShieldCheck, Check, Sparkles, ShoppingBag, ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface StoreBootstrapViewProps {
  stores: StoreContext[];
  activeStoreId: string;
  onSelectStore: (storeId: string) => void;
  onBackToChat: () => void;
}

// Metadados só de exibição (selo + cor do logo) por loja — o resto (nome,
// tagline, cashback, cupons, catálogo) vem do StoreContext real, então a
// troca de loja reflete de verdade em toda a app.
const STORE_DISPLAY_META: Record<string, { status: string; logoColor: string }> = {
  'deco-sports-store': { status: 'Loja Principal', logoColor: 'text-primary bg-primary/10 border-primary/30' },
  'nike-brasil-partner': { status: 'Parceiro Oficial', logoColor: 'text-foreground bg-card border-border-strong' },
  'centauro-esportes-partner': { status: 'Parceiro Oficial', logoColor: 'text-red-400 bg-red-500/10 border-red-500/30' },
  'max-titanium-supplements': { status: 'Parceiro de Performance', logoColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
};

export function StoreBootstrapView({ stores, activeStoreId, onSelectStore, onBackToChat }: StoreBootstrapViewProps) {
  return (
    <div className="flex-1 flex flex-col p-8 max-w-5xl mx-auto w-full gap-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">

      {/* Top Navigation Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChat}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-strong transition"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading font-bold text-2xl text-foreground">Rede de Lojas &amp; Parceiros Deco</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Troque de loja ativa e veja o catálogo, cupons e cashback do parceiro em tempo real</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 font-mono-tech font-bold flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          Deco Interoperable Mesh
        </span>
      </div>

      {/* User-Centric Hero Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-background via-card to-background">
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-cyan-400" />
            <h3 className="font-heading font-bold text-lg text-foreground">Ecossistema de Parceiros Integrados</h3>
          </div>
          <p className="text-xs text-foreground leading-relaxed">
            Com o $Agent, seu perfil contextual, histórico e saldo de cashback de <strong>Nike, Centauro e Max Titanium</strong> são unificados em uma única experiência de compra.
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-foreground">
            <Check className="w-4 h-4 text-primary" />
            <span>Cashback Unificado na Carteira</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground">
            <Check className="w-4 h-4 text-primary" />
            <span>Cupons Exclusivos de Grandes Marcas</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground">
            <Check className="w-4 h-4 text-primary" />
            <span>Sincronia Web &amp; App Mobile</span>
          </div>
        </div>
      </div>

      {/* Connected Stores Network */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-bold text-lg text-foreground">Lojas &amp; Marcas Conectadas</h3>

        <div className="flex flex-col gap-4">
          {stores.map((store) => {
            const isCurrent = store.storeId === activeStoreId;
            const meta = STORE_DISPLAY_META[store.storeId] ?? { status: 'Parceiro', logoColor: 'text-foreground bg-card border-border-strong' };

            return (
              <div
                key={store.storeId}
                role={isCurrent ? undefined : 'button'}
                onClick={isCurrent ? undefined : () => onSelectStore(store.storeId)}
                className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition ${
                  isCurrent
                    ? 'bg-card/80 border-primary/40 shadow-xl'
                    : 'bg-background border-border hover:border-border-strong cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${meta.logoColor}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-base text-foreground truncate max-w-[320px]" title={store.config.storeName}>{store.config.storeName}</h4>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono-tech ${
                        isCurrent ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-card text-foreground border border-border'
                      }`}>
                        {isCurrent ? 'Loja Ativa' : meta.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{store.config.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 shrink-0">
                  <div>
                    <span className="text-[10px] text-faint uppercase block font-mono-tech">Cashback</span>
                    <span className="font-mono-tech font-bold text-primary text-sm">{store.config.cashbackPercentage}% de Cashback</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-faint uppercase block font-mono-tech">Cupons Ativos</span>
                    <span className="font-mono-tech font-bold text-amber-400 text-xs">{store.config.activeCoupons.map(c => c.code).join(', ')}</span>
                  </div>

                  {!isCurrent && (
                    <Button
                      onClick={(e) => { e.stopPropagation(); onSelectStore(store.storeId); }}
                      className="gap-1.5 shrink-0"
                      size="sm"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      Trocar para esta loja
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
