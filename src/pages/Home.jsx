import { Link } from "react-router-dom";
import { useGame } from "../context/useGame";
import tapImg from "../assets/tap.png";
import "../styles/home.css";

const Home = () => {
  const { stars, coins, tapLimit, tap, tapRefill } = useGame();

  const maxTaps = 100;
  const tapPercentage = (tapLimit / maxTaps) * 100;

  const getTapLimitColor = () => {
    if (tapPercentage > 60) return "full";
    if (tapPercentage > 30) return "";
    return "low";
  };

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="home-background">
        <div className="grid-pattern" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
        <div className="particles">
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>
      </div>

      {/* Top Bar - Centered */}
      <header className="top-bar-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Logo */}
          <div className="logo-container">
            <div className="logo-icon">ACE</div>
            <div className="logo-text">
              <span className="logo-title">Anime Card Empire</span>
              <span className="logo-subtitle">Idle • Tap • Collect</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="nav-menu">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/cards" className="nav-link">Cards</Link>
            <Link to="/nfts" className="nav-link">NFTs</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </nav>

          {/* Stats */}
          <div className="stats-container">
            <div className="stat-badge coins">
              <span className="stat-icon">🪙</span>
              <span className="stat-value">{Number(coins ?? 0).toLocaleString()}</span>
            </div>
            <div className="stat-badge stars">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{(Number(stars ?? 0)).toFixed(3)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Currency Header - Stars Left, Coins Right */}
        <div className="currency-header">
          {/* Stars - Top Left */}
          <div className="stars-display">
            <div className="stars-glow" />
            <div className="stars-card">
              <div className="stars-label">
                <span>⭐</span>
                <span>Stars Earned</span>
              </div>
              <div className="stars-value">{Number(stars ?? 0).toFixed(3)}</div>
            </div>
          </div>

          {/* Coins - Top Right */}
          <div className="coins-display">
            <div className="coins-glow" />
            <div className="coins-card">
              <div className="coins-label">
                <span>Coins Earned</span>
                <span>🪙</span>
              </div>
              <div className="coins-value">{Number(coins ?? 0).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Tap Area */}
        <div className="tap-area">
          {/* Tap to Earn Title */}
          <h1 className="tap-title">Tap to Earn</h1>
          <p className="tap-subtitle">Tap the button to earn stars and coins. Upgrade your cards to increase passive income!</p>

          {/* Tap Button */}
          <div className="tap-button-container">
            <div className="tap-outer-glow" />
            <button
              className="tap-button"
              onClick={tap}
              disabled={tapLimit <= 0}
            >
              <img
                src={tapImg}
                alt="Tap"
                className="tap-button-image"
              />
              <div className="tap-button-overlay tap-shine" />
              <div className="tap-button-overlay tap-reflection" />
            </button>
          </div>

          {/* Tap Limit Display */}
          <div className="tap-limit-container">
            <div className="tap-limit-bar">
              <div 
                className={`tap-limit-fill ${getTapLimitColor()}`}
                style={{ width: `${tapPercentage}%` }}
              />
            </div>
            <span className="tap-limit-text">{tapLimit} / {maxTaps}</span>
            <span className="tap-limit-label">Tap Limit</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
