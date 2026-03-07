import { useState } from "react";
import { useGame } from "../context/useGame";
import SharedHeader from "../components/SharedHeader";
import "../styles/profile.css";
import "../styles/home.css";
import "../styles/SharedHeader.css";

// Mock achievements data
const ACHIEVEMENTS = [
  { id: 1, name: "First Tap", icon: "👆", unlocked: true },
  { id: 2, name: "100 Taps", icon: "💯", unlocked: true },
  { id: 3, name: "1000 Taps", icon: "🔥", unlocked: false },
  { id: 4, name: "First Card", icon: "🎴", unlocked: true },
  { id: 5, name: "Card Master", icon: "🏆", unlocked: false },
  { id: 6, name: "First NFT", icon: "💎", unlocked: false },
  { id: 7, name: "NFT Collector", icon: "🎆", unlocked: false },
  { id: 8, name: "Star Lord", icon: "⭐", unlocked: false },
  { id: 9, name: "Richest", icon: "💰", unlocked: false },
  { id: 10, name: "Legend", icon: "👑", unlocked: false },
  { id: 11, name: "Veteran", icon: "🎖️", unlocked: false },
  { id: 12, name: "VIP", icon: "✨", unlocked: false },
];

// Mock activity data
const ACTIVITIES = [
  { id: 1, type: "tap", text: "Tapped for stars", value: "+1 ⭐", time: "Just now" },
  { id: 2, type: "passive", text: "Passive income earned", value: "+0.5 ⭐", time: "1 min ago" },
  { id: 3, type: "card", text: "Upgraded Luffy card", value: "Lv. 5", time: "5 min ago" },
  { id: 4, type: "nft", text: "Purchased Straw Hat NFT", value: "✅", time: "1 hour ago" },
  { id: 5, type: "tap", text: "Tapped for coins", value: "+1 🪙", time: "2 hours ago" },
];

const Profile = () => {
  const { stars, coins, cards, nfts } = useGame();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  // Calculate stats
  const cardCount = Object.keys(cards).length;
  const nftCount = Object.values(nfts).filter(Boolean).length;
  const totalTaps = 1250; // Mock data
  const memberSince = "January 2025";

  // Calculate level based on stars
  const calculateLevel = () => {
    if (stars < 100) return 1;
    if (stars < 500) return 2;
    if (stars < 1000) return 3;
    if (stars < 5000) return 4;
    if (stars < 10000) return 5;
    return 6;
  };

  const level = calculateLevel();

  // Get title based on level
  const getTitle = () => {
    const titles = [
      "Novice Tapper",
      "Rising Star",
      "Card Collector",
      "NFT Enthusiast",
      "Empire Builder",
      "Legendary Emperor"
    ];
    return titles[level - 1] || "Player";
  };

  return (
    <div className="profile-container">
      {/* Background Effects */}
      <div className="profile-background">
        <div className="profile-grid-pattern" />
        <div className="profile-glow profile-glow-1" />
        <div className="profile-glow profile-glow-2" />
      </div>

      {/* Shared Transparent Header */}
      <SharedHeader />

      {/* Page Content */}
      <div className="profile-content">
        {/* Page Header */}
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">View your stats, achievements, and manage your account</p>
        </div>

        {/* Main Profile Section */}
        <div className="profile-main">
          {/* Avatar Card */}
          <div className="profile-avatar-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">🎭</div>
              <div className="profile-level-badge">Level {level}</div>
            </div>
            <h2 className="profile-name">Player One</h2>
            <p className="profile-title-text">{getTitle()}</p>
            <div className="profile-joined">
              <span>📅</span>
              <span>Member since {memberSince}</span>
            </div>
          </div>

          {/* Stats Card */}
          <div className="profile-stats-card">
            <h3 className="profile-stats-title">📊 Statistics Overview</h3>
            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <div className="profile-stat-icon">⭐</div>
                <div className="profile-stat-label">Total Stars</div>
                <div className="profile-stat-value stars">{(Number(stars ?? 0)).toFixed(3)}</div>
              </div>
              <div className="profile-stat-box">
                <div className="profile-stat-icon">🪙</div>
                <div className="profile-stat-label">Coins</div>
                <div className="profile-stat-value coins">{Number(coins ?? 0).toLocaleString()}</div>
              </div>
              <div className="profile-stat-box">
                <div className="profile-stat-icon">🎴</div>
                <div className="profile-stat-label">Cards Owned</div>
                <div className="profile-stat-value cards">{cardCount}</div>
              </div>
              <div className="profile-stat-box">
                <div className="profile-stat-icon">💎</div>
                <div className="profile-stat-label">NFTs Owned</div>
                <div className="profile-stat-value nfts">{nftCount}</div>
              </div>
              <div className="profile-stat-box">
                <div className="profile-stat-icon">👆</div>
                <div className="profile-stat-label">Total Taps</div>
                <div className="profile-stat-value">{totalTaps.toLocaleString()}</div>
              </div>
              <div className="profile-stat-box">
                <div className="profile-stat-icon">🎯</div>
                <div className="profile-stat-label">Achievements</div>
                <div className="profile-stat-value">{ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">📜 Recent Activity</h3>
          <div className="profile-activity-list">
            {ACTIVITIES.map(activity => (
              <div key={activity.id} className="profile-activity-item">
                <div className={`profile-activity-icon ${activity.type}`}>
                  {activity.type === 'tap' && '👆'}
                  {activity.type === 'passive' && '⭐'}
                  {activity.type === 'card' && '🎴'}
                  {activity.type === 'nft' && '💎'}
                </div>
                <div className="profile-activity-details">
                  <div className="profile-activity-text">{activity.text}</div>
                  <div className="profile-activity-time">{activity.time}</div>
                </div>
                <div className="profile-activity-value">{activity.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">🏆 Achievements</h3>
          <div className="profile-achievements">
            {ACHIEVEMENTS.map(achievement => (
              <div 
                key={achievement.id} 
                className={`profile-achievement ${achievement.unlocked ? '' : 'locked'}`}
                title={achievement.name}
              >
                <div className="profile-achievement-icon">{achievement.icon}</div>
                <div className="profile-achievement-name">{achievement.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">⚙️ Settings</h3>
          <div className="profile-settings-list">
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <span className="profile-setting-icon">🔔</span>
                <span className="profile-setting-text">Notifications</span>
              </div>
              <div 
                className={`profile-toggle ${notifications ? 'active' : ''}`}
                onClick={() => setNotifications(!notifications)}
              />
            </div>
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <span className="profile-setting-icon">🔊</span>
                <span className="profile-setting-text">Sound Effects</span>
              </div>
              <div 
                className={`profile-toggle ${sound ? 'active' : ''}`}
                onClick={() => setSound(!sound)}
              />
            </div>
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <span className="profile-setting-icon">🌐</span>
                <span className="profile-setting-text">Language</span>
              </div>
              <span className="profile-setting-arrow">English →</span>
            </div>
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <span className="profile-setting-icon">❓</span>
                <span className="profile-setting-text">Help & Support</span>
              </div>
              <span className="profile-setting-arrow">→</span>
            </div>
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <span className="profile-setting-icon">📋</span>
                <span className="profile-setting-text">Terms of Service</span>
              </div>
              <span className="profile-setting-arrow">→</span>
            </div>
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <span className="profile-setting-icon">🔒</span>
                <span className="profile-setting-text">Privacy Policy</span>
              </div>
              <span className="profile-setting-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
