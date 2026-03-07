import { useGame } from "../context/useGame";
import tapImg from "../assets/tap.png";
import SharedHeader from "../components/SharedHeader";
import "../styles/home.css";

const Home = () => {
  const { stars, coins, tapLimit, tap } = useGame();

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

      {/* Shared Transparent Header */}
      <SharedHeader />

      {/* Main Content */}
      <main className="main-content-home">
        {/* Anime Card Empire Title */}
        <h1 className="main-title">Anime Card Empire</h1>
        
        {/* Tap to Earn Section */}
        <div className="tap-section">
          <h2 className="tap-title">Tap to Earn</h2>
          <p className="tap-subtitle">
            Tap the button to earn stars and coins. Upgrade your cards to increase passive income!
          </p>

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
            <span className="tap-limit-text">{tapLimit} / {maxTaps}</span>
            <div className="tap-limit-bar">
              <div 
                className={`tap-limit-fill ${getTapLimitColor()}`}
                style={{ width: `${tapPercentage}%` }}
              />
            </div>
            <span className="tap-limit-label">Tap Limit</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
