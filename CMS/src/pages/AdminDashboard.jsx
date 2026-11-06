import React, {  useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tag, 
  Users, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Search, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  Sparkles, 
  X, 
  Camera, 
  Mail, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getAdminStats, 
  getProducts, 
  createProduct, 
  updateProduct,
  deleteProduct, 
  getOrders, 
  updateOrderStatus, 
  deleteOrder, 
  getPromos, 
  createPromo, 
  togglePromo, 
  deletePromo,
  getAllUgcPosts,
  updateUgcStatus,
  deleteUgcPost,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber
} from '../services/api';
import { formatINR } from '../utils/currency';
import './AdminDashboard.css';

const CATEGORY_SUBTYPES_MAP = {
  'Kurtis': ['Short Kurti', 'Long Kurti', 'Sleeveless', 'Straight Cut', 'Kurti Shirts', 'Tunics'],
  'Dresses': ['Anarkali', 'Angrakha', 'A-Line', 'Long Flared Tunics'],
  'Co-ord set': ['Blazer & Trouser', 'Cape & Palazzo', 'Printed Silk Co-ords'],
  'Two piece set': ['Peplum & Sharara', 'Crop Top & Dhoti', 'Kurti & Gharara'],
  'Plus size collection': ['Curvy Anarkalis', 'Plus Kaftans', 'Flowy Tunics'],
  'Pants': ['Cigarette Pants', 'Flared Palazzos', 'Dhoti Pants', 'Velvet Trousers'],
  'Sarees': ['Banarasi Katan', 'Organza Tissue', 'Pre-Draped Satin', 'Chanderi Zari'],
  'Lehengas': ['Bridal Lehengas', 'Sangeet Cholis', 'Pastel Florals', 'Velvet Ensembles'],
  'Suits & Anarkalis': ['Anarkali', 'Straight Suit', 'Sharara Suit'],
  'Shararas & Sets': ['Sharara Pairs', 'Gharara Sets'],
  'Indo-Western & Drapes': ['Pre-Draped Drapes', 'Corset Blouse Pairs']
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'promos' | 'ugc' | 'subscribers'
  
  // Dynamic State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promos, setPromos] = useState([]);
  const [ugcPosts, setUgcPosts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [statusNotification, setStatusNotification] = useState(null);

  // Search & Filter state
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddPromoModalOpen, setIsAddPromoModalOpen] = useState(false);

  // New Product Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Kurtis');
  const [newSubcategory, setNewSubcategory] = useState('Short Kurti');
  const [newAesthetic, setNewAesthetic] = useState('Heritage Royalty');
  const [newPrice, setNewPrice] = useState('');
  const [newSalePrice, setNewSalePrice] = useState('');
  const [newStock, setNewStock] = useState('20');
  const [newFabric, setNewFabric] = useState('100% Handwoven Pure Mulberry Silk');
  const [newImage, setNewImage] = useState('');
  const [newBadge, setNewBadge] = useState('🌸 Fresh Drop');

  // Edit Product Modal State
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Kurtis');
  const [editSubcategory, setEditSubcategory] = useState('Short Kurti');
  const [editAesthetic, setEditAesthetic] = useState('Heritage Royalty');
  const [editPrice, setEditPrice] = useState('');
  const [editSalePrice, setEditSalePrice] = useState('');
  const [editStock, setEditStock] = useState('20');
  const [editFabric, setEditFabric] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // New Promo Form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState('PERCENTAGE');
  const [newPromoValue, setNewPromoValue] = useState('0.20');
  const [newPromoMinOrder, setNewPromoMinOrder] = useState('0');

  // Show Toast Notification
  const showToast = (message) => {
    setStatusNotification(message);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  // Fetch all live data from backend
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, promosRes, ugcRes, subsRes] = await Promise.all([
        getAdminStats().catch(() => ({ data: null })),
        getProducts().catch(() => ({ data: [] })),
        getOrders().catch(() => ({ data: [] })),
        getPromos().catch(() => ({ data: [] })),
        getAllUgcPosts().catch(() => ({ data: [] })),
        getNewsletterSubscribers().catch(() => ({ data: [] }))
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (productsRes?.data) setProducts(productsRes.data);
      if (ordersRes?.data) setOrders(ordersRes.data);
      if (promosRes?.data) setPromos(promosRes.data);
      if (ugcRes?.data) setUgcPosts(ugcRes.data);
      if (subsRes?.data) setSubscribers(subsRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handler: Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    try {
      const payload = {
        title: newTitle,
        category: newCategory,
        subcategory: newSubcategory || null,
        aesthetic: newAesthetic,
        basePrice: parseFloat(newPrice),
        salePrice: newSalePrice ? parseFloat(newSalePrice) : null,
        stockQuantity: parseInt(newStock, 10) || 15,
        fabric: newFabric,
        badge: newBadge,
        image: newImage || 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=800',
        variants: [
          { size: 'XS', colorName: 'Standard', colorHex: '#ff8fab', inventory: 5 },
          { size: 'S', colorName: 'Standard', colorHex: '#ff8fab', inventory: 10 },
          { size: 'M', colorName: 'Standard', colorHex: '#ff8fab', inventory: 8 }
        ]
      };

      const res = await createProduct(payload);
      if (res?.data) {
        setProducts([res.data, ...products]);
        showToast('New fashion drop published to store! 💖');
      }
      setIsAddProductModalOpen(false);
      setNewTitle('');
      setNewPrice('');
      setNewSalePrice('');
      setNewImage('');
    } catch (err) {
      alert(err.message || 'Error creating product');
    }
  };

  // Handler: Open Edit Product Modal
  const handleOpenEditProduct = (p) => {
    setEditingProductId(p.id);
    setEditTitle(p.title || '');
    setEditCategory(p.category || 'Kurtis');
    setEditSubcategory(p.subcategory || (CATEGORY_SUBTYPES_MAP[p.category]?.[0] || ''));
    setEditAesthetic(p.aesthetic || 'Heritage Royalty');
    setEditPrice(p.basePrice !== undefined ? String(p.basePrice) : '');
    setEditSalePrice(p.salePrice ? String(p.salePrice) : '');
    setEditStock(p.stockQuantity !== undefined ? String(p.stockQuantity) : '15');
    setEditFabric(p.fabric || '');
    setEditImage(p.image || '');
    setEditBadge(p.badge || '');
    setEditDescription(p.description || '');
    setIsEditProductModalOpen(true);
  };

  // Handler: Save Edited Product
  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProductId || !editTitle || !editPrice) return;

    try {
      const payload = {
        title: editTitle,
        category: editCategory,
        subcategory: editSubcategory || null,
        aesthetic: editAesthetic,
        basePrice: parseFloat(editPrice),
        salePrice: editSalePrice ? parseFloat(editSalePrice) : null,
        stockQuantity: parseInt(editStock, 10) || 0,
        fabric: editFabric,
        badge: editBadge,
        image: editImage,
        description: editDescription
      };

      const res = await updateProduct(editingProductId, payload);
      if (res?.data) {
        setProducts(products.map(p => p.id === editingProductId ? { ...p, ...res.data } : p));
        showToast('Product updated successfully! ✨');
      }
      setIsEditProductModalOpen(false);
      setEditingProductId(null);
    } catch (err) {
      alert(err.message || 'Error updating product');
    }
  };

  // Handler: Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this piece?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      showToast('Product deleted.');
    } catch (err) {
      alert(err.message || 'Error deleting product');
    }
  };

  // Handler: Update Order Status
  const handleCycleOrderStatus = async (orderId, currentStatus) => {
    const statusSequence = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusSequence.indexOf(currentStatus.toUpperCase());
    const nextStatus = currentIndex >= 0 && currentIndex < statusSequence.length - 1 
      ? statusSequence[currentIndex + 1] 
      : 'DELIVERED';

    try {
      await updateOrderStatus(orderId, nextStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      showToast(`Order status updated to ${nextStatus} ✨`);
    } catch (err) {
      alert(err.message || 'Error updating order status');
    }
  };

  // Handler: Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order record?')) return;
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      showToast('Order record removed.');
    } catch (err) {
      alert(err.message || 'Error deleting order');
    }
  };

  // Handler: Add Promo Code
  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (!newPromoCode) return;

    try {
      const res = await createPromo({
        code: newPromoCode,
        discountType: newPromoType,
        value: parseFloat(newPromoValue),
        minOrder: parseFloat(newPromoMinOrder || 0),
        active: true
      });

      if (res?.data) {
        setPromos([res.data, ...promos]);
        showToast(`Promo code ${res.data.code} created! 🌸`);
      }
      setIsAddPromoModalOpen(false);
      setNewPromoCode('');
    } catch (err) {
      alert(err.message || 'Error creating promo code');
    }
  };

  // Handler: Toggle Promo Active
  const handleTogglePromo = async (id) => {
    try {
      const res = await togglePromo(id);
      setPromos(promos.map(p => p.id === id ? { ...p, active: res.data.active } : p));
      showToast(`Promo ${res.data.code} is now ${res.data.active ? 'Active' : 'Paused'}`);
    } catch (err) {
      alert(err.message || 'Error updating promo');
    }
  };

  // Handler: Delete Promo
  const handleDeletePromo = async (id) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await deletePromo(id);
      setPromos(promos.filter(p => p.id !== id));
      showToast('Promo code removed.');
    } catch (err) {
      alert(err.message || 'Error deleting promo');
    }
  };

  // Handler: UGC Status Change
  const handleUgcStatus = async (id, status) => {
    try {
      await updateUgcStatus(id, status);
      setUgcPosts(ugcPosts.map(p => p.id === id ? { ...p, status } : p));
      showToast(`Look is now ${status}`);
    } catch (err) {
      alert(err.message || 'Error updating UGC status');
    }
  };

  // Handler: Delete UGC Post
  const handleDeleteUgc = async (id) => {
    if (!window.confirm('Delete this UGC submission?')) return;
    try {
      await deleteUgcPost(id);
      setUgcPosts(ugcPosts.filter(p => p.id !== id));
      showToast('UGC post removed.');
    } catch (err) {
      alert(err.message || 'Error deleting UGC post');
    }
  };

  // Handler: Delete Subscriber
  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Remove this email from VIP subscriber list?')) return;
    try {
      await deleteNewsletterSubscriber(id);
      setSubscribers(subscribers.filter(s => s.id !== id));
      showToast('Subscriber removed from list.');
    } catch (err) {
      alert(err.message || 'Error removing subscriber');
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
      p.aesthetic.toLowerCase().includes(q);
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status.toUpperCase() === orderStatusFilter.toUpperCase();
    let matchesSearch = true;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      matchesSearch = o.orderNumber.toLowerCase().includes(q) || 
        o.customerName?.toLowerCase().includes(q) || 
        o.customerEmail?.toLowerCase().includes(q);
    }
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-layout">
      
      {/* Toast Notification */}
      {statusNotification && (
        <div className="admin-toast-badge animate-fade-in">
          <Sparkles size={16} />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* 1. Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand-wrap">
            <span className="sparkle-icon">✨</span>
            <h2>Taasa<span>.</span></h2>
          </div>
          <span className="admin-badge-tag">CMS STUDIO</span>
        </div>

        <nav className="admin-nav-menu">
          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Overview & KPIs</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBag size={18} />
            <span>Product Catalog</span>
            <span className="nav-count-badge">{products.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} />
            <span>Live Orders</span>
            <span className="nav-count-badge">{orders.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'promos' ? 'active' : ''}`}
            onClick={() => setActiveTab('promos')}
          >
            <Tag size={18} />
            <span>VIP Promo Codes</span>
            <span className="nav-count-badge">{promos.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'ugc' ? 'active' : ''}`}
            onClick={() => setActiveTab('ugc')}
          >
            <Camera size={18} />
            <span>#Muses UGC Feed</span>
            <span className="nav-count-badge">{ugcPosts.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'subscribers' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscribers')}
          >
            <Mail size={18} />
            <span>VIP Subscribers</span>
            <span className="nav-count-badge">{subscribers.length}</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-profile-pill">
            <img src={user?.avatar || "https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=150"} alt="Admin" />
            <div className="profile-text">
              <h5>{user?.name || 'Victoria'}</h5>
              <span>Principal Creative Admin</span>
            </div>
          </div>

          <div className="sidebar-action-links">
            <Link to="/" className="sidebar-link">
              <ExternalLink size={14} /> Back to Storefront
            </Link>
            <button className="sidebar-link logout-btn" onClick={logout}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="admin-main">
        
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="topbar-title-wrap">
            <h1>
              {activeTab === 'overview' && 'Executive Overview & Brand KPIs'}
              {activeTab === 'products' && 'Product Catalog & Drops'}
              {activeTab === 'orders' && 'Real-Time Customer Orders'}
              {activeTab === 'promos' && 'VIP Promo Codes & Campaign Engine'}
              {activeTab === 'ugc' && '#TaasaMuses UGC Feed Moderation'}
              {activeTab === 'subscribers' && 'VIP Email Subscribers List'}
            </h1>
            <p className="topbar-subtitle">
              Taasa Luxury E-Commerce Engine • Connected to SQLite REST Backend
            </p>
          </div>

          <div className="topbar-actions">
            <button className="btn btn-outline-rose refresh-btn" onClick={loadAllData} title="Sync with live database">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Sync DB</span>
            </button>

            {activeTab === 'products' && (
              <button className="btn btn-cute-pink" onClick={() => setIsAddProductModalOpen(true)}>
                <Plus size={16} />
                <span>New Fashion Drop</span>
              </button>
            )}

            {activeTab === 'promos' && (
              <button className="btn btn-cute-pink" onClick={() => setIsAddPromoModalOpen(true)}>
                <Plus size={16} />
                <span>New Promo Code</span>
              </button>
            )}

            <div className="live-status-pill">
              <span className="live-dot pulse"></span>
              <span>REST API Online (Port 5000)</span>
            </div>
          </div>
        </header>

        {/* ============================================================
            TAB 1: EXECUTIVE OVERVIEW & KPIS
           ============================================================ */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content animate-fade-in">
            
            {/* KPI Cards Row */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon-wrap rose">
                  <DollarSign size={20} />
                </div>
                <div className="kpi-details">
                  <span className="kpi-label">Gross Revenue</span>
                  <h3 className="kpi-value">{formatINR(stats?.kpis?.totalRevenue || 120498)}</h3>
                  <span className="kpi-trend positive">
                    <TrendingUp size={12} /> +18.4% vs last week
                  </span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap champagne">
                  <ShoppingBag size={20} />
                </div>
                <div className="kpi-details">
                  <span className="kpi-label">Active Products</span>
                  <h3 className="kpi-value">{products.length}</h3>
                  <span className="kpi-subtext">Across 5 silk categories</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap violet">
                  <Package size={20} />
                </div>
                <div className="kpi-details">
                  <span className="kpi-label">Total Store Orders</span>
                  <h3 className="kpi-value">{orders.length}</h3>
                  <span className="kpi-subtext">Avg Order: {formatINR(stats?.kpis?.averageOrderValue || 30124)}</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap blush">
                  <Users size={20} />
                </div>
                <div className="kpi-details">
                  <span className="kpi-label">Registered Muses</span>
                  <h3 className="kpi-value">{stats?.kpis?.totalCustomers || (orders.length + subscribers.length)}</h3>
                  <span className="kpi-trend positive">
                    <Sparkles size={12} /> High brand loyalty
                  </span>
                </div>
              </div>
            </div>

            {/* Low Stock Inventory Warning Banner */}
            {stats?.lowStockAlerts && stats.lowStockAlerts.length > 0 && (
              <div className="low-stock-banner mt-6">
                <div className="low-stock-header">
                  <AlertTriangle size={18} className="text-warning" />
                  <strong>Low Stock Alerts ({stats.lowStockAlerts.length} variants need restocking):</strong>
                </div>
                <div className="low-stock-chips">
                  {stats.lowStockAlerts.slice(0, 4).map((alert, idx) => (
                    <span key={idx} className="low-stock-chip">
                      {alert.productTitle} — Size {alert.size} ({alert.inventory} left)
                    </span>
                  ))}
                  {stats.lowStockAlerts.length > 4 && (
                    <span className="low-stock-chip more">+{stats.lowStockAlerts.length - 4} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions & Recent Orders Table */}
            <div className="admin-content-grid mt-6">
              
              {/* Recent Orders */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Recent Customer Orders</h3>
                  <button className="link-button" onClick={() => setActiveTab('orders')}>
                    View All Orders ➔
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                          <td><strong>{order.orderNumber}</strong></td>
                          <td>
                            <div className="customer-cell">
                              <span>{order.customerName}</span>
                              <small>{order.customerEmail}</small>
                            </div>
                          </td>
                          <td>
                            <span className="order-items-snippet">
                              {order.items?.length 
                                ? `${order.items[0]?.title} (${order.items[0]?.size || 'S'})${order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}`
                                : '1 item'}
                            </span>
                          </td>
                          <td><strong>{formatINR(order.total)}</strong></td>
                          <td>
                            <span className={`status-pill ${order.status?.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => handleCycleOrderStatus(order.id, order.status)}
                              title="Advance Status"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Status Distribution Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Order Pipeline</h3>
                </div>

                <div className="pipeline-stats-list">
                  <div className="pipeline-item">
                    <span className="pipeline-name">Processing</span>
                    <span className="pipeline-bar-wrapper">
                      <span className="pipeline-bar processing" style={{ width: `${Math.max(20, (orders.filter(o => o.status === 'PROCESSING').length / Math.max(1, orders.length)) * 100)}%` }}></span>
                    </span>
                    <span className="pipeline-count">{orders.filter(o => o.status === 'PROCESSING').length}</span>
                  </div>

                  <div className="pipeline-item">
                    <span className="pipeline-name">Shipped</span>
                    <span className="pipeline-bar-wrapper">
                      <span className="pipeline-bar shipped" style={{ width: `${Math.max(20, (orders.filter(o => o.status === 'SHIPPED').length / Math.max(1, orders.length)) * 100)}%` }}></span>
                    </span>
                    <span className="pipeline-count">{orders.filter(o => o.status === 'SHIPPED').length}</span>
                  </div>

                  <div className="pipeline-item">
                    <span className="pipeline-name">Delivered</span>
                    <span className="pipeline-bar-wrapper">
                      <span className="pipeline-bar delivered" style={{ width: `${Math.max(20, (orders.filter(o => o.status === 'DELIVERED').length / Math.max(1, orders.length)) * 100)}%` }}></span>
                    </span>
                    <span className="pipeline-count">{orders.filter(o => o.status === 'DELIVERED').length}</span>
                  </div>

                  <div className="pipeline-item">
                    <span className="pipeline-name">Pending</span>
                    <span className="pipeline-bar-wrapper">
                      <span className="pipeline-bar pending" style={{ width: `${Math.max(20, (orders.filter(o => o.status === 'PENDING').length / Math.max(1, orders.length)) * 100)}%` }}></span>
                    </span>
                    <span className="pipeline-count">{orders.filter(o => o.status === 'PENDING').length}</span>
                  </div>
                </div>

                <div className="quick-action-cta mt-6 text-center">
                  <button className="btn btn-cute-pink" style={{ width: '100%' }} onClick={() => setIsAddProductModalOpen(true)}>
                    <Plus size={16} /> Publish New Fashion Drop
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================
            TAB 2: PRODUCT CATALOG MANAGEMENT
           ============================================================ */}
        {activeTab === 'products' && (
          <div className="admin-tab-content animate-fade-in">
            <div className="admin-card">
              
              <div className="table-controls-bar">
                <div className="search-input-wrap">
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search drops by title, category, aesthetic..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <span className="showing-text">Showing {filteredProducts.length} pieces</span>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category & Subcategory</th>
                      <th>Aesthetic</th>
                      <th>Price</th>
                      <th>Stock Units</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-cell">
                            <img 
                              src={product.image} 
                              alt={product.title} 
                              className="product-thumb" 
                              style={{ width: '52px', height: '64px', minWidth: '52px', maxWidth: '52px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <div className="product-title-group">
                              <strong>{product.title}</strong>
                              {product.badge && <span className="cell-badge">{product.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{product.category}</div>
                          {product.subcategory && (
                            <span 
                              className="aesthetic-chip" 
                              style={{ 
                                fontSize: '11px', 
                                marginTop: '4px', 
                                display: 'inline-block', 
                                background: '#fff0f3', 
                                color: '#c2185b', 
                                border: '1px solid #ffd1dc' 
                              }}
                            >
                              {product.subcategory}
                            </span>
                          )}
                        </td>
                        <td><span className="aesthetic-chip">{product.aesthetic}</span></td>
                        <td>
                          <strong>{formatINR(product.basePrice)}</strong>
                          {product.salePrice && <span className="old-price">{formatINR(product.salePrice)}</span>}
                        </td>
                        <td>
                          <span className={`stock-badge ${product.stockQuantity < 10 ? 'low' : ''}`}>
                            {product.stockQuantity} in stock
                          </span>
                        </td>
                        <td>⭐ {product.ratingsAvg || '4.9'} ({product.reviewsCount || 0})</td>
                        <td>
                          <div className="table-actions-cell">
                            <Link to={`/products/${product.id}`} className="icon-action-btn" title="View PDP" target="_blank">
                              <Eye size={15} />
                            </Link>
                            <button 
                              className="icon-action-btn edit" 
                              onClick={() => handleOpenEditProduct(product)}
                              title="Edit Piece"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              className="icon-action-btn delete" 
                              onClick={() => handleDeleteProduct(product.id)}
                              title="Delete Product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: ORDERS MANAGEMENT
           ============================================================ */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content animate-fade-in">
            <div className="admin-card">
              
              <div className="table-controls-bar">
                <div className="search-input-wrap">
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search by Order #, Customer, or Email..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>

                <div className="filter-select-wrap">
                  <select 
                    value={orderStatusFilter} 
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="admin-select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Shipping City</th>
                      <th>Items Ordered</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td><strong>{order.orderNumber}</strong></td>
                        <td>
                          <div className="customer-cell">
                            <strong>{order.customerName}</strong>
                            <small>{order.customerEmail}</small>
                          </div>
                        </td>
                        <td>{order.shippingAddress?.city || 'New York'}, {order.shippingAddress?.country || 'USA'}</td>
                        <td>
                          <div className="order-items-details">
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="item-line">
                                • {it.title} (Size: {it.size}, Qty: {it.quantity || 1})
                              </div>
                            ))}
                          </div>
                        </td>
                        <td><strong>{formatINR(order.total)}</strong></td>
                        <td><span className="pay-tag">{order.paymentMethod}</span></td>
                        <td>
                          <button 
                            className={`status-pill ${order.status.toLowerCase()} clickable`}
                            onClick={() => handleCycleOrderStatus(order.id, order.status)}
                            title="Click to advance status"
                          >
                            {order.status} ➔
                          </button>
                        </td>
                        <td>
                          <button 
                            className="icon-action-btn delete" 
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Delete Order"
                          >
                            <Trash2 size={15} />
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

        {/* ============================================================
            TAB 4: PROMO CODES ENGINE
           ============================================================ */}
        {activeTab === 'promos' && (
          <div className="admin-tab-content animate-fade-in">
            <div className="admin-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Coupon Code</th>
                      <th>Discount Value</th>
                      <th>Min Order</th>
                      <th>Usage Counter</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promos.map(promo => (
                      <tr key={promo.id}>
                        <td><span className="promo-code-badge">{promo.code}</span></td>
                        <td>
                          <strong>
                            {promo.discountType === 'PERCENTAGE' 
                              ? `${(promo.value * 100).toFixed(0)}% OFF` 
                              : `₹${Number(promo.value).toLocaleString('en-IN')} OFF`}
                          </strong>
                        </td>
                        <td>{promo.minOrder > 0 ? formatINR(promo.minOrder) : 'None'}</td>
                        <td>{promo.usageCount || 0} orders used</td>
                        <td>
                          <span className={`status-pill ${promo.active ? 'delivered' : 'pending'}`}>
                            {promo.active ? 'Active' : 'Paused'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions-cell">
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => handleTogglePromo(promo.id)}
                            >
                              {promo.active ? 'Pause' : 'Activate'}
                            </button>
                            <button 
                              className="icon-action-btn delete" 
                              onClick={() => handleDeletePromo(promo.id)}
                              title="Delete Promo"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: UGC SOCIAL FEED MODERATION
           ============================================================ */}
        {activeTab === 'ugc' && (
          <div className="admin-tab-content animate-fade-in">
            <div className="admin-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Look Preview</th>
                      <th>Creator</th>
                      <th>Caption</th>
                      <th>Category & Subcategory</th>
                      <th>Likes</th>
                      <th>Status</th>
                      <th>Moderation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ugcPosts.map(ugc => (
                      <tr key={ugc.id}>
                        <td>
                          <img 
                            src={ugc.image} 
                            alt={ugc.caption} 
                            className="product-thumb rounded" 
                            style={{ width: '52px', height: '64px', minWidth: '52px', maxWidth: '52px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </td>
                        <td>
                          <div className="customer-cell">
                            <strong>{ugc.creator}</strong>
                            <small>{ugc.location || 'Online'}</small>
                          </div>
                        </td>
                        <td>
                          <span className="ugc-caption-cell">{ugc.caption}</span>
                        </td>
                        <td><span className="aesthetic-chip">{ugc.category}</span></td>
                        <td>❤️ {ugc.likes}</td>
                        <td>
                          <span className={`status-pill ${ugc.status === 'APPROVED' ? 'delivered' : 'pending'}`}>
                            {ugc.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions-cell">
                            {ugc.status !== 'APPROVED' ? (
                              <button 
                                className="btn btn-sm btn-cute-pink"
                                onClick={() => handleUgcStatus(ugc.id, 'APPROVED')}
                              >
                                Approve
                              </button>
                            ) : (
                              <button 
                                className="btn btn-sm btn-outline"
                                onClick={() => handleUgcStatus(ugc.id, 'PENDING')}
                              >
                                Hide
                              </button>
                            )}
                            <button 
                              className="icon-action-btn delete" 
                              onClick={() => handleDeleteUgc(ugc.id)}
                              title="Delete Look"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 6: VIP EMAIL SUBSCRIBERS
           ============================================================ */}
        {activeTab === 'subscribers' && (
          <div className="admin-tab-content animate-fade-in">
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>VIP Community Newsletter Subscribers ({subscribers.length})</h3>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Subscriber Email</th>
                      <th>Acquisition Channel</th>
                      <th>Welcome Code Sent</th>
                      <th>Subscription Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map(sub => (
                      <tr key={sub.id}>
                        <td><strong>{sub.email}</strong></td>
                        <td><span className="pay-tag">{sub.source || 'FOOTER_FORM'}</span></td>
                        <td><span className="promo-code-badge">{sub.discountCodeSent || 'MUSE15'}</span></td>
                        <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="icon-action-btn delete" 
                            title="Remove Subscriber"
                            onClick={() => handleDeleteSubscriber(sub.id)}
                          >
                            <Trash2 size={15} />
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

      {/* ============================================================
          MODAL: ADD NEW PRODUCT DROP
         ============================================================ */}
      {isAddProductModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddProductModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h3>🌸 Add New Fashion Drop</h3>
              <button className="icon-btn" onClick={() => setIsAddProductModalOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddProduct} className="modal-form">
              <div className="form-group">
                <label>Product Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Silk Rosette Halter Top" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => {
                      const cat = e.target.value;
                      setNewCategory(cat);
                      const subList = CATEGORY_SUBTYPES_MAP[cat] || [];
                      setNewSubcategory(subList[0] || '');
                    }}
                  >
                    <option>Kurtis</option>
                    <option>Dresses</option>
                    <option>Co-ord set</option>
                    <option>Two piece set</option>
                    <option>Plus size collection</option>
                    <option>Pants</option>
                    <option>Sarees</option>
                    <option>Lehengas</option>
                    <option>Suits & Anarkalis</option>
                    <option>Shararas & Sets</option>
                    <option>Indo-Western & Drapes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sub Category / Cut</label>
                  <select 
                    value={newSubcategory} 
                    onChange={(e) => setNewSubcategory(e.target.value)}
                  >
                    {(CATEGORY_SUBTYPES_MAP[newCategory] || ['Standard Silhouette']).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Aesthetic Vibe</label>
                  <select value={newAesthetic} onChange={(e) => setNewAesthetic(e.target.value)}>
                    <option>Heritage Royalty</option>
                    <option>Bridal Opulence</option>
                    <option>Mughal Grace</option>
                    <option>Pastel Poetry</option>
                    <option>Sangeet Sparkle</option>
                    <option>Modern Siren</option>
                    <option>Haldi & Festive</option>
                    <option>Winter Royalty</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Marketing Badge Tag</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 💖 Viral Pick" 
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Base Price (₹ INR)</label>
                  <input 
                    type="number" 
                    step="1" 
                    placeholder="18500" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Sale Price (₹ INR, Optional)</label>
                  <input 
                    type="number" 
                    step="1" 
                    placeholder="16500" 
                    value={newSalePrice}
                    onChange={(e) => setNewSalePrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Initial Stock Units</label>
                  <input 
                    type="number" 
                    placeholder="20" 
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Fabric & Craftsmanship</label>
                  <input 
                    type="text" 
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>High-Res Image URL</label>
                <input 
                  type="url" 
                  placeholder="https://images.pexels.com/..." 
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-cute-pink" style={{ width: '100%', marginTop: '10px' }}>
                <span>Publish Drop to Storefront ✨</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: EDIT EXISTING PIECE
         ============================================================ */}
      {isEditProductModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsEditProductModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h3>✏️ Edit Fashion Piece</h3>
              <button className="icon-btn" onClick={() => setIsEditProductModalOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="modal-form">
              <div className="form-group">
                <label>Piece Title</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={editCategory} 
                    onChange={(e) => {
                      const cat = e.target.value;
                      setEditCategory(cat);
                      const subList = CATEGORY_SUBTYPES_MAP[cat] || [];
                      setEditSubcategory(subList[0] || '');
                    }}
                  >
                    <option>Kurtis</option>
                    <option>Dresses</option>
                    <option>Co-ord set</option>
                    <option>Two piece set</option>
                    <option>Plus size collection</option>
                    <option>Pants</option>
                    <option>Sarees</option>
                    <option>Lehengas</option>
                    <option>Suits & Anarkalis</option>
                    <option>Shararas & Sets</option>
                    <option>Indo-Western & Drapes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sub Category / Cut</label>
                  <select 
                    value={editSubcategory} 
                    onChange={(e) => setEditSubcategory(e.target.value)}
                  >
                    {(CATEGORY_SUBTYPES_MAP[editCategory] || ['Standard Silhouette']).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Aesthetic Vibe</label>
                  <select value={editAesthetic} onChange={(e) => setEditAesthetic(e.target.value)}>
                    <option>Heritage Royalty</option>
                    <option>Bridal Opulence</option>
                    <option>Mughal Grace</option>
                    <option>Pastel Poetry</option>
                    <option>Sangeet Sparkle</option>
                    <option>Modern Siren</option>
                    <option>Haldi & Festive</option>
                    <option>Winter Royalty</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Marketing Badge Tag</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 🌸 Fresh Drop, -15% Off" 
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Base Price (₹ INR)</label>
                  <input 
                    type="number" 
                    step="1" 
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Sale Price (₹ INR, Optional)</label>
                  <input 
                    type="number" 
                    step="1" 
                    placeholder="Leave empty if not on sale"
                    value={editSalePrice}
                    onChange={(e) => setEditSalePrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock Units</label>
                  <input 
                    type="number" 
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Fabric & Craftsmanship</label>
                  <input 
                    type="text" 
                    value={editFabric}
                    onChange={(e) => setEditFabric(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>High-Res Image URL</label>
                <input 
                  type="url" 
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="3"
                  className="admin-textarea"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-cute-pink" style={{ width: '100%', marginTop: '10px' }}>
                <span>Save Changes ✨</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: ADD NEW PROMO CODE
         ============================================================ */}
      {isAddPromoModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddPromoModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h3>🏷️ Create VIP Promo Code</h3>
              <button className="icon-btn" onClick={() => setIsAddPromoModalOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddPromo} className="modal-form">
              <div className="form-group">
                <label>Coupon Code Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. VIP25" 
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type</label>
                  <select value={newPromoType} onChange={(e) => setNewPromoType(e.target.value)}>
                    <option value="PERCENTAGE">Percentage (% Off)</option>
                    <option value="FIXED">Fixed Amount (₹ Off)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{newPromoType === 'PERCENTAGE' ? 'Discount Rate (e.g. 0.20 for 20%)' : 'Rupee Amount (e.g. 2000.00)'}</label>
                  <input 
                    type="number" 
                    step="1" 
                    value={newPromoValue}
                    onChange={(e) => setNewPromoValue(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Minimum Order Threshold (₹ INR)</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={newPromoMinOrder}
                  onChange={(e) => setNewPromoMinOrder(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-cute-pink" style={{ width: '100%', marginTop: '10px' }}>
                <span>Activate Promo Code ✨</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
