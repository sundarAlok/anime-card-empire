import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGame } from "../context/useGame";
import "../styles/home.css";

const StreakOverlay = ({ isOpen, onClose }) => {
  const { streakDays, lastClaimDate, getDailyStreakReward, claimStreak } = useGame();

  const [reward, setReward] = useState(0);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const daily = getDailyStreakReward();
      const tomorrowStreakDays = streakDays + 1;
      let extraReward = 0;
      const milestones = [7, 30, 90, 180, 365];
      if (milestones.includes(tomorrowStreakDays)) {
        extraReward = daily * 100;
      }
      const totalPreview = daily + extraReward;
      setReward(totalPreview);
      setClaimed(false);
    }
  }, [isOpen, streakDays, lastClaimDate, getDailyStreakReward]);

  const handleClaim = () => {
    const r = claimStreak();
    setReward(r);
    setClaimed(true);
  };

  if (!isOpen) return null;

  const dailyReward = getDailyStreakReward();
  const isMilestone = [7, 30, 90, 180, 365].includes(streakDays + 1);
  const totalReward = dailyReward + (isMilestone ? dailyReward * 100 : 0);

  return createPortal(
    <div className="streak-overlay">
      <div className="streak-modal">
        <div className="streak-header">
          <span className="streak-icon">🔥</span>
          <h3>Daily Streak</h3>
          <button className="streak-close" onClick={onClose}>×</button>
        </div>
        <div className="streak-stats">
          <div className="streak-day">
            Day <span className="streak-number">{streakDays + 1}</span>
          </div>
          <div className="streak-reward">
            +{totalReward.toLocaleString()} Coins!
            {isMilestone && <span className="milestone-badge">MILESTONE x100!</span>}
          </div>
        </div>
        <button 
          className={`streak-claim-btn ${claimed ? 'claimed' : ''}`}
          onClick={handleClaim}
          disabled={claimed}
        >
          {claimed ? 'Claimed!' : 'Claim Reward'}
        </button>
        {/* <div className="streak-multiplier">
          Multiplier: x{(Math.pow(1.076, streakDays)).toFixed(2)}
        </div> */}
      </div>
    </div>,
    document.body
  );
};

export default StreakOverlay;

