import React, { useState } from 'react';
import { MapPin, Phone, Package, DollarSign, TrendingUp, BarChart3, Lock, User, LogOut, Tag, Edit, ShoppingBag, ChevronRight, Plus, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../context/CartContext';
import './Admin.css';

const Admin: React.FC = () => {
  const { orders, products, updateOrderStatus, addProduct, editProduct } = useCart();
  const [filter, setFilter] = useState<'All' | 'Today' | 'Week'>('All');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({ name: '', brand: '', price: '', originalPrice: '', image: '/perfume1.png' });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: prodForm.name,
      brand: prodForm.brand,
      price: Number(prodForm.price),
      originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : undefined,
      image: prodForm.image,
      rating: 5.0
    };
    if (editingId) {
      editProduct(editingId, data);
      setEditingId(null);
    } else {
      addProduct(data);
    }
    setProdForm({ name: '', brand: '', price: '', originalPrice: '', image: '/perfume1.png' });
    setShowProductForm(false);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setProdForm({ name: p.name, brand: p.brand, price: p.price.toString(), originalPrice: p.originalPrice ? p.originalPrice.toString() : '', image: p.image });
    setShowProductForm(true);
  };
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="adm-login-page">
        <div className="adm-login-bg"></div>
        <div className="adm-login-card">
          <div className="adm-login-brand">
            <div className="adm-login-logo">DP</div>
            <h2>DubaiPerfume</h2>
            <p>Admin Control Center</p>
          </div>
          
          <form className="adm-login-form" onSubmit={handleLogin}>
            <div className="adm-field">
              <label>Username</label>
              <div className="adm-field-input">
                <User size={18} />
                <input type="text" placeholder="Enter username" required value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
            
            <div className="adm-field">
              <label>Password</label>
              <div className="adm-field-input">
                <Lock size={18} />
                <input type="password" placeholder="Enter password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {authError && <div className="adm-error">Invalid credentials. Please try again.</div>}

            <button type="submit" className="adm-login-submit">
              Sign In
              <ChevronRight size={18} />
            </button>
            <p className="adm-hint">Demo: admin / admin123</p>
          </form>
        </div>
      </div>
    );
  }

  // Filter logic
  const filteredOrders = orders.filter(o => {
    if (filter === 'All') return true;
    if (filter === 'Today') return o.date === new Date().toLocaleDateString();
    return true;
  });

  // Analytics
  const totalRevenue = filteredOrders.reduce((sum, ord) => sum + ord.total, 0);
  const productSales: Record<string, { name: string; qty: number; rev: number }> = {};
  filteredOrders.forEach(o => {
    o.items.forEach(item => {
      if (!productSales[item.id]) productSales[item.id] = { name: item.name, qty: 0, rev: 0 };
      productSales[item.id].qty += item.quantity;
      productSales[item.id].rev += (item.price * item.quantity);
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.rev - a.rev).slice(0, 5);
  const deliveredCount = filteredOrders.filter(o => o.status === 'Delivered').length;
  const processingCount = filteredOrders.filter(o => o.status === 'Processing').length;

  return (
    <div className="adm-layout">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <div className="adm-brand-icon">DP</div>
          <span>Admin</span>
        </div>
        <nav className="adm-sidebar-nav">
          <button className={`adm-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </button>
          <button className={`adm-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <Package size={20} />
            <span>Orders</span>
            {processingCount > 0 && <span className="adm-nav-badge">{processingCount}</span>}
          </button>
          <button className={`adm-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Tag size={20} />
            <span>Products</span>
          </button>
        </nav>
        <div className="adm-profile-wrapper">
          <button className="adm-profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <User size={18} />
            <span>Profile</span>
          </button>
          {showProfileMenu && (
            <>
              <div className="adm-profile-overlay" onClick={() => setShowProfileMenu(false)}></div>
              <div className="adm-profile-dropdown">
                <div className="adm-profile-info">
                  <div className="adm-profile-avatar"><User size={24} /></div>
                  <div>
                    <div className="adm-profile-name">Admin</div>
                    <div className="adm-profile-role">Store Manager</div>
                  </div>
                </div>
                <div className="adm-profile-divider"></div>
                <button className="adm-profile-logout" onClick={() => setIsAuthenticated(false)}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="adm-main">
        {/* Top Bar */}
        <div className="adm-topbar">
          <div className="adm-topbar-left">
            <h1 className="adm-page-title">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'products' && 'Product Catalog'}
            </h1>
            <span className="adm-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="adm-content animate-fade-in">
            {/* Filter */}
            <div className="adm-filter-row">
              {['All', 'Today', 'Week'].map(f => (
                <button key={f} className={`adm-filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f as any)}>{f}</button>
              ))}
            </div>

            {/* Stat Cards */}
            <div className="adm-stats-grid">
              <div className="adm-stat-card">
                <div className="adm-stat-icon" style={{background: 'rgba(212, 175, 55, 0.15)'}}>
                  <DollarSign size={22} color="#D4AF37" />
                </div>
                <div className="adm-stat-body">
                  <span className="adm-stat-label">Revenue</span>
                  <span className="adm-stat-value">AED {totalRevenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="adm-stat-card">
                <div className="adm-stat-icon" style={{background: 'rgba(52, 152, 219, 0.15)'}}>
                  <ShoppingBag size={22} color="#3498db" />
                </div>
                <div className="adm-stat-body">
                  <span className="adm-stat-label">Orders</span>
                  <span className="adm-stat-value">{filteredOrders.length}</span>
                </div>
              </div>
              <div className="adm-stat-card">
                <div className="adm-stat-icon" style={{background: 'rgba(46, 204, 113, 0.15)'}}>
                  <Package size={22} color="#2ecc71" />
                </div>
                <div className="adm-stat-body">
                  <span className="adm-stat-label">Delivered</span>
                  <span className="adm-stat-value">{deliveredCount}</span>
                </div>
              </div>
              <div className="adm-stat-card">
                <div className="adm-stat-icon" style={{background: 'rgba(155, 89, 182, 0.15)'}}>
                  <Tag size={22} color="#9b59b6" />
                </div>
                <div className="adm-stat-body">
                  <span className="adm-stat-label">Products</span>
                  <span className="adm-stat-value">{products.length}</span>
                </div>
              </div>
            </div>

            {/* Top Products Table */}
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-card-title">
                  <TrendingUp size={18} className="text-gold" />
                  <h3>Top Selling Products</h3>
                </div>
              </div>
              <div className="adm-card-body">
                {topProducts.length === 0 ? (
                  <div className="adm-empty-small">No sales data for this period</div>
                ) : (
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((p, i) => (
                        <tr key={i}>
                          <td><span className="adm-rank">{i + 1}</span></td>
                          <td className="adm-prod-name">{p.name}</td>
                          <td>{p.qty} units</td>
                          <td className="text-gold">AED {p.rev.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-card-title">
                  <Package size={18} className="text-gold" />
                  <h3>Recent Orders</h3>
                </div>
                <button className="adm-link" onClick={() => setActiveTab('orders')}>View All <ChevronRight size={14} /></button>
              </div>
              <div className="adm-card-body">
                {filteredOrders.slice(0, 3).map(order => (
                  <div key={order.id} className="adm-mini-order">
                    <div className="adm-mini-order-left">
                      <span className="adm-mini-id">{order.id}</span>
                      <span className="adm-mini-date">{order.date}</span>
                    </div>
                    <span className="adm-mini-amount">AED {order.total}</span>
                    <span className={`adm-status-pill status-${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="adm-content animate-fade-in">
            <div className="adm-filter-row">
              {['All', 'Today', 'Week'].map(f => (
                <button key={f} className={`adm-filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f as any)}>{f}</button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="adm-empty-state">
                <Package size={56} color="#333" />
                <h3>No orders found</h3>
                <p>Change the filter to see older orders.</p>
              </div>
            ) : (
              <div className="adm-orders-grid">
                {filteredOrders.map(order => (
                  <div key={order.id} className="adm-order-card">
                    <div className="adm-order-top">
                      <div>
                        <div className="adm-order-id">{order.id}</div>
                        <div className="adm-order-date">{order.date}</div>
                      </div>
                      <select
                        className={`adm-status-select status-${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="adm-order-customer">
                      <div className="adm-cust-row"><MapPin size={14} /> {order.address}</div>
                      <div className="adm-cust-row"><Phone size={14} /> {order.phone}</div>
                    </div>

                    <div className="adm-order-items-section">
                      <div className="adm-items-label">Items ({order.items.reduce((a, it) => a + it.quantity, 0)})</div>
                      {order.items.map(item => (
                        <div key={item.id} className="adm-order-item-row">
                          <span>{item.quantity}× {item.name}</span>
                          <span>AED {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="adm-order-total-row">
                      <span>Total</span>
                      <span className="adm-order-total-val">AED {order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="adm-content animate-fade-in">
            <div className="adm-products-header">
              <span className="adm-prod-count">{products.length} Products</span>
              <button className="adm-add-btn" onClick={() => { setEditingId(null); setProdForm({ name: '', brand: '', price: '', originalPrice: '', image: '/perfume1.png' }); setShowProductForm(true); }}>
                <Plus size={18} />
                Add Product
              </button>
            </div>

            {/* Product Table */}
            <div className="adm-card">
              <div className="adm-card-body no-pad">
                <table className="adm-table adm-table-products">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Offer</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="adm-prod-cell">
                            <img src={p.image} alt={p.name} className="adm-prod-thumb" />
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td className="adm-text-secondary">{p.brand}</td>
                        <td className="adm-text-bold">AED {p.price}</td>
                        <td>
                          {p.originalPrice ? (
                            <span className="adm-offer-tag">{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF</span>
                          ) : (
                            <span className="adm-text-secondary">—</span>
                          )}
                        </td>
                        <td>
                          <button className="adm-edit-btn" onClick={() => startEdit(p)}>
                            <Edit size={16} />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Form Modal - Outside main for proper fixed positioning */}
      {showProductForm && (
        <div className="adm-modal-overlay" onClick={() => setShowProductForm(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3>{editingId ? 'Edit Product' : 'New Product'}</h3>
              <button className="adm-modal-close" onClick={() => setShowProductForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="adm-modal-form">
              <div className="adm-image-picker">
                <div className="adm-image-preview">
                  <img src={prodForm.image} alt="Preview" />
                </div>
                <div className="adm-image-options">
                  <label className="adm-field-label">Choose Image</label>
                  <div className="adm-image-presets">
                    {['/perfume1.png', '/perfume2.png'].map(img => (
                      <button
                        type="button"
                        key={img}
                        className={`adm-preset-img ${prodForm.image === img ? 'selected' : ''}`}
                        onClick={() => setProdForm({...prodForm, image: img})}
                      >
                        <img src={img} alt="option" />
                      </button>
                    ))}
                  </div>
                  <div className="adm-field" style={{marginTop: '8px'}}>
                    <label>Or paste image URL</label>
                    <input type="text" placeholder="https://..." value={prodForm.image} onChange={e => setProdForm({...prodForm, image: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="adm-field">
                <label>Product Name</label>
                <input type="text" placeholder="e.g. Oud Majestic" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} required />
              </div>
              <div className="adm-field">
                <label>Brand</label>
                <input type="text" placeholder="e.g. Dubai Luxury" value={prodForm.brand} onChange={e => setProdForm({...prodForm, brand: e.target.value})} required />
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Price (AED)</label>
                  <input type="number" placeholder="0" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} required />
                </div>
                <div className="adm-field">
                  <label>Original Price (Offer)</label>
                  <input type="number" placeholder="Optional" value={prodForm.originalPrice} onChange={e => setProdForm({...prodForm, originalPrice: e.target.value})} />
                </div>
              </div>
              <div className="adm-modal-actions">
                <button type="button" className="adm-btn-secondary" onClick={() => setShowProductForm(false)}>Cancel</button>
                <button type="submit" className="adm-btn-primary">{editingId ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
