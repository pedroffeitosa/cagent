import { useState } from 'react';
import { MOCK_USER_PROFILES, UserProfile } from '@cagent/shared';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);

  // Fecha o loop do cashback: credita o saldo real e registra a movimentação
  // no extrato, para que Carteira/Header reflitam a compra imediatamente.
  const creditCashback = (payload: { productName: string; amount: number; cashbackEarned: number }) => {
    setUserProfile(prev => ({
      ...prev,
      walletBalance: Math.round(((prev.walletBalance || 0) + payload.cashbackEarned) * 100) / 100,
      purchaseHistory: [
        {
          id: `order-${Date.now()}`,
          productName: payload.productName,
          date: 'Agora',
          amount: payload.amount,
          cashbackEarned: payload.cashbackEarned,
        },
        ...(prev.purchaseHistory || []),
      ],
    }));
  };

  const addBalance = (amount: number) => {
    setUserProfile(prev => ({
      ...prev,
      walletBalance: Math.round(((prev.walletBalance || 0) + amount) * 100) / 100,
    }));
  };

  return { userProfile, setUserProfile, creditCashback, addBalance };
}
