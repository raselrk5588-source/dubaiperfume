import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Share2, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const { products, addToCart } = useCart();
  const productData = products.find(p => p.id === id);

  if (!productData) {
    return (
      <div className="product-details-page animate-fade-in" style={{padding: '20px', textAlign: 'center'}}>
        <div className="pd-header">
          <button className="icon-button glass" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} color="var(--color-text)" />
          </button>
        </div>
        <h2 style={{marginTop: '40px', color: 'white'}}>Product not found</h2>
      </div>
    );
  }

  // Merge with mock details for fields not in DB
  const product = {
    ...productData,
    description: 'A masterpiece of olfactory art, blending rare ingredients to create an unforgettable trail of royal elegance. Long-lasting and luxurious.',
    images: [productData.image],
    reviews: Math.floor(Math.random() * 200) + 50,
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
          <div className="pd-price text-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>AED {product.price}</span>
            {product.originalPrice && (
              <>
                <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.9rem' }}>AED {product.originalPrice}</span>
                <span style={{ color: '#2ecc71', fontSize: '0.8rem', fontWeight: 800, backgroundColor: 'rgba(46, 204, 113, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>
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
          style={product.isStockOut ? { background: '#333', color: '#888', cursor: 'not-allowed' } : {}}
          disabled={product.isStockOut}
          onClick={() => {
            if (!product.isStockOut) {
              addToCart({
                id: id || '0',
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.images[0]
              });
            }
          }}
        >
          {product.isStockOut ? <X size={20} /> : <ShoppingBag size={20} />}
          {product.isStockOut ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
