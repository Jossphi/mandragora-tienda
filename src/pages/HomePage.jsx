import HeroCarousel from '../components/home/HeroCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductTabs from '../components/home/ProductTabs';
import MarqueeSection from '../components/home/MarqueeSection';
import BrandStatement from '../components/home/BrandStatement';
import NoviosEditorial from '../components/home/NoviosEditorial';
import CollectionsGrid from '../components/home/CollectionsGrid';
import InstagramGrid from '../components/home/InstagramGrid';

export default function HomePage({ onNavigate, onAddToCart }) {
  return (
    <main>
      <HeroCarousel />
      <CategoryGrid onNavigate={onNavigate} />
      <ProductTabs onNavigate={onNavigate} onAddToCart={onAddToCart} />
      <MarqueeSection onNavigate={onNavigate} />
      <BrandStatement onNavigate={onNavigate} />
      <NoviosEditorial onNavigate={onNavigate} />
      <CollectionsGrid onNavigate={onNavigate} />
      <InstagramGrid />
    </main>
  );
}
