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
  X,
  Crosshair,
  Gauge,
  HelpCircle
} from 'lucide-react';
import { calculateSensitivity, calculateFireButton } from './SensitivityEngine';
import logo from './assets/logo.webp';

const App = () => {
  const [formData, setFormData] = useState({
    deviceType: 'mid',
    dpi: '440',
    playStyle: 'balanced',
    surfaceType: 'bare',
    refreshRate: '60',
    screenSize: 'large'
  });
  const [results, setResults] = useState(null);
  const [fireBtn, setFireBtn] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // 🔊 Audio Refs - UPDATED with stable Mixkit CDN links
  const audioInitialized = useRef(false);
  const shootSfx = useRef(null);
  const reloadSfx = useRef(null);

  // 🛠️ Toolbox State
  const [dpiConv, setDpiConv] = useState({ oldDpi: '', oldSns: '', newDpi: '', result: null });
  const [fixAimType, setFixAimType] = useState(null);

  const initAudio = () => {
    if (audioInitialized.current) return;
    shootSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    reloadSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    shootSfx.current.load();
    reloadSfx.current.load();
    audioInitialized.current = true;
    console.log("Elite Audio Engine Initialized ✅");
  };

  const playSfx = (type) => {
    initAudio();
    const sfx = type === 'shoot' ? shootSfx.current : reloadSfx.current;
    if (sfx) {
      sfx.currentTime = 0;
      sfx.play().catch(e => console.warn("Audio interactive required"));
    }
  };

  useEffect(() => {
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
      const btn = calculateFireButton(formData);
      setResults(sens);
      setFireBtn(btn);
      setIsCalculating(false);
    }, 1200); 
  };

  const calculateDpiConv = () => {
    playSfx('reload');
    const { oldDpi, oldSns, newDpi } = dpiConv;
    if (oldDpi && oldSns && newDpi) {
      const res = (parseFloat(oldSns) * parseFloat(oldDpi)) / parseFloat(newDpi);
      setDpiConv(prev => ({ ...prev, result: Math.round(res) }));
    }
  };

  return (
    <>
      <div className="bg-container"><div className="bg-panning" /></div>
      <div className="hud-overlay" /><div className="hud-vignette" />

      {showPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass animate-enter" style={{ maxWidth: '400px', width: '100%', padding: '3rem', borderRadius: '32px', textAlign: 'center', border: '2px solid var(--primary)' }}>
            <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 20px var(--primary)' }}>
              <Zap size={32} color="white" />
            </div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>Elite v1.1 Launch</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>Perfect accuracy logic updated with <br/><b>Refresh Rate</b> and <b>Fire Button</b> generation. 🎯</p>
            <button className="btn-primary" onClick={() => { setShowPopup(false); initAudio(); playSfx('reload'); }} style={{ width: '100%' }}>START CALCULATION</button>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* 📥 TOP AD SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ opacity: 0.4, fontSize: '0.65rem', marginBottom: '8px', letterSpacing: '2px' }}>ADVERTISEMENT</div>
          <div className="glass" style={{ height: '90px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '728px', margin: '0 auto', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>[ 💰 Top Leaderboard Ad Unit ]</p>
          </div>
        </div>

        <header style={{ textAlign: 'center', marginBottom: '5rem' }} className="animate-enter">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '25px' }}>
             <div id="app-logo-container" className="animate-float" style={{ 
               width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', 
               border: '3px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
               overflow: 'hidden', boxShadow: '0 0 40px rgba(255, 77, 0, 0.5)' 
             }}>
               <img src={logo} alt="FF Sensi Pro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <div>
               <h1 style={{ lineHeight: '1.2', fontWeight: '900', fontSize: '3.5rem' }}>FF Sensi <span style={{ color: 'var(--primary)' }}>Pro</span></h1>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '10px' }}>ELITE ACCURACY ENGINE v1.1</p>
             </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          
          <section className="glass animate-enter" style={{ padding: '2.5rem', borderRadius: 'var(--radius)', animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><Dna size={24} color="var(--primary)" /><h2>Analysis</h2></div>
              <button className="btn-secondary animate-glitch" onClick={handleAutoDetect}><Smartphone size={14} style={{ marginRight: '8px' }}/>AUTO-SYNC</button>
            </div>

            <div className="form-group"><label>Device Tier</label>
              <select name="deviceType" value={formData.deviceType} onChange={handleInputChange}>
                <option value="low">Standard / Economy (2-3GB)</option>
                <option value="mid">Mid-Tier Gaming (4-6GB)</option>
                <option value="high">Hardcore / Flagship (8GB+)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '1.5rem' }}>
              <div className="form-group"><label>System DPI</label>
                <input type="number" name="dpi" value={formData.dpi} onChange={handleInputChange} />
              </div>
              <div className="form-group"><label>Refresh Rate</label>
                <select name="refreshRate" value={formData.refreshRate} onChange={handleInputChange}>
                  <option value="60">60 Hz</option><option value="90">90 Hz</option><option value="120">120 Hz</option><option value="144">144 Hz</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}><label>Device Size</label>
              <select name="screenSize" value={formData.screenSize} onChange={handleInputChange}>
                <option value="compact">Compact Phone</option><option value="large">Large / Max Phone</option><option value="tablet">iPad / Tablet</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}><label>Tactical Style</label>
              <select name="playStyle" value={formData.playStyle} onChange={handleInputChange}>
                <optgroup label="Pro Gaming Presets">
                  <option value="balanced">Balanced Strategy</option><option value="rush">Aggressive Rush</option>
                </optgroup>
                <optgroup label="Legendary Configs">
                  <option value="raistar">Raistar God-Speed</option><option value="white444">White444 Red-Aim</option>
                </optgroup>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}><label>Surface friction</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button className={`btn-secondary ${formData.surfaceType === 'bare' ? 'active' : ''}`} onClick={() => { handleInputChange({ target: { name: 'surfaceType', value: 'bare' }}); playSfx('reload'); }} style={{ flex: 1, borderColor: formData.surfaceType === 'bare' ? 'var(--primary)' : '' }}>Bare Finger</button>
                <button className={`btn-secondary ${formData.surfaceType === 'glove' ? 'active' : ''}`} onClick={() => { handleInputChange({ target: { name: 'surfaceType', value: 'glove' }}); playSfx('reload'); }} style={{ flex: 1, borderColor: formData.surfaceType === 'glove' ? 'var(--primary)' : '' }}>Glove</button>
              </div>
            </div>

            <button className="btn-primary animate-glitch" onClick={handleCalculate} style={{ width: '100%', marginTop: '2rem', height: '65px' }} disabled={isCalculating}>
              {isCalculating ? 'DEEP ANALYSIS...' : 'COMPUTE ELITE SENSI'} 
            </button>
          </section>

          <section className="glass animate-enter" style={{ padding: '2.5rem', borderRadius: 'var(--radius)', minHeight: '550px', animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2.5rem' }}><ShieldCheck size={24} color="var(--primary)" /><h2>Elite Result</h2></div>
            {!results ? (
              <div style={{ textAlign: 'center', paddingTop: '8rem', color: 'var(--text-secondary)' }}><TrendingUp size={80} style={{ opacity: 0.1, marginBottom: '2rem' }} /><p>Hardware sync required...</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="glass" style={{ background: 'rgba(255, 77, 0, 0.08)', border: '1px solid var(--primary)', padding: '1rem', borderRadius: '15px', fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Crosshair size={18} color="var(--primary)" /><span>Sensi optimized for <b>{formData.refreshRate}Hz</b> & <b>{formData.screenSize}</b>.</span>
                </div>
                
                {/* 💰 Results Internal Ad */}
                <div style={{ margin: '1rem 0' }}>
                  <div className="glass" style={{ height: '70px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.05)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>[ 💰 Results Inline Ad Unit ]</p>
                  </div>
                </div>

                {/* Fire Button Results */}
                <div className="glass toolbox-card" style={{ padding: '1.25rem', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>🔥 Fire Button Size</span>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: 'white' }}>{fireBtn.size}%</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.7rem', opacity: 0.6, maxWidth: '120px' }}>Tip: {fireBtn.position}</div>
                </div>

                {Object.entries(results).map(([key, value], idx) => (
                  <div key={key} className="glass" style={{ padding: '1.1rem 1.5rem', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div><span style={{ textTransform: 'uppercase', color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '2px' }}>{key.replace(/([A-Z])/g, ' $1')}</span><div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary)', lineHeight: '1' }}>{value}</div></div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setResults(prev => ({...prev, [key]: Math.max(0, prev[key]-1)}))} className="btn-secondary" style={{ width: '35px', height: '35px', padding: 0 }}>-</button>
                      <button onClick={() => setResults(prev => ({...prev, [key]: Math.min(100, prev[key]+1)}))} className="btn-secondary" style={{ width: '35px', height: '35px', padding: 0 }}>+</button>
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '15px', marginTop: '2rem' }}>
                  <button className="btn-primary" onClick={() => { setResults(null); playSfx('reload'); }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', boxShadow: 'none' }}><RotateCcw size={18} /> RESET</button>
                  <button className="btn-primary" onClick={() => { playSfx('reload'); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} style={{ flex: 1.5 }}>{copied ? <Check size={18} /> : <Share2 size={18} />} {copied ? 'DONE!' : 'SHARE'}</button>
                </div>
              </div>
            )}
            {/* NATIVE AD */}
            <div style={{ marginTop: '3.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '20px', padding: '2rem', textAlign: 'center', border: '1px dashed rgba(255,77,0,0.2)' }}>
              <div style={{ fontSize: '0.6rem', opacity: 0.3, letterSpacing: '3px' }}>PROMOTED CONTENT</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>[ 💰 Native Analysis Ad Unit ]</p>
            </div>
          </section>
        </div>

        {/* 🛠️ ELITE TOOLBOX SECTION */}
        <section className="glass animate-enter" style={{ padding: '3rem', borderRadius: 'var(--radius)', marginBottom: '5rem', animationDelay: '0.3s' }}>
          
          {/* 💰 Toolbox Entry Ad */}
          <div style={{ marginBottom: '3rem' }}>
            <div className="glass" style={{ height: '90px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,184,0,0.3)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>[ 💰 Toolbox Header Ad Unit ]</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '3rem' }}><Settings size={28} color="var(--primary)" /><h2 style={{ fontSize: '1.75rem' }}>Elite Toolbox</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            
            {/* DPI Converter */}
            <div className="glass toolbox-card" style={{ padding: '2rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}><Gauge size={20} color="var(--primary)" /><h3 style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>DPI Converter</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input type="number" placeholder="Old DPI" value={dpiConv.oldDpi} onChange={(e)=>setDpiConv({...dpiConv, oldDpi: e.target.value})} />
                  <input type="number" placeholder="Old Sensi" value={dpiConv.oldSns} onChange={(e)=>setDpiConv({...dpiConv, oldSns: e.target.value})} />
                </div>
                <input type="number" placeholder="New DPI" value={dpiConv.newDpi} onChange={(e)=>setDpiConv({...dpiConv, newDpi: e.target.value})} />
                <button className="btn-primary" onClick={calculateDpiConv} style={{ height: '50px', fontSize: '0.9rem' }}>Convert Now</button>
                {dpiConv.result !== null && (
                  <div style={{ marginTop: '1rem', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>New Sensi Recommendation:</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary)' }}>{dpiConv.result}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Fix My Aim */}
            <div className="glass toolbox-card" style={{ padding: '2rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}><HelpCircle size={20} color="var(--primary)" /><h3 style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Fix My Aim</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className={`fix-aim-btn ${fixAimType === 'overshoot' ? 'active' : ''}`} onClick={()=>setFixAimType('overshoot')}><Crosshair size={18}/> Aim Over Head</button>
                <button className={`fix-aim-btn ${fixAimType === 'body' ? 'active' : ''}`} onClick={()=>setFixAimType('body')}><Crosshair size={18}/> Aim Stuck on Body</button>
                <button className={`fix-aim-btn ${fixAimType === 'shake' ? 'active' : ''}`} onClick={()=>setFixAimType('shake')}><Crosshair size={18}/> Aim Shaking</button>
                
                {fixAimType && (
                  <div className="animate-enter" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid var(--primary)' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={14} /> Expert Solution:
                    </div>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'white' }}>
                      {fixAimType === 'overshoot' && "Your General sensitivity is too high. Decrease it by 2-3 points from your current result. Ensure you have more physical screen space above your fire button to complete the drag motion."}
                      {fixAimType === 'body' && "Try reducing your Fire Button size slightly. Increase your 'General' sensitivity by +5 points. Focus on a faster, more explosive flick when dragging upward."}
                      {fixAimType === 'shake' && "Your general mobility settings are exceeding your device's touch sampling rate. Decrease 'General' by 5 points to stabilize the camera during intense movements."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer style={{ marginTop: '5rem', textAlign: 'center', paddingBottom: '6rem', opacity: 0.5 }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '2px', marginBottom: '10px' }}>© 2026 FF SENSI PRO • ELITE ACCESS</p>
          <a href="https://axiino.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>DEVELOPED BY AXIINO.COM</a>
        </footer>
      </div>
    </>
  );
};

export default App;
