import React, { useState } from 'react';
import { UserProfile } from '@cagent/shared';
import { Wallet, Coins, Plus, ArrowUpRight, ShieldCheck, ArrowLeft, History } from 'lucide-react';
import { Button } from '../ui/button';

const TOPUP_AMOUNT = 50;

interface WalletViewProps {
  userProfile: UserProfile;
  onBackToChat: () => void;
  onAddBalance: (amount: number) => void;
}

export function WalletView({ userProfile, onBackToChat, onAddBalance }: WalletViewProps) {
  const [showTopUpFeedback, setShowTopUpFeedback] = useState(false);
  const balance = userProfile.walletBalance || 42.50;
  const purchaseHistory = userProfile.purchaseHistory || [];
  const totalCashbackEarned = purchaseHistory.reduce((sum, tx) => sum + tx.cashbackEarned, 0);

  const handleAddBalance = () => {
    onAddBalance(TOPUP_AMOUNT);
    setShowTopUpFeedback(true);
    setTimeout(() => setShowTopUpFeedback(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-5xl mx-auto w-full gap-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChat}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-strong transition"
            title="Voltar ao Chat"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading font-bold text-2xl text-foreground">Minha Carteira &amp; Cashback</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Gerencie seu saldo e bônus de cashback entre a loja e o app mobile</p>
          </div>
        </div>
        
        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-mono-tech font-bold">
          Cashback Ativo: 5%
        </span>
      </div>

      {/* Main Balance Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Available Balance Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-card via-card to-background border border-primary/30 flex flex-col justify-between gap-4 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span className="font-mono-tech uppercase">Saldo Total Disponível</span>
            <Wallet className="w-5 h-5 text-primary" />
          </div>

          <div>
            <span className="font-heading font-extrabold text-4xl text-foreground">
              R$ {balance.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-xs text-primary block mt-2 font-medium">
              ✨ Pronto para uso no checkout 1-clique
            </span>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-border/80">
            <Button onClick={handleAddBalance} size="sm" className="flex-1 gap-1.5 text-xs">
              <Plus className="w-4 h-4" />
              Adicionar Saldo (R$ {TOPUP_AMOUNT},00)
            </Button>
            {showTopUpFeedback && (
              <span className="text-[11px] text-primary font-medium text-center animate-in fade-in">
                ✓ R$ {TOPUP_AMOUNT},00 adicionados ao seu saldo!
              </span>
            )}
          </div>
        </div>

        {/* Accumulated Cashback Card */}
        <div className="p-6 rounded-3xl bg-card/60 border border-border flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span className="font-mono-tech uppercase">Cashback Total Ganho</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <span className="font-heading font-extrabold text-3xl text-amber-400">
              R$ {totalCashbackEarned.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-xs text-muted-foreground block mt-2">
              Gerado em {purchaseHistory.length} {purchaseHistory.length === 1 ? 'compra' : 'compras'} via canal $Agent
            </span>
          </div>

          <div className="text-[11px] text-faint font-mono-tech">
            100% Interoperável na Rede Deco Mesh
          </div>
        </div>

        {/* Loyalty Tier Status Card */}
        <div className="p-6 rounded-3xl bg-card/60 border border-border flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span className="font-mono-tech uppercase">Nível de Fidelidade</span>
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>

          <div>
            <span className="font-heading font-extrabold text-2xl text-foreground">
              {userProfile.badge || 'VIP Emerald'}
            </span>
            <span className="text-xs text-muted-foreground block mt-2">
              Taxa preferencial de 5% cashback em todos os pedidos
            </span>
          </div>

          <div className="text-[11px] text-cyan-400 font-mono-tech font-bold">
            Válido no Web Storefront &amp; App Mobile Expo
          </div>
        </div>

      </div>

      {/* Detailed Transaction History */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-bold text-lg text-foreground">Extrato de Movimentações</h3>
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-border overflow-hidden divide-y divide-border/80 text-xs">
          {purchaseHistory.length === 0 && (
            <div className="p-6 text-center text-faint">Nenhuma movimentação ainda.</div>
          )}
          {purchaseHistory.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-card/40 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-bold text-foreground block text-sm">
                    {tx.amount > 0 ? `Cashback $Agent — ${tx.productName}` : tx.productName}
                  </span>
                  <span className="text-[11px] text-faint font-mono-tech mt-0.5">
                    {tx.date} • {tx.amount > 0 ? 'Cashback' : 'Bônus'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono-tech font-extrabold text-primary text-sm block">
                  + R$ {tx.cashbackEarned.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Confirmado</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
