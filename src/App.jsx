import { useState, useCallback, useEffect } from 'react';
import { pageToPath, pathToPage } from './lib/routes';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import CartToast from './components/shop/CartToast';

import AnnouncementBar from './components/layout/AnnouncementBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import JoyeriaPage from './pages/JoyeriaPage';
import ColeccionesPage from './pages/ColeccionesPage';
import NoviosPage from './pages/NoviosPage';
import NosotrosPage from './pages/NosotrosPage';
import ContactoPage from './pages/ContactoPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import OrderPage from './pages/OrderPage';

export default function App() {
  // The current page comes from the URL, so links can be shared and reloaded.
  const [page, setPage] = useState(() => pathToPage(window.location.pathname, window.location.search));
  const { count: cartCount, addToCart } = useCart();
  const { recovering, endRecovery } = useAuth();

  const navigate = useCallback((to, { replace = false } = {}) => {
    const path = pageToPath(to);
    if (path !== window.location.pathname + window.location.search) {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', path);
    }
    setPage(pathToPage(window.location.pathname, window.location.search));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Browser back/forward buttons.
  useEffect(() => {
    const onPop = () => setPage(pathToPage(window.location.pathname, window.location.search));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Default tab title for pages that don't set their own.
  useEffect(() => {
    if (!page.startsWith('product/')) document.title = 'Mandrágora · Joyería de autor · Perú';
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={navigate} onAddToCart={addToCart} />;
      case 'joyeria':
        return <JoyeriaPage key="joyeria" onAddToCart={addToCart} onNavigate={navigate} />;
      case 'sale':
        return <JoyeriaPage key="sale" onAddToCart={addToCart} onNavigate={navigate} isSale />;
      case 'colecciones':
        return <ColeccionesPage onNavigate={navigate} />;
      case 'novios':
        return <NoviosPage onAddToCart={addToCart} onNavigate={navigate} />;
      case 'nosotros':
        return <NosotrosPage />;
      case 'contacto':
        return <ContactoPage />;
      case 'cart':
        return <CartPage onNavigate={navigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigate} />;
      case 'account':
        return <AccountPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage key="login" onNavigate={navigate} />;
      default:
        if (page.startsWith('login?next=')) {
          return <LoginPage key={page} onNavigate={navigate} next={page.slice('login?next='.length)} />;
        }
        if (page.startsWith('order/')) {
          return <OrderPage orderId={page.slice('order/'.length)} onNavigate={navigate} />;
        }
        if (page.startsWith('joyeria/')) {
          const filtro = decodeURIComponent(page.slice('joyeria/'.length));
          return <JoyeriaPage key={page} initialFilter={filtro} onAddToCart={addToCart} onNavigate={navigate} />;
        }
        if (page.startsWith('coleccion/')) {
          const collection = decodeURIComponent(page.slice('coleccion/'.length));
          return <JoyeriaPage key={page} collection={collection} onAddToCart={addToCart} onNavigate={navigate} />;
        }
        if (page.startsWith('product/')) {
          const productId = page.split('/')[1];
          return <ProductPage productId={productId} onAddToCart={addToCart} onNavigate={navigate} />;
        }
        return <HomePage onNavigate={navigate} onAddToCart={addToCart} />;
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: '#23161c', background: '#fdf8fa', overflowX: 'hidden' }}>
      <AnnouncementBar />
      <Header cartCount={cartCount} onNavigate={navigate} />
      {recovering ? (
        <LoginPage key="reset" initialMode="reset" onNavigate={(to) => { endRecovery(); navigate(to); }} />
      ) : renderPage()}
      <CartToast onNavigate={navigate} />
      <Footer onNavigate={navigate} />
    </div>
  );
}
