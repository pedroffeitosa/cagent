import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface CouponsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUPONS = [
  {
    code: 'DECO10',
    discount: '10% OFF',
    description: 'Desconto exclusivo no canal agêntico $Agent em todas as compras.',
    isApplied: true,
  },
  {
    code: 'AGENT50',
    discount: 'R$ 50,00 OFF',
    description: 'Bônus especial no primeiro pedido utilizando o assistente $Agent.',
    isApplied: false,
  },
];

export function CouponsModal({ isOpen, onClose }: CouponsModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [redeemed, setRedeemed] = useState(false);

  const handleRedeem = () => {
    if (!couponCode.trim()) return;
    setRedeemed(true);
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
              placeholderTextColor="#64748b"
              value={couponCode}
              onChangeText={(text) => setCouponCode(text.toUpperCase())}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
              <Text style={styles.redeemButtonText}>{redeemed ? '✓' : 'Resgatar'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.couponsList}>
            {COUPONS.map((c) => (
              <View key={c.code} style={styles.couponCard}>
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
              </View>
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 20,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#1e293b',
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '700',
  },
  redeemRow: {
    flexDirection: 'row',
    gap: 8,
  },
  redeemInput: {
    flex: 1,
    backgroundColor: '#020617',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
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
    color: '#020617',
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
    backgroundColor: '#020617',
    borderColor: '#1e293b',
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
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15,
  },
  appliedBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  appliedBadgeText: {
    color: '#6ee7b7',
    fontSize: 9,
  },
  closeCardButton: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeCardButtonText: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 12,
  },
});
