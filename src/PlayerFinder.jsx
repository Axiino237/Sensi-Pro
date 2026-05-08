import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Trophy, 
  Users, 
  Heart, 
  Zap, 
  Activity, 
  Globe, 
  AlertCircle,
  Loader2,
  Crosshair,
  Crown,
  MessageCircle,
  Camera,
  WifiOff,
  Target,
  Shield,
  Flame,
  BarChart2
} from 'lucide-react';

// ✅ FreeFire-Api by 0xMe — No API key needed!
// Source: https://github.com/0xMe/FreeFire-Api
const FF_API = 'https://freefire-api-six.vercel.app';

// ✅ Ban Check API — via Vite proxy → raw.thug4ff.xyz
// Source: https://github.com/paulafredo/check-ban-freefire-bot
const BAN_API = '/api/bancheck'; // Proxied by vite.config.js → http://raw.thug4ff.xyz/check_ban

const statLabel = (key) => ({
  kills: 'Kills', deaths: 'Deaths', wins: 'Wins', gamesplayed: 'Games',
  damage: 'Damage', headshotKills: 'HS Kills', headshots: 'Headshots',
  highestKills: 'Best Kill', knockDown: 'Knock', revives: 'Revives',
  topNTimes: 'Top Placements', roadKills: 'Road Kills', survivalTime: 'Survival (s)',
  ratingPoints: 'Rating Points', ratingEnabledGames: 'Ranked Games',
  distanceTravelled: 'Distance (m)', pickUps: 'Pick Ups'
})[key] || key;

const ModeCard = ({ title, data, color = 'var(--primary)' }) => {
  if (!data || !data.detailedstats || Object.keys(data.detailedstats).length === 0) {
    return (
      <div className="glass toolbox-card" style={{ padding: '2rem', borderRadius: '20px' }}>
        <h3 style={{ fontSize: '1rem', color, marginBottom: '1rem', textTransform: 'uppercase' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No data available for this mode.</p>
      </div>
    );
  }
  const kd = data.kills && data.detailedstats.deaths
    ? (data.kills / data.detailedstats.deaths).toFixed(2)
    : data.kills && data.gamesplayed ? '—' : '—';
  const hsRate = data.detailedstats.headshotKills && data.kills
    ? ((data.detailedstats.headshotKills / data.kills) * 100).toFixed(1) + '%'
    : '—';
  const winRate = data.wins && data.gamesplayed
    ? ((data.wins / data.gamesplayed) * 100).toFixed(1) + '%'
    : '—';

  const highlights = [
    { label: 'Games', value: data.gamesplayed },
    { label: 'Kills', value: data.kills },
    { label: 'Wins', value: data.wins },
    { label: 'K/D', value: kd },
    { label: 'Win Rate', value: winRate },
    { label: 'HS Rate', value: hsRate },
    { label: 'Best Kill', value: data.detailedstats.highestKills },
    { label: 'Headshots', value: data.detailedstats.headshots },
    { label: 'Damage', value: data.detailedstats.damage?.toLocaleString() },
    { label: 'Knock', value: data.detailedstats.knockDown },
    { label: 'Revives', value: data.detailedstats.revives },
    { label: 'Top Places', value: data.detailedstats.topNTimes },
  ].filter(s => s.value !== undefined && s.value !== null);

  return (
    <div className="glass toolbox-card" style={{ padding: '2rem', borderRadius: '20px', borderLeft: `4px solid ${color}` }}>
      <h3 style={{ fontSize: '1rem', color, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {highlights.map(s => (
          <div key={s.label} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '0.8rem 0.4rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'white' }}>{s.value ?? '—'}</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlayerFinder = ({ playSfx }) => {
  const [uid, setUid] = useState('');
  const [region, setRegion] = useState('IND');
  const [gamemode, setGamemode] = useState('br');
  const [matchmode, setMatchmode] = useState('CAREER');
  const [playerData, setPlayerData] = useState(null);
  const [banData, setBanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const regions = [
    { id: 'IND', name: 'India (IND)' },
    { id: 'SG', name: 'Singapore (SG)' },
    { id: 'BR', name: 'Brazil (BR)' },
    { id: 'US', name: 'United States (US)' },
    { id: 'RU', name: 'Russia (RU)' },
    { id: 'ID', name: 'Indonesia (ID)' },
    { id: 'ME', name: 'Middle East (ME)' },
    { id: 'PK', name: 'Pakistan (PK)' },
    { id: 'BD', name: 'Bangladesh (BD)' },
    { id: 'TW', name: 'Taiwan (TW)' },
    { id: 'VN', name: 'Vietnam (VN)' },
    { id: 'TH', name: 'Thailand (TH)' },
    { id: 'CIS', name: 'CIS (RU/EU)' },
  ];

  const fetchPlayerDetails = async () => {
    if (!uid.trim()) { setError('Please enter a valid UID.'); return; }
    if (playSfx) playSfx('reload');
    setLoading(true);
    setError(null);
    setPlayerData(null);
    setBanData(null);

    try {
      // Fetch stats + ban check in parallel (ban goes through Vite proxy)
      const banUrl = `${BAN_API}/${uid}/great`;
      const [careerRes, rankedRes, banRes] = await Promise.all([
        fetch(`${FF_API}/get_player_stats?server=${region}&uid=${uid}&matchmode=CAREER&gamemode=${gamemode}`),
        fetch(`${FF_API}/get_player_stats?server=${region}&uid=${uid}&matchmode=RANKED&gamemode=${gamemode}`),
        fetch(banUrl).catch(() => null),
      ]);

      const careerJson = await careerRes.json();
      const rankedJson = await rankedRes.json();

      // Parse ban data
      if (banRes) {
        try {
          const banJson = await banRes.json();
          if (banJson.status === 200 && banJson.data) {
            const d = banJson.data;
            setBanData({
              nickname: d.nickname || 'Unknown',
              isBanned: d.is_banned === 1,
              period: d.period || 0,
              region: d.region || region,
              lastLogin: d.last_login ? new Date(d.last_login * 1000).toLocaleString() : 'Unknown',
            });
          }
        } catch (_) {}
      }

      if (!careerJson.success && !rankedJson.success) {
        setError(`Player not found (UID: ${uid}, Region: ${region}). Try a different region.`);
        setLoading(false);
        return;
      }

      setPlayerData({ uid, region, gamemode, career: careerJson.data, ranked: rankedJson.data });
    } catch (e) {
      setError(`Network error: ${e.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="animate-enter">
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>UID <span style={{ color: 'var(--primary)' }}>Analyzer</span></h1>
        <p style={{ color: 'var(--text-secondary)', letterSpacing: '3px' }}>REAL-TIME STATS • NO API KEY</p>
      </header>

      <section className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius)', marginBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div className="form-group">
            <label>Player UID</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                placeholder="Ex: 868145897" 
                value={uid} 
                onChange={(e) => setUid(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchPlayerDetails()}
                style={{ paddingLeft: '3.5rem' }}
              />
              <User size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
            </div>
          </div>
          <div className="form-group">
            <label>Region</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Game Mode</label>
            <select value={gamemode} onChange={(e) => setGamemode(e.target.value)}>
              <option value="br">Battle Royale</option>
              <option value="cs">Clash Squad</option>
            </select>
          </div>
          <div className="form-group">
            <label>Match Type</label>
            <select value={matchmode} onChange={(e) => setMatchmode(e.target.value)}>
              <option value="CAREER">Career</option>
              <option value="RANKED">Ranked</option>
            </select>
          </div>
        </div>

        <button 
          className="btn-primary animate-glitch" 
          onClick={fetchPlayerDetails} 
          style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          disabled={loading}
        >
          {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={20} />}
          {loading ? 'SCANNING DATABASE...' : 'ANALYZE PLAYER'}
        </button>

        {error && (
          <div style={{ marginTop: '20px', background: 'rgba(255, 77, 0, 0.08)', border: '1px solid rgba(255,77,0,0.3)', padding: '1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
            <WifiOff size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}
      </section>

      {playerData && (
        <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Header card */}
          <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius)', borderLeft: '5px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(255,77,0,0.3)' }}>
                <Crown size={44} color="white" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '2.5rem', textTransform: 'none' }}>
                    {banData?.nickname || `UID: ${playerData.uid}`}
                  </h2>
                  <span style={{ background: 'rgba(255,77,0,0.15)', color: 'var(--primary)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid var(--primary)' }}>
                    {playerData.region} SERVER
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>
                    {playerData.gamemode === 'br' ? '🪂 Battle Royale' : '⚔️ Clash Squad'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem' }}>
                  UID: {playerData.uid} • Showing Career + Ranked stats simultaneously
                </p>
              </div>
            </div>
          </div>

          {/* Ban Status Card */}
          {banData && (
            <div className="glass" style={{
              padding: '2rem', borderRadius: '20px',
              border: `2px solid ${banData.isBanned ? '#ff4444' : '#00ff88'}`,
              background: banData.isBanned ? 'rgba(255,68,68,0.07)' : 'rgba(0,255,136,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '55px', height: '55px', borderRadius: '14px',
                    background: banData.isBanned ? 'rgba(255,68,68,0.2)' : 'rgba(0,255,136,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                  }}>
                    {banData.isBanned ? '🚫' : '✅'}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: banData.isBanned ? '#ff4444' : '#00ff88' }}>
                      {banData.isBanned ? 'BANNED ACCOUNT' : 'CLEAN ACCOUNT'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {banData.isBanned
                        ? `Banned for cheating • Period: ${banData.period > 0 ? banData.period + ' months' : 'Permanent'}`
                        : 'No evidence of cheat usage found'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', padding: '0.75rem 1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Last Login</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white' }}>{banData.lastLogin}</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.75rem 1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Region</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white' }}>{banData.region}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Career Stats */}
          {playerData.career && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <BarChart2 size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem' }}>CAREER STATS</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <ModeCard title="Solo" data={playerData.career.solostats} color="#00d2ff" />
                <ModeCard title="Duo" data={playerData.career.duostats} color="#ffb800" />
                <ModeCard title="Squad" data={playerData.career.quadstats} color="var(--primary)" />
              </div>
            </div>
          )}

          {/* Ranked Stats */}
          {playerData.ranked?.success !== false && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <Trophy size={22} color="#ffb800" />
                <h3 style={{ fontSize: '1.25rem' }}>RANKED STATS</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <ModeCard title="Solo Ranked" data={playerData.ranked?.solostats} color="#00d2ff" />
                <ModeCard title="Duo Ranked" data={playerData.ranked?.duostats} color="#ffb800" />
                <ModeCard title="Squad Ranked" data={playerData.ranked?.quadstats} color="var(--primary)" />
              </div>
            </div>
          )}

          {/* Contact CTA */}
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0, 255, 136, 0.3)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#00ff88' }}>Buy & Sell FF IDs</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Contact <b>FF KOLARU GAMING</b> for safe account trading.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <a href="https://wa.me/918610763440" target="_blank" rel="noreferrer" className="btn-primary" style={{ background: '#25D366', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageCircle size={18} /> WHATSAPP
              </a>
              <a href="https://instagram.com/ff_kolaru_gaming._" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} /> @ff_kolaru_gaming._
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PlayerFinder;
