import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Linking, Share, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { UserProfile, Product, Coupon } from '@cagent/shared';
import { ThemeColors, useTheme } from '../theme';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  queryTitle: string;
  recommendedProducts: Product[];
  activeCoupon: Coupon | null;
}

export function ShareModal({ isOpen, onClose, userProfile, queryTitle, activeCoupon }: ShareModalProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [copied, setCopied] = useState(false);

  const couponLabel = activeCoupon
    ? `${activeCoupon.code} (${activeCoupon.discountType === 'percentage' ? `${activeCoupon.discountValue}% OFF` : `R$ ${activeCoupon.discountValue.toFixed(2).replace('.', ',')} OFF`})`
    : null;
  const shareUrl = `https://cagent.deco.site/share?user=${encodeURIComponent(userProfile.name)}&q=${encodeURIComponent(queryTitle)}`;
  const whatsappMessage = `*Recomendação do $Agent Commerce* 🛍️✨\n\nConfira as sugestões de *${queryTitle}* recomendadas para *${userProfile.name}* no canal agêntico!\n\n${couponLabel ? `🎟️ Cupom Ativo: *${couponLabel}*\n` : ''}🔗 Acesse aqui: ${shareUrl}`;

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
              {couponLabel && (
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>{couponLabel}</Text>
                </View>
              )}
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
      gap: 14,
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
    previewCard: {
      backgroundColor: c.background,
      borderColor: `${c.primary}4d`,
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
      color: c.foreground,
      fontWeight: '700',
      fontSize: 12,
    },
    previewBadge: {
      backgroundColor: `${c.primary}33`,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    previewBadgeText: {
      color: c.primary,
      fontSize: 10,
    },
    previewText: {
      color: c.foreground,
      fontSize: 12,
      lineHeight: 17,
    },
    previewFooter: {
      color: c.mutedForeground,
      fontSize: 10,
      borderTopColor: c.border,
      borderTopWidth: 1,
      paddingTop: 8,
    },
    // Verde oficial do WhatsApp — cor fixa da marca, não segue o tema.
    whatsappButton: {
      backgroundColor: '#059669',
      borderRadius: 14,
      paddingVertical: 13,
      alignItems: 'center',
    },
    whatsappButtonText: {
      color: '#f8fafc',
      fontWeight: '800',
      fontSize: 12,
    },
    nativeShareButton: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
    },
    nativeShareButtonText: {
      color: c.foreground,
      fontWeight: '700',
      fontSize: 12,
    },
    linkRow: {
      flexDirection: 'row',
      gap: 8,
    },
    linkText: {
      flex: 1,
      backgroundColor: c.background,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: c.mutedForeground,
      fontSize: 11,
    },
    copyButton: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copyButtonText: {
      color: c.primary,
      fontWeight: '700',
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
