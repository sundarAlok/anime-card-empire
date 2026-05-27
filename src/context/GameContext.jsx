import { createContext, useState, useEffect, useRef } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import { STAR_RATES } from "../constants/starRates";
import { CARD_REWARDS_MAP } from "../constants/cardRewards";
import { preciseAdd } from "../utils/math";
import { calculateTapRefill } from "../utils/cooldown";
import { useAuth } from "./useAuth";

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

const getSafeLastRefillTime = (savedTime, currentTapLimit) => {
  if (typeof savedTime === "number" && savedTime > 0) {
    return savedTime;
  }

  if (currentTapLimit < GAME_CONFIG.INITIAL_TAP_LIMIT) {
    return (
      Date.now() -
      GAME_CONFIG.TAP_REFILL_INTERVAL_MS *
        (GAME_CONFIG.INITIAL_TAP_LIMIT - currentTapLimit)
    );
  }

  return Date.now();
};

const getCardCoinRatePerHour = (cards) => {
  let total = 0;
  try {
    Object.entries(cards || {}).forEach(([cardId, cardData]) => {
      const level = Number(cardData?.level) || 0;
      const cardRewards = CARD_REWARDS_MAP[cardId];
      if (cardRewards && level >= 1 && level <= 3) {
        total += Number(cardRewards.coin[level - 1] ?? 0);
      }
    });
  } catch (e) {
    console.error("Error calculating card coin rate:", e);
  }
  return total;
};

const getCardStarRatePerHour = (cards) => {
  let total = 0;
  try {
    Object.values(cards || {}).forEach((cardData) => {
      const level = Number(cardData?.level) || 0;
      if (level >= 4) {
        total += Number(STAR_RATES[level] ?? 0);
      }
    });
  } catch (e) {
    console.error("Error calculating card star rate:", e);
  }
  return total;
};

const calculateOfflineResourceGain = (cards, elapsedMs) => {
  const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  if (elapsedSeconds <= 0) return { coins: 0, stars: 0 };

  const coinsPerHour = getCardCoinRatePerHour(cards);
  const starsPerHour = getCardStarRatePerHour(cards);

  return {
    coins: preciseAdd(0, (coinsPerHour * elapsedSeconds) / 3600),
    stars: preciseAdd(0, (starsPerHour * elapsedSeconds) / 3600),
  };
};

const getSafeLastResourceUpdateTime = (savedTime) => {
  if (typeof savedTime === "number" && savedTime > 0) {
    return savedTime;
  }
  return Date.now();
};

export const GameProvider = ({ children }) => {
  const { isLoggedIn, userData, saveGameData } = useAuth();

  /* -----------------------------
     ECONOMY
  --------------------------------*/

  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("coins");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [stars, setStars] = useState(0);

  const [highestCoins, setHighestCoins] = useState(() => {
    const saved = localStorage.getItem("highestCoins");
    return saved ? parseInt(saved, 10) : 0;
  });

  /* -----------------------------
     STREAK SYSTEM
  --------------------------------*/

  const [streakDays, setStreakDays] = useState(() => {
    const saved = localStorage.getItem("streakDays");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lastClaimDate, setLastClaimDate] = useState(() => {
    return localStorage.getItem("lastClaimDate") || null;
  });

  const MILestones = [7, 30, 90, 180, 365];

  const getDailyStreakReward = () => {
    const baseReward = 100;

    // Tiered daily growth rates (compounded per day):
    // days 0-29: 7% daily
    // days 30-59: 3% daily
    // days 60-99: 1% daily
    // days 100-149: 0.5% daily
    // days 150-364: 0.3% daily
    // day >=365: 0.1% daily
    const getRateForDay = (dayIndex) => {
      if (dayIndex < 30) return 0.07;
      if (dayIndex < 60) return 0.03;
      if (dayIndex < 100) return 0.01;
      if (dayIndex < 150) return 0.005; // 0.5%
      if (dayIndex < 365) return 0.003; // 0.3%
      return 0.001; // 0.1%
    };

    // Compound the per-day rates up to current streakDays
    let multiplier = 1;
    for (let d = 0; d < Math.max(0, streakDays); d++) {
      const rate = getRateForDay(d);
      multiplier *= (1 + rate);
    }

    return Math.floor(baseReward * multiplier);
  };

  const isNewDay = () => {
    const today = new Date().toDateString();
    return lastClaimDate !== today;
  };

  const claimStreak = () => {
    if (!isNewDay()) return 0;

    const dailyReward = getDailyStreakReward();
    let extraReward = 0;

    // Check milestone
    if (MILestones.includes(streakDays + 1)) {
      extraReward = dailyReward * 100;
    }

    const totalReward = dailyReward + extraReward;

    setCoins((prev) => prev + totalReward);
    setStreakDays((prev) => prev + 1);
    setLastClaimDate(new Date().toDateString());

    localStorage.setItem("streakDays", (streakDays + 1).toString());
    localStorage.setItem("lastClaimDate", new Date().toDateString());

    return totalReward;
  };

  /* -----------------------------
     TAP LIMIT SYSTEM
  --------------------------------*/

  const [tapLimit, setTapLimit] = useState(() => {
    const saved = localStorage.getItem("tapLimit");
    return saved ? Number(saved) : GAME_CONFIG.INITIAL_TAP_LIMIT;
  });

  const [lastRefillTimeLoaded, setLastRefillTimeLoaded] = useState(false);
  const lastRefillTimeRef = useRef(null);
  const lastResourceUpdateTimeRef = useRef(null);
  const offlineGainSourceRef = useRef(null);

  /* -----------------------------
     CARDS + NFTS
  --------------------------------*/

  // Cards “ownership” is defined by upgrade level.
  // Persist to localStorage so state shape stays stable and the UI never blanks.
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem("cards");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error parsing cards from localStorage:", e);
      return {};
    }
  });

  const cardsRef = useRef(cards);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  const [nfts, setNfts] = useState(() => {
    try {
      const saved = localStorage.getItem("nfts");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error parsing nfts from localStorage:", e);
      return {};
    }
  });

  // When a user logs in, load their saved game data into the GameContext state
  useEffect(() => {
    if (!isLoggedIn || !userData) return;

    try {
      // Merge server values with local state. Never decrease local coins/stars
      const serverCoins = Number(userData.coins) || 0;
      const serverStars = Number(userData.stars) || 0;
      const serverHighest = Number(userData.highestCoins) || 0;
      const userTapLimit = userData.tapLimit ?? GAME_CONFIG.INITIAL_TAP_LIMIT;

      setCoins((prev) => {
        // keep the higher value to avoid visual rollback
        return Math.max(Number(prev) || 0, serverCoins);
      });

      setStars((prev) => Math.max(Number(prev) || 0, serverStars));

      setHighestCoins((prev) => Math.max(Number(prev) || 0, serverHighest, serverCoins));

      setTapLimit(userTapLimit);

      // Restore last refill time from server data or localStorage
      const savedLastRefillLocal = localStorage.getItem("lastRefillTime");
      lastRefillTimeRef.current = getSafeLastRefillTime(
        userData.lastRefillTime ?? (savedLastRefillLocal ? Number(savedLastRefillLocal) : undefined),
        userTapLimit
      );

      // Apply refill immediately after loading saved values
      try {
        const result = calculateTapRefill(userTapLimit, lastRefillTimeRef.current);
        if (result.tapLimit !== userTapLimit) {
          setTapLimit(result.tapLimit);
        }
        lastRefillTimeRef.current = result.lastRefillTime;
        localStorage.setItem("lastRefillTime", String(lastRefillTimeRef.current));
      } catch (e) {
        console.error("Error applying tap refill on login:", e);
      }

      const savedResourceLocal = localStorage.getItem("lastResourceUpdateTime");
      lastResourceUpdateTimeRef.current = getSafeLastResourceUpdateTime(
        userData.lastResourceUpdateTime ?? (savedResourceLocal ? Number(savedResourceLocal) : undefined)
      );

      setStreakDays(userData.streakDays ?? 0);
      setLastClaimDate(userData.lastClaimDate ?? null);
      setCards(userData.cards || {});
      setNfts(userData.nfts || {});
    } catch (e) {
      console.error("Error applying userData to GameContext:", e);
    }
  }, [isLoggedIn, userData]);

  useEffect(() => {
    if (isLoggedIn && !userData) return;

    const source = isLoggedIn ? "server" : "local";
    if (offlineGainSourceRef.current === source) return;

    const savedResourceLocal = localStorage.getItem("lastResourceUpdateTime");
    const resourceCards = isLoggedIn ? (userData?.cards || {}) : cards;
    lastResourceUpdateTimeRef.current = getSafeLastResourceUpdateTime(
      isLoggedIn
        ? userData?.lastResourceUpdateTime ?? (savedResourceLocal ? Number(savedResourceLocal) : undefined)
        : savedResourceLocal ? Number(savedResourceLocal) : undefined
    );

    try {
      const offlineResources = calculateOfflineResourceGain(
        resourceCards,
        Date.now() - lastResourceUpdateTimeRef.current
      );

      if (offlineResources.coins > 0) {
        setCoins((prev) => {
          const newValue = preciseAdd(prev, offlineResources.coins);
          setHighestCoins((highest) => Math.max(highest, newValue));
          return newValue;
        });
      }
      if (offlineResources.stars > 0) {
        setStars((prev) => preciseAdd(prev, offlineResources.stars));
      }
    } catch (e) {
      console.error("Error applying offline resources:", e);
    }

    lastResourceUpdateTimeRef.current = Date.now();
    try {
      localStorage.setItem("lastResourceUpdateTime", String(lastResourceUpdateTimeRef.current));
    } catch (e) {
      console.error("Error saving lastResourceUpdateTime to localStorage:", e);
    }
    offlineGainSourceRef.current = source;
  }, [isLoggedIn, userData, cards]);

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
    TAP_LEVEL_DATA.find((item) => item.level === level)?.coins || 1;

  /* -----------------------------
     INITIAL REFILL TIME
  --------------------------------*/

  useEffect(() => {
    // Try to restore last refill time from localStorage so taps refill while app was closed
    const savedRefill = localStorage.getItem("lastRefillTime");
    lastRefillTimeRef.current = getSafeLastRefillTime(
      savedRefill ? Number(savedRefill) : undefined,
      tapLimit
    );

    // Apply any pending refills immediately on startup
    try {
      const result = calculateTapRefill(tapLimit, lastRefillTimeRef.current);
      if (result.tapLimit !== tapLimit) {
        setTapLimit(result.tapLimit);
      }
      lastRefillTimeRef.current = result.lastRefillTime;
      localStorage.setItem("lastRefillTime", String(lastRefillTimeRef.current));
    } catch (e) {
      console.error("Error applying initial tap refill:", e);
    }

    const savedResource = localStorage.getItem("lastResourceUpdateTime");
    lastResourceUpdateTimeRef.current = getSafeLastResourceUpdateTime(
      savedResource ? Number(savedResource) : undefined
    );

    setLastRefillTimeLoaded(true);
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

  useEffect(() => {
    localStorage.setItem("streakDays", streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("nfts", JSON.stringify(nfts));
  }, [nfts]);

  const saveCurrentGameData = () => {
    if (!isLoggedIn || typeof saveGameData !== "function") return;

    const dataToSave = {
      coins,
      stars,
      highestCoins,
      tapLimit,
      level,
      streakDays,
      lastClaimDate,
      cards,
      nfts,
      lastRefillTime: lastRefillTimeRef.current,
      lastResourceUpdateTime: lastResourceUpdateTimeRef.current,
    };

    // queue immediate local save and mark for flush
    try {
      localStorage.setItem("coins", String(dataToSave.coins));
      localStorage.setItem("stars", String(dataToSave.stars));
      localStorage.setItem("tapLimit", String(dataToSave.tapLimit));
      localStorage.setItem("lastRefillTime", String(dataToSave.lastRefillTime));
      localStorage.setItem("cards", JSON.stringify(dataToSave.cards || {}));
      localStorage.setItem("nfts", JSON.stringify(dataToSave.nfts || {}));
      localStorage.setItem("lastResourceUpdateTime", String(dataToSave.lastResourceUpdateTime ?? Date.now()));
    } catch (e) {
      console.error("Error writing local save:", e);
    }

    pendingSaveRef.current = { ...(pendingSaveRef.current || {}), ...dataToSave };
    pendingSaveDirtyRef.current = true;
  };

  // Periodic persistence: ensure app updates local state first, then push to server
  useEffect(() => {
    const intervalMs = 2 * 60 * 1000; // 2 minutes

    const id = setInterval(() => {
      try {
        // Persist locally and queue for flush
        saveCurrentGameData();

        // Immediately push to server with local timestamp so server snapshots won't overwrite
        if (isLoggedIn && typeof saveGameData === "function") {
          const dataToSave = {
            coins,
            stars,
            highestCoins,
            tapLimit,
            level,
            streakDays,
            lastClaimDate,
            cards,
            nfts,
            lastRefillTime: lastRefillTimeRef.current,
            lastResourceUpdateTime: lastResourceUpdateTimeRef.current,
            _localUpdateTimeMs: Date.now(),
          };

          // fire-and-forget but log errors
          saveGameData(dataToSave).catch((err) => {
            console.error("Error during periodic saveGameData:", err);
          });
        }
      } catch (e) {
        console.error("Periodic persistence failed:", e);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [
    isLoggedIn,
    saveGameData,
    coins,
    stars,
    highestCoins,
    tapLimit,
    level,
    streakDays,
    lastClaimDate,
    cards,
    nfts,
  ]);

  // pending save queue (write-local then flush to Firestore on interval)
  const pendingSaveRef = useRef(null);
  const pendingSaveDirtyRef = useRef(false);

  const queueSave = (overrides = {}) => {
    const dataToSave = {
      coins,
      stars,
      highestCoins,
      tapLimit,
      level,
      streakDays,
      lastClaimDate,
      cards,
      nfts,
      lastRefillTime: lastRefillTimeRef.current,
      lastResourceUpdateTime: lastResourceUpdateTimeRef.current,
      ...overrides,
    };

    // write to localStorage immediately
    try {
      localStorage.setItem("coins", String(dataToSave.coins));
      localStorage.setItem("stars", String(dataToSave.stars));
      localStorage.setItem("tapLimit", String(dataToSave.tapLimit));
      localStorage.setItem("lastRefillTime", String(dataToSave.lastRefillTime));
      localStorage.setItem("cards", JSON.stringify(dataToSave.cards || {}));
      localStorage.setItem("nfts", JSON.stringify(dataToSave.nfts || {}));
      localStorage.setItem("lastResourceUpdateTime", String(dataToSave.lastResourceUpdateTime ?? Date.now()));
    } catch (e) {
      console.error("Error writing local save:", e);
    }

    // merge into pending save and mark dirty
    pendingSaveRef.current = { ...(pendingSaveRef.current || {}), ...dataToSave };
    pendingSaveDirtyRef.current = true;
  };

  /* -----------------------------
     TAP REFILL ENGINE
  --------------------------------*/

  // Persist game data to Firestore for logged-in users
  useEffect(() => {
    if (!isLoggedIn || typeof saveGameData !== "function") return;

    // Debounce saves to avoid excessive Firestore writes.
    const timeout = setTimeout(() => {
      const dataToSave = {
        coins,
        stars,
        highestCoins,
        tapLimit,
        level,
        streakDays,
        lastClaimDate,
        cards,
        nfts,
        // persist last refill time so server can compute refills while app was closed
        lastRefillTime: lastRefillTimeRef.current,
      };

      // Attach a local timestamp so server-side transaction can avoid overwriting newer data
      dataToSave._localUpdateTimeMs = Date.now();
      saveGameData(dataToSave);
    }, 5000); // wait 5s after the last change

    return () => clearTimeout(timeout);
  }, [
    isLoggedIn,
    coins,
    stars,
    highestCoins,
    tapLimit,
    level,
    streakDays,
    lastClaimDate,
    cards,
    nfts,
    saveGameData,
  ]);

  useEffect(() => {
    if (!isLoggedIn || typeof saveGameData !== "function") return;
    // Save card/nft changes locally and mark for flush; flush interval will write to Firestore.
    saveCurrentGameData();
  }, [isLoggedIn, cards, nfts, saveGameData]);

  // Flush pending saves to Firestore every 3 seconds (configurable)
  useEffect(() => {
    if (!isLoggedIn || typeof saveGameData !== "function") return;

    const flushIntervalMs = 3000; // 3 seconds
    const id = setInterval(() => {
      if (pendingSaveDirtyRef.current && pendingSaveRef.current) {
        const data = { ...(pendingSaveRef.current || {}) };
        data._localUpdateTimeMs = Date.now();
        // clear pending before calling save to avoid races
        pendingSaveDirtyRef.current = false;
        pendingSaveRef.current = null;
        saveGameData(data).catch((err) => {
          console.error('Error flushing pending save:', err);
        });
      }
    }, flushIntervalMs);

    return () => clearInterval(id);
  }, [isLoggedIn, saveGameData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastRefillTimeRef.current) return;

      const result = calculateTapRefill(tapLimit, lastRefillTimeRef.current);

      if (result.tapLimit !== tapLimit) {
        setTapLimit(result.tapLimit);
        lastRefillTimeRef.current = result.lastRefillTime;
        try {
          localStorage.setItem("lastRefillTime", String(lastRefillTimeRef.current));
          localStorage.setItem("tapLimit", String(result.tapLimit));
        } catch (e) {
          console.error("Error saving refill state to localStorage:", e);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tapLimit]);

  // Persist tapLimit to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("tapLimit", String(tapLimit));
    } catch (e) {
      console.error("Error saving tapLimit to localStorage:", e);
    }
  }, [tapLimit]);

  /* -----------------------------
     STAR ENGINE
  --------------------------------*/

  useEffect(() => {
    const interval = setInterval(() => {
      let totalPerHour = 0;

      try {
        Object.values(cardsRef.current).forEach((card) => {
          const level = Number(card?.level) || 0;
          const rate = STAR_RATES[level] ?? 0;

          if (level >= 4) {
            totalPerHour += rate;
          }
        });

        if (totalPerHour > 0) {
          const perSecond = totalPerHour / 3600;
          setStars((prev) => preciseAdd(Number(prev) || 0, perSecond));
        }
      } catch (e) {
        console.error("Error in star engine:", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* -----------------------------
     COIN ENGINE
  --------------------------------*/

  useEffect(() => {
    const interval = setInterval(() => {
      let totalPerHour = 0;

      try {
        Object.entries(cardsRef.current).forEach(([cardId, cardData]) => {
          const level = Number(cardData?.level) || 0;
          const cardRewards = CARD_REWARDS_MAP[cardId];

          if (cardRewards && level >= 1 && level <= 3) {
            // Coin rewards are for levels 1-3
            const rewardIndex = level - 1;
            const coinRate = cardRewards.coin[rewardIndex] ?? 0;
            totalPerHour += coinRate;
          }
        });

        if (totalPerHour > 0) {
          const perSecond = totalPerHour / 3600;
          setCoins((prev) => preciseAdd(Number(prev) || 0, perSecond));
        }
      } catch (e) {
        console.error("Error in coin engine:", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* -----------------------------
     TAP FUNCTION
  --------------------------------*/

  const tap = () => {
    if (tapLimit <= 0) return;

    setCoins((prev) => {
      const newAmount = prev + coinsPerTap;

      setHighestCoins((highest) => Math.max(highest, newAmount));

      return newAmount;
    });
    // compute new tap value synchronously so we can save immediately
    setTapLimit((prev) => {
      const wasFull = prev === GAME_CONFIG.INITIAL_TAP_LIMIT;
      const newVal = prev - 1;
      if (wasFull) {
        const now = Date.now();
        lastRefillTimeRef.current = now;
        try {
          localStorage.setItem("lastRefillTime", String(now));
        } catch (e) {
          console.error("Error saving lastRefillTime after tap:", e);
        }
      }

      // queue the tap change (local saved immediately, Firestore flush will happen on interval)
      queueSave({ tapLimit: newVal, lastRefillTime: lastRefillTimeRef.current });

      return newVal;
    });
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
        setHighestCoins,
        streakDays,
        lastClaimDate,
        getDailyStreakReward,
        claimStreak,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

