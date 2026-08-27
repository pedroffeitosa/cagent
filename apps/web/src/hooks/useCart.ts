import { useState } from 'react';
import { MOCK_STORE_CONTEXT, Product } from '@cagent/shared';

export interface CartItem {
  product: Product;
  quantity: number;
}

export function useCart(onAdd?: () => void) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: MOCK_STORE_CONTEXT.catalog[0], quantity: 1 },
    { product: MOCK_STORE_CONTEXT.catalog[1], quantity: 1 },
  ]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    onAdd?.();
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  return {
    cartItems,
    setCartItems,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveCartItem,
    clearCart,
  };
}
