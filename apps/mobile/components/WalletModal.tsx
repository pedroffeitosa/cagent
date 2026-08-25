import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserProfile } from '@cagent/shared';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

const CASHBACK_HISTORY = [
  { title: 'Cashback $Agent — Vestido Linho', date: 'Hoje, 14:21', amount: '+ R$ 16,00' },
  { title: 'Cashback $Agent — Camiseta Tech', date: 'Ontem', amount: '+ R$ 10,50' },
  { title: 'Recarga em Conta', date: '05 de Ago', amount: '+ R$ 16,00' },
];

export function WalletModal({ isOpen, onClose, userProfile }: WalletModalProps) {
  const balance = userProfile.walletBalance || 42.5;

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
              ✨ R$ 26,50 de cashback gerado em compras via $Agent
            </Text>

            <View style={styles.balanceActions}>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Adicionar Saldo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statementButton}>
                <Text style={styles.statementButtonText}>Extrato ↗</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.historyLabel}>Histórico de Cashback</Text>
          <View style={styles.historyList}>
            {CASHBACK_HISTORY.map((item, idx) => (
              <View key={idx} style={styles.historyRow}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <Text style={styles.historyAmount}>{item.amount}</Text>
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
  balanceCard: {
    backgroundColor: '#020617',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  balanceLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  balanceValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  balanceSubtext: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopColor: '#1e293b',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#34d399',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#020617',
    fontWeight: '800',
    fontSize: 11,
  },
  statementButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statementButtonText: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 11,
  },
  historyLabel: {
    color: '#cbd5e1',
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
    backgroundColor: '#020617',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  historyDate: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
  },
  historyAmount: {
    color: '#34d399',
    fontWeight: '800',
    fontSize: 11,
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
