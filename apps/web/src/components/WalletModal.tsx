import React from 'react';
import { UserProfile } from '@cagent/shared';
import { Wallet, Coins, ArrowUpRight, Plus, X, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export function WalletModal({ isOpen, onClose, userProfile }: WalletModalProps) {
  if (!isOpen) return null;

  const balance = userProfile.walletBalance || 42.50;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6 text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-bold text-base text-white">Minha Carteira & Cashback</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono-tech text-[10px] uppercase tracking-wider">Saldo Total Acumulado</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>

          <div>
            <span className="font-heading font-extrabold text-3xl text-white">
              R$ {balance.toFixed(2)}
            </span>
            <span className="text-[11px] text-emerald-400 block mt-1 font-medium">
              ✨ R$ 26,50 de cashback gerado em compras via $Agent
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex gap-2 mt-1">
            <Button size="sm" className="flex-1 gap-1.5 text-[11px]">
              <Plus className="w-3.5 h-3.5" />
              Adicionar Saldo
            </Button>
            <button className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold transition flex items-center gap-1">
              <span>Extrato</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Cashback Activity */}
        <div className="flex flex-col gap-2.5">
          <span className="font-bold text-slate-300 text-xs">Histórico de Cashback</span>

          <div className="flex flex-col gap-2">
            {[
              { title: 'Cashback $Agent — Vestido Linho', date: 'Hoje, 14:21', amount: '+ R$ 16,00' },
              { title: 'Cashback $Agent — Camiseta Tech', date: 'Ontem', amount: '+ R$ 10,50' },
              { title: 'Recarga em Conta', date: '05 de Ago', amount: '+ R$ 16,00' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-medium text-white block">{item.title}</span>
                  <span className="text-[10px] text-slate-500 block font-mono-tech">{item.date}</span>
                </div>
                <span className="font-mono-tech font-bold text-emerald-400 text-xs">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={onClose} variant="secondary" className="w-full">
          Fechar Carteira
        </Button>

      </div>
    </div>
  );
}
