import { GAME_CONFIG } from "../constants/gameConfig";

export const calculateTapRefill = (tapLimit, lastRefillTime) => {
  const now = Date.now();
  const safeLastRefillTime =
    typeof lastRefillTime === "number" && lastRefillTime > 0
      ? lastRefillTime
      : now - GAME_CONFIG.TAP_REFILL_INTERVAL_MS * GAME_CONFIG.INITIAL_TAP_LIMIT;

  const elapsed = Math.max(0, now - safeLastRefillTime);
  const refillCount = Math.floor(elapsed / GAME_CONFIG.TAP_REFILL_INTERVAL_MS);

  if (refillCount <= 0) {
    return { tapLimit, lastRefillTime: safeLastRefillTime };
  }

  const actualRefill = Math.min(
    GAME_CONFIG.INITIAL_TAP_LIMIT - tapLimit,
    refillCount
  );

  const newTapLimit = Math.min(
    GAME_CONFIG.INITIAL_TAP_LIMIT,
    tapLimit + actualRefill
  );

  const updatedRefillTime =
    safeLastRefillTime +
    actualRefill * GAME_CONFIG.TAP_REFILL_INTERVAL_MS;

  return {
    tapLimit: newTapLimit,
    lastRefillTime: updatedRefillTime,
  };
};
