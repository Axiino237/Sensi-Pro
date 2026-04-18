import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Settings, 
  Zap, 
  Target, 
  Copy, 
  Check, 
  RotateCcw, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Share2,
  Download,
  AlertCircle,
  Dna,
  Wind,
  X
} from 'lucide-react';
import { calculateSensitivity } from './SensitivityEngine';
import logo from './assets/logo.webp';

const App = () => {
  const [formData, setFormData] = useState({
    deviceType: 'mid',
    dpi: '440',
    playStyle: 'balanced',
    surfaceType: 'bare'
  });
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // 🔊 Audio Refs
  const audioInitialized = useRef(false);
  const shootSfx = useRef(null);
  const reloadSfx = useRef(null);

  // Function to initialize sounds on first click
  const initAudio = () => {
    if (audioInitialized.current) return;
    
    shootSfx.current = new Audio('https://www.soundjay.com/mechanical/gun-shot-01.mp3');
    reloadSfx.current = new Audio('https://www.soundjay.com/mechanical/gun-cocking-01.mp3');
    
    // Warm up/Unlock audio context
    shootSfx.current.play().then(() => {
      shootSfx.current.pause();
      shootSfx.current.currentTime = 0;
    }).catch(() => {});
    
    audioInitialized.current = true;
    console.log("Audio Engine Initialized ✅");
  };

  const playSfx = (type) => {
    initAudio(); // Ensure init happens if not already
    
    const sfx = type === 'shoot' ? shootSfx.current : reloadSfx.current;
    if (sfx) {
      sfx.currentTime = 0;
      sfx.play().catch(e => console.log("Audio wait for gesture..."));
    }
  };

  useEffect(() => {
    // Show popup ad after 1.5 seconds
    const timer = setTimeout(() => setShowPopup(true), 1500);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAutoDetect = () => {
    playSfx('reload');
    setIsCalculating(true);
    setTimeout(() => {
      const ram = navigator.deviceMemory || 4;
      let type = 'mid';
      if (ram <= 2) type = 'low';
      else if (ram >= 8) type = 'high';
      const estimatedDpi = Math.round(window.devicePixelRatio * 160);
      setFormData(prev => ({ ...prev, deviceType: type, dpi: estimatedDpi.toString() }));
      setIsCalculating(false);
    }, 800);
  };

  const handleCalculate = () => {
    playSfx('shoot');
    setIsCalculating(true);
    setTimeout(() => {
      const sens = calculateSensitivity(formData);
      setResults(sens);
      setIsCalculating(false);
    }, 1200); 
  };

  const handleInstall = async () => {
    playSfx('reload');
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const adjustSens = (key, val) => {
    playSfx('reload');
    setResults(prev => ({ ...prev, [key]: Math.max(0, Math.min(100, prev[key] + val)) }));
  };

  const closePopup = () => {
    initAudio(); // Unblocks audio for the whole session
    playSfx('reload');
    setShowPopup(false);
  };

  return (
    <>
      {/* 📹 Live Background Layer */}
      <div className="bg-container">
        <div className="bg-panning" />
      </div>
      <div className="hud-overlay" />
      <div className="hud-vignette" />

      {/* 🍿 Startup Interstitial Popup */}
      {showPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass animate-enter" style={{ maxWidth: '380px', width: '100%', padding: '2.5rem', borderRadius: '32px', textAlign: 'center', position: 'relative', border: '2px solid rgba(255, 77, 0, 0.3)' }}>
            <button 
              onClick={closePopup} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            
            <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Zap size={32} color="white" />
            </div>
            
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Ready for Accuracy?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Enable pro sensitivity v1 for your device now. 🎯</p>
            
            <div className="glass" style={{ background: '#111', height: '180px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px dashed #444' }}>
              <p style={{ color: '#666', fontSize: '0.75rem' }}>[ Google AdSense Interstitial Ad ]</p>
            </div>
            
            <button className="btn-primary" onClick={closePopup} style={{ width: '100%' }}>
              START CALCULATION
            </button>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* 📥 TOP AD SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ opacity: 0.4, fontSize: '0.65rem', marginBottom: '8px', letterSpacing: '2px' }}>ADVERTISEMENT</div>
          <div className="glass" style={{ height: '90px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '728px', margin: '0 auto' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>[ Google AdSense Header ]</p>
          </div>
        </div>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '5rem' }} className="animate-enter">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '25px' }}>
             <div id="app-logo-container" className="animate-float" style={{ 
               width: '140px', 
               height: '140px', 
               borderRadius: '50%', 
               background: 'rgba(0,0,0,0.5)', 
               border: '3px solid var(--primary)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               overflow: 'hidden',
               boxShadow: '0 0 40px rgba(255, 77, 0, 0.5)'
             }}>
               <img src={logo} alt="FF Sensi Pro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <div style={{ marginTop: '10px' }}>
               <h1 style={{ lineHeight: '1.2', fontWeight: '900', fontSize: '3.5rem' }}>FF Sensi <span style={{ color: 'var(--primary)' }}>Pro</span></h1>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '10px' }}>THE CLASSIC ACCURACY ENGINE v1</p>
             </div>
          </div>
          
          {deferredPrompt && (
            <button className="btn-secondary" onClick={handleInstall} style={{ marginTop: '2rem', fontSize: '0.75rem', padding: '0.6rem 2rem', background: 'var(--primary)', border: 'none' }}>
              <Download size={14} style={{ marginRight: '8px' }} /> INSTALL PRO APP
            </button>
          )}
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          
          {/* Input Section */}
          <section className="glass animate-enter" style={{ padding: '3rem', borderRadius: 'var(--radius)', animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Dna size={24} color="var(--primary)" />
                <h2>Analysis</h2>
              </div>
              <button className="btn-secondary animate-glitch" onClick={handleAutoDetect} style={{ padding: '8px 16px' }}>
                <Smartphone size={14} style={{ marginRight: '8px' }} /> AUTO-SYNC
              </button>
            </div>

            <div className="form-group">
              <label>Device Core Focus</label>
              <select name="deviceType" value={formData.deviceType} onChange={handleInputChange}>
                <option value="low">Standard / Economy (2-3GB)</option>
                <option value="mid">Mid-Tier Gaming (4-6GB)</option>
                <option value="high">Hardcore / Flagship (8GB+)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label>System DPI</label>
              <input type="number" name="dpi" value={formData.dpi} onChange={handleInputChange} />
            </div>

            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label>Tactical Style</label>
              <select name="playStyle" value={formData.playStyle} onChange={handleInputChange}>
                <optgroup label="Pro Gaming Presets">
                  <option value="balanced">Balanced Strategy</option>
                  <option value="rush">Aggressive Rush (One-Tap)</option>
                  <option value="sniper_pro">Long Range Precision</option>
                </optgroup>
                <optgroup label="Legendary Configs">
                  <option value="raistar">Raistar Speed-God</option>
                  <option value="tsg_jash">TSG Jash Drag-Shot</option>
                  <option value="white444">White444 Red-Aim</option>
                </optgroup>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label>Surface Friction</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => { handleInputChange({ target: { name: 'surfaceType', value: 'bare' }}); playSfx('reload'); }}
                  style={{ flex: 1, height: '50px', borderColor: formData.surfaceType === 'bare' ? 'var(--primary)' : 'var(--border-glass)' }}
                >
                  Bare Finger
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => { handleInputChange({ target: { name: 'surfaceType', value: 'glove' }}); playSfx('reload'); }}
                  style={{ flex: 1, height: '50px', borderColor: formData.surfaceType === 'glove' ? 'var(--primary)' : 'var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Wind size={16} /> Glove
                </button>
              </div>
            </div>

            <button className="btn-primary animate-glitch" onClick={handleCalculate} style={{ width: '100%', marginTop: '2.5rem', height: '65px', fontSize: '1.1rem' }} disabled={isCalculating}>
              {isCalculating ? 'DEEP SCANNING...' : 'COMPUTE PERFECT SENSI'} 
            </button>

            {/* NATIVE AD */}
            <div style={{ marginTop: '3.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '20px', padding: '2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.6rem', opacity: 0.3, letterSpacing: '3px' }}>PROMOTED CONTENT</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>[ AdSense Native Ad ]</p>
            </div>
          </section>

          {/* Results Section */}
          <section className="glass animate-enter" style={{ padding: '3rem', borderRadius: 'var(--radius)', minHeight: '550px', animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ShieldCheck size={24} color="var(--primary)" />
                <h2>Perfect Result</h2>
              </div>
            </div>

            {!results ? (
              <div style={{ textAlign: 'center', paddingTop: '8rem', color: 'var(--text-secondary)' }}>
                <TrendingUp size={80} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                <p style={{ fontStyle: 'italic', letterSpacing: '2px' }}>Awaiting hardware sync...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div className="glass" style={{ background: 'rgba(255, 77, 0, 0.1)', border: '1px solid var(--primary)', padding: '1.25rem', borderRadius: '18px', fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Zap size={20} color="var(--primary)" /> 
                  <span>AI Tuned for <b>{formData.deviceType}</b> Hardware.</span>
                </div>

                {Object.entries(results).map(([key, value], idx) => (
                  <div key={key} className="glass animate-enter" style={{ padding: '1.25rem 2rem', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: `${0.3 + idx * 0.1}s` }}>
                    <div>
                      <span style={{ textTransform: 'uppercase', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                      <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', lineHeight: '1' }}>{value}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => adjustSens(key, -1)} className="btn-secondary" style={{ width: '40px', height: '40px', padding: 0 }}>-</button>
                      <button onClick={() => adjustSens(key, 1)} className="btn-secondary" style={{ width: '40px', height: '40px', padding: 0 }}>+</button>
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '20px', marginTop: '2.5rem' }}>
                  <button className="btn-primary" onClick={() => { setResults(null); playSfx('reload'); }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', boxShadow: 'none' }}>
                    <RotateCcw size={20} /> RESET
                  </button>
                  <button className="btn-primary" onClick={() => { 
                    playSfx('reload');
                    navigator.clipboard.writeText(`Perfect Sensi: ${JSON.stringify(results)}`); 
                    setCopied(true); 
                    setTimeout(()=>setCopied(false), 2000); 
                  }} style={{ flex: 1.5 }}>
                    {copied ? <Check size={20} /> : <Share2 size={20} />} 
                    {copied ? 'COPIED!' : 'SHARE CONFIG'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* 📥 BOTTOM AD SECTION */}
        <div style={{ marginTop: '6rem', textAlign: 'center' }} className="animate-enter">
          <div style={{ opacity: 0.3, fontSize: '0.7rem', marginBottom: '15px', letterSpacing: '4px' }}>PROMOTED BY GOOGLE AD SENSE</div>
          <div className="glass" style={{ padding: '4rem', borderRadius: '40px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '1px' }}>[ High Revenue Multiplex Ad Unit ]</p>
          </div>
        </div>

        <footer style={{ marginTop: '8rem', textAlign: 'center', paddingBottom: '6rem', opacity: 0.5 }} className="animate-enter">
          <p style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '2px', marginBottom: '10px' }}>© 2026 FF SENSI PRO • THE KERNEL OF PRECISION</p>
          <a 
            href="https://axiino.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '1px' }}
            onClick={() => playSfx('reload')}
          >
            DEVELOPED BY AXIINO.COM
          </a>
        </footer>
      </div>
    </>
  );
};

export default App;
