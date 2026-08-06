import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './Home.css';

const CATEGORIES = ['All', 'Oud', 'Floral', 'Woody', 'Spicy', 'Citrus'];

const Home: React.FC = () => {
  const { products } = useCart();
  const [showAllTrending, setShowAllTrending] = useState(false);
  const [showAllLuxury, setShowAllLuxury] = useState(false);
  
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
          <button className="view-all text-gold" onClick={() => setShowAllTrending(!showAllTrending)}>
            {showAllTrending ? 'Show Less' : 'See All'}
          </button>
        </div>
        <div className="product-grid">
          {(showAllTrending ? products : products.slice(0, 2)).map(product => (
            <ProductCard key={`trending-${product.id}`} {...product} />
          ))}
        </div>
      </section>

      {/* Dubai Luxury Collection */}
      <section className="product-section">
        <div className="section-header">
          <h2 className="section-title">Dubai Luxury</h2>
          <button className="view-all text-gold" onClick={() => setShowAllLuxury(!showAllLuxury)}>
            {showAllLuxury ? 'Show Less' : 'See All'}
          </button>
        </div>
        <div className={showAllLuxury ? "product-grid" : "horizontal-scroll"}>
          {products.map(product => (
            <div className={showAllLuxury ? "" : "scroll-item"} key={`dl-${product.id}`}>
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
