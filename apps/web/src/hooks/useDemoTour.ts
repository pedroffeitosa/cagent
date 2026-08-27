import { useState } from 'react';
import { MOCK_USER_PROFILES, MOCK_STORE_CONTEXT, Product, UserProfile } from '@cagent/shared';
import { CartItem } from './useCart';
import { MainViewType } from '../types/chat';

interface DemoTourActions {
  setUserProfile: (profile: UserProfile) => void;
  setActiveMainView: (view: MainViewType) => void;
  setIsProfilePopoverOpen: (open: boolean) => void;
  setSelectedCheckoutProduct: (product: Product | null) => void;
  setIsShareModalOpen: (open: boolean) => void;
  setCartItems: (items: CartItem[]) => void;
  handleRunAgent: (query: string) => void;
  setCurrentQuery: (query: string) => void;
}

// Roteiro do tour de pitch de 1-clique (5 passos, ~3min de demo).
export function useDemoTour(actions: DemoTourActions) {
  const [demoStep, setDemoStep] = useState<number>(1);

  const handleSelectDemoStep = (stepId: number) => {
    setDemoStep(stepId);
    switch (stepId) {
      case 1:
        // Passo 1: Perfil Pedro (0m00s - 0m30s)
        actions.setUserProfile(MOCK_USER_PROFILES[0]);
        actions.setActiveMainView('home');
        actions.setIsProfilePopoverOpen(true);
        actions.setSelectedCheckoutProduct(null);
        actions.setIsShareModalOpen(false);
        break;
      case 2: {
        // Passo 2: Busca Chuteira (0m30s - 1m15s)
        actions.setIsProfilePopoverOpen(false);
        actions.setUserProfile(MOCK_USER_PROFILES[0]);
        actions.setSelectedCheckoutProduct(null);
        actions.setIsShareModalOpen(false);
        const queryText = 'Preciso de uma chuteira para jogar em campo de grama sintética no Rio de Janeiro';
        actions.setCurrentQuery(queryText);
        actions.handleRunAgent(queryText);
        break;
      }
      case 3:
        // Passo 3: Batalha Swords (1m15s - 2m00s)
        actions.setIsProfilePopoverOpen(false);
        actions.setSelectedCheckoutProduct(null);
        actions.setIsShareModalOpen(false);
        actions.setCartItems([
          // Chuteira Society Tiempo Legend vs Chuteira de Campo Predator Elite —
          // a dupla que corresponde à narrativa "Nike Mercurial vs Adidas Predator" do tour.
          { product: MOCK_STORE_CONTEXT.catalog[3] || MOCK_STORE_CONTEXT.catalog[0], quantity: 1 },
          { product: MOCK_STORE_CONTEXT.catalog[4] || MOCK_STORE_CONTEXT.catalog[1], quantity: 1 },
        ]);
        actions.setActiveMainView('compare');
        break;
      case 4: {
        // Passo 4: Checkout 1-Clique com Cashback (2m00s - 2m30s)
        actions.setIsProfilePopoverOpen(false);
        actions.setIsShareModalOpen(false);
        // Segue com o "vencedor" da Batalha Swords do Passo 3, para continuidade da narrativa.
        const checkoutItem = MOCK_STORE_CONTEXT.catalog[3] || MOCK_STORE_CONTEXT.catalog[0];
        actions.setSelectedCheckoutProduct(checkoutItem);
        actions.setActiveMainView('home');
        break;
      }
      case 5:
        // Passo 5: Compartilhamento QR Code Mobile (2m30s - 3m00s)
        actions.setIsProfilePopoverOpen(false);
        actions.setSelectedCheckoutProduct(null);
        actions.setIsShareModalOpen(true);
        break;
      default:
        break;
    }
  };

  return { demoStep, handleSelectDemoStep };
}
