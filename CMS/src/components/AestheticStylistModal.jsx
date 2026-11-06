import React, {  useState  } from 'react';
import { Sparkles, X, ArrowRight, ArrowLeft, Check, ShoppingBag, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import './AestheticStylistModal.css';

// Curated 3-Piece Indian Royal Capsules based on choices
const STYLIST_CAPSULES = {
  heritage: {
    title: 'The Royal Boutique Flared Edit',
    tagline: 'Handcrafted slub cotton, intricate zardozi threadwork & tailored cigarette trousers.',
    items: [
      { id: 90, title: 'Noor Rust Orange Flared Anarkali Dress', price: 5499.00, size: 'M', color: 'Rust Terracotta', image: '/images/products/taasa-client-01.jpeg' },
      { id: 104, title: 'Classic Ivory Tailored Cotton Cigarette Pants', price: 1499.00, size: 'M', color: 'Classic Ivory', image: '/images/products/taasa-client-40.jpeg' },
      { id: 81, title: 'Noorani Ivory Threadwork Short Kurti', price: 2499.00, size: 'M', color: 'Ivory Cream', image: '/images/products/taasa-client-26.jpeg' }
    ]
  },
  bridal: {
    title: 'The Sangeet & Soirée Mirror Edit',
    tagline: 'Regal royal blue mirror-work anarkali and tailored coordinates for unforgettable celebrations.',
    items: [
      { id: 91, title: 'Neelambari Royal Blue Mirror-Work Anarkali', price: 6899.00, size: 'M', color: 'Royal Blue', image: '/images/products/taasa-client-05.jpeg' },
      { id: 92, title: 'Noorani Midnight Black Mirror Flared Anarkali', price: 7299.00, size: 'M', color: 'Midnight Black', image: '/images/products/taasa-client-03.jpeg' },
      { id: 83, title: 'Rajkumari Wine Silk Straight Cut Kurti Suit', price: 6199.00, size: 'M', color: 'Imperial Wine', image: '/images/products/taasa-client-31.jpeg' }
    ]
  },
  sangeet: {
    title: 'The Everyday & Festive Radiance Capsule',
    tagline: 'Terracotta peplum co-ords and violet pleated pairs for modern poise.',
    items: [
      { id: 97, title: 'Terracotta Rust Embroidered Peplum Co-ord Set', price: 3899.00, size: 'M', color: 'Terracotta Rust', image: '/images/products/taasa-client-08.jpeg' },
      { id: 99, title: 'Purple Elegance Pleated Two-Piece Set', price: 3499.00, size: 'M', color: 'Violet & White', image: '/images/products/taasa-client-22.jpeg' },
      { id: 84, title: 'Haldi Sunshine Paisley Sleeveless Kurti', price: 2699.00, size: 'M', color: 'Haldi Yellow', image: '/images/products/taasa-client-02.jpeg' }
    ]
  }
};

const AestheticStylistModal = ({ isOpen, onClose }) => {
  const { addToCart, toggleCart } = useCart();
  
  const [step, setStep] = useState(1);
  const [selectedVibe, setSelectedVibe] = useState('heritage');
  const [selectedOccasion, setSelectedOccasion] = useState('shaadi');
  const [selectedPalette, setSelectedPalette] = useState('raniPink');
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedAll, setAddedAll] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 3) {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setStep(4);
      }, 900);
    } else {
      setStep(step + 1);
    }
  };

  const handleAddBundle = () => {
    const capsuleKey = selectedVibe === 'bridal' ? 'bridal' : selectedVibe === 'sangeet' ? 'sangeet' : 'heritage';
    const capsule = STYLIST_CAPSULES[capsuleKey];
    
    // Add all 3 items to cart
    capsule.items.forEach(item => {
      addToCart(item, 1, item.size, item.color);
    });

    setAddedAll(true);
    setTimeout(() => {
      setAddedAll(false);
      onClose();
      toggleCart();
    }, 1200);
  };

  const resetQuiz = () => {
    setStep(1);
    setAddedAll(false);
  };

  const capsuleKey = selectedVibe === 'bridal' ? 'bridal' : selectedVibe === 'sangeet' ? 'sangeet' : 'heritage';
  const capsule = STYLIST_CAPSULES[capsuleKey];
  const originalTotal = capsule.items.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = originalTotal * 0.15;
  const bundlePrice = originalTotal - bundleDiscount;

  return (
    <div className="stylist-backdrop animate-fade-in" onClick={onClose}>
      <div className="stylist-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Bar */}
        <div className="stylist-modal-top">
          <div className="stylist-brand-pill">
            <Sparkles size={16} className="text-rose-deep animate-float" />
            <span>TAASA ROYAL TROUSSEAU MATCHMAKER</span>
          </div>
          <button className="stylist-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Loading Transition Screen */}
        {isGenerating && (
          <div className="stylist-loading-screen">
            <div className="magic-orb-wrap">
              <span className="magic-sparkle-emoji">✨</span>
              <div className="magic-orb animate-pulse-glow"></div>
            </div>
            <h3>Curating Your Royal Trousseau...</h3>
            <p>Matching silk marks, authentic handcraft techniques, and heritage palettes for you.</p>
          </div>
        )}

        {/* STEP 1: CHOOSE YOUR VIBE */}
        {!isGenerating && step === 1 && (
          <div className="quiz-step-content animate-fade-in">
            <span className="quiz-step-number">STEP 1 OF 3</span>
            <h2 className="quiz-title">What is your royal fashion vibe?</h2>
            <p className="quiz-sub">Select the silhouette and heritage art that moves you.</p>

            <div className="quiz-options-grid">
              {[
                { key: 'heritage', title: '👑 Pure Handloom Banarasi', desc: 'Centuries-old kadwa weaves, antique gold zari & regal pure Katan silks.' },
                { key: 'bridal', title: '✨ Imperial Zardozi Bridal', desc: 'Over 350 hours of bullion, dabka, and pearl hand-embroidery for royal pheras.' },
                { key: 'sangeet', title: '💃 Sangeet Mirror Radiance', desc: 'Twirling real glass mirror-work shararas & scalloped gota anarkalis.' },
                { key: 'cocktail', title: '🍸 Modern Pre-Draped Saree', desc: 'Effortless fluid satin drapes, sculpted blouses & cocktail evening glam.' }
              ].map(opt => (
                <div 
                  key={opt.key}
                  className={`quiz-card ${selectedVibe === opt.key ? 'active' : ''}`}
                  onClick={() => setSelectedVibe(opt.key)}
                >
                  <div className="quiz-card-head">
                    <h4>{opt.title}</h4>
                    {selectedVibe === opt.key && <Check size={16} className="check-icon" />}
                  </div>
                  <p>{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="quiz-bottom-actions">
              <button className="btn btn-cute-pink" onClick={handleNext}>
                <span>Next: Choose Occasion</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE OCCASION */}
        {!isGenerating && step === 2 && (
          <div className="quiz-step-content animate-fade-in">
            <span className="quiz-step-number">STEP 2 OF 3</span>
            <h2 className="quiz-title">Which celebration are you attending?</h2>
            <p className="quiz-sub">We will match the craftsmanship and weight to the ceremony.</p>

            <div className="quiz-options-grid">
              {[
                { key: 'shaadi', title: '👑 Royal Wedding Pheras', desc: 'Heirloom bridal lehengas and pure silk sarees fit for palace mandaps.' },
                { key: 'sangeet', title: '💃 Sangeet & Mehendi Night', desc: 'Lightweight twirling shararas and flared anarkalis for all-night dancing.' },
                { key: 'reception', title: '🍸 Palace Reception & Cocktails', desc: 'Pre-draped satin sarees and royal Kashmiri velvet suits.' },
                { key: 'haldi', title: '💛 Haldi Ceremony & Puja', desc: 'Sunshine yellow pure Chanderi kurta sets with scalloped gota work.' }
              ].map(opt => (
                <div 
                  key={opt.key}
                  className={`quiz-card ${selectedOccasion === opt.key ? 'active' : ''}`}
                  onClick={() => setSelectedOccasion(opt.key)}
                >
                  <div className="quiz-card-head">
                    <h4>{opt.title}</h4>
                    {selectedOccasion === opt.key && <Check size={16} className="check-icon" />}
                  </div>
                  <p>{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="quiz-bottom-actions space-between">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-cute-pink" onClick={handleNext}>
                <span>Next: Color Palette</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: COLOR PALETTE */}
        {!isGenerating && step === 3 && (
          <div className="quiz-step-content animate-fade-in">
            <span className="quiz-step-number">STEP 3 OF 3</span>
            <h2 className="quiz-title">Select your royal color story</h2>
            <p className="quiz-sub">Harmonize your trousseau with curated auspicious Indian hues.</p>

            <div className="quiz-options-grid">
              {[
                { key: 'raniPink', title: '🌸 Gulabi Rani Pink & Antique Gold', preview: ['#d81b60', '#e91e63', '#c5a059'] },
                { key: 'crimson', title: '❤️ Mastani Crimson & Palace Maroon', preview: ['#880e4f', '#4a0e17', '#c5a059'] },
                { key: 'emerald', title: '🌿 Zoon Emerald Green & Zari', preview: ['#004d40', '#1b5e20', '#d4af37'] },
                { key: 'haldi', title: '💛 Meera Haldi Gold & Ivory', preview: ['#fbc02d', '#fffaf0', '#ffe5ec'] }
              ].map(opt => (
                <div 
                  key={opt.key}
                  className={`quiz-card ${selectedPalette === opt.key ? 'active' : ''}`}
                  onClick={() => setSelectedPalette(opt.key)}
                >
                  <div className="quiz-card-head">
                    <h4>{opt.title}</h4>
                    {selectedPalette === opt.key && <Check size={16} className="check-icon" />}
                  </div>
                  <div className="palette-dots">
                    {opt.preview.map((hex, i) => (
                      <span key={i} className="palette-dot" style={{ background: hex }}></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-bottom-actions space-between">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-cute-pink" onClick={handleNext}>
                <span>✨ Reveal My Royal Trousseau</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: RESULT CAPSULE REVEAL */}
        {!isGenerating && step === 4 && (
          <div className="result-capsule-content animate-fade-in">
            <div className="result-badge-pill">
              <span>💖 99.8% ROYAL TROUSSEAU MATCH</span>
            </div>
            <h2 className="result-title">{capsule.title}</h2>
            <p className="result-tagline">{capsule.tagline}</p>

            {/* 3-Piece Grid */}
            <div className="capsule-items-grid">
              {capsule.items.map((item, idx) => (
                <div key={item.id} className="capsule-item-card">
                  <div className="capsule-img-wrap">
                    <img src={item.image} alt={item.title} />
                    <span className="capsule-step-chip">Piece #{idx + 1}</span>
                  </div>
                  <div className="capsule-details">
                    <h5>{item.title}</h5>
                    <span className="capsule-meta">{item.color} • Size {item.size}</span>
                    <span className="capsule-price">{formatINR(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown & Bundle Add Button */}
            <div className="capsule-pricing-box">
              <div className="capsule-price-summary">
                <span className="old-sum">{formatINR(originalTotal)}</span>
                <span className="new-sum">{formatINR(bundlePrice)}</span>
                <span className="bundle-save-tag">SAVE 15% BUNDLE DEAL</span>
              </div>

              <div className="bundle-action-row">
                <button 
                  className={`btn btn-cute-pink btn-add-bundle ${addedAll ? 'added' : ''}`}
                  onClick={handleAddBundle}
                  disabled={addedAll}
                >
                  {addedAll ? (
                    <span>🌸 Added All 3 Pieces to Your Bag! 💖</span>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add Complete 3-Piece Look to Bag • {formatINR(bundlePrice)}</span>
                    </>
                  )}
                </button>

                <button className="btn-retake-quiz" onClick={resetQuiz} title="Retake Quiz">
                  <RotateCcw size={16} /> Retake
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AestheticStylistModal;
