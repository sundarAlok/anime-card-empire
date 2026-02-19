import { GAME_CONFIG } from "../constants/gameConfig";

export const calculateTapRefill = (tapLimit, lastRefillTime) => {
  const now = Date.now();
  const elapsed = now - lastRefillTime;

  const refillCount = Math.floor(
    elapsed / GAME_CONFIG.TAP_REFILL_INTERVAL_MS
  );

  if (refillCount <= 0) return { tapLimit, lastRefillTime };

  const newTapLimit = Math.min(
    GAME_CONFIG.INITIAL_TAP_LIMIT,
    tapLimit + refillCount
  );

  const updatedRefillTime =
    lastRefillTime +
    refillCount * GAME_CONFIG.TAP_REFILL_INTERVAL_MS;

  return {
    tapLimit: newTapLimit,
    lastRefillTime: updatedRefillTime
  };
};
