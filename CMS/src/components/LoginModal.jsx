import React, {  useState  } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, login, register, demoLogin } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (tab === 'login') {
      login(email, password);
    } else {
      register(name, email);
    }
  };

  return (
    <div className="login-backdrop animate-fade-in" onClick={closeLoginModal}>
      <div className="login-modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="login-close-btn" onClick={closeLoginModal} aria-label="Close">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="login-header">
          <div className="login-brand-icon">
            <Sparkles size={24} className="text-rose-deep" />
          </div>
          <h2 className="login-title">
            {tab === 'login' ? 'Welcome Back, Muse ✨' : 'Join The VIP Club 🌸'}
          </h2>
          <p className="login-subtitle">
            {tab === 'login' 
              ? 'Access your orders, wishlist & exclusive member discounts.'
              : 'Create an account to unlock secret drops & 15% off your first order.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="login-tabs">
          <button 
            className={`login-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Sign In
          </button>
          <button 
            className={`login-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Switcher */}
        <div className="demo-login-strip">
          <span className="demo-label">⚡ Quick 1-Click Demo Login:</span>
          <div className="demo-buttons-row">
            <button 
              type="button" 
              className="btn-demo-pill demo-admin"
              onClick={() => demoLogin('admin')}
            >
              👑 Login as Admin
            </button>
            <button 
              type="button" 
              className="btn-demo-pill demo-customer"
              onClick={() => demoLogin('customer')}
            >
              💖 Login as Customer
            </button>
          </div>
        </div>

        {error && <div className="login-error-msg">{error}</div>}

        {/* Main Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="input-field-wrap">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-field-wrap">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-field-wrap">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password (any for demo)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-cute-pink btn-submit-auth">
            <span>{tab === 'login' ? 'SIGN IN TO TAASA' : 'CREATE VIP ACCOUNT'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="login-footer-trust">
          <ShieldCheck size={14} className="text-muted" />
          <span>Encrypted & secure VIP access</span>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;
