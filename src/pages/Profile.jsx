import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import HelpSupportOverlay from "../components/HelpSupportOverlay";
import TermsOverlay from "../components/TermsOverlay";
import PrivacyOverlay from "../components/PrivacyOverlay";

// importing files
import { useGame } from "../context/useGame";
import SharedHeader from "../components/SharedHeader";
import "../styles/profile.css";
import "../styles/home.css";
import "../styles/SharedHeader.css";

// importing images
import starsImg from "../assets/common/stars.png";
import coinsImg from "../assets/common/coins.png";
import cardsImg from "../assets/profile/cards.png";
import berryImg from "../assets/profile/berry.png";
import maxCoinImg from "../assets/profile/max-coin.png";
import achievementsImg from "../assets/profile/achievements.png";
import richestImg from "../assets/profile/richest.png";
import legendImg from "../assets/profile/legend.png";
import veteranImg from "../assets/profile/veteran.png";
import vipImg from "../assets/profile/vip.png";
import notificationImg from "../assets/profile/notification.png";
import soundImg from "../assets/profile/sound.png";
import helpImg from "../assets/profile/help.png";
import languageImg from "../assets/profile/language.png";
import termsImg from "../assets/profile/terms.png";
import privacyImg from "../assets/profile/security.png";

// fontawsome icon
import '@fortawesome/fontawesome-free/css/all.min.css';

// Achievement categories with thresholds
const COIN_ACHIEVEMENTS = [
  { id: "coins_100", name: "100 Coins", threshold: 100, icon: coinsImg },
  { id: "coins_2k", name: "2K Coins", threshold: 2000, icon: coinsImg },
  { id: "coins_10k", name: "10K Coins", threshold: 10000, icon: coinsImg },
  { id: "coins_50k", name: "70K Coins", threshold: 70000, icon: coinsImg },
  { id: "coins_master", name: "Coin Minister", threshold: 150000, icon: coinsImg },
];

const CARD_ACHIEVEMENTS = [
  { id: "cards_1", name: "First Card", threshold: 1, icon: cardsImg },
  { id: "cards_3", name: "3 Cards", threshold: 3, icon: cardsImg },
  { id: "cards_7", name: "7 Cards", threshold: 7, icon: cardsImg },
  { id: "cards_11", name: "12 Cards", threshold: 12, icon: cardsImg },
  { id: "cards_master", name: "Card Master", threshold: 21, icon: cardsImg },
];

const NFT_ACHIEVEMENTS = [
  { id: "nfts_1", name: "First NFT", threshold: 1, icon: berryImg },
  { id: "nfts_3", name: "3 NFTs", threshold: 3, icon: berryImg },
  { id: "nfts_7", name: "7 NFTs", threshold: 7, icon: berryImg },
  { id: "nfts_11", name: "11 NFTs", threshold: 11, icon: berryImg },
  { id: "nfts_collector", name: "NFT Collector", threshold: 17, icon: berryImg },
];

const STAR_ACHIEVEMENTS = [
  { id: "stars_11", name: "11 Stars", threshold: 11, icon: starsImg },
  { id: "stars_108", name: "108 Stars", threshold: 108, icon: starsImg },
  { id: "stars_300", name: "3K Stars", threshold: 3000, icon: starsImg },
  { id: "stars_700", name: "10K Stars", threshold: 10000, icon: starsImg },
  { id: "stars_lord", name: "Star Lord", threshold: 50000, icon: starsImg },
];

const STREAK_ACHIEVEMENTS = [
  { id: "streak_7", name: "7 Day", threshold: 7, icon: "🔥" },
  { id: "streak_30", name: "30 Day", threshold: 30, icon: "🔥" },
  { id: "streak_3m", name: "3 Month", threshold: 90, icon: "🔥" },
  { id: "streak_6m", name: "6 Month", threshold: 180, icon: "🔥" },
  { id: "streak_1y", name: "Goal Achiever", threshold: 365, icon: "🔥" },
];

// Special achievements
const SPECIAL_ACHIEVEMENTS = [
  { 
    id: "richest", 
    name: "Richest", 
    condition: (coins, stars, cardCount, nftCount) => coins >= 2000 && stars >= 108 && cardCount >= 3 && nftCount >= 3,
    icon: richestImg
  },
  { 
    id: "legend", 
    name: "Legend", 
    condition: (coins, stars, cardCount, nftCount) => coins >= 10000 && stars >= 300 && cardCount >= 7 && nftCount >= 7,
    icon: legendImg
  },
  { 
    id: "veteran", 
    name: "Veteran", 
    condition: (coins, stars, cardCount, nftCount) => coins >= 50000 && stars >= 700 && cardCount >= 11 && nftCount >= 11,
    icon: veteranImg
  },
  { 
    id: "vip", 
    name: "VIP", 
    condition: (coins, stars, cardCount, nftCount) => coins >= 100000 && stars >= 1500 && cardCount >= 21 && nftCount >= 17,
    icon: vipImg
  },
];

// Check if achievement is unlocked
const isAchievementUnlocked = (achievement, coins, stars, cardCount, nftCount) => {
  if (achievement.condition) {
    return achievement.condition(coins, stars, cardCount, nftCount);
  }
  if (achievement.threshold !== undefined) {
    if (achievement.id.startsWith("coins_")) return coins >= achievement.threshold;
    if (achievement.id.startsWith("cards_")) return cardCount >= achievement.threshold;
    if (achievement.id.startsWith("nfts_")) return nftCount >= achievement.threshold;
    if (achievement.id.startsWith("stars_")) return stars >= achievement.threshold;
    if (achievement.id.startsWith("streak_")) return false; // Streak not implemented yet
  }
  return false;
};

// Level data with titles (16 levels)
const LEVEL_DATA = [
  { level: 1, coins: 0, title: "Novice Explorer" },
  { level: 2, coins: 100, title: "Tap Apprentice" },
  { level: 3, coins: 500, title: "Coin Rookie" },
  { level: 4, coins: 1000, title: "Treasure Hunter" },
  { level: 5, coins: 2500, title: "Silver Scout" },
  { level: 6, coins: 5000, title: "Gold Gatherer" },
  { level: 7, coins: 10000, title: "Platinum Player" },
  { level: 8, coins: 20000, title: "Diamond Diver" },
  { level: 9, coins: 35000, title: "Master Collector" },
  { level: 10, coins: 55000, title: "Elite Strategist" },
  { level: 11, coins: 80000, title: "Champion" },
  { level: 12, coins: 110000, title: "Supreme Leader" },
  { level: 13, coins: 150000, title: "Grand Master" },
  { level: 14, coins: 200000, title: "Legendary Hero" },
  { level: 15, coins: 300000, title: "Mythic Emperor" },
  { level: 16, coins: 500000, title: "Ultimate God" },
];

const Profile = () => {
  const { stars, coins, highestCoins, cards, nfts } = useGame();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [editName, setEditName] = useState('Player One');
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoRef = useRef(null);
  const iconRef = useRef(null);

  // “Owned cards” = cards where upgrade level >= 10
  const cardCount = Object.values(cards || {}).filter(c => (c?.level ?? 0) >= 10).length;
  const nftCount = Object.values(nfts).filter(Boolean).length;
  const memberSince = "January 2025";

  // Calculate level based on highest coins ever earned
  const calculateLevel = () => {
    for (let i = LEVEL_DATA.length - 1; i >= 0; i--) {
      if (highestCoins >= LEVEL_DATA[i].coins) {
        return LEVEL_DATA[i].level;
      }
    }
    return 1;
  };

  const level = calculateLevel();

  // Get title based on level
  const getTitle = () => {
    const levelItem = LEVEL_DATA.find(l => l.level === level);
    return levelItem ? levelItem.title : "Player";
  };

  // Format coins for display
  const formatCoinValue = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + "K";
    }
    return value.toString();
  };

  // Update tooltip position when shown
  useEffect(() => {
    if (!showLevelInfo || !iconRef.current) return;

    const updateTooltipPosition = () => {
      const icon = iconRef.current.getBoundingClientRect();
      const tooltipWidth = 380;
      const tooltipHeight = 400; // approximate height
      const offset = 15;
      
      // Calculate position
      let left = icon.right + offset;
      let top = icon.top - (tooltipHeight - icon.height) / 2;
      
      // Adjust if tooltip goes off right edge
      if (left + tooltipWidth > window.innerWidth) {
        left = icon.left - tooltipWidth - offset;
      }
      
      // Adjust if tooltip goes off bottom
      if (top + tooltipHeight > window.innerHeight) {
        top = window.innerHeight - tooltipHeight - 20;
      }
      
      // Adjust if tooltip goes off top
      if (top < 20) {
        top = 20;
      }
      
      setTooltipPosition({
        top: Math.max(0, top),
        left: Math.max(0, left)
      });
    };

    updateTooltipPosition();

    // Add scroll and resize listeners to keep tooltip positioned correctly
    window.addEventListener('scroll', updateTooltipPosition, true);
    window.addEventListener('resize', updateTooltipPosition);

    return () => {
      window.removeEventListener('scroll', updateTooltipPosition, true);
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [showLevelInfo]);

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

      {/* Edit Overlay */}
      {isEditing && createPortal(
        <div className="edit-profile-overlay" onClick={() => setIsEditing(false)}>
          <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-profile-header">
              <h3>Edit Profile</h3>
              <button className="edit-close" onClick={() => setIsEditing(false)}>×</button>
            </div>
            <div className="edit-avatar-preview text-center mx-auto">
              <div className="edit-avatar-display mb-4">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="edit-avatar-img" />
                ) : (
                  <div className="edit-avatar-placeholder">🎭</div>
                )}
              </div>
              <div className="flex flex-col gap-2 max-w-md mx-auto">
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  className="edit-file-input"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPhotoPreview(url);
                    }
                  }}
                />
                <input
                  type="url"
                  className="edit-input"
                  placeholder="Avatar URL (e.g. https://example.com/avatar.jpg)"
                  onChange={(e) => {
                    const url = e.target.value;
                    if (url) {
                      setPhotoPreview(url);
                    }
                  }}
                />
              </div>
            </div>
            <div className="edit-form">
              <label className="edit-label">Name</label>
              <input
                type="text"
                className="edit-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value.slice(0, 20))}
                maxLength="20"
                placeholder="Enter your display name (max 20 chars)"
              />
              <label className="edit-label">Email</label>
              <input
                type="email"
                className="edit-input"
                value="player@example.com"
                readOnly
                maxLength="35"
                placeholder="player@example.com (max 35 chars)"
              />
            </div>
            <div className="edit-actions">
              <button className="edit-cancel flex-1" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="edit-save edit-cancel" onClick={() => {
                // Save logic here (localStorage, Firebase, etc.)
                console.log('Saved:', { editName, photoPreview });
                setIsEditing(false);
              }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <HelpSupportOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <TermsOverlay isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyOverlay isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

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
            <div className="profile-avatar-section relative">
              <button 
                className="edit-avatar-btn absolute top-[-5px] right-[-10px] w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 border-none border-white/30 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 z-20 text-white font-bold text-xs drop-shadow-lg cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <i className="fa-solid fa-pencil" style={{ color: '#10b981', fontSize: '0.875rem' }}></i>
              </button>
              <div className="profile-avatar">{photoPreview ? (
                <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : "🎭"}</div>
              <div className="profile-level-badge">Level {level}</div>
            </div>

            <h2 className="profile-name">{editName}</h2>
            <div className="profile-title-wrapper">
              <p className="profile-title-text">{getTitle()}</p>
              {/* Level Info Icon next to title */}
              <span 
                ref={iconRef}
                className="level-info-icon"
                onMouseEnter={() => setShowLevelInfo(true)}
                onMouseLeave={() => setShowLevelInfo(false)}
              >
                i
              </span>
              {/* Level Info Tooltip - rendered via Portal to bypass stacking contexts */}
              {showLevelInfo && createPortal(
                <div 
                  className="level-info-tooltip"
                  style={{
                    position: 'fixed',
                    top: `${tooltipPosition.top}px`,
                    left: `${tooltipPosition.left}px`,
                    zIndex: 10000,
                    visibility: 'visible',
                    opacity: 1,
                    display: 'block'
                  }}
                  onMouseEnter={() => setShowLevelInfo(true)}
                  onMouseLeave={() => setShowLevelInfo(false)}
                >
                  <div className="level-info-title">Level Guide</div>
                  <div className="level-info-description">
                    Collect coins to unlock new levels and titles. Each level requires a minimum coin threshold.
                  </div>
                  <div className="level-info-table">
                    <div className="level-info-grid">
                      <div className="level-info-column">
                        {LEVEL_DATA.slice(0, 8).map((item) => (
                          <div key={item.level} className="level-info-item">
                            <span className="level-number">Lv.{item.level}</span>
                            <span className="level-bracket">[</span>
                            <span className="level-name">{item.title}</span>
                            <span className="level-bracket">]</span>
                            <span className="level-separator">≥</span>
                            <span className="level-coins">{formatCoinValue(item.coins)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="level-info-column">
                        {LEVEL_DATA.slice(8).map((item) => (
                          <div key={item.level} className="level-info-item">
                            <span className="level-number">Lv.{item.level}</span>
                            <span className="level-bracket">[</span>
                            <span className="level-name">{item.title}</span>
                            <span className="level-bracket">]</span>
                            <span className="level-separator">≥</span>
                            <span className="level-coins">{formatCoinValue(item.coins)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </div>
            <div className="profile-joined">
              <span>📅</span>
              <span>Member since {memberSince}</span>
            </div>
          </div>

          {/* Stats Card */}
          <div className="profile-stats-card">
            <h3 className="profile-stats-title">Statistics Overview</h3>
            <div className="profile-stats-grid">
              {/* Total Stars */}
              <div className="profile-stat-box">
                <div className="profile-stat-row">
                  <img src={starsImg} alt="Total Stars" className="profile-stat-img"  />
                  <div className="profile-stat-content">
                    <div className="profile-stat-value stars">{(Number(stars ?? 0)).toFixed(3)}</div>
                    <div className="profile-stat-label">Total Stars</div>
                  </div>
                </div>
              </div>
              {/* Coins */}
              <div className="profile-stat-box">
                <div className="profile-stat-row">
                  <img src={coinsImg} alt="Coins" className="profile-stat-img"  />
                  <div className="profile-stat-content">
                    <div className="profile-stat-value coins">{Number(coins ?? 0).toLocaleString()}</div>
                    <div className="profile-stat-label">Coins</div>
                  </div>
                </div>
              </div>
              {/* Highest Coins */}
              <div className="profile-stat-box">
                <div className="profile-stat-row">
                  <img src={maxCoinImg} alt="Highest Coins" className="profile-stat-img"  />
                  <div className="profile-stat-content">
                    <div className="profile-stat-value coins">{Number(highestCoins ?? 0).toLocaleString()}</div>
                    <div className="profile-stat-label">Highest Coins</div>
                  </div>
                </div>
              </div>
              {/* Cards Owned */}
              <div className="profile-stat-box">
                <div className="profile-stat-row">
                  <img src={cardsImg} alt="Cards Owned" className="profile-stat-img"  />
                  <div className="profile-stat-content">
                    <div className="profile-stat-value cards">{cardCount}</div>
                    <div className="profile-stat-label">Cards Owned</div>
                  </div>
                </div>
              </div>
              {/* NFTs Owned */}
              <div className="profile-stat-box">
                <div className="profile-stat-row">
                  <img src={berryImg} alt="NFTs Owned" className="profile-stat-img"  />
                  <div className="profile-stat-content">
                    <div className="profile-stat-value nfts">{nftCount}</div>
                    <div className="profile-stat-label">NFTs Owned</div>
                  </div>
                </div>
              </div>
              {/* Achievements */}
              <div className="profile-stat-box">
                <div className="profile-stat-row">
                  <img src={achievementsImg} alt="Achievements" className="profile-stat-img"  />
                  <div className="profile-stat-content">
                    <div className="profile-stat-value">0/0</div>
                    <div className="profile-stat-label">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">Achievements</h3>
          
          {/* Achievement Categories Grid */}
          <div className="achievement-categories">
            {/* Coins Column */}
            <div className="achievement-category">
              <h4 className="achievement-category-title">
                <img src={coinsImg} alt="Coins" className="achievement-category-icon" />
                Coins
              </h4>
              <div className="achievement-list">
                {COIN_ACHIEVEMENTS.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${isAchievementUnlocked(achievement, coins, stars, cardCount, nftCount) ? 'unlocked' : 'locked'}`}
                  >
                    <img src={achievement.icon} alt={achievement.name} className="achievement-icon" />
                    <span className="achievement-name">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards Column */}
            <div className="achievement-category">
              <h4 className="achievement-category-title">
                <img src={cardsImg} alt="Cards" className="achievement-category-icon" />
                Cards
              </h4>
              <div className="achievement-list">
                {CARD_ACHIEVEMENTS.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${isAchievementUnlocked(achievement, coins, stars, cardCount, nftCount) ? 'unlocked' : 'locked'}`}
                  >
                    <img src={achievement.icon} alt={achievement.name} className="achievement-icon" />
                    <span className="achievement-name">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NFTs Column */}
            <div className="achievement-category">
              <h4 className="achievement-category-title">
                <img src={berryImg} alt="NFTs" className="achievement-category-icon" />
                NFTs
              </h4>
              <div className="achievement-list">
                {NFT_ACHIEVEMENTS.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${isAchievementUnlocked(achievement, coins, stars, cardCount, nftCount) ? 'unlocked' : 'locked'}`}
                  >
                    <img src={achievement.icon} alt={achievement.name} className="achievement-icon" />
                    <span className="achievement-name">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stars Column */}
            <div className="achievement-category">
              <h4 className="achievement-category-title">
                <img src={starsImg} alt="Stars" className="achievement-category-icon" />
                Stars
              </h4>
              <div className="achievement-list">
                {STAR_ACHIEVEMENTS.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${isAchievementUnlocked(achievement, coins, stars, cardCount, nftCount) ? 'unlocked' : 'locked'}`}
                  >
                    <img src={achievement.icon} alt={achievement.name} className="achievement-icon" />
                    <span className="achievement-name">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streaks Column */}
            <div className="achievement-category">
              <h4 className="achievement-category-title">
                <span className="achievement-category-icon streak-icon">🔥</span>
                Streaks
              </h4>
              <div className="achievement-list">
                {STREAK_ACHIEVEMENTS.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${isAchievementUnlocked(achievement, coins, stars, cardCount, nftCount) ? 'unlocked' : 'locked'}`}
                  >
                    <span className="achievement-icon-text">{achievement.icon}</span>
                    <span className="achievement-name">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Special Achievements */}
          <div className="special-achievements">
            <h4 className="special-achievements-title">Special Achievements</h4>
            <div className="special-achievements-grid">
{SPECIAL_ACHIEVEMENTS.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`special-achievement aspect-square relative ${isAchievementUnlocked(achievement, coins, stars, cardCount, nftCount) ? 'unlocked' : 'locked'}`}
                >
                  <img 
                    src={achievement.icon} 
                    alt={achievement.name}
                    className="special-achievement-icon w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">Settings</h3>
          <div className="profile-settings-list">
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <img src={notificationImg} alt="Notifications" className="profile-setting-icon" />
                <span className="profile-setting-text">Notifications</span>
              </div>
              <div 
                className={`profile-toggle ${notifications ? 'active' : ''}`}
                onClick={() => setNotifications(!notifications)}
              />
            </div>
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <img src={soundImg} alt="Sound" className="profile-setting-icon" />
                <span className="profile-setting-text">Sound Effects</span>
              </div>
              <div 
                className={`profile-toggle ${sound ? 'active' : ''}`}
                onClick={() => setSound(!sound)}
              />
            </div>
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <img src={languageImg} alt="Language" className="profile-setting-icon" />
                <span className="profile-setting-text">Language</span>
              </div>
              <span className="profile-setting-arrow cursor-pointer" onClick={() => setShowLanguage(true)}>English →</span>
            </div>

            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <img src={helpImg} alt="Help" className="profile-setting-icon" />
                <span className="profile-setting-text">Help & Support</span>
              </div>
              <span className="profile-setting-arrow cursor-pointer" onClick={() => setShowHelp(true)}>→</span>
            </div>

            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <img src={termsImg} alt="Terms" className="profile-setting-icon" />
                <span className="profile-setting-text">Terms of Service</span>
              </div>
              <span className="profile-setting-arrow cursor-pointer" onClick={() => setShowTerms(true)}>→</span>
            </div>
            <div className="profile-setting-item">
              <div className="profile-setting-info">
                <img src={privacyImg} alt="Privacy" className="profile-setting-icon" />
                <span className="profile-setting-text">Privacy Policy</span>
              </div>
              <span className="profile-setting-arrow cursor-pointer" onClick={() => setShowPrivacy(true)}>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
