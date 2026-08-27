import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import {
  MOCK_USER_PROFILES,
  MOCK_STORE_CONTEXT,
  UserProfile,
  Product,
  AgentResponsePayload,
  runLocalRuleEngine
} from '@cagent/shared';
import { CartDrawerModal, CartItem } from './components/CartDrawerModal';
import { WalletModal } from './components/WalletModal';
import { CouponsModal } from './components/CouponsModal';
import { ShareModal } from './components/ShareModal';
import { CompareProductsScreen } from './screens/CompareProductsScreen';
import { ThemeProvider, ThemeColors, THEME_LABELS, useTheme } from './theme';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { colors, themePreset, cycleTheme } = useTheme();
  const styles = getStyles(colors);

  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [agentResponse, setAgentResponse] = useState<AgentResponsePayload | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [screen, setScreen] = useState<'home' | 'compare'>('home');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isCouponsModalOpen, setIsCouponsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const cartQuantityTotal = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  // Fecha o loop do cashback: credita o saldo real e registra a movimentação no extrato.
  const handlePurchaseComplete = (payload: { productName: string; amount: number; cashbackEarned: number }) => {
    setUserProfile(prev => ({
      ...prev,
      walletBalance: Math.round(((prev.walletBalance || 0) + payload.cashbackEarned) * 100) / 100,
      purchaseHistory: [
        {
          id: `order-${Date.now()}`,
          productName: payload.productName,
          date: 'Agora',
          amount: payload.amount,
          cashbackEarned: payload.cashbackEarned,
        },
        ...(prev.purchaseHistory || []),
      ],
    }));
  };

  const handleCartCheckoutComplete = (payload: { productName: string; amount: number; cashbackEarned: number }) => {
    handlePurchaseComplete(payload);
    setCartItems([]);
  };

  const handleAddBalance = (amount: number) => {
    setUserProfile(prev => ({
      ...prev,
      walletBalance: Math.round(((prev.walletBalance || 0) + amount) * 100) / 100,
    }));
  };

  const activeProductIds = agentResponse?.recommendedProductIds;
  const displayedProducts = activeProductIds
    ? MOCK_STORE_CONTEXT.catalog.filter(p => activeProductIds.includes(p.id))
    : MOCK_STORE_CONTEXT.catalog;

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    const result = runLocalRuleEngine({
      userQuery: query,
      userProfile: userProfile,
      storeContext: MOCK_STORE_CONTEXT,
    });
    setAgentResponse(result);
  };

  const handleCheckout = () => {
    if (selectedProduct) {
      const discountAmount = Math.round(selectedProduct.price * 0.1);
      const finalPrice = selectedProduct.price - discountAmount;
      const cashbackBonus = selectedProduct.cashbackReward || Math.round(finalPrice * 0.05);
      handlePurchaseComplete({ productName: selectedProduct.name, amount: finalPrice, cashbackEarned: cashbackBonus });
    }
    setIsPurchased(true);
    setTimeout(() => {
      setIsPurchased(false);
      setSelectedProduct(null);
    }, 2000);
  };

  const statusBarStyle = themePreset === 'light' ? 'dark-content' : 'light-content';

  if (screen === 'compare') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
        <CompareProductsScreen
          products={cartItems.map(i => i.product)}
          userProfile={userProfile}
          onBackToCart={() => {
            setScreen('home');
            setIsCartDrawerOpen(true);
          }}
          onSelectProductToBuy={(product) => {
            setScreen('home');
            setSelectedProduct(product);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Top Navbar Header with $Agent Logo + Feature Chips */}
        <View style={styles.header}>
          <Text style={styles.logoText}>$Agent</Text>

          <View style={styles.headerChipsRow}>
            {/* Theme Chip: cicla entre os 4 presets (Dark, Light, Midnight, Royal) */}
            <TouchableOpacity
              style={styles.themeChip}
              onPress={cycleTheme}
              accessibilityLabel={`Tema atual: ${THEME_LABELS[themePreset]}. Toque para trocar.`}
            >
              <Text style={styles.themeChipText}>🎨</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity style={styles.shareChip} onPress={() => setIsShareModalOpen(true)}>
              <Text style={styles.shareChipText}>📤</Text>
            </TouchableOpacity>

            {/* Coupon Chip */}
            <TouchableOpacity style={styles.couponChip} onPress={() => setIsCouponsModalOpen(true)}>
              <Text style={styles.couponChipText}>🎟️ DECO10</Text>
            </TouchableOpacity>

            {/* Cart Chip */}
            <TouchableOpacity style={styles.cartChip} onPress={() => setIsCartDrawerOpen(true)}>
              <Text style={styles.cartChipText}>🛒 {cartQuantityTotal}</Text>
            </TouchableOpacity>

            {/* Wallet Saldo Chip */}
            <TouchableOpacity style={styles.walletChip} onPress={() => setIsWalletModalOpen(true)}>
              <Text style={styles.walletChipText}>
                R$ {(userProfile.walletBalance || 42.50).toFixed(2).replace('.', ',')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pedro França Personal Context Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.profileCardHeader}>MEU PERFIL CONTEXTUAL</Text>
          <View style={styles.profileRow}>
            <Image
              source={require('./assets/user-pedro.jpg')}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userBadge}>
                VIP • Saldo: R$ {(userProfile.walletBalance || 42.50).toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.userPreferences}>
                Estilo: {userProfile.stylePreferences.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Agent Search Input Bar (Gemini Style) */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="O que você quer pesquisar e comprar hoje?..."
            placeholderTextColor={colors.faint}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch(searchQuery)}
          >
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Suggestion Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
          {[
            'Camisa Oficial Fluminense Tricolor',
            'Camisa Seleção Brasileira Amarela',
            'Tênis de Corrida Nike Air Zoom',
            'Chuteira Society Tiempo Legend Pro'
          ].map((sug) => (
            <TouchableOpacity
              key={sug}
              style={styles.sugPill}
              onPress={() => {
                setSearchQuery(sug);
                handleSearch(sug);
              }}
            >
              <Text style={styles.sugPillText}>💡 {sug}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Agent Feedback Banner */}
        {agentResponse && (
          <View style={styles.agentBanner}>
            <Text style={styles.agentBannerTitle}>✨ $Agent Context Response</Text>
            <Text style={styles.agentBannerText}>{agentResponse.naturalLanguageReply}</Text>
            <Text style={styles.agentReasoning}>{agentResponse.reasoningSummary}</Text>
            <TouchableOpacity onPress={() => setAgentResponse(null)} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Limpar Filtros</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Product Listing Grid */}
        <Text style={styles.sectionTitle}>
          Vitrine $Agent Loja ({displayedProducts.length} itens)
        </Text>

        {displayedProducts.map((product) => {
          const isMatch = activeProductIds?.includes(product.id);
          return (
            <View key={product.id} style={[styles.productCard, isMatch && styles.productCardMatched]}>
              <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <View style={styles.productHeaderRow}>
                  <Text style={styles.productCategory}>{product.category} • {product.storeName}</Text>
                  {isMatch && <Text style={styles.matchTag}>✨ Match</Text>}
                </View>
                <Text style={styles.productName}>{product.name}</Text>

                <View style={styles.productPriceRow}>
                  <Text style={styles.productPrice}>R$ {product.price}</Text>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => handleAddToCart(product)}
                  >
                    <Text style={styles.buyButtonText}>Comprar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* 1-Click Checkout Modal */}
      {selectedProduct && (
        <Modal transparent animationType="fade" visible={!!selectedProduct}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {isPurchased ? (
                <View style={styles.purchasedSuccessBox}>
                  <Text style={styles.successTitle}>✅ Pedido Confirmado!</Text>
                  <Text style={styles.successText}>
                    Seu pedido de {selectedProduct.name} foi realizado com sucesso. 💰 Cashback creditado na sua carteira!
                  </Text>
                </View>
              ) : (
                <View>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Checkout Assistido $Agent</Text>
                    <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                      <Text style={styles.closeModalText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                  <Text style={styles.modalProductPrice}>R$ {selectedProduct.price}</Text>

                  {/* Match Diagnostic Box */}
                  <View style={styles.diagnosticBox}>
                    <Text style={styles.diagnosticTitle}>🛡️ Raio-X de Match do Perfil</Text>
                    <Text style={styles.diagnosticText}>• Tamanho M em estoque na loja</Text>
                    <Text style={styles.diagnosticText}>• R$ {selectedProduct.price} dentro do teto R$ {userProfile.maxBudget || '450'}</Text>
                    <Text style={styles.diagnosticText}>• Cupom DECO10 (-10% OFF) aplicado</Text>
                  </View>

                  <TouchableOpacity style={styles.confirmCheckoutButton} onPress={handleCheckout}>
                    <Text style={styles.confirmCheckoutButtonText}>Finalizar Pedido em 1-Clique</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}

      <CartDrawerModal
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        userProfile={userProfile}
        onOpenComparePage={() => setScreen('compare')}
        onCheckoutComplete={handleCartCheckoutComplete}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        userProfile={userProfile}
        onAddBalance={handleAddBalance}
      />

      <CouponsModal
        isOpen={isCouponsModalOpen}
        onClose={() => setIsCouponsModalOpen(false)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userProfile={userProfile}
        queryTitle={searchQuery || 'Busca Contextual'}
        recommendedProducts={displayedProducts}
      />

    </SafeAreaView>
  );
}

// Cores fixas (não seguem o tema): âmbar é a cor semântica de cupom/promoção
// em todas as 4 combinações, igual à decisão tomada no web.
const COUPON_AMBER = '#fbbf24';

function getStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    scrollContent: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingVertical: 4,
    },
    logoText: {
      fontSize: 24,
      fontWeight: '800',
      color: c.primary,
      letterSpacing: -1,
    },
    headerChipsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    themeChip: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    themeChipText: {
      fontSize: 12,
    },
    shareChip: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    shareChipText: {
      fontSize: 12,
    },
    couponChip: {
      backgroundColor: c.card,
      borderColor: `${COUPON_AMBER}4d`,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    couponChipText: {
      color: COUPON_AMBER,
      fontSize: 10,
      fontWeight: '700',
    },
    cartChip: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    cartChipText: {
      color: c.foreground,
      fontSize: 10,
      fontWeight: '700',
    },
    walletChip: {
      backgroundColor: c.card,
      borderColor: `${c.primary}66`,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    walletChipText: {
      color: c.primary,
      fontSize: 11,
      fontWeight: '800',
    },
    profileCard: {
      backgroundColor: c.card,
      padding: 14,
      borderRadius: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    profileCardHeader: {
      fontSize: 9,
      color: c.faint,
      fontWeight: '800',
      letterSpacing: 1,
      marginBottom: 8,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: `${c.primary}66`,
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 15,
      fontWeight: '700',
      color: c.foreground,
    },
    userBadge: {
      fontSize: 11,
      color: c.primary,
      marginTop: 2,
      fontWeight: '600',
    },
    userPreferences: {
      fontSize: 10,
      color: c.mutedForeground,
      marginTop: 2,
    },
    searchSection: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 10,
      color: c.foreground,
      fontSize: 12,
    },
    searchButton: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchButtonText: {
      color: c.primaryForeground,
      fontWeight: '800',
      fontSize: 12,
    },
    suggestionsContainer: {
      marginBottom: 16,
    },
    sugPill: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginRight: 8,
    },
    sugPillText: {
      color: c.foreground,
      fontSize: 11,
    },
    agentBanner: {
      backgroundColor: `${c.primary}22`,
      borderColor: `${c.primary}4d`,
      borderWidth: 1,
      padding: 14,
      borderRadius: 16,
      marginBottom: 16,
    },
    agentBannerTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: c.primary,
      marginBottom: 4,
    },
    agentBannerText: {
      fontSize: 11,
      color: c.foreground,
      lineHeight: 16,
    },
    agentReasoning: {
      fontSize: 10,
      color: c.mutedForeground,
      marginTop: 6,
    },
    resetButton: {
      marginTop: 8,
      alignSelf: 'flex-end',
    },
    resetButtonText: {
      fontSize: 10,
      color: c.mutedForeground,
      textDecorationLine: 'underline',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: c.foreground,
      marginBottom: 12,
    },
    productCard: {
      backgroundColor: c.card,
      borderRadius: 18,
      overflow: 'hidden',
      marginBottom: 14,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: c.border,
    },
    productCardMatched: {
      borderColor: c.primary,
      borderWidth: 1.5,
    },
    productImage: {
      width: 90,
      height: 90,
    },
    productDetails: {
      padding: 12,
      flex: 1,
      justifyContent: 'center',
    },
    productHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    productCategory: {
      fontSize: 10,
      color: c.faint,
    },
    matchTag: {
      fontSize: 9,
      color: c.primaryForeground,
      backgroundColor: c.primary,
      fontWeight: '800',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    productName: {
      fontSize: 13,
      fontWeight: '700',
      color: c.foreground,
    },
    productPriceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
    },
    productPrice: {
      fontSize: 15,
      fontWeight: '800',
      color: c.foreground,
    },
    buyButton: {
      backgroundColor: c.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    buyButtonText: {
      color: c.primaryForeground,
      fontWeight: '800',
      fontSize: 11,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: `${c.background}d9`,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContainer: {
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 20,
      width: '100%',
      borderColor: c.border,
      borderWidth: 1,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: c.foreground,
    },
    closeModalText: {
      color: c.mutedForeground,
      fontSize: 18,
      fontWeight: '700',
    },
    modalProductName: {
      fontSize: 16,
      fontWeight: '700',
      color: c.foreground,
    },
    modalProductPrice: {
      fontSize: 18,
      fontWeight: '800',
      color: c.primary,
      marginTop: 4,
    },
    diagnosticBox: {
      backgroundColor: c.background,
      padding: 12,
      borderRadius: 14,
      marginVertical: 14,
      borderColor: `${c.primary}4d`,
      borderWidth: 1,
    },
    diagnosticTitle: {
      fontSize: 11,
      fontWeight: '700',
      color: c.primary,
      marginBottom: 6,
    },
    diagnosticText: {
      fontSize: 11,
      color: c.foreground,
      marginVertical: 2,
    },
    confirmCheckoutButton: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
    },
    confirmCheckoutButtonText: {
      color: c.primaryForeground,
      fontWeight: '800',
      fontSize: 13,
    },
    purchasedSuccessBox: {
      padding: 20,
      alignItems: 'center',
    },
    successTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: c.primary,
      marginBottom: 8,
    },
    successText: {
      fontSize: 12,
      color: c.foreground,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
}
