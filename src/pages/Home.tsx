import React from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './Home.css';

const CATEGORIES = ['All', 'Oud', 'Floral', 'Woody', 'Spicy', 'Citrus'];

const Home: React.FC = () => {
  const { products } = useCart();
  
  return (
    <div className="home-page animate-fade-in">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-banner radius-lg glass">
          <div className="hero-content">
            <span className="hero-subtitle text-gold">New Collection</span>
            <h1 className="hero-title">The Royal<br/>Oud Experience</h1>
            <button className="shop-now-btn bg-gold radius-sm">Explore Now</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="categories-scroll">
          {CATEGORIES.map((cat, index) => (
            <button 
              key={cat} 
              className={`category-chip ${index === 0 ? 'active glass-light text-gold border-gold' : 'glass-light'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="product-section">
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
          <button className="view-all text-gold">See All</button>
        </div>
        <div className="product-grid">
          {products.slice(0, 2).map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Dubai Luxury Collection */}
      <section className="product-section">
        <div className="section-header">
          <h2 className="section-title">Dubai Luxury</h2>
          <button className="view-all text-gold">See All</button>
        </div>
        <div className="horizontal-scroll">
          {products.map(product => (
            <div className="scroll-item" key={`dl-${product.id}`}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>
      
      {/* Spacer for bottom nav */}
      <div style={{ height: '40px' }}></div>
    </div>
  );
};

export default Home;
