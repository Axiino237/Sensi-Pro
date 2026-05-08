import React from 'react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Camera, 
  ShieldCheck, 
  Zap, 
  Star, 
  TrendingUp, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

const AccountStore = () => {
  return (
    <div className="animate-enter">
      <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Account <span style={{ color: 'var(--primary)' }}>Store</span></h1>
        <p style={{ color: 'var(--text-secondary)', letterSpacing: '4px' }}>PREMIUM FREE FIRE MARKETPLACE</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        
        {/* Main Promo Card */}
        <div className="glass" style={{ padding: '3rem', borderRadius: '24px', border: '2px solid rgba(0, 255, 136, 0.2)', gridColumn: '1 / -1', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', opacity: 0.1 }}><ShoppingBag size={200} color="#00ff88" /></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', padding: '6px 15px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '1.5rem', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
              <Star size={14} fill="#00ff88" /> VERIFIED SELLER
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>FF KOLARU <span style={{ color: '#00ff88' }}>GAMING</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', fontSize: '1.1rem' }}>
              The most trusted destination for premium Free Fire IDs. 100% safe transactions, instant delivery, and the rarest bundles in the game.
            </p>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <a href="https://wa.me/918610763440" target="_blank" rel="noreferrer" className="btn-primary" style={{ background: '#25D366', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)', padding: '1.2rem 2.5rem' }}>
                <MessageCircle size={22} /> CHAT ON WHATSAPP
              </a>
              <a href="https://instagram.com/ff_kolaru_gaming._" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.2rem 2.5rem' }}>
                <Camera size={22} /> VIEW ON INSTAGRAM
              </a>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="glass toolbox-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <ShieldCheck size={40} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>100% Secure</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Every account is verified for security. We ensure a smooth ownership transfer without any risk.</p>
        </div>

        <div className="glass toolbox-card" style={{ padding: '2.5rem', borderRadius: '24px', borderLeftColor: '#00d2ff' }}>
          <Zap size={40} color="#00d2ff" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Instant Access</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No waiting times. Once the deal is closed, you get full access to your new elite account immediately.</p>
        </div>

        <div className="glass toolbox-card" style={{ padding: '2.5rem', borderRadius: '24px', borderLeftColor: '#ffb800' }}>
          <TrendingUp size={40} color="#ffb800" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Rare Items</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Access accounts with OG skins, Evo guns, and rare bundles that are no longer available in-game.</p>
        </div>
      </div>

      {/* Trust Badges */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.6, marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}><CheckCircle2 size={16} /> ANTI-SCAM PROTECTED</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}><Lock size={16} /> ENCRYPTED DEALS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}><Star size={16} fill="white" /> 5-STAR RATING</div>
      </div>

      {/* Sell Your Account CTA */}
      <section className="glass" style={{ padding: '3rem', borderRadius: '24px', textAlign: 'center', background: 'rgba(255, 77, 0, 0.05)', border: '1px dashed var(--primary)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Want to Sell Your ID?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Get the best valuation for your Free Fire account. Contact us today.</p>
        <a href="https://wa.me/918610763440" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          CONTACT FOR SELLING <ArrowRight size={18} />
        </a>
      </section>
    </div>
  );
};

export default AccountStore;
