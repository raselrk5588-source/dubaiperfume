import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, BellRing } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Notifications.css';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, customerPhone, markNotificationsAsRead } = useCart();
  
  const myNotifications = notifications.filter(n => n.phone === customerPhone);

  useEffect(() => {
    // Mark as read when opening the page
    if (myNotifications.some(n => !n.read)) {
      markNotificationsAsRead();
    }
  }, [myNotifications, markNotificationsAsRead]);

  return (
    <div className="notifications-page animate-fade-in">
      <div className="notifications-header">
        <button className="icon-button glass" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="var(--color-text)" />
        </button>
        <h1 className="page-title">Notifications</h1>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="notifications-list">
        {myNotifications.length === 0 ? (
          <div className="empty-notifications glass">
            <Bell size={48} color="var(--color-text-secondary)" />
            <h2>No Notifications</h2>
            <p>You don't have any notifications right now.</p>
          </div>
        ) : (
          myNotifications.map((notif) => (
            <div key={notif.id} className="notification-card glass hover-scale">
              <div className="notification-icon bg-gold">
                <BellRing size={20} color="#000" />
              </div>
              <div className="notification-content">
                <h3 className="notification-title">{notif.title}</h3>
                <p className="notification-message">{notif.message}</p>
                <span className="notification-date">{notif.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
