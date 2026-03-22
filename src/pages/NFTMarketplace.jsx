import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import SharedHeader from "../components/SharedHeader";
import "../styles/nft.css";
import "../styles/home.css";
import "../styles/SharedHeader.css";

import starImg from "../assets/common/stars.png";
// import zenitsuImg from "../assets/cards/zenitsu.jpg";
// import namiImg from "../assets/cards/nami.jpg";
// import tienImg from "../assets/cards/tien.jpg";
// import sakuraImg from "../assets/cards/sakura_haruno.png";
// import leviImg from "../assets/cards/levi_ackerman.png";
// import lImg from "../assets/cards/l.png";
// import zoroImg from "../assets/cards/roronoa_zoro.jpg";
// import tanjiroImg from "../assets/cards/tanjiro.jpg";
// import yujiImg from "../assets/cards/yuji_itadori.jpg";
// import sasukeImg from "../assets/cards/sasuke_uchiha.jpeg";
// import ichigoImg from "../assets/cards/ichigo.jpg";
// import sanjiImg from "../assets/cards/sanji.jpg";
// import gojoImg from "../assets/cards/satoru_gojo.jpg";
// import gokuImg from "../assets/cards/goku.jpg";
// import luffyImg from "../assets/cards/luffy.jpg";
// import saitamaImg from "../assets/cards/saitama.jpg";
// import rimuruImg from "../assets/cards/rimuru.jpg";
// import jinwooImg from "../assets/cards/jinwoo.jpg";
// import killuaImg from "../assets/cards/killua.jpg";
// import edwardImg from "../assets/cards/edward_elric.jpg";

// for testing purpose, remove it later
import zenitsuImg from "../assets/cards/luffy.jpg";
import namiImg from "../assets/cards/luffy.jpg";
import tienImg from "../assets/cards/luffy.jpg";
import sakuraImg from "../assets/cards/luffy.jpg";
import leviImg from "../assets/cards/luffy.jpg";
import lImg from "../assets/cards/luffy.jpg";
import zoroImg from "../assets/cards/luffy.jpg";
import tanjiroImg from "../assets/cards/luffy.jpg";
import yujiImg from "../assets/cards/luffy.jpg";
import sasukeImg from "../assets/cards/luffy.jpg";
import ichigoImg from "../assets/cards/luffy.jpg";
import sanjiImg from "../assets/cards/luffy.jpg";
import gojoImg from "../assets/cards/luffy.jpg";
import gokuImg from "../assets/cards/luffy.jpg";
import luffyImg from "../assets/cards/luffy.jpg";
import saitamaImg from "../assets/cards/luffy.jpg";
import rimuruImg from "../assets/cards/luffy.jpg";
import jinwooImg from "../assets/cards/luffy.jpg";
import killuaImg from "../assets/cards/luffy.jpg";
import edwardImg from "../assets/cards/luffy.jpg";

// NFT Data
const NFT_DATA = [
  // Common
  {
    id: "nft_zenitsu_common",
    name: "Zenitsu Agatsuma",
    anime: "Demon Slayer",
    info: "Zenitsu may appear cowardly, but when he awakens from his fear, his Thunderclap and Flash strikes with unmatched speed and precision.",
    image: zenitsuImg,
    rarity: "common",
    price: 163,
    totalSupply: 198,
    quotes: [
      "I’m not scared of dying… I’m scared of failing!",
      "Even the weak have the power to protect someone.",
      "Fear can be a weapon if used right.",
      "I will overcome my fear to stand strong!",
      "Courage is facing what terrifies you the most."
    ]
  },
  {
    id: "nft_nami_common",
    name: "Nami",
    anime: "One Piece",
    info: "Nami is a brilliant navigator and a cunning strategist, always finding a way to turn the tides in the heat of battle or on the seas.",
    image: namiImg,
    rarity: "common",
    price: 241,
    totalSupply: 212,
    quotes: [
      "I’m the navigator of this crew, and I never get lost!",
      "A clever plan is the deadliest weapon.",
      "Knowledge is the key to freedom.",
      "No storm can defeat a determined heart.",
      "I chart my own destiny."
    ]
  },
  {
    id: "nft_tien_common",
    name: "Tien Shinhan",
    anime: "Dragon Ball",
    info: "Tien’s discipline and martial arts mastery make him a formidable fighter, capable of precision strikes and incredible focus in the heat of battle.",
    image: tienImg,
    rarity: "common",
    price: 212,
    totalSupply: 243,
    quotes: [
      "I fight to surpass my limits, every single day!",
      "Discipline is the foundation of strength.",
      "Only through struggle does power grow.",
      "My resolve will never waver!",
      "Strength is meaningless without purpose."
    ]
  },
  {
    id: "nft_sakura_common",
    name: "Sakura Haruno",
    anime: "Naruto",
    info: "Sakura combines raw strength and medical ninja skills, turning her into a powerful force capable of healing allies and dominating enemies.",
    image: sakuraImg,
    rarity: "common",
    price: 178,
    totalSupply: 225,
    quotes: [
      "I will protect my friends, no matter what!",
      "True strength comes from the heart.",
      "Every challenge is a lesson.",
      "I fight not for myself, but for those I love.",
      "Healing others is just as powerful as defeating enemies."
    ]
  },
  {
    id: "nft_levi_common",
    name: "Levi Ackerman",
    anime: "Attack on Titan",
    info: "Levi, humanity’s strongest soldier, wields unmatched speed and precision against titans, always remaining calm and deadly in battle.",
    image: leviImg,
    rarity: "common",
    price: 189,
    totalSupply: 193,
    quotes: [
      "No matter what, keep moving forward!",
      "Precision and speed define a true warrior.",
      "Fear is a weakness to be conquered.",
      "Every battle teaches a lesson.",
      "Victory favors the prepared."
    ]
  },
  {
    id: "nft_l_common",
    name: "L",
    anime: "Death Note",
    info: "L is the world’s greatest detective, solving the most complex mysteries with astonishing logic and a mind that never rests.",
    image: lImg,
    rarity: "common",
    price: 203,
    totalSupply: 197,
    quotes: [
      "I take risks, because I want to solve the case.",
      "Observation is the first step to victory.",
      "The mind is sharper than any sword.",
      "Focus and logic overcome chaos.",
      "Every clue brings you closer to the truth."
    ]
  },

  // Enhanced
  {
    id: "nft_zoro_enhanced",
    name: "Roronoa Zoro",
    anime: "One Piece",
    info: "Zoro is a master swordsman whose ambition to become the world’s greatest is matched only by his unbreakable determination and spirit.",
    image: zoroImg,
    rarity: "enhanced",
    price: 353,
    totalSupply: 143,
    quotes: [
      "Promise me. Someday, one of us will be the world's greatest swordsman. We'll compete to get there.",
      "A crew with no respect and a captain that doesn't demand it is destined to fall apart quickly.",
      "Scars on the back are a swordsman's shame.",
      "Only I can call my dream stupid!",
      "Nothing happened. I’m still the best swordsman!"
    ]
  },
  {
    id: "nft_tanjiro_enhanced",
    name: "Tanjiro Kamado",
    anime: "Demon Slayer",
    info: "Tanjiro fights with compassion and strength, using his Water and Sun Breathing techniques to protect his friends and defeat demons.",
    image: tanjiroImg,
    rarity: "enhanced",
    price: 392,
    totalSupply: 115,
    quotes: [
      "I will not forgive the demons that hurt my family!",
      "Even the smallest light can shine through the darkest night.",
      "My determination will never waver!",
      "A promise is a promise, no matter the cost.",
      "I will protect everyone with my life."
    ]
  },
  {
    id: "nft_yuji_enhanced",
    name: "Yuji Itadori",
    anime: "Jujutsu Kaisen",
    info: "Yuji is a vessel of immense power, combining courage, compassion, and unstoppable energy to face curses far beyond ordinary human limits.",
    image: yujiImg,
    rarity: "enhanced",
    price: 381,
    totalSupply: 134,
    quotes: [
      "I’ll save people! That’s my promise!",
      "I won’t let anyone fall alone!",
      "Power is meaningless without purpose.",
      "Even if the odds are stacked against me, I’ll keep moving forward!",
      "Strength is measured by how you protect others."
    ]
  },
  {
    id: "nft_sasuke_enhanced",
    name: "Sasuke Uchiha",
    anime: "Naruto",
    info: "Sasuke, the avenger, pursues power relentlessly, mastering his Sharingan and Rinnegan to challenge fate itself and protect what he values.",
    image: sasukeImg,
    rarity: "enhanced",
    price: 328,
    totalSupply: 121,
    quotes: [
      "I have my own path to follow, no matter the cost.",
      "Revenge is a path to power.",
      "I walk alone to reach my goal.",
      "Strength is earned, not given.",
      "No one can control my destiny but me."
    ]
  },
  {
    id: "nft_ichigo_enhanced",
    name: "Ichigo Kurosaki",
    anime: "Bleach",
    info: "Ichigo wields the power of both humans and spirits, bridging worlds to protect those who cannot defend themselves, always with courage and conviction.",
    image: ichigoImg,
    rarity: "enhanced",
    price: 472,
    totalSupply: 145,
    quotes: [
      "I’m not the one who’s going to run away.",
      "Power is worthless if you don’t protect what matters.",
      "I fight to protect, not to destroy.",
      "Courage comes from heart, not power.",
      "Even the strongest have something to protect."
    ]
  },
  {
    id: "nft_edward_enhanced",
    name: "Edward Elric",
    anime: "Fullmetal Alchemist",
    info: "Edward’s mastery of alchemy and relentless determination allow him to achieve feats others could only dream of, driven by love and loyalty.",
    image: edwardImg,
    rarity: "enhanced",
    price: 399,
    totalSupply: 111,
    quotes: [
      "A lesson without pain is meaningless!",
      "Even failure teaches valuable lessons.",
      "Knowledge and perseverance create power.",
      "I fight for those I care about.",
      "No sacrifice is too great for what you love."
    ]
  },

  // Elite
  {
    id: "nft_rimuru_elite",
    name: "Rimuru Tempest",
    anime: "That Time I Got Reincarnated as a Slime",
    info: "Rimuru is a cunning and powerful slime lord, capable of absorbing skills and adapting to any situation, proving intelligence is the ultimate weapon.",
    image: rimuruImg,
    rarity: "elite",
    price: 580,
    totalSupply: 76,
    quotes: [
      "I’ll absorb and surpass everything in my path.",
      "Knowledge is power, and I take it all.",
      "Adaptation is the key to survival.",
      "No challenge is too great if you plan smart.",
      "Strength comes from understanding and evolution."
    ]
  },
  {
    id: "nft_killua_elite",
    name: "Killua Zoldyck",
    anime: "Hunter x Hunter",
    info: "Killua, a prodigy assassin, blends agility, strategy, and lightning-fast reflexes to overcome foes much stronger than himself.",
    image: killuaImg,
    rarity: "elite",
    price: 512,
    totalSupply: 69,
    quotes: [
      "I’m not afraid… I’m ready for anything!",
      "Speed and precision win battles.",
      "Every challenge makes me stronger.",
      "Courage is facing fear head-on.",
      "I fight to protect my friends and my honor."
    ]
  },
  {
    id: "nft_gojo_elite",
    name: "Satoru Gojo",
    anime: "Jujutsu Kaisen",
    info: "Gojo is the most powerful sorcerer alive, his limitless abilities and overwhelming confidence make him untouchable in battle.",
    image: gojoImg,
    rarity: "elite",
    price: 599,
    totalSupply: 72,
    quotes: [
      "You’re all weak… and I’m too strong to care.",
      "True strength has no limits.",
      "Confidence is power.",
      "I only fight for what’s worth it.",
      "Power must be used wisely."
    ]
  },
  {
    id: "nft_sanji_elite",
    name: "Sanji",
    anime: "One Piece",
    info: "Sanji is a master chef and fighter, delivering lethal kicks with unmatched speed while protecting those he loves with unwavering loyalty.",
    image: sanjiImg,
    rarity: "elite",
    price: 552,
    totalSupply: 78,
    quotes: [
      "I only kick for love… and victory!",
      "True strength is protecting those you care about.",
      "A gentleman fights with honor.",
      "Passion fuels my power.",
      "No one stands between me and my dreams."
    ]
  },

  // Eternal
  {
    id: "nft_jinwoo_eternal",
    name: "Sung Jin-Woo",
    anime: "Solo Leveling",
    info: "Jin-Woo rises as the Shadow Monarch, overcoming insurmountable odds with cunning, strength, and an army that bends to his will.",
    image: jinwooImg,
    rarity: "eternal",
    price: 873,
    totalSupply: 22,
    quotes: [
      "I’ll become stronger than anyone in this world!",
      "Power comes from determination and courage.",
      "A true king leads by strength and wisdom.",
      "I won’t be stopped by anyone!",
      "The weak inspire me to grow stronger."
    ]
  },
  {
    id: "nft_goku_eternal",
    name: "Son Goku",
    anime: "Dragon Ball",
    info: "Goku reaches legendary heights with Ultra Instinct, never stopping in the pursuit of strength and adventure, inspiring all who witness his power.",
    image: gokuImg,
    rarity: "eternal",
    price: 881,
    totalSupply: 18,
    quotes: [
      "I will never give up, no matter what!",
      "Strength is tested in the heat of battle.",
      "Push past your limits!",
      "A challenge is an opportunity to grow.",
      "I fight to protect my friends and dreams."
    ]
  },
  {
    id: "nft_luffy_eternal",
    name: "Monkey D. Luffy",
    anime: "One Piece",
    info: "Luffy, the future Pirate King, overcomes all challenges with his indomitable will and stretches his body and limits to achieve his dreams.",
    image: luffyImg,
    rarity: "eternal",
    price: 862,
    totalSupply: 12,
    quotes: [
      "I’ll be the King of the Pirates!",
      "Nothing is impossible with enough courage.",
      "Friends are the greatest treasure.",
      "I will never back down!",
      "As long as I live, there are infinite chances!"
    ]
  },
  {
    id: "nft_saitama_eternal",
    name: "Saitama",
    anime: "One Punch Man",
    info: "Saitama possesses limitless strength, defeating any opponent effortlessly while maintaining a desire to find a true challenge.",
    image: saitamaImg,
    rarity: "eternal",
    price: 892,
    totalSupply: 15,
    quotes: [
      "I’m just a hero for fun.",
      "True power is calm and controlled.",
      "Even the strongest need purpose.",
      "I fight to find a challenge worth my strength.",
      "Never underestimate the unexpected."
    ]
  }
];

// Filters
const FILTERS = [
  { id: "all", label: "All NFTs" },
  { id: "common", label: "Common" },
  { id: "enhanced", label: "Enhanced" },
  { id: "elite", label: "Elite" },
  { id: "eternal", label: "Eternal" },
  { id: "owned", label: "Owned" }
];

// rewards
const RARITY_REWARDS = {
  common: 500,
  enhanced: 1000,
  elite: 3000,
  eternal: 5000
};

const NFTMarketplace = () => {
  const { stars, setStars, coins, setCoins, nfts = {}, setNfts } = useContext(GameContext);
  const [activeFilter, setActiveFilter] = useState("all");
  const [purchaseStatus, setPurchaseStatus] = useState({});
  const [infoTooltip, setInfoTooltip] = useState(null);
  const [infoPosition, setInfoPosition] = useState({ top: 0, left: 0 });
  const [hoveringTooltip, setHoveringTooltip] = useState(false);
  const [rewardPopup, setRewardPopup] = useState(null);
  const hideTimeout = useRef(null);

  const isOwned = (nftId) => nfts[nftId] === true;
  const getOwnedCount = () => Object.values(nfts).filter(Boolean).length;

  const getFilteredNFTs = () => {
    if (activeFilter === "all") return NFT_DATA;
    if (activeFilter === "owned") return NFT_DATA.filter(nft => isOwned(nft.id));
    return NFT_DATA.filter(nft => nft.rarity === activeFilter);
  };

  const handlePurchase = (nft) => {

    if (stars < nft.price || isOwned(nft.id)) {
      setPurchaseStatus({ [nft.id]: "error" });
      return;
    }

    const reward = RARITY_REWARDS[nft.rarity] || 0;

    // deduct stars
    setStars(prev => prev - nft.price);

    // mark NFT owned
    setNfts(prev => ({
      ...prev,
      [nft.id]: true
    }));

    // give coins reward
    setCoins(prev => prev + reward);

    // show popup AFTER purchase
    setTimeout(() => {
      setRewardPopup({
        nft,
        reward
      });
    }, 50);

    setPurchaseStatus({ [nft.id]: "success" });

    setTimeout(() => {
      setPurchaseStatus(prev => ({
        ...prev,
        [nft.id]: null
      }));
    }, 2000);
};

  // -------------------
  // Tooltip Handlers
  // -------------------
  const handleInfoHover = (e, nft) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 380;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let leftPosition = rect.left + 40;
    let topPosition = rect.bottom + 10;

    if (rect.left + tooltipWidth > viewportWidth) {
      leftPosition = rect.right - tooltipWidth;
    }
    if (topPosition + tooltipHeight > viewportHeight) {
      topPosition = rect.top - tooltipHeight - 20;
    }
    leftPosition = Math.max(10, leftPosition);
    topPosition = Math.max(10, topPosition);

    setInfoPosition({ top: topPosition, left: leftPosition });
    setInfoTooltip(nft);

    // Cancel any pending hide timer
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  const handleInfoLeave = () => {
    hideTimeout.current = setTimeout(() => {
      if (!hoveringTooltip) setInfoTooltip(null);
    }, 150);
  };

  const handleTooltipEnter = () => {
    setHoveringTooltip(true);
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  const handleTooltipLeave = () => {
    setHoveringTooltip(false);
    hideTimeout.current = setTimeout(() => {
      setInfoTooltip(null);
    }, 150);
  };

  const filteredNFTs = getFilteredNFTs();
  const ownedCount = getOwnedCount();

  return (
    <div className="nft-container">
      <div className="nft-background">
        <div className="nft-grid-pattern" />
        <div className="nft-glow-orb nft-glow-orb-1" />
        <div className="nft-glow-orb nft-glow-orb-2" />
      </div>

      <SharedHeader />

      <div className="nft-header">
        <h1 className="nft-title">NFT Marketplace</h1>
        <p className="nft-subtitle">
          Purchase exclusive <span className="nft-highlight">NFTs</span> with your earned stars. 
          Collect and trade your favorite anime heroes in a premium showcase!
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="nft-filters">
        {FILTERS.map(filter => (
          <button
            key={filter.id}
            className={`nft-filter ${filter.id} ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
            {filter.id === "owned" && ownedCount > 0 && ` (${ownedCount})`}
          </button>
        ))}
      </div>

      {/* NFT Grid */}
      <div className="nft-grid">
        {filteredNFTs.map(nft => {
          const owned = isOwned(nft.id);
          const canAfford = stars >= nft.price;
          const statusLabel = owned ? "Owned" : canAfford ? "Available" : "Locked";
          const statusClass = owned ? "owned" : canAfford ? "available" : "unavailable";
          const starsNeeded = Math.max(0, nft.price - Math.floor(stars));

          return (
            <div key={nft.id} className={`nft-card ${nft.rarity} ${owned ? 'owned' : ''}`}>
              {/* Image Section */}
              <div className="nft-image-section">
                <div className="nft-image-bg" />
                <img src={nft.image} alt={nft.name} className="nft-image" />

                {/* Badges */}
                <div className="nft-badges">
                  <span className={`nft-badge rarity ${nft.rarity}`}>{nft.rarity}</span>
                  <span className={`nft-badge status ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Owned Overlay */}
                {owned && <div className="nft-owned-overlay">Owned</div>}
              </div>

              {/* Content */}
              <div className="nft-content">
                <div className="nft-header-row">
                  <h3 className="nft-name">{nft.name}</h3>
                  <button
                    className="nft-info-btn"
                    onMouseEnter={(e) => handleInfoHover(e, nft)}
                    onMouseLeave={handleInfoLeave}
                    aria-label="Show NFT info"
                  >
                    ℹ
                  </button>
                </div>

                {/* Stats */}
                <div className="nft-stats-row">
                  <span className="nft-supply">
                    Supply: <strong>{nft.totalSupply}</strong>
                  </span>

                  <span className="nft-owned">
                    Owned: <strong>{owned ? 1 : 0}</strong>
                  </span>
                </div>

                {/* Purchase Button */}
                <div className="purchase-wrapper">
                  <button
                    className={`nft-purchase ${owned ? 'owned' : 'buy'}`}
                    onClick={() => handlePurchase(nft)}
                    disabled={owned || !canAfford}
                  >
                    {owned ? "You Own This NFT" : (
                      <>
                        Purchase for
                        <img src={starImg} alt="stars" className="star-icon" />
                        {nft.price.toLocaleString()}
                      </>
                    )}
                  </button>

                  {!owned && !canAfford && (
                    <div className="hover-message">
                      You need {starsNeeded} more stars
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNFTs.length === 0 && (
        <div className="nft-empty">
          <div className="nft-empty-icon">🎆</div>
          <h3 className="nft-empty-title">No NFTs Found</h3>
          <p className="nft-empty-text">
            {activeFilter === "owned"
              ? "You don't own any NFTs yet. Purchase some to boost your earnings!"
              : "Check back later for new NFTs!"}
          </p>
        </div>
      )}

      {/* Info Tooltip */}
      {infoTooltip && createPortal(
        <div
          className="nft-info-tooltip"
          style={{ top: infoPosition.top, left: infoPosition.left }}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        >
          <div className="nft-tooltip-content">
            <div className="nft-tooltip-header">
              {infoTooltip.id === "nft_rimuru_elite" ? (
                <>
                  <h4 className="nft-tooltip-title">{infoTooltip.name}</h4>
                  <p className="nft-tooltip-anime">{infoTooltip.anime}</p>
                </>
              ) : (
                <>
                  <h4 className="nft-tooltip-title">{infoTooltip.name}</h4>
                  <span className="nft-tooltip-anime">{infoTooltip.anime}</span>
                </>
              )}
            </div>
            <p className="nft-tooltip-desc">{infoTooltip.info}</p>
            {infoTooltip.quotes?.length > 0 && <div className="nft-tooltip-divider" />}
            <div className="nft-tooltip-details">
              {infoTooltip.quotes?.map((quote, idx) => (
                <div className="nft-tooltip-detail" key={idx}>
                  <span className="nft-detail-bullet">❝</span>
                  <span className="nft-detail-text">{quote}</span>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}


      {rewardPopup && createPortal(
        <div className="reward-overlay">
          <div className="reward-card">

            <div className="reward-left">
              <img src={rewardPopup.nft.image} alt={rewardPopup.nft.name} />
            </div>

            <div className="reward-right">
              <h2 className="reward-title">🎉 Achievement Unlocked!</h2>

              <h3>{rewardPopup.nft.name}</h3>
              <p className="reward-anime">{rewardPopup.nft.anime}</p>

              <p className="reward-info">{rewardPopup.nft.info}</p>

              <div className="reward-coins">
                Reward Earned: <span>{rewardPopup.reward} Coins</span>
              </div>

              <button
                className="reward-close"
                onClick={() => setRewardPopup(null)}
              >
                Continue
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default NFTMarketplace;