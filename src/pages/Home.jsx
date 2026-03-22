import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGame } from "../context/useGame";
import tapImg from "../assets/tap.png";
import SharedHeader from "../components/SharedHeader";
import "../styles/home.css";

/* Coins per tap table (Level Guide) */
const TAP_LEVEL_DATA = [
  { level: 1, coins: 1 },
  { level: 2, coins: 2 },
  { level: 3, coins: 3 },
  { level: 4, coins: 5 },
  { level: 5, coins: 7 },
  { level: 6, coins: 10 },
  { level: 7, coins: 15 },
  { level: 8, coins: 20 },
  { level: 9, coins: 30 },
  { level: 10, coins: 50 },
  { level: 11, coins: 75 },
  { level: 12, coins: 100 },
  { level: 13, coins: 150 },
  { level: 14, coins: 200 },
  { level: 15, coins: 300 },
  { level: 16, coins: 500 }
];

const Home = () => {

  const { coins, tapLimit, tap, coinsPerTap, level } = useGame();

  const maxTaps = 100;
  const tapPercentage = (tapLimit / maxTaps) * 100;

  const [showInfo, setShowInfo] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const iconRef = useRef(null);

  /* Tooltip positioning */
  useEffect(() => {
    if (!showInfo || !iconRef.current) return;

    const rect = iconRef.current.getBoundingClientRect();

    setTooltipPosition({
      top: rect.top - 100,
      left: rect.right + 20
    });

  }, [showInfo]);

  const getTapLimitColor = () => {
    if (tapPercentage > 60) return "full";
    if (tapPercentage > 30) return "";
    return "low";
  };

  return (
    <div className="home-container">

      {/* Background */}
      <div className="home-background">
        <div className="grid-pattern" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
      </div>

      <SharedHeader />

      <main className="main-content-home">

        <h1 className="main-title">Anime Card Empire</h1>

        <div className="tap-section">

          {/* Title Row */}
          <div className="tap-title-row">

            <h2 className="tap-title">Tap to Earn</h2>

            <span
              ref={iconRef}
              className="tap-info-icon"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
            >
              i
            </span>

          </div>

          <p className="tap-subtitle">
            Tap the button to earn coins and upgrade your cards to generate stars.
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

          {/* Coins per Tap */}
          <div className="coins-per-tap">
            Coins per tap: +<span>{coinsPerTap}</span>
          </div>

          {/* Tap Limit */}
          <div className="tap-limit-container">

            <span className="tap-limit-text">
              {tapLimit} / {maxTaps}
            </span>

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

      {/* Tooltip */}

      {showInfo && createPortal(

        <div
          className="game-info-tooltip"
          style={{
            position: "fixed",
            top: tooltipPosition.top,
            left: tooltipPosition.left
          }}
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >

          {/* Header */}
          <div className="game-info-header">
            <span className="game-info-icon">🎮</span>
            <h3>Game Guide</h3>
          </div>

          {/* Description */}
          <p className="game-info-desc">
            Tap the button to earn coins. Upgrade cards to generate stars per hour.
            Use stars to buy NFTs and grow your anime empire.
          </p>

          {/* Game Flow */}
          <div className="game-flow">

            <div className="flow-step">
              Tap → Earn Coins
            </div>

            <div className="flow-step">
              Upgrade Cards → Generate Stars
            </div>

            <div className="flow-step">
              Spend Stars → Buy NFTs
            </div>

            <div className="flow-step">
              Track Everything → Profile Page
            </div>

          </div>

          <div className="game-info-divider"></div>

          {/* Table Title */}
          <div className="tap-table-title">
            Coins Per Tap by Level
          </div>

          {/* Table */}
          <div className="tap-table">

            {TAP_LEVEL_DATA.map((item) => (
              <div key={item.level} className="tap-row">

                <span className="tap-level">
                  Lv.{item.level}
                </span>

                <span className="tap-arrow">
                  →
                </span>

                <span className="tap-coins">
                  {item.coins}
                </span>

              </div>
            ))}

          </div>

        </div>,

        document.body

      )}


    </div>
  );
};

export default Home;
