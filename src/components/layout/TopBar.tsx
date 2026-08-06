import React from 'react';
import { Bell, Search, Mic } from 'lucide-react';
import './TopBar.css';

const TopBar: React.FC = () => {
  return (
    <header className="top-bar glass">
      <div className="top-bar-content">
        <div className="brand-logo">
          <span className="text-gold">Dubai</span>Perfume
        </div>
        <div className="top-bar-actions">
          <button className="icon-button hover-scale">
            <Bell size={20} color="var(--color-text)" />
            <span className="notification-dot"></span>
          </button>
        </div>
      </div>
      
      <div className="search-container">
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
    </header>
  );
};

export default TopBar;
