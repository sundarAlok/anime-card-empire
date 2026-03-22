import { createContext, useState, useEffect, useRef } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import { STAR_RATES } from "../constants/starRates";
import { preciseAdd } from "../utils/math";
import { calculateTapRefill } from "../utils/cooldown";

export const GameContext = createContext(null);

/* -----------------------------
   COINS PER TAP LEVEL SYSTEM
--------------------------------*/

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
  { level: 16, coins: 500 },
];

/* -----------------------------
   LEVEL THRESHOLDS
--------------------------------*/

const LEVEL_THRESHOLDS = [
  { level: 1, coins: 100 },
  { level: 2, coins: 500 },
  { level: 3, coins: 1000 },
  { level: 4, coins: 2500 },
  { level: 5, coins: 5000 },
  { level: 6, coins: 10000 },
  { level: 7, coins: 25000 },
  { level: 8, coins: 50000 },
  { level: 9, coins: 75000 },
  { level: 10, coins: 100000 },
  { level: 11, coins: 300000 },
  { level: 12, coins: 500000 },
  { level: 13, coins: 1000000 },
  { level: 14, coins: 5000000 },
  { level: 15, coins: 10000000 },
  { level: 16, coins: 100000000 },
];

export const GameProvider = ({ children }) => {

  /* -----------------------------
     ECONOMY
  --------------------------------*/

  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("coins");
    return saved ? parseInt(saved, 10) : 0;
  });

  // const [stars, setStars] = useState(() => {
  //   const saved = localStorage.getItem("stars");
  //   return saved ? parseFloat(saved) : 0;
  // });

  const [stars, setStars] = useState(99999);

  const [highestCoins, setHighestCoins] = useState(() => {
    const saved = localStorage.getItem("highestCoins");
    return saved ? parseInt(saved, 10) : 0;
  });

  /* -----------------------------
     TAP LIMIT SYSTEM
  --------------------------------*/

  const [tapLimit, setTapLimit] = useState(
    GAME_CONFIG.INITIAL_TAP_LIMIT
  );

  const lastRefillTimeRef = useRef(null);

  /* -----------------------------
     CARDS + NFTS
  --------------------------------*/

  const [cards, setCards] = useState({
    starter: { level: 1 }
  });

  const [nfts, setNfts] = useState({});

  /* -----------------------------
     LEVEL CALCULATION
  --------------------------------*/

  const calculateLevel = () => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (highestCoins >= LEVEL_THRESHOLDS[i].coins) {
        return LEVEL_THRESHOLDS[i].level;
      }
    }
    return 1;
  };

  const level = calculateLevel();

  const coinsPerTap =
    TAP_LEVEL_DATA.find(item => item.level === level)?.coins || 1;

  /* -----------------------------
     INITIAL REFILL TIME
  --------------------------------*/

  useEffect(() => {
    lastRefillTimeRef.current = Date.now();
  }, []);

  /* -----------------------------
     SAVE DATA
  --------------------------------*/

  useEffect(() => {
    localStorage.setItem("coins", coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("stars", stars.toString());
  }, [stars]);

  useEffect(() => {
    localStorage.setItem("highestCoins", highestCoins.toString());
  }, [highestCoins]);

  /* -----------------------------
     TAP REFILL ENGINE
  --------------------------------*/

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

  /* -----------------------------
     STAR ENGINE
  --------------------------------*/

  useEffect(() => {
    const interval = setInterval(() => {
      let totalPerHour = 0;

      Object.values(cards).forEach(card => {

        const level = Number(card.level) || 0;
        const rate = STAR_RATES[level] ?? 0;

        if (level >= 4) {
          totalPerHour += rate;
        }

      });

      if (totalPerHour > 0) {

        const perSecond = totalPerHour / 3600;

        setStars(prev =>
          preciseAdd(Number(prev) || 0, perSecond)
        );

      }

    }, 1000);

    return () => clearInterval(interval);

  }, [cards]);

  /* -----------------------------
     TAP FUNCTION
  --------------------------------*/

  const tap = () => {

    if (tapLimit <= 0) return;

    setCoins(prev => {

      const newAmount = prev + coinsPerTap;

      setHighestCoins(highest =>
        Math.max(highest, newAmount)
      );

      return newAmount;

    });

    setTapLimit(prev => prev - 1);
  };

  /* -----------------------------
     PROVIDER
  --------------------------------*/

  return (
    <GameContext.Provider
      value={{
        coins,
        setCoins,
        stars,
        setStars,
        highestCoins,
        tapLimit,
        cards,
        nfts,
        tap,
        coinsPerTap,
        level,
        setCards,
        setNfts,
        setHighestCoins
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
