import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, CreditCard, CheckCircle, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalItems, placeOrder, customerName, customerPhone, customerAddress } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState(customerName || '');
  const [address, setAddress] = useState(customerAddress || '');
  const [phone, setPhone] = useState(customerPhone || '');

  React.useEffect(() => {
    if (!customerName || !customerPhone) {
      // Redirect to profile to complete info before checkout
      navigate('/profile');
    }
  }, [customerName, customerPhone, navigate]);

  if (!customerName || !customerPhone) {
    return null; // Don't render checkout while redirecting
  }
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(address, phone, name);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="checkout-page success-state animate-fade-in">
        <CheckCircle size={80} color="var(--color-accent)" className="success-icon" />
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-message">Your luxury fragrance will be delivered soon.</p>
        <button className="back-home-btn bg-gold radius-lg" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page animate-fade-in">
      <div className="checkout-header">
        <button className="icon-button glass" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="var(--color-text)" />
        </button>
        <h1 className="page-title">Checkout</h1>
        <div style={{ width: 40 }}></div> {/* Spacer for centering */}
      </div>

      <form className="checkout-form" onSubmit={handlePlaceOrder}>
        
        <div className="form-section">
          <h3 className="section-subtitle">Delivery Information</h3>
          
          <div className="input-group glass">
            <User size={20} color="var(--color-text-secondary)" />
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              className="checkout-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group glass">
            <MapPin size={20} color="var(--color-text-secondary)" />
            <input 
              type="text" 
              placeholder="Full Delivery Address" 
              required 
              className="checkout-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div className="input-group glass">
            <Phone size={20} color="var(--color-text-secondary)" />
            <input 
              type="tel" 
              placeholder="Contact Number (e.g. +971...)" 
              required 
              className="checkout-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-subtitle">Payment Method</h3>
          
          <label className="payment-method glass active">
            <div className="payment-left">
              <input type="radio" name="payment" defaultChecked className="payment-radio" />
              <span className="payment-name">Cash on Delivery</span>
            </div>
            <CreditCard size={20} color="var(--color-accent)" />
          </label>
        </div>

        <div className="checkout-summary glass">
          <h3 className="summary-title">Order Summary ({totalItems} Items)</h3>
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

          <button type="submit" className="place-order-btn bg-gold radius-lg hover-scale">
            Place Order - AED {total}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
