import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Linking, Share, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { UserProfile, Product } from '@cagent/shared';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  queryTitle: string;
  recommendedProducts: Product[];
}

export function ShareModal({ isOpen, onClose, userProfile, queryTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://cagent.deco.site/share?user=${encodeURIComponent(userProfile.name)}&q=${encodeURIComponent(queryTitle)}`;
  const whatsappMessage = `*Recomendação do $Agent Commerce* 🛍️✨\n\nConfira as sugestões de *${queryTitle}* recomendadas para *${userProfile.name}* no canal agêntico!\n\n🎟️ Cupom Ativo: *DECO10* (10% OFF)\n🔗 Acesse aqui: ${shareUrl}`;

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`);
  };

  const handleNativeShare = () => {
    Share.share({ message: whatsappMessage, url: shareUrl });
  };

  return (
    <Modal transparent animationType="fade" visible={isOpen} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📤 Compartilhar Busca Agêntica</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewCard}>
            <View style={styles.previewHeaderRow}>
              <Text style={styles.previewTitle}>✨ $Agent Context Card</Text>
              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeText}>DECO10 • 10% OFF</Text>
              </View>
            </View>
            <Text style={styles.previewText}>
              Recomendações de "{queryTitle}" criadas para {userProfile.name}.
            </Text>
            <Text style={styles.previewFooter}>
              🎁 Inclui cupom promocional ativo e pontos de cashback para amigos.
            </Text>
          </View>

          <TouchableOpacity style={styles.whatsappButton} onPress={handleOpenWhatsApp}>
            <Text style={styles.whatsappButtonText}>💬 Compartilhar no WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nativeShareButton} onPress={handleNativeShare}>
            <Text style={styles.nativeShareButtonText}>📲 Mais opções de compartilhamento</Text>
          </TouchableOpacity>

          <View style={styles.linkRow}>
            <Text style={styles.linkText} numberOfLines={1}>{shareUrl}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
              <Text style={styles.copyButtonText}>{copied ? '✓' : 'Copiar'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeCardButton} onPress={onClose}>
            <Text style={styles.closeCardButtonText}>Fechar</Text>
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
    gap: 14,
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
  previewCard: {
    backgroundColor: '#020617',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  previewBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  previewBadgeText: {
    color: '#6ee7b7',
    fontSize: 10,
  },
  previewText: {
    color: '#e2e8f0',
    fontSize: 12,
    lineHeight: 17,
  },
  previewFooter: {
    color: '#94a3b8',
    fontSize: 10,
    borderTopColor: '#1e293b',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  whatsappButton: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  whatsappButtonText: {
    color: '#020617',
    fontWeight: '800',
    fontSize: 12,
  },
  nativeShareButton: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nativeShareButtonText: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 12,
  },
  linkRow: {
    flexDirection: 'row',
    gap: 8,
  },
  linkText: {
    flex: 1,
    backgroundColor: '#020617',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#94a3b8',
    fontSize: 11,
  },
  copyButton: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    color: '#34d399',
    fontWeight: '700',
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
