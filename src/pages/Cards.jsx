import { useState } from "react";
import { useGame } from "../context/useGame";
import { STAR_RATES } from "../constants/starRates";
import SharedHeader from "../components/SharedHeader";
import "../styles/cards.css";
import "../styles/home.css";

// Card data with different categories
const CARD_DATA = {
  starter: [
    {
      id: "luffy",
      name: "Monkey D. Luffy",
      description: "The future Pirate King with his iconic straw hat. His rubber powers make him unstoppable!",
      image: "/src/assets/luffy.jpg",
      rarity: "starter",
      passiveStars: STAR_RATES[4] || 1,
      upgradeCost: 100
    },
    {
      id: "zoro",
      name: "Roronoa Zoro",
      description: "The greatest swordsman with his three-sword style. He dreams of becoming the strongest!",
      image: "https://via.placeholder.com/140x180/1e293b/6366f1?text=Zoro",
      rarity: "starter",
      passiveStars: STAR_RATES[4] || 1,
      upgradeCost: 100
    },
    {
      id: "nami",
      name: "Nami",
      description: "The skilled navigator who draws maps of the world's oceans. Her weather tech is amazing!",
      image: "https://via.placeholder.com/140x180/1e293b/6366f1?text=Nami",
      rarity: "starter",
      passiveStars: STAR_RATES[4] || 1,
      upgradeCost: 100
    }
  ],
  rare: [
    {
      id: "sanji",
      name: "Vinsmoke Sanji",
      description: "The Black Legger with his fiery kicks. His cooking and fighting skills are legendary!",
      image: "https://via.placeholder.com/140x180/1e293b/3b82f6?text=Sanji",
      rarity: "rare",
      passiveStars: STAR_RATES[5] || 1.3,
      upgradeCost: 250
    },
    {
      id: "usopp",
      name: "Usopp",
      description: "The brave sniper with his Pop Greens. His lies become reality!",
      image: "https://via.placeholder.com/140x180/1e293b/3b82f6?text=Usopp",
      rarity: "rare",
      passiveStars: STAR_RATES[5] || 1.3,
      upgradeCost: 250
    },
    {
      id: "chopper",
      name: "Tony Tony Chopper",
      description: "The reindeer doctor with his Rumble Balls. He can transform into many forms!",
      image: "https://via.placeholder.com/140x180/1e293b/3b82f6?text=Chopper",
      rarity: "rare",
      passiveStars: STAR_RATES[5] || 1.3,
      upgradeCost: 250
    }
  ],
  epic: [
    {
      id: "ace",
      name: "Portgas D. Ace",
      description: "The Fire Fist with his Mera Mera no Mi. The son of the Pirate King!",
      image: "https://via.placeholder.com/140x180/1e293b/8b5cf6?text=Ace",
      rarity: "epic",
      passiveStars: STAR_RATES[7] || 2,
      upgradeCost: 500
    },
    {
      id: "sabo",
      name: "Sabo",
      description: "The Revolutionary with his Dragon Claw. Ace's sworn brother!",
      image: "https://via.placeholder.com/140x180/1e293b/8b5cf6?text=Sabo",
      rarity: "epic",
      passiveStars: STAR_RATES[7] || 2,
      upgradeCost: 500
    },
    {
      id: "whitebeard",
      name: "Whitebeard",
      description: "The strongest man in the world with his quake-quake powers!",
      image: "https://via.placeholder.com/140x180/1e293b/8b5cf6?text=Whitebeard",
      rarity: "epic",
      passiveStars: STAR_RATES[8] || 2.4,
      upgradeCost: 750
    }
  ],
  legendary: [
    {
      id: "roger",
      name: "Gol D. Roger",
      description: "The Pirate King himself! The man who found the One Piece!",
      image: "https://via.placeholder.com/140x180/1e293b/f59e0b?text=Roger",
      rarity: "legendary",
      passiveStars: STAR_RATES[10] || 3,
      upgradeCost: 1000
    },
    {
      id: "shanks",
      name: "Shanks",
      description: "The Emperor of the Sea with his haki powers. Luffy's inspiration!",
      image: "https://via.placeholder.com/140x180/1e293b/f59e0b?text=Shanks",
      rarity: "legendary",
      passiveStars: STAR_RATES[10] || 3,
      upgradeCost: 1000
    },
    {
      id: "mihawk",
      name: "Dracule Mihawk",
      description: "The strongest swordsman in the world. His black blade is unstoppable!",
      image: "https://via.placeholder.com/140x180/1e293b/f59e0b?text=Mihawk",
      rarity: "legendary",
      passiveStars: STAR_RATES[10] || 3,
      upgradeCost: 1000
    }
  ]
};

const CATEGORIES = [
  { id: "all", label: "All Cards", count: 12 },
  { id: "starter", label: "Starter", count: 3 },
  { id: "rare", label: "Rare", count: 3 },
  { id: "epic", label: "Epic", count: 3 },
  { id: "legendary", label: "Legendary", count: 3 }
];

const Cards = () => {
  const { cards, stars, setCards } = useGame();
  const [activeCategory, setActiveCategory] = useState("all");

  // Get all cards flattened
  const getAllCards = () => {
    return Object.values(CARD_DATA).flat();
  };

  // Filter cards by category
  const getFilteredCards = () => {
    if (activeCategory === "all") {
      return getAllCards();
    }
    return CARD_DATA[activeCategory] || [];
  };

  // Get card level from game context
  const getCardLevel = (cardId) => {
    return cards[cardId]?.level || 1;
  };

  // Handle upgrade
  const handleUpgrade = (cardId, cost) => {
    if (stars >= cost) {
      const currentLevel = getCardLevel(cardId);
      if (currentLevel < 10) {
        setCards(prev => ({
          ...prev,
          [cardId]: { level: currentLevel + 1 }
        }));
      }
    }
  };

  const filteredCards = getFilteredCards();

  return (
    <div className="cards-container">
      {/* Background Effects */}
      <div className="cards-background">
        <div className="cards-grid-pattern" />
        <div className="cards-glow cards-glow-1" />
        <div className="cards-glow cards-glow-2" />
      </div>

      {/* Shared Transparent Header */}
      <SharedHeader />

      {/* Page Header */}
      <div className="cards-header">
        <h1 className="cards-title">Card Collection</h1>
        <p className="cards-subtitle">Build your ultimate anime card deck. Upgrade cards to earn passive stars!</p>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${cat.id} ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {filteredCards.map(card => {
          const level = getCardLevel(card.id);
          const isMaxLevel = level >= 10;
          const canUpgrade = stars >= card.upgradeCost && !isMaxLevel;

          return (
            <div key={card.id} className={`card-item ${card.rarity}`}>
              {/* Card Image Section */}
              <div className="card-image-section">
                <div className="card-image-bg" />
                <img
                  src={card.image}
                  alt={card.name}
                  className="card-image"
                />
                <div className="card-rarity-badge">{card.rarity}</div>
                <div className="card-level-badge">{level}</div>
              </div>

              {/* Card Content */}
              <div className="card-content">
                <h3 className="card-name">{card.name}</h3>
                <p className="card-description">{card.description}</p>

                {/* Stats */}
                <div className="card-stats">
                  <div className="card-stat">
                    <div className="card-stat-label">Stars/hr</div>
                    <div className="card-stat-value stars">
                      {card.passiveStars}
                    </div>
                  </div>
                  <div className="card-stat">
                    <div className="card-stat-label">Cost</div>
                    <div className="card-stat-value coins">
                      {card.upgradeCost}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`card-action ${isMaxLevel ? 'max-level' : 'upgrade'}`}
                  onClick={() => handleUpgrade(card.id, card.upgradeCost)}
                  disabled={!canUpgrade && !isMaxLevel}
                  style={{ opacity: (!canUpgrade && !isMaxLevel) ? 0.6 : 1 }}
                >
                  {isMaxLevel ? 'MAX LEVEL' : `UPGRADE - ${card.upgradeCost} ⭐`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
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
