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
        
        <div className="price-container">
          <span className="current-price">AED {price}</span>
          {originalPrice && <span className="original-price">AED {originalPrice}</span>}
        </div>
        
        <button 
          className="add-to-cart-btn bg-gold radius-sm"
          onClick={(e) => {
            e.stopPropagation();
            addToCart({ id, name, brand, price, image });
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
