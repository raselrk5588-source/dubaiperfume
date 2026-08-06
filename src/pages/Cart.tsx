import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, customerName, customerPhone } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50;
  const total = subtotal + shipping;

  return (
    <div className="cart-page animate-fade-in">
      <h1 className="page-title">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart glass">
          <ShoppingBag size={48} color="var(--color-text-secondary)" />
          <h2>Your cart is empty</h2>
          <p>Explore our luxury collection and find your signature scent.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
          <div key={item.id} className="cart-item glass">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            
            <div className="cart-item-info">
              <div className="cart-item-header">
                <div>
                  <div className="cart-brand">{item.brand}</div>
                  <h3 className="cart-name">{item.name}</h3>
                </div>
                <button className="delete-btn" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="cart-item-footer">
                <div className="cart-price text-gold">AED {item.price}</div>
                <div className="quantity-controls glass-light radius-sm">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="coupon-section glass">
        <input type="text" placeholder="Enter Promo Code" className="coupon-input" />
        <button className="apply-btn text-gold">Apply</button>
      </div>

      <div className="checkout-summary glass">
        <h3 className="summary-title">Order Summary</h3>
        
        <div className="summary-row">
          <span>Subtotal</span>
          <span>AED {subtotal}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>AED {shipping}</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row total-row">
          <span>Total</span>
          <span className="text-gold">AED {total}</span>
        </div>

          <button 
            className="checkout-btn bg-gold radius-lg hover-scale"
            onClick={() => {
              if (!customerName || !customerPhone) {
                alert("Please complete your profile (Name & Phone) to proceed to checkout.");
                navigate('/profile');
              } else {
                navigate('/checkout');
              }
            }}
          >
            Proceed to Checkout
            <ArrowRight size={20} />
          </button>
        </div>
      </>
      )}
    </div>
  );
};

export default Cart;
