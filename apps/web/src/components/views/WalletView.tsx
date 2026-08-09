import React from 'react';
import { UserProfile } from '@cagent/shared';
import { Wallet, Coins, Plus, ArrowUpRight, ShieldCheck, ArrowLeft, History } from 'lucide-react';
import { Button } from '../ui/button';

interface WalletViewProps {
  userProfile: UserProfile;
  onBackToChat: () => void;
}

export function WalletView({ userProfile, onBackToChat }: WalletViewProps) {
  const balance = userProfile.walletBalance || 42.50;

  return (
    <div className="flex-1 flex flex-col p-8 max-w-5xl mx-auto w-full gap-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      
      {/* Top Header Navigation */}
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
            <h2 className="font-heading font-bold text-2xl text-white">Minha Carteira & Cashback</h2>
            <p className="text-xs text-slate-400 mt-0.5">Gerencie seu saldo e bônus de cashback entre a loja e o app mobile</p>
          </div>
        </div>
        
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-tech font-bold">
          Cashback Ativo: 5%
        </span>
      </div>

      {/* Main Balance Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Available Balance Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col justify-between gap-4 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono-tech uppercase">Saldo Total Disponível</span>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>

          <div>
            <span className="font-heading font-extrabold text-4xl text-white">
              R$ {balance.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-xs text-emerald-400 block mt-2 font-medium">
              ✨ Pronto para uso no checkout 1-clique
            </span>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-800/80">
            <Button size="sm" className="flex-1 gap-1.5 text-xs">
              <Plus className="w-4 h-4" />
              Adicionar Saldo
            </Button>
          </div>
        </div>

        {/* Accumulated Cashback Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono-tech uppercase">Cashback Total Ganho</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <span className="font-heading font-extrabold text-3xl text-amber-400">
              R$ 26,50
            </span>
            <span className="text-xs text-slate-400 block mt-2">
              Gerado em 3 compras via canal $Agent
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono-tech">
            100% Interoperável na Rede Deco Mesh
          </div>
        </div>

        {/* Loyalty Tier Status Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono-tech uppercase">Nível de Fidelidade</span>
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>

          <div>
            <span className="font-heading font-extrabold text-2xl text-white">
              VIP {userProfile.badge || 'Emerald'}
            </span>
            <span className="text-xs text-slate-400 block mt-2">
              Taxa preferencial de 5% cashback em todos os pedidos
            </span>
          </div>

          <div className="text-[11px] text-cyan-400 font-mono-tech font-bold">
            Válido no Web Storefront & App Mobile Expo
          </div>
        </div>

      </div>

      {/* Detailed Transaction History */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <h3 className="font-heading font-bold text-lg text-white">Extrato de Movimentações</h3>
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80 text-xs">
          {[
            { id: 'tx-1', title: 'Cashback $Agent — Vestido Leve de Linho', date: 'Hoje, 14:21', type: 'Cashback', amount: '+ R$ 16,00', status: 'Confirmado' },
            { id: 'tx-2', title: 'Cashback $Agent — Camiseta Tech Anti-Suor', date: 'Ontem, 18:40', type: 'Cashback', amount: '+ R$ 10,50', status: 'Confirmado' },
            { id: 'tx-3', title: 'Recarga em Conta via Pix', date: '05 de Ago', type: 'Recarga', amount: '+ R$ 16,00', status: 'Concluído' },
          ].map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="font-bold text-white block text-sm">{tx.title}</span>
                  <span className="text-[11px] text-slate-500 font-mono-tech mt-0.5">{tx.date} • {tx.type}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono-tech font-extrabold text-emerald-400 text-sm block">{tx.amount}</span>
                <span className="text-[10px] text-slate-400 font-medium">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
