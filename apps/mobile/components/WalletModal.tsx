import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserProfile } from '@cagent/shared';
import { ThemeColors, useTheme } from '../theme';

const TOPUP_AMOUNT = 50;

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onAddBalance: (amount: number) => void;
}

export function WalletModal({ isOpen, onClose, userProfile, onAddBalance }: WalletModalProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [showTopUpFeedback, setShowTopUpFeedback] = useState(false);
  const balance = userProfile.walletBalance || 42.5;
  const purchaseHistory = userProfile.purchaseHistory || [];
  const totalCashbackEarned = purchaseHistory.reduce((sum, tx) => sum + tx.cashbackEarned, 0);

  const handleAddBalance = () => {
    onAddBalance(TOPUP_AMOUNT);
    setShowTopUpFeedback(true);
    setTimeout(() => setShowTopUpFeedback(false), 2000);
  };

  return (
    <Modal transparent animationType="fade" visible={isOpen} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>👛 Minha Carteira & Cashback</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>SALDO TOTAL ACUMULADO</Text>
            <Text style={styles.balanceValue}>R$ {balance.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.balanceSubtext}>
              ✨ R$ {totalCashbackEarned.toFixed(2).replace('.', ',')} de cashback gerado em compras via $Agent
            </Text>

            <View style={styles.balanceActions}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddBalance}>
                <Text style={styles.addButtonText}>
                  {showTopUpFeedback ? `✓ + R$ ${TOPUP_AMOUNT},00` : '+ Adicionar Saldo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.historyLabel}>Histórico de Cashback</Text>
          <View style={styles.historyList}>
            {purchaseHistory.length === 0 && (
              <Text style={styles.historyDate}>Nenhuma movimentação ainda.</Text>
            )}
            {purchaseHistory.map((tx) => (
              <View key={tx.id} style={styles.historyRow}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>
                    {tx.amount > 0 ? `Cashback $Agent — ${tx.productName}` : tx.productName}
                  </Text>
                  <Text style={styles.historyDate}>{tx.date}</Text>
                </View>
                <Text style={styles.historyAmount}>+ R$ {tx.cashbackEarned.toFixed(2).replace('.', ',')}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.closeCardButton} onPress={onClose}>
            <Text style={styles.closeCardButtonText}>Fechar Carteira</Text>
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
    balanceCard: {
      backgroundColor: c.background,
      borderColor: `${c.primary}4d`,
      borderWidth: 1,
      borderRadius: 18,
      padding: 16,
      gap: 6,
    },
    balanceLabel: {
      color: c.faint,
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 1,
    },
    balanceValue: {
      color: c.foreground,
      fontSize: 28,
      fontWeight: '800',
    },
    balanceSubtext: {
      color: c.primary,
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 6,
    },
    balanceActions: {
      flexDirection: 'row',
      gap: 8,
      borderTopColor: c.border,
      borderTopWidth: 1,
      paddingTop: 12,
    },
    addButton: {
      flex: 1,
      backgroundColor: c.primary,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
    },
    addButtonText: {
      color: c.primaryForeground,
      fontWeight: '800',
      fontSize: 11,
    },
    historyLabel: {
      color: c.foreground,
      fontWeight: '700',
      fontSize: 12,
    },
    historyList: {
      gap: 8,
    },
    historyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: c.background,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: 10,
    },
    historyInfo: {
      flex: 1,
    },
    historyTitle: {
      color: c.foreground,
      fontSize: 11,
      fontWeight: '600',
    },
    historyDate: {
      color: c.faint,
      fontSize: 9,
      marginTop: 2,
    },
    historyAmount: {
      color: c.primary,
      fontWeight: '800',
      fontSize: 11,
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
