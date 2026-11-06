import React, {  useState  } from 'react';
import { X, Clock, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { subscribeNewsletter } from '../services/api';
import './SecretDropWheel.css';

const WHEEL_SEGMENTS = [
  { label: '20% OFF', code: 'RANI20', color: '#ff8fab', textColor: '#ffffff' },
  { label: 'FREE SHIPPING', code: 'FREESHIP', color: '#fef7db', textColor: '#1c141a' },
  { label: '25% OFF SHAADI', code: 'SHAADI25', color: '#ffe5ec', textColor: '#880e4f' },
  { label: 'SILK GIFT', code: 'SILKGIFT', color: '#f3e8ff', textColor: '#004d40' },
  { label: '15% OFF NOOR', code: 'NOOR15', color: '#ffc2d1', textColor: '#c9184a' },
  { label: 'UTSAV 50%', code: 'UTSAV50', color: '#1c141a', textColor: '#fbc02d' }
];

const SecretDropWheel = ({ isOpen, onClose }) => {
  const { applyDiscount, toggleCart } = useCart();
  
  const [email, setEmail] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningSegment, setWinningSegment] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);

  if (!isOpen) return null;

  const handleSpin = (e) => {
    e.preventDefault();
    if (!email || isSpinning || hasSpun) return;

    // Save subscriber to backend database
    subscribeNewsletter(email.trim(), 'SECRET_WHEEL').catch(() => {});

    setIsSpinning(true);

    // Target a guaranteed winning segment: 20% OFF (Segment index 0 - RANI20)
    const targetIndex = 0;
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    
    // 5 full spins (1800 deg) + offset to land on segment 0
    const extraSpins = 360 * 5;
    const targetAngle = extraSpins + (360 - (targetIndex * segmentAngle) - (segmentAngle / 2));

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      const won = WHEEL_SEGMENTS[targetIndex];
      setWinningSegment(won);
      applyDiscount(won.code);
    }, 4000);
  };

  const handleClaimReward = () => {
    onClose();
    toggleCart();
  };

  return (
    <div className="wheel-backdrop animate-fade-in" onClick={onClose}>
      <div className="wheel-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="wheel-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="wheel-header text-center">
          <span className="wheel-badge">👑 EXCLUSIVE ROYAL ACCESS</span>
          <h2 className="wheel-title">Spin The Royal Shaadi Wheel</h2>
          <p className="wheel-subtitle">
            Enter your email to unlock instant royal discounts, free pure silk gifts & VIP trousseau rewards!
          </p>
        </div>

        {/* Wheel Apparatus */}
        <div className="wheel-container-wrap">
          <div className="wheel-pointer-triangle"></div>
          
          <div 
            className="wheel-circle"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
            }}
          >
            {WHEEL_SEGMENTS.map((seg, idx) => {
              const angle = (360 / WHEEL_SEGMENTS.length) * idx;
              return (
                <div 
                  key={idx}
                  className="wheel-slice"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    backgroundColor: seg.color,
                    color: seg.textColor
                  }}
                >
                  <span className="slice-text">{seg.label}</span>
                </div>
              );
            })}
          </div>

          <div className="wheel-center-pin">
            <span>✨</span>
          </div>
        </div>

        {/* Form or Winning Result */}
        {!winningSegment ? (
          <form className="wheel-form mt-6" onSubmit={handleSpin}>
            <div className="wheel-input-box">
              <input 
                type="email" 
                placeholder="Enter your email to unlock wheel..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSpinning}
              />
              <button 
                type="submit" 
                className="btn btn-cute-pink btn-spin-now"
                disabled={isSpinning}
              >
                <span>{isSpinning ? 'SPINNING...' : 'SPIN TO WIN 💖'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="wheel-win-announcement animate-fade-in mt-6 text-center">
            <span className="congrats-tag">✨ CONGRATULATIONS, ANGEL!</span>
            <h3 className="won-prize-title">You Unlocked {winningSegment.label}!</h3>
            <p className="won-prize-desc">
              Code <strong>{winningSegment.code}</strong> has been automatically applied to your cart bag!
            </p>

            <div className="countdown-pill">
              <Clock size={14} />
              <span>Discount active for: <strong>14:59</strong></span>
            </div>

            <button className="btn btn-cute-pink btn-claim-now" onClick={handleClaimReward}>
              <span>SHOP YOUR DROP WITH 20% OFF 💖</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SecretDropWheel;
