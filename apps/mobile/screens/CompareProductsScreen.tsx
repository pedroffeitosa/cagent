import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Product, UserProfile, computeProductMatchDetails } from '@cagent/shared';
import { ThemeColors, useTheme } from '../theme';

interface CompareProductsScreenProps {
  products: Product[];
  userProfile: UserProfile;
  cashbackPercentage: number;
  onBackToCart: () => void;
  onSelectProductToBuy: (product: Product) => void;
}

export function CompareProductsScreen({
  products,
  userProfile,
  cashbackPercentage,
  onBackToCart,
  onSelectProductToBuy,
}: CompareProductsScreenProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>⚔️</Text>
        <Text style={styles.emptyTitle}>Nenhum item para comparar</Text>
        <Text style={styles.emptyText}>
          Adicione 2 ou mais produtos ao carrinho para comparar seus atributos com o $Agent.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={onBackToCart}>
          <Text style={styles.backButtonText}>Voltar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const bestMatch = products.reduce((best, p) =>
    computeProductMatchDetails(p, userProfile).score > computeProductMatchDetails(best, userProfile).score ? p : best
  , products[0]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToCart} style={styles.backIconButton}>
          <Text style={styles.backIconText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚔️ Comparador Agêntico de Atributos</Text>
        <Text style={styles.headerSubtitle}>
          Batalha de especificações cruzadas com seu perfil contextual
        </Text>
      </View>

      <View style={styles.verdictBox}>
        <Text style={styles.verdictTitle}>✨ Veredito do $Agent para {userProfile.name}</Text>
        <Text style={styles.verdictText}>
          Comparando os atributos com seu perfil (tamanho {userProfile.sizes.clothing}, teto R$ {userProfile.maxBudget || 450}),
          o {bestMatch.name} é o que melhor combina com você.
        </Text>
      </View>

      {products.map((product) => {
        const matchScore = computeProductMatchDetails(product, userProfile).score;
        return (
        <View key={product.id} style={styles.card}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
            <View style={styles.storeTag}>
              <Text style={styles.storeTagText}>{product.storeName}</Text>
            </View>
          </View>

          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

          <View style={styles.specsBox}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Preço:</Text>
              <Text style={styles.specValueStrong}>R$ {product.price}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Cashback Ganho:</Text>
              <Text style={styles.specValueGreen}>
                + R$ {product.cashbackReward || Math.round(product.price * (cashbackPercentage / 100))}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Tamanhos Disponíveis:</Text>
              <Text style={styles.specValue}>{product.availableSizes.join(', ')}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Compatibilidade Perfil:</Text>
              <Text style={matchScore >= 40 ? styles.specValueGreen : styles.specValueWarn}>
                {matchScore >= 40 ? '✓' : '✕'} Match {matchScore}%
              </Text>
            </View>

            {product.technicalSpecs?.material && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Material:</Text>
                <Text style={styles.specValue}>{product.technicalSpecs.material}</Text>
              </View>
            )}
            {product.technicalSpecs?.fit && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Ajuste / Pisada:</Text>
                <Text style={styles.specValue}>{product.technicalSpecs.fit}</Text>
              </View>
            )}
            {product.technicalSpecs?.cleatType && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Trava:</Text>
                <Text style={styles.specValue}>{product.technicalSpecs.cleatType}</Text>
              </View>
            )}
            {product.technicalSpecs?.support && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Suporte:</Text>
                <Text style={styles.specValue}>{product.technicalSpecs.support}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.chooseButton} onPress={() => onSelectProductToBuy(product)}>
            <Text style={styles.chooseButtonText}>🛍️ Escolher Este Produto</Text>
          </TouchableOpacity>
        </View>
        );
      })}
    </ScrollView>
  );
}

function getStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      padding: 16,
      gap: 16,
    },
    emptyContainer: {
      flex: 1,
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      gap: 12,
    },
    emptyIcon: {
      fontSize: 40,
    },
    emptyTitle: {
      color: c.foreground,
      fontSize: 18,
      fontWeight: '800',
    },
    emptyText: {
      color: c.mutedForeground,
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 18,
    },
    backButton: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginTop: 8,
    },
    backButtonText: {
      color: c.foreground,
      fontWeight: '700',
      fontSize: 12,
    },
    header: {
      gap: 4,
      borderBottomColor: c.border,
      borderBottomWidth: 1,
      paddingBottom: 14,
    },
    backIconButton: {
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    backIconText: {
      color: c.mutedForeground,
      fontSize: 12,
      fontWeight: '600',
    },
    headerTitle: {
      color: c.foreground,
      fontSize: 20,
      fontWeight: '800',
    },
    headerSubtitle: {
      color: c.mutedForeground,
      fontSize: 11,
    },
    verdictBox: {
      backgroundColor: c.card,
      borderColor: `${c.primary}4d`,
      borderWidth: 1,
      borderRadius: 18,
      padding: 14,
      gap: 6,
    },
    verdictTitle: {
      color: c.primary,
      fontWeight: '700',
      fontSize: 13,
    },
    verdictText: {
      color: c.foreground,
      fontSize: 12,
      lineHeight: 18,
    },
    card: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 22,
      padding: 16,
      gap: 12,
    },
    imageWrapper: {
      aspectRatio: 4 / 3,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: c.elevated,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    storeTag: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: `${c.background}cc`,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    storeTagText: {
      color: c.foreground,
      fontSize: 10,
    },
    category: {
      color: c.mutedForeground,
      fontSize: 10,
      textTransform: 'uppercase',
    },
    name: {
      color: c.foreground,
      fontSize: 15,
      fontWeight: '700',
      marginTop: -6,
    },
    specsBox: {
      borderTopColor: c.border,
      borderTopWidth: 1,
      borderBottomColor: c.border,
      borderBottomWidth: 1,
      paddingVertical: 12,
      gap: 10,
    },
    specRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    specLabel: {
      color: c.mutedForeground,
      fontSize: 11,
    },
    specValue: {
      color: c.foreground,
      fontSize: 11,
      flexShrink: 1,
      textAlign: 'right',
    },
    specValueStrong: {
      color: c.foreground,
      fontSize: 13,
      fontWeight: '800',
    },
    specValueGreen: {
      color: c.primary,
      fontSize: 11,
      fontWeight: '700',
    },
    specValueWarn: {
      color: '#f87171',
      fontSize: 11,
      fontWeight: '700',
    },
    chooseButton: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 13,
      alignItems: 'center',
    },
    chooseButtonText: {
      color: c.primaryForeground,
      fontWeight: '800',
      fontSize: 12,
    },
  });
}
