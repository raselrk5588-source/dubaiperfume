import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isStockOut?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  rating,
  isNew,
  isStockOut,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="product-card glass hover-scale" onClick={() => navigate(`/product/${id}`)}>
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
        <button className="favorite-button glass-light" onClick={(e) => { e.stopPropagation(); /* Add to wishlist logic */ }}>
          <Heart size={18} color="var(--color-text)" />
        </button>
        {isNew && <span className="badge new-badge">NEW</span>}
        {isStockOut && <span className="badge" style={{background: 'rgba(231,76,60,0.8)', color: 'white', bottom: '10px', top: 'auto', left: '10px', right: 'auto'}}>OUT OF STOCK</span>}
        {originalPrice && (
          <span className="badge discount-badge">
            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </span>
        )}
      </div>
      
      <div className="product-info">
        <div className="brand-name">{brand}</div>
        <h3 className="product-name">{name}</h3>
        
        <div className="rating">
          <Star size={14} fill="var(--color-accent)" color="var(--color-accent)" />
          <span>{rating.toFixed(1)}</span>
        </div>
        
        <div className="price-container" style={{ display: 'flex', alignItems: 'center' }}>
          <span className="current-price">AED {price}</span>
          {originalPrice && (
            <>
              <span className="original-price" style={{ marginLeft: '8px' }}>AED {originalPrice}</span>
              <span style={{color: '#2ecc71', fontSize: '0.75rem', fontWeight: 800, marginLeft: '6px', backgroundColor: 'rgba(46, 204, 113, 0.1)', padding: '2px 6px', borderRadius: '4px'}}>
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>
        
        <button 
          className="add-to-cart-btn bg-gold radius-sm"
          style={isStockOut ? { background: '#333', color: '#888', cursor: 'not-allowed' } : {}}
          disabled={isStockOut}
          onClick={(e) => {
            e.stopPropagation();
            if (!isStockOut) {
              addToCart({ id, name, brand, price, image });
            }
          }}
        >
          {isStockOut ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
