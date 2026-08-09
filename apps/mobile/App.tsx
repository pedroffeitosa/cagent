import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MOCK_USER_PROFILES, MOCK_STORE_PRODUCTS } from '@cagent/shared';

export default function App() {
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const activeUser = MOCK_USER_PROFILES[activeUserIndex];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>$Agent Mobile</Text>
          <Text style={styles.badge}>Deco Mesh</Text>
        </View>

        {/* Profile Selector */}
        <View style={styles.profileCard}>
          <Text style={styles.sectionLabel}>CLIENTE ATIVO (DEMO):</Text>
          <View style={styles.profileRow}>
            <Image source={{ uri: activeUser.avatarUrl }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{activeUser.name}</Text>
              <Text style={styles.userBadge}>{activeUser.badge}</Text>
              <Text style={styles.userSize}>Tamanho: {activeUser.sizes.clothing} | Sapatos: {activeUser.sizes.shoes}</Text>
            </View>
          </View>
        </View>

        {/* Product Catalog */}
        <Text style={styles.sectionTitle}>Vitrine Contextual Deco</Text>
        {MOCK_STORE_PRODUCTS.map((prod) => (
          <View key={prod.id} style={styles.productCard}>
            <Image source={{ uri: prod.imageUrl }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productCategory}>{prod.category} • {prod.storeName}</Text>
              <Text style={styles.productName}>{prod.name}</Text>
              <Text style={styles.productPrice}>R$ {prod.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  badge: {
    fontSize: 12,
    color: '#10b981',
    backgroundColor: '#064e3b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionLabel: {
    fontSize: 10,
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: '700',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  userBadge: {
    fontSize: 12,
    color: '#38bdf8',
  },
  userSize: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#334155',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productDetails: {
    padding: 12,
    flex: 1,
    justifyContent: 'center',
  },
  productCategory: {
    fontSize: 10,
    color: '#94a3b8',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
  },
});
