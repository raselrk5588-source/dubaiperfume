import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Share2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  // Mock data fetching based on ID
  const product = {
    name: 'Oud Majestic',
    brand: 'Dubai Luxury',
    price: 1250,
    description: 'A masterpiece of olfactory art, Oud Majestic blends the rarest Cambodian oud with delicate Taif rose and warm amber. Designed for the elite, this fragrance leaves an unforgettable trail of royal elegance.',
    images: ['/perfume1.png', '/perfume2.png', '/perfume1.png'],
    rating: 4.9,
    reviews: 128,
    notes: {
      top: ['Saffron', 'Nutmeg', 'Lavender'],
      heart: ['Agarwood (Oud)', 'Taif Rose', 'Patchouli'],
      base: ['Amber', 'Musk', 'Sandalwood']
    }
  };

  return (
    <div className="product-details-page animate-fade-in">
      <div className="pd-header">
        <button className="icon-button glass" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="var(--color-text)" />
        </button>
        <div className="pd-header-actions">
          <button className="icon-button glass mr-2" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart size={24} fill={isFavorite ? 'var(--color-accent)' : 'none'} color={isFavorite ? 'var(--color-accent)' : 'var(--color-text)'} />
          </button>
          <button className="icon-button glass">
            <Share2 size={24} color="var(--color-text)" />
          </button>
        </div>
      </div>

      <div className="image-gallery">
        <div className="gallery-scroll">
          {product.images.map((img, idx) => (
            <div className="gallery-item" key={idx}>
              <img src={img} alt={`${product.name} view ${idx + 1}`} />
            </div>
          ))}
        </div>
        <div className="gallery-indicators">
          {product.images.map((_, idx) => (
            <div key={idx} className={`indicator ${idx === 0 ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="product-info-section glass">
        <div className="pd-brand">{product.brand}</div>
        <h1 className="pd-title">{product.name}</h1>
        
        <div className="pd-meta">
          <div className="pd-rating">
            <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
            <span>{product.rating}</span>
            <span className="reviews-count">({product.reviews} reviews)</span>
          </div>
          <div className="pd-price text-gold">AED {product.price}</div>
        </div>

        <div className="pd-description">
          <p>{product.description}</p>
        </div>

        <div className="fragrance-notes">
          <h3 className="section-subtitle">Fragrance Notes</h3>
          <div className="notes-container">
            <div className="note-tier">
              <div className="tier-label">Top</div>
              <div className="tier-values">{product.notes.top.join(' • ')}</div>
            </div>
            <div className="note-tier">
              <div className="tier-label">Heart</div>
              <div className="tier-values">{product.notes.heart.join(' • ')}</div>
            </div>
            <div className="note-tier">
              <div className="tier-label">Base</div>
              <div className="tier-values">{product.notes.base.join(' • ')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky-buy-bar glass">
        <div className="buy-price">
          <span className="buy-price-label">Total Price</span>
          <span className="buy-price-value text-gold">AED {product.price}</span>
        </div>
        <button 
          className="buy-now-btn bg-gold radius-lg"
          onClick={() => addToCart({
            id: id || '0',
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.images[0]
          })}
        >
          <ShoppingBag size={20} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
