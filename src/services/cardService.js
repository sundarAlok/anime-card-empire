import {
  getUserCards,
  saveUserCards,
  updateCardLevel,
} from "./firestoreService";

/**
 * Get all cards owned by a user
 * @param {string} uid - User ID
 * @returns {Promise<Object>} Cards object
 */
export const getAllUserCards = async (uid) => {
  try {
    return await getUserCards(uid);
  } catch (error) {
    console.error("Error fetching user cards:", error);
    throw error;
  }
};

/**
 * Upgrade a specific card
 * @param {string} uid - User ID
 * @param {string} cardId - Card ID
 * @param {number} newLevel - New level value
 * @returns {Promise<void>}
 */
export const upgradeCard = async (uid, cardId, newLevel) => {
  try {
    await updateCardLevel(uid, cardId, newLevel);
  } catch (error) {
    console.error(`Error upgrading card ${cardId}:`, error);
    throw error;
  }
};

/**
 * Save entire card collection for a user
 * @param {string} uid - User ID
 * @param {Object} cards - Cards object
 * @returns {Promise<void>}
 */
export const updateCardCollection = async (uid, cards) => {
  try {
    await saveUserCards(uid, cards);
  } catch (error) {
    console.error("Error updating card collection:", error);
    throw error;
  }
};

/**
 * Get card details by ID
 * @param {string} uid - User ID
 * @param {string} cardId - Card ID
 * @returns {Promise<Object|null>} Card data or null if not found
 */
export const getCardDetails = async (uid, cardId) => {
  try {
    const cards = await getUserCards(uid);
    return cards[cardId] || null;
  } catch (error) {
    console.error(`Error fetching card ${cardId}:`, error);
    throw error;
  }
};
