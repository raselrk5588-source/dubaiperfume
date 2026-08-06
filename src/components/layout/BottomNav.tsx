import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <nav className="bottom-nav glass">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Home size={22} />
            <span>Home</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/cart" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <div className="cart-icon-wrapper">
              <ShoppingBag size={22} />
              {totalItems > 0 && <span className="cart-badge bg-gold">{totalItems}</span>}
            </div>
            <span>Cart</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <User size={22} />
            <span>Profile</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;
