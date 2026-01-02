import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import BoxBuilder from './components/BoxBuilder';
import AlaCarteOrderPage from './components/AlaCarteOrderPage';
import ContactModal from './components/ContactModal';
import MenuModal from './components/MenuModal';
import ContainerSelectionModal from './components/ContainerSelectionModal';
import UnifiedCartModal from './components/UnifiedCartModal';
import UnifiedCheckoutModal from './components/UnifiedCheckoutModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { type Container } from './data/containers';

type Page = 'landing' | 'builder' | 'alacarte';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const { user, loading } = useAdminAuth();
  const { cartItems, notes, removeFromCart, clearCart, setNotes, getTotalPrice } = useCart();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isContainerSelectionOpen, setIsContainerSelectionOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin-panel-login' || path === '/admin-panel-login/');
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, []);

  const handleStartBuilder = () => {
    setIsContainerSelectionOpen(true);
  };

  const handleStartAlaCarte = () => {
    setCurrentPage('alacarte');
  };

  const handleContainerSelect = (container: Container) => {
    setSelectedContainer(container);
    setCurrentPage('builder');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setSelectedContainer(null);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-xl text-coffee">جاري التحميل...</div>
      </div>
    );
  }

  if (isAdminRoute) {
    if (user) {
      return <AdminDashboard />;
    }
    return <AdminLogin onLoginSuccess={() => window.location.reload()} />;
  }

  if (isAdminLoginOpen && user) {
    return <AdminDashboard />;
  }

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage
          onStartBuilder={handleStartBuilder}
          onStartAlaCarte={handleStartAlaCarte}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        />
      )}

      {isAdminLoginOpen && !user && (
        <AdminLogin
          onLoginSuccess={() => {
            setIsAdminLoginOpen(false);
            window.location.reload();
          }}
        />
      )}

      {currentPage === 'builder' && selectedContainer && (
        <BoxBuilder
          container={selectedContainer}
          onBack={handleBackToLanding}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {currentPage === 'alacarte' && (
        <AlaCarteOrderPage
          onBack={handleBackToLanding}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      <ContainerSelectionModal
        isOpen={isContainerSelectionOpen}
        onClose={() => setIsContainerSelectionOpen(false)}
        onSelect={handleContainerSelect}
      />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <UnifiedCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        notes={notes}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onNotesChange={setNotes}
        onCheckout={handleCheckout}
      />

      <UnifiedCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        notes={notes}
        totalPrice={getTotalPrice()}
      />
    </>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AdminAuthProvider>
  );
}

export default App;
