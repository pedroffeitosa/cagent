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
  StatusBar 
} from 'react-native';
import { 
  MOCK_USER_PROFILES, 
  MOCK_STORE_CONTEXT, 
  UserProfile, 
  AgentResponsePayload, 
  runLocalRuleEngine 
} from '@cagent/shared';

export default function App() {
  const [userProfile] = useState<UserProfile>(MOCK_USER_PROFILES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [agentResponse, setAgentResponse] = useState<AgentResponsePayload | null>(null);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header with Financial Logo */}
        <View style={styles.header}>
          <Text style={styles.logoText}>$Agent</Text>
          <Text style={styles.badgeText}>Deco Mobile</Text>
        </View>

        {/* Personal Context Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.profileCardHeader}>MEU PERFIL CONTEXTUAL</Text>
          <View style={styles.profileRow}>
            <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userSpecs}>
                Tamanho: {userProfile.sizes.clothing} | Orçamento: R$ {userProfile.maxBudget || '∞'}
              </Text>
              <Text style={styles.userPreferences}>
                Estilo: {userProfile.stylePreferences.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Agent Search Input Bar */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Perguntar ao $Agent..."
            placeholderTextColor="#64748b"
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
          {['Vestido de linho', 'Blazer oversized', 'Camiseta tech', 'Jaqueta puffer'].map((sug) => (
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
            <Text style={styles.agentBannerTitle}>✨ $Agent Context Filter Ativo</Text>
            <Text style={styles.agentBannerText}>{agentResponse.naturalLanguageReply}</Text>
            <TouchableOpacity onPress={() => setAgentResponse(null)} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Limpar Filtro</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Product Listing Grid */}
        <Text style={styles.sectionTitle}>
          Vitrine Adaptada ({displayedProducts.length} itens)
        </Text>

        {displayedProducts.map((product) => {
          const isMatch = activeProductIds?.includes(product.id);
          return (
            <View key={product.id} style={[styles.productCard, isMatch && styles.productCardMatched]}>
              <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <View style={styles.productHeaderRow}>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  {isMatch && <Text style={styles.matchTag}>✨ Match $Agent</Text>}
                </View>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSizes}>Tamanhos: {product.availableSizes.join(', ')}</Text>
                <Text style={styles.productPrice}>R$ {product.price}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#34d399',
    letterSpacing: -1,
  },
  badgeText: {
    fontSize: 11,
    color: '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  profileCardHeader: {
    fontSize: 9,
    color: '#64748b',
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
    borderColor: 'rgba(52, 211, 153, 0.4)',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  userSpecs: {
    fontSize: 11,
    color: '#34d399',
    marginTop: 2,
    fontWeight: '600',
  },
  userPreferences: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  searchSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 13,
  },
  searchButton: {
    backgroundColor: '#34d399',
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#020617',
    fontWeight: '800',
    fontSize: 12,
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  sugPill: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  sugPillText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  agentBanner: {
    backgroundColor: 'rgba(6, 78, 59, 0.4)',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderWidth: 1,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  agentBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34d399',
    marginBottom: 4,
  },
  agentBannerText: {
    fontSize: 11,
    color: '#e2e8f0',
    lineHeight: 16,
  },
  resetButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  resetButtonText: {
    fontSize: 10,
    color: '#94a3b8',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  productCardMatched: {
    borderColor: '#34d399',
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
    color: '#64748b',
  },
  matchTag: {
    fontSize: 9,
    color: '#020617',
    backgroundColor: '#34d399',
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  productSizes: {
    fontSize: 10,
    color: '#34d399',
    marginVertical: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
});
