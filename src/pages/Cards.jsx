import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useGame } from "../context/useGame";
import SharedHeader from "../components/SharedHeader";
import {
  STARTER_REWARDS,
  RARE_REWARDS,
  EPIC_REWARDS,
  LEGENDARY_REWARDS,
  MYTHIC_REWARDS
} from "../constants/cardRewards";
import "../styles/cards-new.css";
import "../styles/home.css";

// importing all the images
import starsImg from "../assets/common/stars.png";
import coinsImg from "../assets/common/coins.png";
// starter images
import zenitsuImg from "../assets/cards/zenitsu.jpg";
import usoppImg from "../assets/cards/usopp.jpg";
import krillinImg from "../assets/cards/krillin.jpg";
import sakuraImg from "../assets/cards/Sakura Haruno.png";
import arminImg from "../assets/cards/Armin Arlert.jpg";
// rare images
import leviImg from "../assets/cards/Levi Ackerman.png";
import zoroImg from "../assets/cards/Roronoa Zoro.jpg";
import bakugoImg from "../assets/cards/Katsuki Bakugo.jpg";
import aizenImg from "../assets/cards/Aizen Sosuke.png";
import inosukeImg from "../assets/cards/Inosuke Hashibira.png";
// epic images
import tanjiroImg from "../assets/cards/tanjiro.jpg";
import yujiImg from "../assets/cards/yuji itadori.jpg";
import sasukeImg from "../assets/cards/sasuke uchiha.jpeg";
import erenImg from "../assets/cards/eren.jpg";
import astaImg from "../assets/cards/asta.jpeg";
// legendary images
import ichigoImg from "../assets/cards/ichigo.jpg";
import narutoImg from "../assets/cards/naruto.jpg";
import gojoImg from "../assets/cards/satoru gojo.jpg";
import rimuruImg from "../assets/cards/rimuru.jpg";
import ichibeImg from "../assets/cards/ichibe.jpg";
// mythic images
import gokuImg from "../assets/cards/goku.jpg";
import jinwooImg from "../assets/cards/sung jinwoo.jpg";
import saitamaImg from "../assets/cards/saitama.jpg";
import madaraImg from "../assets/cards/madara uchiha.jpg";
import luffyImg from "../assets/cards/luffy.jpg";


// Tier cost increase percentages
const TIER_COST_INCREASE = {
  starter: { min: 4, max: 6 },
  rare: { min: 7, max: 9 },
  epic: { min: 10, max: 12 },
  legendary: { min: 14, max: 16 },
  mythic: { min: 18, max: 22 }
};

const getRandomIncrease = (tier) => {
  const { min, max } = TIER_COST_INCREASE[tier];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateUpgradeCosts = (level1Cost, tier) => {
  const costs = [];
  let currentCost = level1Cost;
  for (let level = 1; level <= 10; level++) {
    if (level === 10) {
      costs.push(0);
    } else {
      costs.push(Math.floor(currentCost));
      const increasePercent = getRandomIncrease(tier) / 100;
      currentCost = Math.floor(currentCost * (1 + increasePercent));
    }
  }
  return costs;
};

// Placeholder image generator
const getPlaceholderImage = (text, bgColor, textColor) => 
  `https://via.placeholder.com/140x180/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;

const CARD_DATA = {
  starter: [
    { id: "zenitsu", name: "Zenitsu Agatsuma", anime: "Demon Slayer", info: "Thunderclap and Flash!", image: zenitsuImg, rarity: "starter", rewards: STARTER_REWARDS[0], level1Cost: 842, details: ["Thunder Breathing user", "Lightning Strike specialist", "Best early-game farmer", "Powerful but sleeps"] },
    { id: "usopp", name: "Usopp", anime: "One Piece", info: "Brave sniper with innovative Pop Greens arsenal.", image: usoppImg, rarity: "starter", rewards: STARTER_REWARDS[1], level1Cost: 915, details: ["Expert sniper & inventor", "Pop Greens specialist", "Team support capabilities", "High versatility"] },
    { id: "krillin", name: "Krillin", anime: "Dragon Ball", info: "Earth's strongest human martial artist.", image: krillinImg, rarity: "starter", rewards: STARTER_REWARDS[2], level1Cost: 1008, details: ["Destructo Disc master", "Loyal Z-Fighter", "Great starter option", "Strategic fighter"] },
    { id: "sakura", name: "Sakura Haruno", anime: "Naruto", info: "Medical ninja with immense chakra control.", image: sakuraImg, rarity: "starter", rewards: STARTER_REWARDS[3], level1Cost: 1086, details: ["Expert medical ninja", "Tsunade's apprentice", "Healing specialist", "Pure strength power"] },
    { id: "armin", name: "Armin Arlert", anime: "Attack on Titan", info: "Genius strategist with Colossus Titan.", image: arminImg, rarity: "starter", rewards: STARTER_REWARDS[4], level1Cost: 1134, details: ["Best tactical mind", "Colossus Titan holder", "Genius intellect", "High potential"] }
  ],
  rare: [
    { id: "levi", name: "Levi Ackerman", anime: "Attack on Titan", info: "Humanity's strongest soldier with elite combat skills.", image: leviImg, rarity: "rare", rewards: RARE_REWARDS[0], level1Cost: 1815, details: ["Expert 3DMG user", "100+ Titan kills", "Superhuman strength", "Clean fighter"] },
    { id: "zoro", name: "Roronoa Zoro", anime: "One Piece", info: "Greatest swordsman aiming to be the strongest.", image: zoroImg, rarity: "rare", rewards: RARE_REWARDS[1], level1Cost: 1897, details: ["Three-sword style", "Haki master", "Right-hand of Luffy", "Monster strength"] },
    { id: "bakugo", name: "Katsuki Bakugo", anime: "My Hero Academia", info: "Explosive hero with highest battle potential.", image: bakugoImg, rarity: "rare", rewards: RARE_REWARDS[2], level1Cost: 1978, details: ["Explosion Quirk", "Top UA student", "High damage dealer", "Aggressive fighter"] },
    { id: "aizen", name: "Aizen Sosuke", anime: "Bleach", info: "Genius captain with hypnosis abilities.", image: aizenImg, rarity: "rare", rewards: RARE_REWARDS[3], level1Cost: 2059, details: ["Kyoka Suigetsu master", "Mind manipulation", "Gen intellect", "Versatile fighter"] },
    { id: "inosuke", name: "Inosuke Hashibira", anime: "Demon Slayer", info: "Wild fighter with beast-like instincts.", image: inosukeImg, rarity: "rare", rewards: RARE_REWARDS[4], level1Cost: 2138, details: ["Beast Breathing user", "Superhuman reflexes", "Dual swords style", "Born in mountains"] }
  ],
  epic: [
    { id: "tanjiro", name: "Tanjiro Kamado", anime: "Demon Slayer", info: "Demon Slayer with Water & Sun Breathing.", image: tanjiroImg, rarity: "epic", rewards: EPIC_REWARDS[0], level1Cost: 2834, details: ["Water & Sun Breathing", "Strongest sense of smell", "Demon conversion potential", "Unique sword"] },
    { id: "yuji", name: "Yuji Itadori", anime: "Jujutsu Kaisen", info: "Sukuna's vessel with immense potential.", image: yujiImg, rarity: "epic", rewards: EPIC_REWARDS[1], level1Cost: 2927, details: ["Sukuna's host", "High physical stats", "Divine weapons", "Fast learner"] },
    { id: "sasuke", name: "Sasuke Uchiha", anime: "Naruto", info: "Uchiha prodigy with legendary dojutsu.", image: sasukeImg, rarity: "epic", rewards: EPIC_REWARDS[2], level1Cost: 3016, details: ["Sharingan & Rinnegan", "Fire Style master", "Lightning blade", "Chidori user"] },
    { id: "eren", name: "Eren Yeager", anime: "Attack on Titan", info: "Attack Titan with founding powers.", image: erenImg, rarity: "epic", rewards: EPIC_REWARDS[3], level1Cost: 3154, details: ["Founding Titan", "Attack Titan", "Coordinate ability", "Warhammer power"] },
    { id: "asta", name: "Asta", anime: "Black Clover", info: "Anti-magic swordsman with 5-leaf grimoire.", image: astaImg, rarity: "epic", rewards: EPIC_REWARDS[4], level1Cost: 3249, details: ["Anti-magic swordsman", "Grimoire: 5-leaf", "Demon dweller sword", "Driven by will"] }
  ],
  legendary: [
    { id: "ichigo", name: "Ichigo Kurosaki", anime: "Bleach", info: "Substitute Shinigami with all powers combined.", image: ichigoImg, rarity: "legendary", rewards: LEGENDARY_REWARDS[0], level1Cost: 4018, details: ["Mix of all powers", "Bankai: Zangetsu", "Final Getsuga", "Strongest protagonist"] },
    { id: "naruto", name: "Naruto Uzumaki", anime: "Naruto", info: "Seven Hokage with Nine-Tails powers.", image: narutoImg, rarity: "legendary", rewards: LEGENDARY_REWARDS[1], level1Cost: 4187, details: ["Nine-Tails Jinchuriki", "Sage Mode master", "Six Paths powers", "Rasenshuriken"] },
    { id: "gojo", name: "Satoru Gojo", anime: "Jujutsu Kaisen", info: "Strongest sorcerer with Six Eyes.", image: gojoImg, rarity: "legendary", rewards: LEGENDARY_REWARDS[2], level1Cost: 4365, details: ["Six Eyes user", "Limitless cursed energy", "Domain Expansion", "Go family heir"] },
    { id: "rimuru", name: "Rimuru Tempest", anime: "That Time I Got Reincarnated", info: "Slime lord with skill absorption.", image: rimuruImg, rarity: "legendary", rewards: LEGENDARY_REWARDS[3], level1Cost: 4521, details: ["Slime reincarnation", "Skill absorber", "Tempest nation", "Ultimate predator"] },
    { id: "ichibe", name: "Ichibe Hyosube", anime: "Bleach", info: "Soul King's lieutenant with naming power.", image: ichibeImg, rarity: "legendary", rewards: LEGENDARY_REWARDS[4], level1Cost: 4710, details: ["Zanjutsu master", "Soul King's attendant", "Calligraphy power", "Immense intellect"] }
  ],
  mythic: [
    { id: "goku", name: "Son Goku", anime: "Dragon Ball", info: "Legendary Saiyan with Ultra Instinct.", image: gokuImg, rarity: "mythic", rewards: MYTHIC_REWARDS[0], level1Cost: 5398, details: ["Super Saiyan forms", "Ultra Instinct", "Kamehameha master", "Fighter born"] },
    { id: "jinwoo", name: "Sung Jin-Woo", anime: "Solo Leveling", info: "Solo Leveler - the strongest hunter.", image: jinwooImg, rarity: "mythic", rewards: MYTHIC_REWARDS[1], level1Cost: 5684, details: ["Solo Leveler", "Shadow monarch", "Necromancer powers", "Rank S hunter"] },
    { id: "saitama", name: "Saitama", anime: "One-Punch Man", info: "One-Punch Man with unlimited power.", image: saitamaImg, rarity: "mythic", rewards: MYTHIC_REWARDS[2], level1Cost: 5982, details: ["Unlimited power", "Serious series", "One-punch KO", "Bald strength"] },
    { id: "madara", name: "Madara Uchiha", anime: "Naruto", info: "Ancient Uchiha with Rinnegan.", image: madaraImg, rarity: "mythic", rewards: MYTHIC_REWARDS[3], level1Cost: 6317, details: ["Eternal Mangekyo", "Rinnegan user", "Ten tails host", "War strategist"] },
    { id: "luffy", name: "Monkey D. Luffy", anime: "One Piece", info: "Future Pirate King with Haki mastery.", image: luffyImg, rarity: "mythic", rewards: MYTHIC_REWARDS[4], level1Cost: 6725, details: ["Gears 1-5", "Haki master", "Gomu Gomu powers", "King of pirates"] }
  ]
};

// Add upgrade costs to each card
Object.keys(CARD_DATA).forEach(tier => {
  CARD_DATA[tier].forEach(card => {
    card.upgradeCosts = generateUpgradeCosts(card.level1Cost, tier);
  });
});

const CATEGORIES = [
  { id: "all", label: "All Cards", count: 25 },
  { id: "starter", label: "Starter", count: 5 },
  { id: "rare", label: "Rare", count: 5 },
  { id: "epic", label: "Epic", count: 5 },
  { id: "legendary", label: "Legendary", count: 5 },
  { id: "mythic", label: "Mythic", count: 5 }
];

const TIER_ORDER = ["starter", "rare", "epic", "legendary", "mythic"];
const TIER_LABELS = { starter: "Starter", rare: "Rare", epic: "Epic", legendary: "Legendary", mythic: "Mythic" };

const Cards = () => {
  const gameContext = useGame();
  const coins = gameContext?.coins ?? 0;
  const setCoins = gameContext?.setCoins ?? (() => {});  const setStars = gameContext?.setStars ?? (() => {});  const validCoins = Math.max(0, parseInt(coins) || 0);

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCardInfo, setSelectedCardInfo] = useState(null);
  const [infoPosition, setInfoPosition] = useState({ top: 0, left: 0 });
  // Persist card levels into GameContext.cards so Profile can compute “owned” (level >= 10)
  const { cards: gameCards = {}, setCards } = gameContext;

  const [cardLevels, setCardLevels] = useState(() => gameCards || {});

  useEffect(() => {
    // keep local UI in sync if GameContext changes (e.g. reload)
    setCardLevels(gameCards || {});
  }, [gameCards]);

  const getAllCards = () => Object.values(CARD_DATA).flat();
  const getFilteredCards = () => activeCategory === "all" ? getAllCards() : CARD_DATA[activeCategory] || [];
  const getCardLevel = (cardId) => cardLevels[cardId]?.level || 1;

  const formatCost = (cost) => {
    const numCost = parseFloat(cost) || 0;
    if (numCost === 0) return "MAX";
    if (numCost >= 1000) return (numCost / 1000).toFixed(3) + "K";
    return numCost.toFixed(3);
  };

  const getCardReward = (card, level) => {

    const isCoinReward = level <= 3;

    const rewardArray = isCoinReward
      ? card.rewards.coin
      : card.rewards.star;

    const index = isCoinReward
      ? level - 1     // coins: levels 1–3
      : level - 4;    // stars: levels 4–10

    const rewardValue = rewardArray[index] ?? 0;

    return {
      type: isCoinReward ? "coins" : "stars",
      value: rewardValue,
      image: isCoinReward ? coinsImg : starsImg
    };
  };

  const handleInfoHover = (e, card) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 280;
    const tooltipHeight = 380;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let leftPosition = rect.left + 30;
    let topPosition = rect.bottom + 10;
    
    if (rect.left + tooltipWidth > viewportWidth) {
      leftPosition = rect.right - tooltipWidth;
    }
    if (topPosition + tooltipHeight > viewportHeight) {
      topPosition = rect.top - tooltipHeight + 130;
    }
    leftPosition = Math.max(10, leftPosition);
    topPosition = Math.max(10, topPosition);
    
    setInfoPosition({ top: topPosition, left: leftPosition });
    setSelectedCardInfo(card);
  };

  const handleInfoLeave = () => setSelectedCardInfo(null);

  const performUpgrade = (card, currentLevel) => {
    if (currentLevel >= 10) return;
    const cost = parseInt(card.upgradeCosts[currentLevel - 1]) || 0;
    if (validCoins >= cost) {
      const nextLevel = currentLevel + 1;

      // Calculate reward for the new level
      const reward = getCardReward(card, nextLevel);

      // update both local UI and GameContext consistently as { level: nextLevel }
      setCardLevels(prev => ({
        ...prev,
        [card.id]: { level: nextLevel }
      }));

      // persist into GameContext.cards so Profile can compute owned (level >= 10)
      setCards(prev => ({
        ...(prev || {}),
        [card.id]: { level: nextLevel }
      }));

      // Deduct upgrade cost and add reward coins (if applicable) in single update
      const rewardCoins = reward.type === "coins" ? reward.value : 0;
      setCoins(prevCoins => prevCoins - cost + rewardCoins);

      // Award stars (if applicable)
      if (reward.type === "stars") {
        setStars(prevStars => prevStars + reward.value);
      }
    }
  };


  const filteredCards = getFilteredCards();

  const renderCard = (card) => {
    const level = getCardLevel(card.id);
    const isMaxLevel = level >= 10;
    const currentCost = card.upgradeCosts[level - 1];
    const upgradeCost = parseInt(currentCost) || 0;
    const canUpgrade = validCoins >= upgradeCost && !isMaxLevel;
    const reward = getCardReward(card, level);

    return (
      <div key={card.id} className={`card-item ${card.rarity} ${!canUpgrade && !isMaxLevel ? 'disabled' : ''}`}>
        <div className={`card-rarity-badge ${card.rarity}`}>{card.rarity}</div>
        <div className="card-image-wrapper">
          <img src={card.image} alt={card.name} className="card-image" />
          <div className="card-image-overlay"></div>
        </div>
        <div className="card-content-section">
          <div className="card-header">
            <h3 className="card-name">{card.name}</h3>
            <button className="card-info-btn" onMouseEnter={(e) => handleInfoHover(e, card)} onMouseLeave={handleInfoLeave}>ℹ</button>
          </div>
          <div className="card-stats-row">
            <div className="card-reward">
              <img src={reward.image} alt={reward.type} className="reward-icon-img" />
              <span className="reward-value">{reward.value.toFixed(3)}/hr</span>
            </div>
            <div className="card-level-display">Lv.{level}</div>
          </div>
          <button className={`card-upgrade-btn ${isMaxLevel ? 'max-level' : ''} ${!canUpgrade && !isMaxLevel ? 'disabled' : ''}`}
            onClick={() => canUpgrade && performUpgrade(card, level)} disabled={!canUpgrade || isMaxLevel}>
            {isMaxLevel ? 'MAX' : (<><img src={coinsImg} alt="coins" className="upgrade-btn-icon" />{formatCost(currentCost)}</>)}
          </button>
        </div>
      </div>
    );
  };

  const renderTierCards = (tier) => (CARD_DATA[tier] || []).map(renderCard);

  const renderAllSections = () => TIER_ORDER.map(tier => (
    <div key={tier} className={`tier-section tier-${tier}`}>
      <div className="tier-header">
        <h2 className="tier-title">{TIER_LABELS[tier]}</h2>
        <span className="tier-count">{CARD_DATA[tier]?.length || 0} Cards</span>
      </div>
      <div className="tier-cards-grid">{renderTierCards(tier)}</div>
    </div>
  ));

  return (
    <div className="cards-container">
      <div className="cards-background">
        <div className="cards-grid-pattern" />
        <div className="cards-glow cards-glow-1" />
        <div className="cards-glow cards-glow-2" />
      </div>
      <SharedHeader />
      <div className="cards-header">
        <h1 className="cards-title">Card Collection</h1>
        <p className="cards-subtitle">Build your ultimate anime card deck. Upgrade cards to earn passive stars!</p>
      </div>
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button key={cat.id} className={`category-tab ${cat.id} ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}>{cat.label}</button>
        ))}
      </div>
      {activeCategory === "all" ? (<div className="all-tiers-container">{renderAllSections()}</div>) : (
        <div className="cards-grid">{filteredCards.map(renderCard)}</div>
      )}
      {selectedCardInfo && createPortal(
        <div className="card-info-tooltip" style={{ position: 'fixed', top: `${infoPosition.top}px`, left: `${infoPosition.left}px`, zIndex: 10000 }} onMouseLeave={() => setSelectedCardInfo(null)}>
          <div className="info-tooltip-content">
            <div className="info-tooltip-header">
              <div className="info-tooltip-title">{selectedCardInfo.name}</div>
              <div className="info-tooltip-anime">{selectedCardInfo.anime}</div>
            </div>
            <div className="info-tooltip-desc">{selectedCardInfo.info}</div>
            <div className="info-tooltip-divider"></div>
            <div className="info-tooltip-details">
              {selectedCardInfo.details && selectedCardInfo.details.map((detail, index) => (
                <div key={index} className="info-tooltip-detail">
                  <span className="detail-bullet">◆</span>
                  <span className="detail-text">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>, document.body
      )}
      {filteredCards.length === 0 && activeCategory !== "all" && (
        <div className="empty-state">
          <div className="empty-icon">🎴</div>
          <h3 className="empty-title">No Cards Found</h3>
          <p className="empty-text">Check back later for new cards!</p>
        </div>
      )}
    </div>
  );
};

export default Cards;
