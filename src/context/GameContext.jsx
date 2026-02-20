import { createContext, useState, useEffect, useRef } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import { STAR_RATES } from "../constants/starRates";
import { preciseAdd } from "../utils/math";
import { calculateTapRefill } from "../utils/cooldown";

export const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  // Core economy
  const [coins, setCoins] = useState(0);
  const [stars, setStars] = useState(0);

  // Tap system
  const [tapLimit, setTapLimit] = useState(
    GAME_CONFIG.INITIAL_TAP_LIMIT
  );

  const lastRefillTimeRef = useRef(null);

  // Cards
  const [cards, setCards] = useState({
    starter: { level: 1 }
  });

  // NFTs - permanently owned
  const [nfts, setNfts] = useState({});

  // Initialize refill timestamp AFTER mount (pure safe)
  useEffect(() => {
    lastRefillTimeRef.current = Date.now();
  }, []);

  // 🔥 TAP REFILL ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastRefillTimeRef.current) return;

      const result = calculateTapRefill(
        tapLimit,
        lastRefillTimeRef.current
      );

      if (result.tapLimit !== tapLimit) {
        setTapLimit(result.tapLimit);
        lastRefillTimeRef.current = result.lastRefillTime;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tapLimit]);

  // ⭐ STAR ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
      let totalPerHour = 0;

      Object.values(cards).forEach(card => {
        if (card.level >= 4) {
          totalPerHour += STAR_RATES[card.level];
        }
      });

      if (totalPerHour > 0) {
        const perSecond = totalPerHour / 3600;
        setStars(prev => preciseAdd(prev, perSecond));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cards]);

  const tap = () => {
    if (tapLimit <= 0) return;

    setCoins(prev => prev + 1);
    setTapLimit(prev => prev - 1);
  };

  return (
    <GameContext.Provider
      value={{
        coins,
        stars,
        tapLimit,
        cards,
        tap,
        setCards
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
