import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Zap,
  Target,
  ShieldCheck,
  Search,
  Activity,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Info,
  Lock,
  FileText,
  Mail,
  ChevronLeft,
  BookOpen,
  Eye,
  Camera
} from 'lucide-react';
import { calculateSensitivity, calculateFireButton } from './SensitivityEngine';
import logo from './assets/logo.webp';
import PlayerFinder from './PlayerFinder';
import AccountStore from './AccountStore';
import { knowledgeBase } from './KnowledgeData';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing'); // landing, sensi, finder, store, knowledge, about, privacy, contact, terms, article
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [visitorCount, setVisitorCount] = useState(null);
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
  const [isCalculating, setIsCalculating] = useState(false);

  // 🔊 Audio Refs
  const audioInitialized = useRef(false);
  const shootSfx = useRef(null);
  const reloadSfx = useRef(null);

  const initAudio = () => {
    if (audioInitialized.current) return;
    shootSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    reloadSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audioInitialized.current = true;
  };

  const playSfx = (type) => {
    initAudio();
    const sfx = type === 'shoot' ? shootSfx.current : reloadSfx.current;
    if (sfx) {
      sfx.currentTime = 0;
      sfx.play().catch(() => {});
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('https://api.counterapi.dev/v1/ffsensiproo/visits/up');
        const data = await res.json();
        if (data?.count) {
          setVisitorCount(data.count);
          setActiveUsers(Math.max(12, Math.min(200, Math.floor(data.count * 0.03) + Math.floor(Math.random() * 8))));
        }
      } catch (e) {
        setVisitorCount(128450);
        setActiveUsers(42);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    playSfx('shoot');
    setIsCalculating(true);
    setTimeout(() => {
      setResults(calculateSensitivity(formData));
      setFireBtn(calculateFireButton(formData));
      setIsCalculating(false);
    }, 1000);
  };

  const navigateTo = (page, article = null) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    setSelectedArticle(article);
    playSfx('reload');
  };

  return (
    <>
      <div className="bg-container"><div className="bg-panning" /></div>
      <div className="hud-overlay" /><div className="hud-vignette" />

      <div className="container">
        {/* 🧭 Navigation */}
        <nav className="glass nav-container">
          {['landing', 'sensi', 'finder', 'knowledge', 'store'].map((page) => (
            <button
              key={page}
              className={`btn-secondary nav-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => navigateTo(page)}
              style={{
                flex: 1, border: 'none', borderRadius: '12px',
                background: currentPage === page ? 'var(--primary)' : 'transparent',
                color: currentPage === page ? 'white' : 'var(--text-secondary)',
                fontSize: '0.75rem', fontWeight: '800'
              }}
            >
              {page.toUpperCase().replace('KNOWLEDGE', 'GUIDES')}
            </button>
          ))}
        </nav>

        {/* 🏠 Landing Page */}
        {currentPage === 'landing' && (
          <div className="animate-enter">
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div id="app-logo-container" className="animate-float" style={{
                width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                border: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', boxShadow: '0 0 40px rgba(255, 77, 0, 0.3)', margin: '0 auto 20px'
              }}>
                <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h1 style={{ marginBottom: '10px' }}>FF Sensi <span style={{ color: 'var(--primary)' }}>Pro</span></h1>
              <p style={{ color: 'var(--text-secondary)', letterSpacing: '4px', fontSize: '0.8rem' }}>ELITE GAMING TOOLKIT</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="glass glass-hover" onClick={() => navigateTo('sensi')} style={{ padding: '2rem', borderRadius: '24px', cursor: 'pointer', textAlign: 'center' }}>
                <Zap size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h3>Sensi Calculator</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Calibrate your device for perfect headshots.</p>
              </div>
              <div className="glass glass-hover" onClick={() => navigateTo('finder')} style={{ padding: '2rem', borderRadius: '24px', cursor: 'pointer', textAlign: 'center' }}>
                <Search size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h3>UID Analyzer</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Track stats and rank for any player.</p>
              </div>
              <div className="glass glass-hover" onClick={() => navigateTo('knowledge')} style={{ padding: '2rem', borderRadius: '24px', cursor: 'pointer', textAlign: 'center' }}>
                <BookOpen size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h3>Gaming Guides</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>20+ pro articles to improve your skill.</p>
              </div>
            </div>
          </div>
        )}

        {/* 🎯 Sensi Page */}
        {currentPage === 'sensi' && (
          <div className="animate-enter">
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Sensi <span style={{ color: 'var(--primary)' }}>Calculator</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                <div className="form-group"><label>Device Tier</label>
                  <select name="deviceType" value={formData.deviceType} onChange={handleInputChange}>
                    <option value="low">Low-End (2-3GB)</option>
                    <option value="mid">Mid-Tier (4-6GB)</option>
                    <option value="high">Flagship (8GB+)</option>
                  </select>
                </div>
                <div className="form-group"><label>System DPI</label><input type="number" name="dpi" value={formData.dpi} onChange={handleInputChange} /></div>
                <button className="btn-primary" onClick={handleCalculate} style={{ width: '100%', height: '60px' }} disabled={isCalculating}>
                  {isCalculating ? 'CALCULATING...' : 'GENERATE ELITE SENSI'}
                </button>
              </section>
              <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                {results ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="glass toolbox-card" style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '800' }}>FIRE BUTTON SIZE</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{fireBtn.size}%</div>
                    </div>
                    {Object.entries(results).map(([key, val]) => (
                      <div key={key} className="glass" style={{ padding: '0.8rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{key.toUpperCase()}</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                ) : <div style={{ textAlign: 'center', opacity: 0.3, paddingTop: '4rem' }}><Target size={60} /><p>Ready to compute</p></div>}
              </section>
            </div>
          </div>
        )}

        {/* 🔍 Finder Page */}
        {currentPage === 'finder' && <PlayerFinder playSfx={playSfx} />}

        {/* 📚 Knowledge Base Page */}
        {currentPage === 'knowledge' && (
          <div className="animate-enter">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Gaming <span style={{ color: 'var(--primary)' }}>Guides</span></h2>
            <div className="knowledge-grid">
              {knowledgeBase.map(item => (
                <div key={item.id} className="glass glass-hover knowledge-card" onClick={() => navigateTo('article', item)}>
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <div style={{ marginTop: '1rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '800' }}>READ MORE →</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📄 Article Detail Page */}
        {currentPage === 'article' && selectedArticle && (
          <div className="animate-enter content-page">
            <button className="btn-secondary" onClick={() => navigateTo('knowledge')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronLeft size={16} /> BACK TO GUIDES
            </button>
            <span style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '2px' }}>{selectedArticle.category.toUpperCase()}</span>
            <h1 style={{ textAlign: 'left', marginTop: '10px' }}>{selectedArticle.title}</h1>
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', marginTop: '2rem' }}>
              <p style={{ fontSize: '1.1rem', color: 'white' }}>{selectedArticle.content}</p>
              <p>For more personalized settings, use our <span onClick={() => navigateTo('sensi')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Sensi Calculator</span> tool to get results based on your specific device hardware.</p>
            </div>
          </div>
        )}

        {/* 🏢 About Page */}
        {currentPage === 'about' && (
          <div className="animate-enter content-page">
            <h1>About <span style={{ color: 'var(--primary)' }}>Us</span></h1>
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
              <p>FF Sensi Pro is a specialized toolkit designed by competitive gamers for the global gaming community. Our mission is to provide accessible, high-precision tools that help players of all skill levels optimize their performance.</p>
              <p>With our advanced Sensitivity Engine and UID Analyzer, we analyze hardware constraints and game mechanics to deliver the most accurate configuration settings possible.</p>
              <h3>Our Team</h3>
              <p>We are a small team of independent developers and game enthusiasts based in India. We believe in building clean, fast, and useful tools that enhance the gaming experience without complexity.</p>
            </div>
          </div>
        )}

        {/* 🔒 Privacy Page */}
        {currentPage === 'privacy' && (
          <div className="animate-enter content-page">
            <h1>Privacy <span style={{ color: 'var(--primary)' }}>Policy</span></h1>
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
              <section>
                <h3>Data Collection</h3>
                <p>We do not collect personal identifiable information. We use anonymous visitor counters and basic device stats (RAM, Screen Size) provided by your browser to calculate sensitivity settings locally on your device.</p>
              </section>
              <section>
                <h3>Third-Party Services</h3>
                <p>We may use third-party analytics (like CounterAPI) to track site traffic. These services may collect your IP address for geographic statistics only.</p>
              </section>
              <section>
                <h3>Cookies</h3>
                <p>We use local storage only to remember your device preferences for a better user experience. No tracking cookies are used.</p>
              </section>
            </div>
          </div>
        )}

        {/* 📧 Contact Page */}
        {currentPage === 'contact' && (
          <div className="animate-enter content-page">
            <h1>Contact <span style={{ color: 'var(--primary)' }}>Us</span></h1>
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', textAlign: 'center' }}>
              <p>Have questions or suggestions? We'd love to hear from you.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <a href="mailto:support@axiino.com" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Mail size={20} /> EMAIL US
                </a>
                <a href="https://wa.me/918610763440" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '60px' }}>
                  <MessageCircle size={20} /> WHATSAPP SUPPORT
                </a>
              </div>
              <p style={{ marginTop: '2rem', fontSize: '0.8rem' }}>Response time: Within 24-48 hours.</p>
            </div>
          </div>
        )}

        {/* 📜 Terms Page */}
        {currentPage === 'terms' && (
          <div className="animate-enter content-page">
            <h1>Terms of <span style={{ color: 'var(--primary)' }}>Service</span></h1>
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
              <p>By using FF Sensi Pro, you agree to the following terms:</p>
              <ul>
                <li>The tools provided are for educational and optimization purposes only.</li>
                <li>We do not guarantee a 100% headshot rate, as gameplay depends on individual skill.</li>
                <li>We are not affiliated with Garena or any other game developer.</li>
                <li>Redistribution of our sensitivity algorithms is prohibited.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 🛍️ Store Page */}
        {currentPage === 'store' && <AccountStore />}

        {/* 👣 Enhanced Footer */}
        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>FF SENSI PRO</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>The ultimate elite toolkit for gaming optimization. Precision meets performance.</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '1.5rem' }}>
                <a href="https://instagram.com/ff_kolaru_gaming._" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}><Camera size={20} /></a>
                <a href="https://wa.me/918610763440" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}><MessageCircle size={20} /></a>
              </div>
            </div>
            <div className="footer-col">
              <h4>QUICK LINKS</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('landing'); }}>Home</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('sensi'); }}>Sensi Calculator</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('finder'); }}>UID Analyzer</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('knowledge'); }}>Gaming Guides</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>LEGAL</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About Us</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>Terms & Conditions</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact Us</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>LIVE STATS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="glass" style={{ padding: '8px 15px', borderRadius: '30px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={14} color="var(--primary)" /> VISITS: <b>{visitorCount?.toLocaleString() || '...'}</b>
                </div>
                <div className="glass" style={{ padding: '8px 15px', borderRadius: '30px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={14} color="#00ff88" /> ACTIVE: <b>{activeUsers || '...'}</b>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 FF SENSI PRO • DEVELOPED BY <a href="https://axiino.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>AXIINO.COM</a></p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
