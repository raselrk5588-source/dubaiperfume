import React from 'react';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

const MOCK_WISHLIST = [
  {
    id: '3',
    name: 'Desert Gold',
    brand: 'Royal Essence',
    price: 1400,
    image: '/perfume1.png',
    rating: 5.0
  },
  {
    id: '4',
    name: 'Saffron Whisper',
    brand: 'Dubai Luxury',
    price: 950,
    originalPrice: 1200,
    image: '/perfume2.png',
    rating: 4.7
  }
];

const Wishlist: React.FC = () => {
  return (
    <div className="wishlist-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Wishlist</h1>
        <span className="item-count">{MOCK_WISHLIST.length} Items</span>
      </div>
      
      <div className="wishlist-grid">
        {MOCK_WISHLIST.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
