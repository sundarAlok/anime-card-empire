import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

  import { getPlatformId, getScopedUid } from "../utils/platform";
// ============================================
// USER PROFILE OPERATIONS
// ============================================

/**
 * Load complete user data from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const loadUserDataFromFirestore = async (uid) => {
  try {
    const scopedUid = getScopedUid(uid);
    const userDoc = await getDoc(doc(db, "users", scopedUid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error loading user data:", error);
    throw error;
  }
};

/**
 * Initialize new user document in Firestore
 * @param {string} uid - User ID
 * @param {Object} profileDefaults - User profile data
 * @returns {Promise<void>}
 */
export const initializeUserDocument = async (uid, profileDefaults = {}) => {
  try {
    const initialData = {
      uid,
      email: profileDefaults.email || "",
      displayName: profileDefaults.displayName || "Player",
      photoURL: profileDefaults.photoURL || "",
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      // Game data
      coins: 0,
      stars: 0,
      highestCoins: 0,
      tapLimit: 100,
      level: 1,
      streakDays: 0,
      lastClaimDate: null,
      lastRefillTime: Date.now(),
      lastResourceUpdateTime: Date.now(),
      // Collections stored as subcollections or nested objects
      cards: {},
      nfts: {},
    };

    const scopedUid = getScopedUid(uid);
    console.log(`Initializing Firestore user document for scopedUid=${scopedUid}`);
    await setDoc(doc(db, "users", scopedUid), { ...initialData, platform: getPlatformId() });
    console.log(`Successfully created/initialized user document for scopedUid=${scopedUid}`);
    return initialData;
  } catch (error) {
    console.error("Error initializing user document for uid=", uid, error);
    // Re-throw so callers can handle the failure (AuthContext will catch/log)
    throw error;
  }
};

/**
 * Update user profile information
 * @param {string} uid - User ID
 * @param {Object} profileData - Profile fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, profileData) => {
  try {
    const scopedUid = getScopedUid(uid);
    await updateDoc(doc(db, "users", scopedUid), {
      ...profileData,
      lastUpdated: serverTimestamp(),
      platform: getPlatformId(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// ============================================
// GAME DATA OPERATIONS
// ============================================

/**
 * Save game state (coins, stars, level, etc.)
 * @param {string} uid - User ID
 * @param {Object} gameData - Game state to save
 * @returns {Promise<void>}
 */
export const saveGameState = async (uid, gameData, localUpdateTimeMs = null) => {
  try {
    const scopedUid = getScopedUid(uid);
    const userRef = doc(db, "users", scopedUid);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(userRef);

      if (!snap.exists()) {
        tx.set(userRef, {
          uid,
          scopedUid,
          coins: gameData.coins ?? 0,
          stars: gameData.stars ?? 0,
          highestCoins: gameData.highestCoins ?? 0,
          level: gameData.level ?? 1,
          tapLimit: gameData.tapLimit ?? 100,
          streakDays: gameData.streakDays ?? 0,
          lastClaimDate: gameData.lastClaimDate ?? null,
          lastRefillTime: gameData.lastRefillTime ?? Date.now(),
          lastResourceUpdateTime: gameData.lastResourceUpdateTime ?? Date.now(),
          cards: gameData.cards ?? {},
          nfts: gameData.nfts ?? {},
          lastUpdated: serverTimestamp(),
        });
        return;
      }

      const serverData = snap.data() || {};
      const serverLast = serverData.lastUpdated && serverData.lastUpdated.toMillis ? serverData.lastUpdated.toMillis() : null;

      if (localUpdateTimeMs && serverLast && serverLast > localUpdateTimeMs) {
        // Another client has newer data — skip this write to avoid overwriting newer state.
        return;
      }

      tx.update(userRef, {
        coins: gameData.coins ?? 0,
        stars: gameData.stars ?? 0,
        highestCoins: gameData.highestCoins ?? 0,
        level: gameData.level ?? 1,
        tapLimit: gameData.tapLimit ?? 100,
        streakDays: gameData.streakDays ?? 0,
        lastClaimDate: gameData.lastClaimDate ?? null,
        lastRefillTime: gameData.lastRefillTime ?? serverData.lastRefillTime ?? Date.now(),
        lastResourceUpdateTime: gameData.lastResourceUpdateTime ?? serverData.lastResourceUpdateTime ?? Date.now(),
        cards: gameData.cards ?? serverData.cards ?? {},
        nfts: gameData.nfts ?? serverData.nfts ?? {},
        lastUpdated: serverTimestamp(),
      });
    });
  } catch (error) {
    console.error("Error saving game state:", error);
    throw error;
  }
};

/**
 * Load game state for a user
 * @param {string} uid - User ID
 * @returns {Promise<Object>} Game state data
 */
export const loadGameState = async (uid) => {
  try {
    const scopedUid = getScopedUid(uid);
    const userDoc = await getDoc(doc(db, "users", scopedUid));
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    return {
      coins: data.coins || 0,
      stars: data.stars || 0,
      highestCoins: data.highestCoins || 0,
      level: data.level || 1,
      tapLimit: data.tapLimit || 100,
      streakDays: data.streakDays || 0,
      lastClaimDate: data.lastClaimDate || null,
      lastRefillTime: data.lastRefillTime || null,
      lastResourceUpdateTime: data.lastResourceUpdateTime || null,
      cards: data.cards || {},
      nfts: data.nfts || {},
    };
  } catch (error) {
    console.error("Error loading game state:", error);
    throw error;
  }
};

/**
 * Update individual game counter
 * @param {string} uid - User ID
 * @param {string} field - Field name (coins, stars, etc.)
 * @param {number} value - New value
 * @returns {Promise<void>}
 */
export const updateGameCounter = async (uid, field, value) => {
  try {
    const scopedUid = getScopedUid(uid);
    await updateDoc(doc(db, "users", scopedUid), {
      [field]: value,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating ${field}:`, error);
    throw error;
  }
};

// ============================================
// CARD OPERATIONS
// ============================================

/**
 * Get all cards owned by user
 * @param {string} uid - User ID
 * @returns {Promise<Object>} Cards object with card IDs as keys
 */
export const getUserCards = async (uid) => {
  try {
    const scopedUid = getScopedUid(uid);
    const userDoc = await getDoc(doc(db, "users", scopedUid));
    return userDoc.exists() ? (userDoc.data().cards || {}) : {};
  } catch (error) {
    console.error("Error loading user cards:", error);
    throw error;
  }
};

/**
 * Update user's card collection
 * @param {string} uid - User ID
 * @param {Object} cards - Cards object
 * @returns {Promise<void>}
 */
export const saveUserCards = async (uid, cards) => {
  try {
    const scopedUid = getScopedUid(uid);
    await updateDoc(doc(db, "users", scopedUid), {
      cards: cards || {},
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving user cards:", error);
    throw error;
  }
};

/**
 * Update specific card level/upgrade
 * @param {string} uid - User ID
 * @param {string} cardId - Card ID
 * @param {number} level - New level/upgrade value
 * @returns {Promise<void>}
 */
export const updateCardLevel = async (uid, cardId, level) => {
  try {
    const scopedUid = getScopedUid(uid);
    const userDoc = await getDoc(doc(db, "users", scopedUid));
    if (!userDoc.exists()) throw new Error("User not found");

    const cards = userDoc.data().cards || {};
    const updatedCards = {
      ...cards,
      [cardId]: {
        ...(cards[cardId] || {}),
        level: level,
        lastUpdated: new Date().toISOString(),
      },
    };

    await updateDoc(doc(db, "users", scopedUid), {
      cards: updatedCards,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating card level:", error);
    throw error;
  }
};

// ============================================
// NFT OPERATIONS
// ============================================

/**
 * Get all NFTs owned by user
 * @param {string} uid - User ID
 * @returns {Promise<Object>} NFTs object
 */
export const getUserNFTs = async (uid) => {
  try {
    const scopedUid = getScopedUid(uid);
    const userDoc = await getDoc(doc(db, "users", scopedUid));
    return userDoc.exists() ? (userDoc.data().nfts || {}) : {};
  } catch (error) {
    console.error("Error loading user NFTs:", error);
    throw error;
  }
};

/**
 * Save user's NFT collection
 * @param {string} uid - User ID
 * @param {Object} nfts - NFTs object
 * @returns {Promise<void>}
 */
export const saveUserNFTs = async (uid, nfts) => {
  try {
    const scopedUid = getScopedUid(uid);
    await updateDoc(doc(db, "users", scopedUid), {
      nfts: nfts || {},
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving user NFTs:", error);
    throw error;
  }
};

/**
 * Add NFT to user's collection
 * @param {string} uid - User ID
 * @param {string} nftId - NFT ID
 * @param {Object} nftData - NFT data
 * @returns {Promise<void>}
 */
export const addUserNFT = async (uid, nftId, nftData) => {
  try {
    const scopedUid = getScopedUid(uid);
    const userDoc = await getDoc(doc(db, "users", scopedUid));
    if (!userDoc.exists()) throw new Error("User not found");

    const nfts = userDoc.data().nfts || {};
    const updatedNFTs = {
      ...nfts,
      [nftId]: {
        ...nftData,
        acquiredAt: new Date().toISOString(),
      },
    };

    await updateDoc(doc(db, "users", scopedUid), {
      nfts: updatedNFTs,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding NFT:", error);
    throw error;
  }
};

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Perform a batch update for multiple users or multiple fields
 * Useful for leaderboards, events, etc.
 * @param {Array} operations - Array of {uid, data} objects
 * @returns {Promise<void>}
 */
export const batchUpdateUsers = async (operations) => {
  try {
    const batch = writeBatch(db);

    operations.forEach(({ uid, data }) => {
      const scopedUid = getScopedUid(uid);
      batch.update(doc(db, "users", scopedUid), {
        ...data,
        lastUpdated: serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error in batch update:", error);
    throw error;
  }
};

/**
 * Delete user document (use with caution)
 * @param {string} uid - User ID
 * @returns {Promise<void>}
 */
export const deleteUserDocument = async (uid) => {
  try {
    const scopedUid = getScopedUid(uid);
    await deleteDoc(doc(db, "users", scopedUid));
  } catch (error) {
    console.error("Error deleting user document:", error);
    throw error;
  }
};

// ============================================
// QUERY OPERATIONS
// ============================================

/**
 * Search users by displayName or email
 * @param {string} searchTerm - Search term
 * @param {string} field - Field to search (displayName or email)
 * @returns {Promise<Array>} Array of matching users
 */
export const searchUsers = async (searchTerm, field = "displayName") => {
  try {
    const q = query(
      collection(db, "users"),
      where(field, ">=", searchTerm),
      where(field, "<=", searchTerm + "\uf8ff")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

/**
 * Get top users by coins (for leaderboard)
 * Note: This requires a composite index in Firestore
 * @param {number} limit - Number of top users to fetch
 * @returns {Promise<Array>} Array of top users
 */
export const getTopUsersByCoins = async (limit = 10) => {
  try {
    // Note: This is a simple implementation
    // For production, you might want to use a separate leaderboard collection
    // or implement server-side pagination
    const allUsersSnapshot = await getDocs(collection(db, "users"));
    const users = allUsersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users
      .sort((a, b) => (b.coins || 0) - (a.coins || 0))
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting top users:", error);
    throw error;
  }
};
