import { Link, useLocation } from "react-router-dom";
import { useGame } from "../context/useGame";
import starsImg from "../assets/common/stars.png";
import coinsImg from "../assets/common/coins.png";
import "../styles/SharedHeader.css";

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
        <span className="stat-value">{Number(stars ?? 0).toFixed(3)}</span>
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
        <span className="stat-value">{Number(coins ?? 0).toLocaleString()}</span>
        <span className="stat-label-hover">Coins Earned</span>
        <img src={coinsImg} alt="Coins" className="stat-image" />
      </div>
    </header>
  );
};

export default SharedHeader;
