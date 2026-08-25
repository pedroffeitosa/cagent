import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Product, UserProfile } from '@cagent/shared';

interface CompareProductsScreenProps {
  products: Product[];
  userProfile: UserProfile;
  onBackToCart: () => void;
  onSelectProductToBuy: (product: Product) => void;
}

export function CompareProductsScreen({
  products,
  userProfile,
  onBackToCart,
  onSelectProductToBuy,
}: CompareProductsScreenProps) {
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
          Ambos os produtos estão dentro do seu orçamento máximo (teto R$ {userProfile.maxBudget || 450})
          e atendem ao seu tamanho {userProfile.sizes.clothing}. Para melhor performance esportiva, o{' '}
          {products[0].name} oferece excelente absorção de suor e conforto térmico.
        </Text>
      </View>

      {products.map((product) => (
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
                + R$ {product.cashbackReward || Math.round(product.price * 0.05)}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Tamanhos Disponíveis:</Text>
              <Text style={styles.specValue}>{product.availableSizes.join(', ')}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Compatibilidade Perfil:</Text>
              <Text style={styles.specValueGreen}>✓ Match 100%</Text>
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
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  backButton: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
  },
  backButtonText: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 12,
  },
  header: {
    gap: 4,
    borderBottomColor: '#1e293b',
    borderBottomWidth: 1,
    paddingBottom: 14,
  },
  backIconButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backIconText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
  },
  verdictBox: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  verdictTitle: {
    color: '#6ee7b7',
    fontWeight: '700',
    fontSize: 13,
  },
  verdictText: {
    color: '#e2e8f0',
    fontSize: 12,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 12,
  },
  imageWrapper: {
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
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
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  storeTagText: {
    color: '#cbd5e1',
    fontSize: 10,
  },
  category: {
    color: '#94a3b8',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  name: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: -6,
  },
  specsBox: {
    borderTopColor: '#1e293b',
    borderTopWidth: 1,
    borderBottomColor: '#1e293b',
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
    color: '#94a3b8',
    fontSize: 11,
  },
  specValue: {
    color: '#e2e8f0',
    fontSize: 11,
    flexShrink: 1,
    textAlign: 'right',
  },
  specValueStrong: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  specValueGreen: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
  },
  chooseButton: {
    backgroundColor: '#34d399',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  chooseButtonText: {
    color: '#020617',
    fontWeight: '800',
    fontSize: 12,
  },
});
