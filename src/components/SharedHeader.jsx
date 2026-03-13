import { Link, useLocation } from "react-router-dom";
import { useGame } from "../context/useGame";
import starsImg from "../assets/common/stars.png";
import coinsImg from "../assets/common/coins.png";
import "../styles/SharedHeader.css";

// Utility function to format large numbers (K for thousands, M for millions, B for billions)
const formatLargeNumber = (value) => {
  const num = Number(value ?? 0);
  if (num >= 1e9) {
    return (num / 1e9).toFixed(3) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(3) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(3) + 'K';
  }
  return num.toFixed(3);
};

const SharedHeader = () => {
  const { stars, coins } = useGame();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header-transparent">
      {/* Stars Earned - Left */}
      <div className="header-stats stars-earned">
        <span className="stat-label-hover">Stars Earned</span>
        <img src={starsImg} alt="Stars" className="stat-image" />
        <span className="stat-value" style={{ fontSize: '1.5rem' }}>{formatLargeNumber(stars)}</span>
      </div>

      {/* Navigation Tabs - Center (Bigger Size) */}
      <nav className="nav-menu-center">
        <Link to="/" className={`nav-link-tab ${isActive("/") ? "active" : ""}`}>Home</Link>
        <Link to="/cards" className={`nav-link-tab ${isActive("/cards") ? "active" : ""}`}>Cards</Link>
        <Link to="/nfts" className={`nav-link-tab ${isActive("/nfts") ? "active" : ""}`}>NFTs</Link>
        <Link to="/profile" className={`nav-link-tab ${isActive("/profile") ? "active" : ""}`}>Profile</Link>
      </nav>

      {/* Coins Earned - Right */}
      <div className="header-stats coins-earned">
        <span className="stat-value" style={{ fontSize: '1.5rem' }}>{formatLargeNumber(coins)}</span>
        <span className="stat-label-hover">Coins Earned</span>
        <img src={coinsImg} alt="Coins" className="stat-image" />
      </div>
    </header>
  );
};

export default SharedHeader;
