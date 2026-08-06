import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Mic } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './TopBar.css';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerPhone, notifications } = useCart();
  const [showSearch, setShowSearch] = useState(false);
  const unreadCount = notifications.filter(n => n.phone === customerPhone && !n.read).length;

  const isHome = location.pathname === '/';

  return (
    <header className="top-bar">
      <div className="top-bar-content">
        <div className="brand-logo">
          <span className="text-gold">Dubai</span>Perfume
        </div>
        <div className="top-bar-actions">
          {isHome && (
            <button className="icon-button hover-scale" onClick={() => setShowSearch(!showSearch)}>
              <Search size={20} color="var(--color-text)" />
            </button>
          )}
          <button className="icon-button hover-scale" onClick={() => navigate('/notifications')} style={{ position: 'relative' }}>
            <Bell size={20} color="var(--color-text)" />
            {unreadCount > 0 && (
              <span className="notification-badge" style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#e74c3c',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                padding: '2px 5px',
                border: '2px solid var(--color-bg)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      
      {isHome && showSearch && (
        <div className="search-container animate-fade-in">
          <div className="search-bar glass-light radius-lg">
            <Search size={18} color="var(--color-text-secondary)" className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for luxury fragrances..." 
              className="search-input"
            />
            <button className="voice-search">
              <Mic size={18} color="var(--color-accent)" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
