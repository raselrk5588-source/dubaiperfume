import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Package, CreditCard, MapPin, ChevronRight, LogOut, Bell, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { customerName, customerPhone, customerAddress, loginCustomer, logoutCustomer } = useCart();
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim() && phoneInput.trim()) {
      loginCustomer(nameInput.trim(), phoneInput.trim());
      setNameInput('');
      setPhoneInput('');
    }
  };

  if (!customerName) {
    return (
      <div className="profile-page animate-fade-in" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px'}}>
        <div className="glass" style={{width: '100%', maxWidth: '350px', padding: '30px 20px', borderRadius: '16px', textAlign: 'center'}}>
          <div style={{width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
            <User size={30} color="black" />
          </div>
          <h2 style={{color: 'white', marginBottom: '10px'}}>Welcome Back</h2>
          <p style={{color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: '14px'}}>Please complete your profile to continue.</p>
          <form onSubmit={handleLoginSubmit}>
            <input 
              type="text" 
              placeholder="Full Name (e.g. John Doe)"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', marginBottom: '12px', fontSize: '15px'}}
              required
            />
            <input 
              type="tel" 
              placeholder="Phone Number (e.g. +971...)"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              style={{width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', marginBottom: '20px', fontSize: '15px'}}
              required
            />
            <button type="submit" style={{width: '100%', padding: '14px', borderRadius: '10px', background: 'var(--color-accent)', color: 'black', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer'}}>
              Save Profile
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-header glass">
        <div className="profile-info">
          <div className="avatar-placeholder bg-gold">
            <span>{customerName.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="profile-name">{customerName}</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px'}}>
              <p className="profile-email" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><User size={14} /> {customerPhone || 'Add Phone Number'}</p>
              {customerAddress && (
                <p className="profile-email" style={{
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden',
                  fontSize: '0.8rem', 
                  lineHeight: '1.4'
                }}>
                  <MapPin size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} />
                  {customerAddress}
                </p>
              )}
            </div>
          </div>
        </div>
        <button className="settings-btn">
          <Settings size={24} color="var(--color-text)" />
        </button>
      </div>


      <div className="profile-menu">
        <div className="menu-group glass">
          <div className="menu-item" onClick={() => navigate('/orders')}>
            <div className="menu-item-left">
              <Package size={20} className="text-gold" />
              <span>My Orders</span>
            </div>
            <ChevronRight size={20} color="var(--color-text-secondary)" />
          </div>
          <div className="menu-item">
            <div className="menu-item-left">
              <CreditCard size={20} className="text-gold" />
              <span>Payment Methods</span>
            </div>
            <ChevronRight size={20} color="var(--color-text-secondary)" />
          </div>
          <div className="menu-item" onClick={() => navigate('/addresses')}>
            <div className="menu-item-left">
              <MapPin size={20} className="text-gold" />
              <span>Saved Addresses</span>
            </div>
            <ChevronRight size={20} color="var(--color-text-secondary)" />
          </div>
          <div className="menu-item" onClick={() => navigate('/notifications')}>
            <div className="menu-item-left">
              <Bell size={20} className="text-gold" />
              <span>Notifications</span>
            </div>
            <ChevronRight size={20} color="var(--color-text-secondary)" />
          </div>
        </div>

        <button className="logout-btn glass" onClick={logoutCustomer}>
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
