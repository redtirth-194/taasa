import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import AdminRoute from './components/AdminRoute';
import AestheticStylistModal from './components/AestheticStylistModal';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import ShopTheFeed from './pages/ShopTheFeed';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import SecretDropWheel from './components/SecretDropWheel';
import AdminDashboard from './pages/AdminDashboard';

// Automatic scroll-to-top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Layout wrapper to conditionally show storefront header/footer
function StorefrontLayout({ children }) {
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <Header onOpenWheel={() => setIsWheelOpen(true)} />
      <CartDrawer />
      <main>{children}</main>
      <Footer />

      {/* Floating AI Stylist Matchmaker Button */}
      <button 
        className="floating-stylist-trigger"
        onClick={() => setIsStylistOpen(true)}
        aria-label="Open AI Style Matchmaker"
      >
        <Sparkles size={16} className="stylist-sparkle-icon" />
        <span>✨ AI Style Matchmaker</span>
      </button>

      <AestheticStylistModal 
        isOpen={isStylistOpen} 
        onClose={() => setIsStylistOpen(false)} 
      />

      <SecretDropWheel 
        isOpen={isWheelOpen} 
        onClose={() => setIsWheelOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <LoginModal />
          <Routes>
            {/* Protected Admin Studio Route */}
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />

            {/* Storefront Routes */}
            <Route 
              path="/*" 
              element={
                <StorefrontLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/collections/:category" element={<Collection />} />
                    <Route path="/collections" element={<Collection />} />
                    <Route path="/shop" element={<Collection />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/feed" element={<ShopTheFeed />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders/:orderNumber" element={<OrderTracking />} />
                    <Route path="/orders" element={<OrderTracking />} />
                    <Route path="/track-order" element={<OrderTracking />} />
                  </Routes>
                </StorefrontLayout>
              } 
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
