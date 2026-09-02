import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Coupon, Product, UserProfile } from '@cagent/shared';
import { ThemeColors, useTheme } from '../theme';

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
  onCheckoutComplete: (payload: { productName: string; amount: number; cashbackEarned: number }) => void;
  activeCoupon: Coupon | null;
  cashbackPercentage: number;
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
  activeCoupon,
  cashbackPercentage,
}: CartDrawerModalProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [isPurchased, setIsPurchased] = useState(false);
  // Congela o cashback exibido na tela de sucesso: o carrinho é esvaziado
  // pelo pai assim que a compra é confirmada, então não dá para seguir
  // derivando esse número de `cartItems` (viraria 0 antes do modal fechar).
  const [purchasedCashback, setPurchasedCashback] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = !activeCoupon
    ? 0
    : activeCoupon.discountType === 'percentage'
      ? Math.round(subtotal * (activeCoupon.discountValue / 100))
      : Math.min(activeCoupon.discountValue, subtotal);
  const finalTotal = Math.max(0, subtotal - discount);
  const cashbackEstimated = Math.round(finalTotal * (cashbackPercentage / 100));

  const handleClose = () => {
    setIsPurchased(false);
    onClose();
  };

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
                Seu pedido foi processado. 💰 R$ {purchasedCashback},00 de cashback foram adicionados à sua carteira!
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
              {activeCoupon && (
                <View style={styles.summaryRow}>
                  <Text style={styles.discountLabel}>
                    🎁 Cupom {activeCoupon.code} ({activeCoupon.discountType === 'percentage' ? `${activeCoupon.discountValue}% OFF` : `R$ ${activeCoupon.discountValue} OFF`}):
                  </Text>
                  <Text style={styles.discountValue}>− R$ {discount}</Text>
                </View>
              )}
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

function getStyles(c: ThemeColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: `${c.background}d9`,
      justifyContent: 'flex-end',
    },
    drawer: {
      backgroundColor: c.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: '85%',
      borderColor: c.border,
      borderWidth: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: c.border,
      borderBottomWidth: 1,
      paddingBottom: 14,
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: c.foreground,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    compareButton: {
      backgroundColor: c.card,
      borderColor: `${c.primary}66`,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    },
    compareButtonText: {
      color: c.primary,
      fontSize: 11,
      fontWeight: '700',
    },
    closeButton: {
      padding: 4,
    },
    closeButtonText: {
      color: c.mutedForeground,
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
      color: c.primary,
    },
    successText: {
      fontSize: 12,
      color: c.foreground,
      textAlign: 'center',
      lineHeight: 18,
      paddingHorizontal: 12,
    },
    emptyTitle: {
      fontSize: 13,
      color: c.foreground,
      fontWeight: '600',
    },
    emptyText: {
      fontSize: 11,
      color: c.faint,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    itemsList: {
      maxHeight: 320,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.background,
      borderColor: c.border,
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
      color: c.foreground,
    },
    itemPrice: {
      fontSize: 10,
      color: c.mutedForeground,
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
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyButtonText: {
      color: c.foreground,
      fontSize: 14,
      fontWeight: '700',
    },
    qtyText: {
      color: c.foreground,
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
      borderTopColor: c.border,
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
      color: c.mutedForeground,
      fontSize: 12,
    },
    summaryValue: {
      color: c.foreground,
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
      backgroundColor: `${c.primary}22`,
      borderColor: `${c.primary}4d`,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    cashbackLabel: {
      color: c.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    cashbackValue: {
      color: c.primary,
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
      color: c.foreground,
      fontSize: 14,
      fontWeight: '700',
    },
    totalValue: {
      color: c.primary,
      fontSize: 18,
      fontWeight: '800',
    },
    checkoutButton: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 4,
    },
    checkoutButtonText: {
      color: c.primaryForeground,
      fontWeight: '800',
      fontSize: 13,
    },
  });
}
