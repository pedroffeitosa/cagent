import React, { useState } from 'react';
import { Product, UserProfile } from '@cagent/shared';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, Gift, Coins, CheckCircle2, Swords } from 'lucide-react';
import { Button } from './ui/button';
import { handleImageError } from '../utils/imageFallback';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  userProfile: UserProfile;
  onOpenComparePage: () => void;
  onCheckoutComplete: (payload: { productName: string; amount: number; cashbackEarned: number }) => void;
}

export function CartDrawerModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  userProfile,
  onOpenComparePage,
  onCheckoutComplete,
}: CartDrawerModalProps) {
  const [isPurchased, setIsPurchased] = useState(false);
  // Congela o valor do cashback exibido na tela de sucesso: o carrinho é
  // esvaziado pelo pai assim que a compra é confirmada, então não dá para
  // seguir derivando esse número de `cartItems` (viraria 0 antes do modal fechar).
  const [purchasedCashback, setPurchasedCashback] = useState(0);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * 0.1); // 10% OFF DECO10 coupon
  const finalTotal = Math.max(0, subtotal - discount);
  const cashbackEstimated = Math.round(finalTotal * 0.05);

  const handleCheckout = () => {
    setIsPurchased(true);
    setPurchasedCashback(cashbackEstimated);
    const productName = cartItems.length === 1
      ? cartItems[0].product.name
      : `${cartItems[0].product.name} + ${cartItems.length - 1} ${cartItems.length - 1 === 1 ? 'item' : 'itens'}`;
    onCheckoutComplete({ productName, amount: finalTotal, cashbackEarned: cashbackEstimated });
    setTimeout(() => {
      setIsPurchased(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-end">
      <div className="glass-panel w-full max-w-md h-full border-l border-border shadow-2xl p-6 flex flex-col justify-between text-xs animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-base text-foreground">Meu Carrinho</h3>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={() => {
                  onClose();
                  onOpenComparePage();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary/40 text-primary hover:text-primary text-xs transition font-semibold"
                title="Comparar Atributos dos Itens (Espadas Cruzadas)"
              >
                <Swords className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Comparar Atributos</span>
              </button>
            )}

            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isPurchased ? (
          <div className="my-auto flex flex-col items-center justify-center text-center gap-4 py-12 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-foreground">Compra Concluída com Sucesso!</h3>
              <p className="text-xs text-foreground mt-2 max-w-xs">
                Seu pedido foi processado. 💰 <strong>R$ {purchasedCashback},00</strong> de cashback foram adicionados à sua carteira!
              </p>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center text-center gap-3 py-12 text-faint">
            <ShoppingCart className="w-12 h-12 stroke-[1.5] text-faint" />
            <p className="text-xs text-muted-foreground font-medium">Seu carrinho está vazio no momento.</p>
            <p className="text-[11px] text-faint max-w-xs">Peça sugestões ao $Agent ou clique em "Comprar" em qualquer item da vitrine.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4 flex flex-col gap-3">
            {cartItems.map((item) => (
              <div key={item.product.id} className="p-3 rounded-2xl bg-background border border-border flex gap-3 items-center justify-between">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
                  onError={handleImageError}
                />

                <div className="flex-1 truncate">
                  <span className="font-bold text-foreground text-xs block truncate" title={item.product.name}>
                    {item.product.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono-tech block mt-0.5">
                    R$ {item.product.price} cada
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="p-1 rounded-lg bg-card border border-border text-foreground hover:text-foreground"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono-tech font-bold text-xs px-1 text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="p-1 rounded-lg bg-card border border-border text-foreground hover:text-foreground"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 rounded-lg text-faint hover:text-red-400 transition ml-1"
                    title="Remover Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && !isPurchased && (
          <div className="pt-4 border-t border-border/80 flex flex-col gap-3 shrink-0">
            
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Subtotal:</span>
              <span className="font-mono-tech">R$ {subtotal}</span>
            </div>

            <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
              <span className="flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" />
                Cupom DECO10 (10% OFF):
              </span>
              <span className="font-mono-tech">- R$ {discount}</span>
            </div>

            <div className="flex items-center justify-between text-primary text-xs font-semibold p-2.5 rounded-xl bg-primary/10 border border-primary/30">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-primary" />
                Cashback a Ganhar:
              </span>
              <span className="font-mono-tech font-bold text-sm">+ R$ {cashbackEstimated}</span>
            </div>

            <div className="flex items-center justify-between text-foreground text-base font-bold pt-1">
              <span>Total do Pedido:</span>
              <span className="font-heading text-xl text-primary">R$ {finalTotal}</span>
            </div>

            <Button onClick={handleCheckout} size="lg" className="w-full py-3.5 flex items-center justify-center gap-2 mt-1">
              <span>Finalizar Compra em 1-Clique</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
