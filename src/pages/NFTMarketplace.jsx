import { useState } from "react";
import { Link } from "react-router-dom";
import { useGame } from "../context/useGame";
import "../styles/nft.css";

// NFT Data - Purchasable with stars, permanently owned
const NFT_DATA = [
  // Legendary NFTs
  {
    id: "nft_roger",
    name: "Gold Roger",
    description: "The legendary Pirate King who discovered the One Piece. Own a piece of history!",
    image: "https://via.placeholder.com/180x240/1e1b4b/f59e0b?text=Roger",
    rarity: "legendary",
    price: 10000,
    boost: 50,
    totalSupply: 100
  },
  {
    id: "nft_whitebeard",
    name: "Whitebeard",
    description: "The strongest man in the world. His quake powers can shake the seas!",
    image: "https://via.placeholder.com/180x240/1e1b4b/f59e0b?text=Whitebeard",
    rarity: "legendary",
    price: 8000,
    boost: 40,
    totalSupply: 150
  },
  {
    id: "nft_shanks",
    name: "Red-Haired Shanks",
    description: "One of the Four Emperors. His haki is unmatched in the world!",
    image: "https://via.placeholder.com/180x240/1e1b4b/f59e0b?text=Shanks",
    rarity: "legendary",
    price: 7500,
    boost: 38,
    totalSupply: 150
  },
  // Epic NFTs
  {
    id: "nft_ace",
    name: "Portgas D. Ace",
    description: "The Fire Fist Commander. His flames burn everything!",
    image: "https://via.placeholder.com/180x240/1e1b4b/8b5cf6?text=Ace",
    rarity: "epic",
    price: 3000,
    boost: 25,
    totalSupply: 300
  },
  {
    id: "nft_sabo",
    name: "Sabo",
    description: "Chief of Staff of the Revolutionary Army. His dragon claw is unstoppable!",
    image: "https://via.placeholder.com/180x240/1e1b4b/8b5cf6?text=Sabo",
    rarity: "epic",
    price: 2800,
    boost: 23,
    totalSupply: 300
  },
  {
    id: "nft_rayleigh",
    name: "Silvers Rayleigh",
    description: "The Dark King. Former first mate of the Pirate King!",
    image: "https://via.placeholder.com/180x240/1e1b4b/8b5cf6?text=Rayleigh",
    rarity: "epic",
    price: 2500,
    boost: 20,
    totalSupply: 350
  },
  // Rare NFTs
  {
    id: "nft_luffy_gear5",
    name: "Luffy Gear 5",
    description: "The dawn of a new era! Luffy's most powerful form yet!",
    image: "https://via.placeholder.com/180x240/1e1b4b/3b82f6?text=Gear5",
    rarity: "rare",
    price: 1000,
    boost: 12,
    totalSupply: 500
  },
  {
    id: "nft_zoro_king",
    name: "Zoro King of Hell",
    description: "Zoro's ultimate attack that conquers even death!",
    image: "https://via.placeholder.com/180x240/1e1b4b/3b82f6?text=Zoro",
    rarity: "rare",
    price: 900,
    boost: 10,
    totalSupply: 500
  },
  {
    id: "nft_sanji_chef",
    name: "Sanji Chef Mode",
    description: "When Sanji cooks, even the gods stop to watch!",
    image: "https://via.placeholder.com/180x240/1e1b4b/3b82f6?text=Sanji",
    rarity: "rare",
    price: 800,
    boost: 9,
    totalSupply: 500
  },
  // Common NFTs
  {
    id: "nft_straw_hat",
    name: "Straw Hat",
    description: "The iconic straw hat passed down from Roger to Luffy. A symbol of dreams!",
    image: "https://via.placeholder.com/180x240/1e1b4b/64748b?text=Hat",
    rarity: "common",
    price: 100,
    boost: 2,
    totalSupply: 1000
  },
  {
    id: "nft_merry",
    name: "Going Merry",
    description: "The beloved ship that carried the Straw Hats through countless adventures!",
    image: "https://via.placeholder.com/180x240/1e1b4b/64748b?text=Merry",
    rarity: "common",
    price: 150,
    boost: 3,
    totalSupply: 800
  },
  {
    id: "nft_tom",
    name: "Tom's Workshop",
    description: "The legendary shipwright's workshop. Where dreams take shape!",
    image: "https://via.placeholder.com/180x240/1e1b4b/64748b?text=Tom",
    rarity: "common",
    price: 200,
    boost: 4,
    totalSupply: 700
  }
];

const FILTERS = [
  { id: "all", label: "All NFTs" },
  { id: "legendary", label: "Legendary" },
  { id: "epic", label: "Epic" },
  { id: "rare", label: "Rare" },
  { id: "common", label: "Common" },
  { id: "owned", label: "Owned" }
];

const NFTMarketplace = () => {
  const { stars, setStars, nfts = {}, setNfts } = useGame();
  const [activeFilter, setActiveFilter] = useState("all");
  const [purchaseStatus, setPurchaseStatus] = useState({});

  // Check if user owns an NFT
  const isOwned = (nftId) => {
    return nfts[nftId] === true;
  };

  // Get owned count
  const getOwnedCount = () => {
    return Object.values(nfts).filter(Boolean).length;
  };

  // Filter NFTs
  const getFilteredNFTs = () => {
    if (activeFilter === "all") {
      return NFT_DATA;
    }
    if (activeFilter === "owned") {
      return NFT_DATA.filter(nft => isOwned(nft.id));
    }
    return NFT_DATA.filter(nft => nft.rarity === activeFilter);
  };

  // Handle NFT purchase
  const handlePurchase = (nft) => {
    if (stars < nft.price) {
      setPurchaseStatus({ [nft.id]: "error" });
      return;
    }

    if (isOwned(nft.id)) return;

    // Deduct stars and mark NFT as owned permanently
    setStars(prev => prev - nft.price);
    setNfts(prev => ({ ...prev, [nft.id]: true }));
    setPurchaseStatus({ [nft.id]: "success" });

    // Clear status after 2 seconds
    setTimeout(() => {
      setPurchaseStatus(prev => ({ ...prev, [nft.id]: null }));
    }, 2000);
  };

  const filteredNFTs = getFilteredNFTs();
  const ownedCount = getOwnedCount();

  return (
    <div className="nft-container">
      {/* Background Effects */}
      <div className="nft-background">
        <div className="nft-grid-pattern" />
        <div className="nft-glow-orb nft-glow-orb-1" />
        <div className="nft-glow-orb nft-glow-orb-2" />
      </div>

      {/* Top Bar */}
      <header className="top-bar-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="logo-container">
            <Link to="/" className="logo-icon" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ACE</Link>
            <div className="logo-text">
              <span className="logo-title">Anime Card Empire</span>
              <span className="logo-subtitle">Idle • Tap • Collect</span>
            </div>
          </div>

          <nav className="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/cards" className="nav-link">Cards</Link>
            <Link to="/nfts" className="nav-link active">NFTs</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </nav>

          <div className="stats-container">
            <div className="stat-badge coins">
              <span className="stat-icon">🪙</span>
            </div>
            <div className="stat-badge stars">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{(Number(stars ?? 0)).toFixed(3)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="nft-header">
        <h1 className="nft-title">NFT Marketplace</h1>
        <p className="nft-subtitle">
          Purchase exclusive <span className="nft-highlight">NFTs</span> with your earned stars. 
          Each NFT permanently boosts your passive income!
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
          const status = purchaseStatus[nft.id];

          return (
            <div key={nft.id} className={`nft-card ${owned ? 'owned' : ''}`}>
              {/* Image Section */}
              <div className="nft-image-section">
                <div className="nft-image-bg" />
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="nft-image"
                />
                
                {/* Badges */}
                <div className="nft-badges">
                  <span className="nft-badge rarity">{nft.rarity}</span>
                  <span className={`nft-badge status ${owned ? 'owned' : 'locked'}`}>
                    {owned ? 'Owned' : 'Available'}
                  </span>
                </div>
                
                {/* NFT ID */}
                <span className="nft-id">#{nft.id.split('_')[1] || '001'}</span>

                {/* Owned Overlay */}
                {owned && (
                  <div className="nft-owned-overlay">Owned</div>
                )}
              </div>

              {/* Content */}
              <div className="nft-content">
                <h3 className="nft-name">{nft.name}</h3>
                <p className="nft-description">{nft.description}</p>

                {/* Stats */}
                <div className="nft-stats">
                  <div className="nft-stat">
                    <div className="nft-stat-label">Price</div>
                    <div className="nft-stat-value stars">⭐ {nft.price.toLocaleString()}</div>
                  </div>
                  <div className="nft-stat">
                    <div className="nft-stat-label">Boost</div>
                    <div className="nft-stat-value boost">+{nft.boost}%</div>
                  </div>
                  <div className="nft-stat">
                    <div className="nft-stat-label">Supply</div>
                    <div className="nft-stat-value">{nft.totalSupply}</div>
                  </div>
                  <div className="nft-stat">
                    <div className="nft-stat-label">Owned</div>
                    <div className="nft-stat-value owned-count">
                      {owned ? '1' : '0'}
                    </div>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  className={`nft-purchase ${owned ? 'owned' : 'buy'}`}
                  onClick={() => handlePurchase(nft)}
                  disabled={owned || (!canAfford && !owned)}
                >
                  {owned ? 'You Own This NFT' : `Purchase for ⭐ ${nft.price.toLocaleString()}`}
                </button>

                {/* Purchase Info */}
                <p className={`nft-purchase-info ${status === 'error' ? 'error' : ''}`}>
                  {status === 'error' 
                    ? "Not enough stars!" 
                    : owned 
                      ? "This NFT is permanently yours!" 
                      : canAfford 
                        ? "Click to purchase permanently" 
                        : `Earn ${nft.price - Math.floor(stars)} more stars`
                  }
                </p>
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
              : "Check back later for new NFTs!"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default NFTMarketplace;
