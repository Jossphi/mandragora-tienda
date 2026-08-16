import { useState } from 'react';
import { useCart } from './hooks/useCart';

import AnnouncementBar from './components/layout/AnnouncementBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import JoyeriaPage from './pages/JoyeriaPage';
import ColeccionesPage from './pages/ColeccionesPage';
import NoviosPage from './pages/NoviosPage';
import NosotrosPage from './pages/NosotrosPage';
import ContactoPage from './pages/ContactoPage';

export default function App() {
  const [page, setPage] = useState('home');
  const [cartCount, addToCart] = useCart();

  const navigate = (to) => {
    setPage(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={navigate} onAddToCart={addToCart} />;
      case 'joyeria':
        return <JoyeriaPage onAddToCart={addToCart} />;
      case 'sale':
        return <JoyeriaPage onAddToCart={addToCart} isSale />;
      case 'colecciones':
        return <ColeccionesPage onNavigate={navigate} />;
      case 'novios':
        return <NoviosPage onAddToCart={addToCart} onNavigate={navigate} />;
      case 'nosotros':
        return <NosotrosPage />;
      case 'contacto':
        return <ContactoPage />;
      default:
        return <HomePage onNavigate={navigate} onAddToCart={addToCart} />;
    }
  };

  // Novios page has its own dark background; don't show the standard footer bg-margin
  const isNovios = page === 'novios';

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: '#23161c', background: '#fdf8fa', overflowX: 'hidden' }}>
      <AnnouncementBar />
      <Header cartCount={cartCount} onNavigate={navigate} />
      {renderPage()}
      <Footer onNavigate={navigate} />
    </div>
  );
}
