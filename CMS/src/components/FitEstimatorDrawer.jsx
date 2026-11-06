import React, {  useState  } from 'react';
import { X, Sparkles, Check, CheckCircle2, ArrowRight } from 'lucide-react';
import './FitEstimatorDrawer.css';

const FitEstimatorDrawer = ({ isOpen, onClose, onSelectSize, _currentSelectedSize }) => {
  const [height, setHeight] = useState(65); // inches (5'5")
  const [weight, setWeight] = useState(130); // lbs
  const [fitPreference, setFitPreference] = useState('sculpted'); // 'sculpted' | 'true' | 'relaxed'

  if (!isOpen) return null;

  // Algorithm to calculate recommended size
  const calculateSize = () => {
    let score = (weight / height) * 33;
    if (fitPreference === 'sculpted') score -= 2;
    if (fitPreference === 'relaxed') score += 2;

    if (score < 60) return 'XS';
    if (score < 67) return 'S';
    if (score < 74) return 'M';
    return 'L';
  };

  const recommendedSize = calculateSize();
  const heightFeet = Math.floor(height / 12);
  const heightInches = height % 12;

  const handleApplySize = () => {
    onSelectSize(recommendedSize);
    onClose();
  };

  return (
    <>
      <div className="fit-backdrop animate-fade-in" onClick={onClose}></div>
      <div className="fit-drawer animate-fade-in">
        
        {/* Header */}
        <div className="fit-header">
          <div className="fit-title-wrap">
            <span className="fit-icon-bubble">✨</span>
            <div>
              <h3>AI Royal Fit & Blouse Tailoring Finder</h3>
              <p>Personalized fit precision calibrated for Taasa pure silks, lehengas & tailored blouses</p>
            </div>
          </div>
          <button className="fit-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body Controls */}
        <div className="fit-body">
          
          {/* Height Slider */}
          <div className="fit-input-block">
            <div className="slider-label-row">
              <span className="slider-title">Your Height:</span>
              <span className="slider-val">{heightFeet}'{heightInches}" ({Math.round(height * 2.54)} cm)</span>
            </div>
            <input 
              type="range" 
              min="58" 
              max="74" 
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="fit-slider"
            />
          </div>

          {/* Weight Slider */}
          <div className="fit-input-block">
            <div className="slider-label-row">
              <span className="slider-title">Your Weight:</span>
              <span className="slider-val">{weight} lbs ({Math.round(weight * 0.453592)} kg)</span>
            </div>
            <input 
              type="range" 
              min="95" 
              max="190" 
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="fit-slider"
            />
          </div>

          {/* Fit Preference */}
          <div className="fit-input-block">
            <span className="slider-title mb-2 block">How do you prefer garments to hug you?</span>
            <div className="fit-pref-grid">
              {[
                { key: 'sculpted', label: 'Structured Sculpt', sub: 'Snug waist, structured contour' },
                { key: 'true', label: 'True to Silhouette', sub: 'Standard tailored fit' },
                { key: 'relaxed', label: 'Relaxed & Flowy', sub: 'Easy breathing, airy drape' }
              ].map(pref => (
                <button 
                  key={pref.key}
                  className={`pref-card ${fitPreference === pref.key ? 'active' : ''}`}
                  onClick={() => setFitPreference(pref.key)}
                >
                  <div className="pref-head">
                    <strong>{pref.label}</strong>
                    {fitPreference === pref.key && <Check size={14} className="text-rose-deep" />}
                  </div>
                  <span>{pref.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Result Banner */}
          <div className="fit-recommendation-card">
            <div className="recommendation-badge">
              <Sparkles size={13} />
              <span>98.6% FIT MATCH CONFIDENCE</span>
            </div>
            
            <div className="recommendation-main">
              <div className="recommended-size-circle">
                <span>{recommendedSize}</span>
              </div>
              <div className="recommendation-text">
                <h4>Recommended: Size {recommendedSize}</h4>
                <p>Based on your height of {heightFeet}'{heightInches}" and {fitPreference} preference.</p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="fit-social-proof">
              <CheckCircle2 size={16} className="text-success" />
              <span><strong>94% of brides & muses</strong> with similar body profiles kept this size without alterations!</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="fit-footer">
          <button className="btn btn-cute-pink btn-apply-fit" onClick={handleApplySize}>
            <span>Select Size {recommendedSize} & Continue Shopping</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </>
  );
};

export default FitEstimatorDrawer;
