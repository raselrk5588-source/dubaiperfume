import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Package, CreditCard, MapPin, ChevronRight, LogOut, Bell } from 'lucide-react';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-header glass">
        <div className="profile-info">
          <div className="avatar-placeholder bg-gold">
            <span>JD</span>
          </div>
          <div>
            <h2 className="profile-name">John Doe</h2>
            <p className="profile-email">john.doe@vip.com</p>
          </div>
        </div>
        <button className="settings-btn">
          <Settings size={24} color="var(--color-text)" />
        </button>
      </div>

      <div className="rewards-card glass hover-scale">
        <div className="rewards-info">
          <span className="rewards-label">Royal Rewards</span>
          <h3 className="rewards-points text-gold">2,450 Points</h3>
        </div>
        <div className="rewards-tier">
          Gold Member
        </div>
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
          <div className="menu-item">
            <div className="menu-item-left">
              <MapPin size={20} className="text-gold" />
              <span>Saved Addresses</span>
            </div>
            <ChevronRight size={20} color="var(--color-text-secondary)" />
          </div>
          <div className="menu-item">
            <div className="menu-item-left">
              <Bell size={20} className="text-gold" />
              <span>Notifications</span>
            </div>
            <ChevronRight size={20} color="var(--color-text-secondary)" />
          </div>
        </div>

        <button className="logout-btn glass">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
