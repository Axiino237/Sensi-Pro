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
  HelpCircle,
  Search,
  Eye,
  Activity,
  Camera,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { calculateSensitivity, calculateFireButton } from './SensitivityEngine';
import logo from './assets/logo.webp';
import PlayerFinder from './PlayerFinder';
import AccountStore from './AccountStore';




const App = () => {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'sensi', 'finder', 'store'
  const [visitorCount, setVisitorCount] = useState(null); // null = loading
  const [activeUsers, setActiveUsers] = useState(null);

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

  // 🔊 Audio Refs
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
  };

  const playSfx = (type) => {
    initAudio();
    const sfx = type === 'shoot' ? shootSfx.current : reloadSfx.current;
    if (sfx) {
      sfx.currentTime = 0;
      sfx.play().catch(e => console.warn("Audio interactive required"));
    }
  };

  // 📊 Real Visitor Counter — counterapi.dev (free, no auth needed)
  useEffect(() => {
    const fetchAndIncrementCount = async () => {
      try {
        // Increment count on every visit
        const res = await fetch('https://api.counterapi.dev/v1/ffsensiproo/visits/up');
        const data = await res.json();
        if (data && data.count) {
          setVisitorCount(data.count);
          // Active users = simulate ~3% of total visitors (min 12, max 200)
          const active = Math.max(12, Math.min(200, Math.floor(data.count * 0.03) + Math.floor(Math.random() * 8)));
          setActiveUsers(active);
        }
      } catch (e) {
        // Fallback if API is down
        setVisitorCount(128000 + Math.floor(Math.random() * 500));
        setActiveUsers(Math.floor(Math.random() * 30) + 20);
      }
    };
    fetchAndIncrementCount();

    // Refresh active users every 30s (no extra increment)
    const activeInterval = setInterval(async () => {
      try {
        const res = await fetch('https://api.counterapi.dev/v1/ffsensiproo/visits/get');
        const data = await res.json();
        if (data && data.count) {
          setVisitorCount(data.count);
          const active = Math.max(12, Math.min(200, Math.floor(data.count * 0.03) + Math.floor(Math.random() * 8)));
          setActiveUsers(active);
        }
      } catch (_) {}
    }, 30000);

    return () => clearInterval(activeInterval);
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

      <div className="container" style={{ paddingTop: '2rem' }}>

        {/* 🧭 Navigation */}
        <nav className="glass" style={{
          display: 'flex', gap: '10px', padding: '8px', borderRadius: '16px',
          maxWidth: '750px', margin: '0 auto 4rem', position: 'sticky', top: '20px', zIndex: 100
        }}>
          <button
            className={`btn-secondary ${currentPage === 'landing' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('landing'); playSfx('reload'); }}
            style={{
              flex: 1, height: '45px', border: 'none', borderRadius: '12px',
              background: currentPage === 'landing' ? 'var(--primary)' : 'transparent',
              color: currentPage === 'landing' ? 'white' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem'
            }}
          >
            HOME
          </button>
          <button
            className={`btn-secondary ${currentPage === 'sensi' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('sensi'); playSfx('reload'); }}
            style={{
              flex: 1, height: '45px', border: 'none', borderRadius: '12px',
              background: currentPage === 'sensi' ? 'var(--primary)' : 'transparent',
              color: currentPage === 'sensi' ? 'white' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem'
            }}
          >
            SENSI PRO
          </button>
          <button
            className={`btn-secondary ${currentPage === 'finder' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('finder'); playSfx('reload'); }}
            style={{
              flex: 1, height: '45px', border: 'none', borderRadius: '12px',
              background: currentPage === 'finder' ? 'var(--primary)' : 'transparent',
              color: currentPage === 'finder' ? 'white' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem'
            }}
          >
            UID ANALYZE
          </button>
          <button
            className={`btn-secondary ${currentPage === 'store' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('store'); playSfx('reload'); }}
            style={{ 
              flex: 1, height: '45px', border: 'none', borderRadius: '12px',
              background: currentPage === 'store' ? '#00ff88' : 'transparent',
              color: currentPage === 'store' ? '#000' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem'
            }}
          >
            <ShoppingBag size={18} /> STORE
          </button>
        </nav>

        {currentPage === 'landing' && (
          <div className="animate-enter">
            <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div id="app-logo-container" className="animate-float" style={{
                  width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                  border: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', boxShadow: '0 0 50px rgba(255, 77, 0, 0.4)'
                }}>
                  <img src={logo} alt="FF Sensi Pro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h1 style={{ fontSize: '4rem' }}>FF Sensi <span style={{ color: 'var(--primary)' }}>Pro</span></h1>
                <p style={{ color: 'var(--text-secondary)', letterSpacing: '5px' }}>THE ULTIMATE ELITE TOOLKIT</p>
              </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
              <div className="glass glass-hover" onClick={() => setCurrentPage('sensi')} style={{ padding: '3rem', borderRadius: '24px', cursor: 'pointer', textAlign: 'center' }}>
                <Zap size={50} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sensi Calculator</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Optimize your sensitivity settings for perfect headshots based on your device tier.</p>
                <div style={{ marginTop: '2rem', color: 'var(--primary)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  OPEN TOOL <ArrowRight size={18} />
                </div>
              </div>

              <div className="glass glass-hover" onClick={() => setCurrentPage('finder')} style={{ padding: '3rem', borderRadius: '24px', cursor: 'pointer', textAlign: 'center' }}>
                <Search size={50} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>UID Analyzer</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Access global database to analyze any player UID. Get rank, stats, and guild info.</p>
                <div style={{ marginTop: '2rem', color: 'var(--primary)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  OPEN ANALYZER <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        )}



        {currentPage === 'sensi' && (
          <div className="animate-enter">
            <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h1 style={{ fontSize: '3rem' }}>Sensi <span style={{ color: 'var(--primary)' }}>Calculator</span></h1>
              <p style={{ color: 'var(--text-secondary)', letterSpacing: '4px' }}>ACCURACY CALIBRATION ENGINE</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
              <section className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><Dna size={24} color="var(--primary)" /><h2>Analysis</h2></div>
                  <button className="btn-secondary animate-glitch" onClick={handleAutoDetect}><Smartphone size={14} style={{ marginRight: '8px' }} />AUTO-SYNC</button>
                </div>
                <div className="form-group"><label>Device Tier</label>
                  <select name="deviceType" value={formData.deviceType} onChange={handleInputChange}>
                    <option value="low">Standard / Economy (2-3GB)</option>
                    <option value="mid">Mid-Tier Gaming (4-6GB)</option>
                    <option value="high">Hardcore / Flagship (8GB+)</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '1.5rem' }}>
                  <div className="form-group"><label>System DPI</label><input type="number" name="dpi" value={formData.dpi} onChange={handleInputChange} /></div>
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
                <button className="btn-primary animate-glitch" onClick={handleCalculate} style={{ width: '100%', marginTop: '2rem', height: '65px' }} disabled={isCalculating}>
                  {isCalculating ? 'ANALYZING...' : 'COMPUTE ELITE SENSI'}
                </button>
              </section>

              <section className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius)', minHeight: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2.5rem' }}><ShieldCheck size={24} color="var(--primary)" /><h2>Elite Result</h2></div>
                {!results ? (
                  <div style={{ textAlign: 'center', paddingTop: '8rem', color: 'var(--text-secondary)' }}><TrendingUp size={80} style={{ opacity: 0.1, marginBottom: '2rem' }} /><p>Compute required...</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="glass toolbox-card" style={{ padding: '1.25rem', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div><span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>🔥 Fire Button Size</span>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: 'white' }}>{fireBtn.size}%</div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.7rem', opacity: 0.6, maxWidth: '120px' }}>Tip: {fireBtn.position}</div>
                    </div>
                    {Object.entries(results).map(([key, value]) => (
                      <div key={key} className="glass" style={{ padding: '1.1rem 1.5rem', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div><span style={{ textTransform: 'uppercase', color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '2px' }}>{key.replace(/([A-Z])/g, ' $1')}</span><div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary)', lineHeight: '1' }}>{value}</div></div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {currentPage === 'finder' && (
          <>
            <PlayerFinder playSfx={playSfx} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '4rem' }}>
              <div className="glass" style={{ padding: '12px 24px', borderRadius: '30px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <Eye size={16} color="var(--primary)" />
                <span>SITE VISITS: <b style={{ color: 'white' }}>{visitorCount !== null ? visitorCount.toLocaleString() : '...'}</b></span>
              </div>
              <div className="glass" style={{ padding: '12px 24px', borderRadius: '30px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <Activity size={16} color="#00ff88" />
                <span>ACTIVE NOW: <b style={{ color: '#00ff88' }}>{activeUsers !== null ? activeUsers : '...'}</b></span>
              </div>
            </div>
          </>
        )}

        {currentPage === 'store' && (
          <AccountStore />
        )}

        <footer style={{ marginTop: '5rem', textAlign: 'center', paddingBottom: '6rem', opacity: 0.5 }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '2px', marginBottom: '10px' }}>© 2026 FF SENSI PRO • ELITE ACCESS</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
            <a href="https://instagram.com/ff_kolaru_gaming._" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Camera size={20} /> @ff_kolaru_gaming._
            </a>
            <a href="https://wa.me/918610763440" target="_blank" rel="noreferrer" style={{ color: 'white' }}><MessageCircle size={18} /></a>
          </div>
          <a href="https://axiino.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700', display: 'block', marginTop: '15px' }}>DEVELOPED BY AXIINO.COM</a>
        </footer>
      </div>
    </>
  );
};

export default App;
