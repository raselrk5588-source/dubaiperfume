import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Orders.css';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { orders, customerPhone } = useCart();
  
  // Filter orders to only show those belonging to the logged-in customer's phone
  const myOrders = orders.filter(order => order.phone === customerPhone);

  return (
    <div className="orders-page animate-fade-in">
      <div className="orders-header">
        <button className="icon-button glass" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="var(--color-text)" />
        </button>
        <h1 className="page-title">My Orders</h1>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="orders-list">
        {myOrders.length === 0 ? (
          <div className="empty-orders glass">
            <Package size={48} color="var(--color-text-secondary)" />
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders. Start shopping to see them here.</p>
          </div>
        ) : (
          myOrders.map(order => (
            <div key={order.id} className="order-card glass hover-scale">
              <div className="order-card-header">
                <span className="order-id">{order.id}</span>
                <span className="order-date">{order.date}</span>
              </div>
              
              <div className="order-items-preview">
                {order.items.slice(0, 3).map(item => (
                  <img key={item.id} src={item.image} alt={item.name} className="order-item-img" />
                ))}
                {order.items.length > 3 && (
                  <div className="more-items">+{order.items.length - 3}</div>
                )}
              </div>
              
              <div className="order-card-footer">
                <div className="order-total">
                  <span className="total-label">Total</span>
                  <span className="total-amount text-gold">AED {order.total}</span>
                </div>
                <div className="order-status bg-gold">{order.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
