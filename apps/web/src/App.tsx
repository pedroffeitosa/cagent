import React, { useState } from 'react';
import { MOCK_STORE_CONTEXT, Product, AIProviderType } from '@cagent/shared';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { AmbientBackground } from './components/AmbientBackground';
import { DemoScriptToolbar } from './components/DemoScriptToolbar';
import { PreferencesModal } from './components/PreferencesModal';
import { ProductCheckoutModal } from './components/ProductCheckoutModal';
import { CartDrawerModal } from './components/CartDrawerModal';
import { ShareContextModal } from './components/ShareContextModal';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { ChatWorkspace } from './components/ChatWorkspace';
import { HomeStorefrontView } from './components/views/HomeStorefrontView';
import { WalletView } from './components/views/WalletView';
import { CouponsView } from './components/views/CouponsView';
import { StoreBootstrapView } from './components/views/StoreBootstrapView';
import { CustomFiltersView } from './components/views/CustomFiltersView';
import { CompareProductsView } from './components/views/CompareProductsView';
import { LandingPage } from './components/views/LandingPage';
import { useUserProfile } from './hooks/useUserProfile';
import { useCart } from './hooks/useCart';
import { useChatSessions } from './hooks/useChatSessions';
import { useDemoTour } from './hooks/useDemoTour';
import { MainViewType } from './types/chat';

export default function App() {
  // Landing Page Gate: shown before the client enters the storefront demo
  const [hasEnteredApp, setHasEnteredApp] = useState(false);

  // Active View Mode (Home vs Chat vs Wallet Page vs Coupons Page vs Store Bootstrap Page vs Filters Page vs Compare Page)
  const [activeMainView, setActiveMainView] = useState<MainViewType>('home');

  // Account / Personal Context Profile
  const { userProfile, setUserProfile, creditCashback, addBalance } = useUserProfile();
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [selectedCheckoutProduct, setSelectedCheckoutProduct] = useState<Product | null>(null);

  // BYOK: Provedor de IA ativo (Fork & Connect ready para Gemini, OpenAI ou Anthropic)
  const [aiProvider, setAiProvider] = useState<AIProviderType>('gemini');
  const [customApiKey, setCustomApiKey] = useState('');

  // Collapsible Past Chats Toggle
  const [showPastChats, setShowPastChats] = useState(false);

  // Shopping Cart State
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { cartItems, setCartItems, handleAddToCart, handleUpdateCartQuantity, handleRemoveCartItem, clearCart } =
    useCart(() => setIsCartDrawerOpen(true));

  // Right Vitrine Sidebar Visibility Toggle
  const [isRightRailOpen, setIsRightRailOpen] = useState(true);

  // Top Header Feature Modals & Drawers
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Chat History & Agent Orchestration
  const {
    activeChatId,
    setActiveChatId,
    currentQuery,
    setCurrentQuery,
    loading,
    activeSession,
    pastSessions,
    displayedProducts,
    activeProductIds,
    handleRunAgent,
    handleNewChat,
  } = useChatSessions({ userProfile, aiProvider, customApiKey, onNavigate: setActiveMainView });

  // Sidebar States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleCartCheckoutComplete = (payload: { productName: string; amount: number; cashbackEarned: number }) => {
    creditCashback(payload);
    clearCart();
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveChatId(sessionId);
    setActiveMainView('chat');
  };

  // Interactive Demo Script Tour State (1-Click Pitch Steps 1..5)
  const { demoStep, handleSelectDemoStep } = useDemoTour({
    setUserProfile,
    setActiveMainView,
    setIsProfilePopoverOpen,
    setSelectedCheckoutProduct,
    setIsShareModalOpen,
    setCartItems,
    handleRunAgent,
    setCurrentQuery,
  });

  if (!hasEnteredApp) {
    return <LandingPage onEnter={() => setHasEnteredApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      <AmbientBackground variant="viewport" className="z-0" />

      <Sidebar
        activeMainView={activeMainView}
        onNavigateHome={() => setActiveMainView('home')}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        onBackToLanding={() => setHasEnteredApp(false)}
        onNewChat={handleNewChat}
        activeSession={activeSession}
        pastSessions={pastSessions}
        onSelectSession={handleSelectSession}
        showPastChats={showPastChats}
        onToggleShowPastChats={() => setShowPastChats(!showPastChats)}
        userProfile={userProfile}
        isProfilePopoverOpen={isProfilePopoverOpen}
        onToggleProfilePopover={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
        onCloseProfilePopover={() => setIsProfilePopoverOpen(false)}
        onOpenPreferences={() => setIsPreferencesModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* ------------------------------------------------------------- */}
      {/* MAIN WORKSPACE: Header + View Switcher                       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">

        {/* Interactive Pitch Demo Tour Bar (1-Click Steps 1..5) */}
        <DemoScriptToolbar
          currentStep={demoStep}
          onSelectStep={handleSelectDemoStep}
          onResetDemo={() => handleSelectDemoStep(1)}
        />

        <TopHeader
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          activeMainView={activeMainView}
          onNavigateHome={() => setActiveMainView('home')}
          currentQuery={currentQuery}
          onQueryChange={setCurrentQuery}
          onSubmitQuery={() => handleRunAgent(currentQuery)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onNavigateFilters={() => setActiveMainView('filters')}
          onNavigateStore={() => setActiveMainView('store')}
          onNavigateCoupons={() => setActiveMainView('coupons')}
          cartItemsCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
          onOpenCart={() => setIsCartDrawerOpen(true)}
          walletBalance={userProfile.walletBalance || 42.50}
          onNavigateWallet={() => setActiveMainView('wallet')}
        />

        {/* View Content Renderer */}
        {activeMainView === 'home' && (
          <HomeStorefrontView
            userProfile={userProfile}
            products={MOCK_STORE_CONTEXT.catalog}
            onOpenChat={(initialQuery) => {
              if (initialQuery) {
                handleRunAgent(initialQuery);
              } else {
                setActiveMainView('chat');
              }
            }}
            onSelectProductToBuy={(product) => setSelectedCheckoutProduct(product)}
          />
        )}

        {activeMainView === 'wallet' && (
          <WalletView userProfile={userProfile} onBackToChat={() => setActiveMainView('home')} onAddBalance={addBalance} />
        )}

        {activeMainView === 'coupons' && (
          <CouponsView onBackToChat={() => setActiveMainView('home')} />
        )}

        {activeMainView === 'store' && (
          <StoreBootstrapView onBackToChat={() => setActiveMainView('home')} />
        )}

        {activeMainView === 'filters' && (
          <CustomFiltersView
            userProfile={userProfile}
            onBackToChat={() => setActiveMainView('home')}
            onApplyPresetFilter={(name, colors) => {
              handleRunAgent(`Filtrar por ${name} nas cores ${colors.join(', ')}`);
            }}
          />
        )}

        {activeMainView === 'compare' && (
          <CompareProductsView
            products={cartItems.map(i => i.product)}
            userProfile={userProfile}
            onBackToCart={() => {
              setActiveMainView('chat');
              setIsCartDrawerOpen(true);
            }}
            onSelectProductToBuy={(product) => {
              setSelectedCheckoutProduct(product);
              setActiveMainView('home');
            }}
          />
        )}

        {/* MAIN VIEW: Gemini Chat Workspace + Optional Right Product Rail */}
        {activeMainView === 'chat' && (
          <ChatWorkspace
            activeSession={activeSession}
            userProfile={userProfile}
            currentQuery={currentQuery}
            onQueryChange={setCurrentQuery}
            onSubmitQuery={handleRunAgent}
            loading={loading}
            displayedProducts={displayedProducts}
            activeProductIds={activeProductIds}
            isRightRailOpen={isRightRailOpen}
            onToggleRail={setIsRightRailOpen}
            onAddToCart={handleAddToCart}
          />
        )}

      </div>

      {/* Share Context Modal */}
      <ShareContextModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userProfile={userProfile}
        queryTitle={activeSession?.title || 'Busca Contextual'}
        recommendedProducts={displayedProducts}
      />

      {/* Cart Drawer Modal */}
      <CartDrawerModal
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        userProfile={userProfile}
        onOpenComparePage={() => setActiveMainView('compare')}
        onCheckoutComplete={handleCartCheckoutComplete}
      />

      {/* Product Checkout Modal */}
      <ProductCheckoutModal
        isOpen={!!selectedCheckoutProduct}
        onClose={() => setSelectedCheckoutProduct(null)}
        product={selectedCheckoutProduct}
        userProfile={userProfile}
        onCheckoutComplete={creditCashback}
      />

      {/* Full Linear-Style Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
        aiProvider={aiProvider}
        onProviderChange={setAiProvider}
        customApiKey={customApiKey}
        onApiKeyChange={setCustomApiKey}
      />

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
    </div>
  );
}
