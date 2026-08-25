import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Product, UserProfile } from '@cagent/shared';

export interface CartItem {
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
}

export function CartDrawerModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  userProfile,
  onOpenComparePage,
}: CartDrawerModalProps) {
  const [isPurchased, setIsPurchased] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * 0.1);
  const finalTotal = Math.max(0, subtotal - discount);
  const cashbackEstimated = Math.round(finalTotal * 0.05);

  const handleClose = () => {
    setIsPurchased(false);
    onClose();
  };

  const handleCheckout = () => {
    setIsPurchased(true);
    setTimeout(() => {
      setIsPurchased(false);
      onClose();
    }, 2500);
  };

  return (
    <Modal transparent animationType="slide" visible={isOpen} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🛒 Meu Carrinho</Text>
            <View style={styles.headerActions}>
              {cartItems.length > 0 && (
                <TouchableOpacity
                  style={styles.compareButton}
                  onPress={() => {
                    onClose();
                    onOpenComparePage();
                  }}
                >
                  <Text style={styles.compareButtonText}>⚔️ Comparar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isPurchased ? (
            <View style={styles.centerBox}>
              <Text style={styles.successTitle}>✅ Compra Concluída!</Text>
              <Text style={styles.successText}>
                Seu pedido foi processado. 💰 R$ {cashbackEstimated},00 de cashback foram adicionados à sua carteira!
              </Text>
            </View>
          ) : cartItems.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.emptyTitle}>Seu carrinho está vazio no momento.</Text>
              <Text style={styles.emptyText}>
                Peça sugestões ao $Agent ou toque em "Comprar" em qualquer item da vitrine.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
              {cartItems.map((item) => (
                <View key={item.product.id} style={styles.itemRow}>
                  <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                    <Text style={styles.itemPrice}>R$ {item.product.price} cada</Text>
                  </View>
                  <View style={styles.itemControls}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => onUpdateQuantity(item.product.id, -1)}
                    >
                      <Text style={styles.qtyButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => onUpdateQuantity(item.product.id, 1)}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => onRemoveItem(item.product.id)}
                    >
                      <Text style={styles.removeButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {cartItems.length > 0 && !isPurchased && (
            <View style={styles.footer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>R$ {subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.discountLabel}>🎁 Cupom DECO10 (10% OFF):</Text>
                <Text style={styles.discountValue}>− R$ {discount}</Text>
              </View>
              <View style={styles.cashbackBox}>
                <Text style={styles.cashbackLabel}>🪙 Cashback a Ganhar:</Text>
                <Text style={styles.cashbackValue}>+ R$ {cashbackEstimated}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total do Pedido:</Text>
                <Text style={styles.totalValue}>R$ {finalTotal}</Text>
              </View>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Finalizar Compra em 1-Clique →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#1e293b',
    borderBottomWidth: 1,
    paddingBottom: 14,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  compareButton: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  compareButtonText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: '700',
  },
  centerBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#34d399',
  },
  successText: {
    fontSize: 12,
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  itemsList: {
    maxHeight: 320,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    gap: 10,
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  itemPrice: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qtyButton: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
  },
  qtyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    width: 18,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 4,
    padding: 4,
  },
  removeButtonText: {
    fontSize: 13,
  },
  footer: {
    borderTopColor: '#1e293b',
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 12,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  summaryValue: {
    color: '#e2e8f0',
    fontSize: 12,
  },
  discountLabel: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
  },
  discountValue: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
  },
  cashbackBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.4)',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cashbackLabel: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '600',
  },
  cashbackValue: {
    color: '#34d399',
    fontSize: 13,
    fontWeight: '800',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  totalLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    color: '#34d399',
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutButton: {
    backgroundColor: '#34d399',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  checkoutButtonText: {
    color: '#020617',
    fontWeight: '800',
    fontSize: 13,
  },
});
