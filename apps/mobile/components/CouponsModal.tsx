import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Coupon } from '@cagent/shared';
import { ThemeColors, useTheme } from '../theme';

interface CouponsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: Coupon[];
  activeCouponCode: string | null;
  onRedeemCoupon: (code: string) => void;
}

export function CouponsModal({ isOpen, onClose, coupons, activeCouponCode, onRedeemCoupon }: CouponsModalProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [couponCode, setCouponCode] = useState('');
  const [redeemed, setRedeemed] = useState(false);

  const displayCoupons = coupons.map((c) => ({
    code: c.code,
    discount: c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `R$ ${c.discountValue.toFixed(2).replace('.', ',')} OFF`,
    description: c.description,
    isApplied: c.code === activeCouponCode,
  }));

  const handleRedeem = () => {
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) return;
    const match = coupons.find((c) => c.code === trimmed);
    if (match) {
      onRedeemCoupon(match.code);
      setRedeemed(true);
    }
    setTimeout(() => {
      setRedeemed(false);
      setCouponCode('');
    }, 2000);
  };

  return (
    <Modal transparent animationType="fade" visible={isOpen} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🎟️ Meus Cupons Exclusivos</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.redeemRow}>
            <TextInput
              style={styles.redeemInput}
              placeholder="Digite o código do cupom..."
              placeholderTextColor={colors.faint}
              value={couponCode}
              onChangeText={(text) => setCouponCode(text.toUpperCase())}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
              <Text style={styles.redeemButtonText}>{redeemed ? '✓' : 'Resgatar'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.couponsList}>
            {displayCoupons.map((c) => (
              <TouchableOpacity
                key={c.code}
                style={styles.couponCard}
                disabled={c.isApplied}
                onPress={() => onRedeemCoupon(c.code)}
              >
                <View style={styles.couponInfo}>
                  <View style={styles.couponHeaderRow}>
                    <Text style={styles.couponCode}>{c.code}</Text>
                    <View style={styles.couponBadge}>
                      <Text style={styles.couponBadgeText}>{c.discount}</Text>
                    </View>
                  </View>
                  <Text style={styles.couponDescription}>{c.description}</Text>
                </View>
                {c.isApplied && (
                  <View style={styles.appliedBadge}>
                    <Text style={styles.appliedBadgeText}>Ativo</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.closeCardButton} onPress={onClose}>
            <Text style={styles.closeCardButtonText}>Fechar Cupons</Text>
          </TouchableOpacity>
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
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    card: {
      width: '100%',
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 20,
      borderColor: c.border,
      borderWidth: 1,
      gap: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: c.border,
      borderBottomWidth: 1,
      paddingBottom: 12,
    },
    headerTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: c.foreground,
    },
    closeButton: {
      padding: 4,
    },
    closeButtonText: {
      color: c.mutedForeground,
      fontSize: 16,
      fontWeight: '700',
    },
    redeemRow: {
      flexDirection: 'row',
      gap: 8,
    },
    redeemInput: {
      flex: 1,
      backgroundColor: c.background,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      color: c.foreground,
      fontSize: 12,
    },
    redeemButton: {
      backgroundColor: '#fbbf24',
      borderRadius: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    redeemButtonText: {
      color: '#1c1300',
      fontWeight: '800',
      fontSize: 12,
    },
    couponsList: {
      gap: 10,
    },
    couponCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundColor: c.background,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 14,
      gap: 10,
    },
    couponInfo: {
      flex: 1,
      gap: 4,
    },
    couponHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    couponCode: {
      color: '#fbbf24',
      fontWeight: '800',
      fontSize: 13,
    },
    couponBadge: {
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
      borderColor: 'rgba(251, 191, 36, 0.2)',
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    couponBadgeText: {
      color: '#fbbf24',
      fontSize: 10,
      fontWeight: '700',
    },
    couponDescription: {
      color: c.mutedForeground,
      fontSize: 11,
      lineHeight: 15,
    },
    appliedBadge: {
      backgroundColor: `${c.primary}33`,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    appliedBadgeText: {
      color: c.primary,
      fontSize: 9,
    },
    closeCardButton: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
    },
    closeCardButtonText: {
      color: c.foreground,
      fontWeight: '700',
      fontSize: 12,
    },
  });
}
