import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Crosshair, Save } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './SavedAddresses.css';

const SavedAddresses: React.FC = () => {
  const navigate = useNavigate();
  const { customerAddress, saveCustomerAddress } = useCart();
  const [addressInput, setAddressInput] = useState(customerAddress || '');
  const [isLocating, setIsLocating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleGetLocation = () => {
    setIsLocating(true);
    setSaveStatus('idle');

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim for free reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          if (!response.ok) throw new Error('Failed to fetch address');
          
          const data = await response.json();
          if (data && data.display_name) {
            setAddressInput(data.display_name);
          } else {
            alert('Could not determine address from location.');
          }
        } catch (error) {
          console.error(error);
          alert('Error fetching address. Please try typing it manually.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        alert('Unable to retrieve your location. Please check your location permissions.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSave = () => {
    if (!addressInput.trim()) {
      alert("Address cannot be empty");
      return;
    }
    saveCustomerAddress(addressInput.trim());
    setSaveStatus('saved');
    setTimeout(() => {
      setSaveStatus('idle');
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="addresses-page animate-fade-in">
      <div className="addresses-header">
        <button className="icon-button glass" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="var(--color-text)" />
        </button>
        <h1 className="page-title">Saved Address</h1>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="addresses-content">
        <div className="glass address-card">
          <div className="address-icon bg-gold">
            <MapPin size={24} color="#000" />
          </div>
          
          <h2 className="address-title">Your Delivery Location</h2>
          <p className="address-subtitle">Set your default address for faster checkout.</p>
          
          <button 
            className="gps-btn radius-lg hover-scale" 
            onClick={handleGetLocation}
            disabled={isLocating}
          >
            <Crosshair size={18} />
            {isLocating ? 'Locating...' : 'Get Current Location (GPS)'}
          </button>

          <div className="input-wrapper">
            <label>Delivery Address</label>
            <textarea 
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="e.g. Apartment 12B, Dubai Marina..."
              className="address-textarea"
              rows={4}
            />
            <p className="helper-text">You can edit the address fetched by GPS (e.g. add apartment number).</p>
          </div>

          <button 
            className={`save-btn radius-lg hover-scale ${saveStatus === 'saved' ? 'success' : 'bg-gold'}`}
            onClick={handleSave}
            disabled={isLocating || !addressInput.trim()}
          >
            <Save size={18} />
            {saveStatus === 'saved' ? 'Address Saved!' : 'Save Address'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedAddresses;
