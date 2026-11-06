import React, {  useState  } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { subscribeNewsletter } from '../services/api';
import './Footer.css';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      try {
        await subscribeNewsletter(newsletterEmail, 'FOOTER_FORM');
      } catch {
        // continue
      }
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="luxe-footer">
      
      {/* 1. VIP Club Newsletter Banner */}
      <div className="container">
        <div className="vip-newsletter-box">
          <div className="newsletter-content">
            <span className="newsletter-tag">🌸 JOIN THE ROYAL MUSE CIRCLE</span>
            <h3 className="newsletter-title">Unlock 15% Off Your Royal Heirloom</h3>
            <p className="newsletter-desc">
              Be the first to access bridal trousseau drops, pure handloom restocks, and private invitations to exclusive festive previews.
            </p>
          </div>

          <form className="newsletter-form-box" onSubmit={handleSubscribe}>
            {subscribed ? (
              <div className="subscribed-feedback">
                <CheckCircle2 size={20} className="check-icon" />
                <span>Welcome to the Royal Circle, Rani! Use code <strong>RANI15</strong> on your order 💖</span>
              </div>
            ) : (
              <div className="newsletter-input-group">
                <input 
                  type="email" 
                  placeholder="Enter your email address..." 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required 
                />
                <button type="submit" className="btn btn-cute-pink btn-subscribe-pill">
                  <span>Join Circle 💌</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div className="container footer-main-grid mt-16">
        
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span>👑</span>
            <h2>Taasa.</h2>
          </div>
          <p className="brand-statement">
            Authentic Indian luxury ethnic wear celebrating centuries of royal weaving, bridal opulence, and timeless femininity. Handcrafted by master karigars across India.
          </p>
          <div className="social-pills-row">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-pill" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-pill" aria-label="TikTok">
              <span>🎵</span>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="social-pill" aria-label="Pinterest">
              <span>📌</span>
            </a>
          </div>
        </div>

        {/* Shop Collections */}
        <div className="footer-col">
          <h4 className="footer-title">ROYAL SILHOUETTES</h4>
          <ul className="footer-nav-list">
            <li><Link to="/collections/kurtis">Kurtis & Tunics 🌸</Link></li>
            <li><Link to="/collections/dresses">Dresses & Anarkalis 👑</Link></li>
            <li><Link to="/collections/co-ord-set">Modern Co-ord Sets ✨</Link></li>
            <li><Link to="/collections/two-piece-set">Two Piece Sets 💃</Link></li>
            <li><Link to="/collections/plus-size-collection">Plus Size Collection 💖</Link></li>
            <li><Link to="/collections/pants">Luxury Tailored Pants 💎</Link></li>
          </ul>
        </div>

        {/* Aesthetic Edits */}
        <div className="footer-col">
          <h4 className="footer-title">HERITAGE EDITS</h4>
          <ul className="footer-nav-list">
            <li><Link to="/collections/sarees">👑 Varanasi Pit-Loom Silks</Link></li>
            <li><Link to="/collections/lehengas">✨ Imperial Zardozi Bridal</Link></li>
            <li><Link to="/collections/suits">🌸 Mughal Court Pastels</Link></li>
            <li><Link to="/collections/suits">💃 Sangeet Mirror Twirls</Link></li>
            <li><Link to="/collections/sarees">🍸 Cocktail Palace Drapes</Link></li>
          </ul>
        </div>

        {/* Client Concierge */}
        <div className="footer-col">
          <h4 className="footer-title">ROYAL CONCIERGE</h4>
          <ul className="footer-nav-list">
            <li><Link to="/track-order">Track Royal Order 📦</Link></li>
            <li><Link to="/shipping">Worldwide Insured Shipping</Link></li>
            <li><Link to="/returns">Bespoke Blouse Customization</Link></li>
            <li><Link to="/size-guide">Indian Sizing & Fall/Pico Guide</Link></li>
            <li><Link to="/contact">24/7 Bridal Video Stylist</Link></li>
          </ul>
        </div>

      </div>

      {/* 3. Bottom Legal & Payment Icons */}
      <div className="container footer-bottom-strip">
        <div className="copyright-wrap">
          <p>&copy; {new Date().getFullYear()} Taasa Official. Handcrafted with 💖 for royal Indian queens.</p>
        </div>

        <div className="payment-badges-row">
          <span className="pay-badge">BHIM UPI</span>
          <span className="pay-badge">RuPay</span>
          <span className="pay-badge">Visa</span>
          <span className="pay-badge">Mastercard</span>
          <span className="pay-badge">Net Banking</span>
          <span className="pay-badge">Apple Pay</span>
          <span className="pay-badge">COD</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
