import {
  getUserNFTs,
  saveUserNFTs,
  addUserNFT,
} from "./firestoreService";

/**
 * Get all NFTs owned by a user
 * @param {string} uid - User ID
 * @returns {Promise<Object>} NFTs object
 */
export const getAllUserNFTs = async (uid) => {
  try {
    return await getUserNFTs(uid);
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    throw error;
  }
};

/**
 * Add a new NFT to user's collection
 * @param {string} uid - User ID
 * @param {string} nftId - NFT ID
 * @param {Object} nftData - NFT data (name, metadata, etc.)
 * @returns {Promise<void>}
 */
export const acquireNFT = async (uid, nftId, nftData) => {
  try {
    await addUserNFT(uid, nftId, nftData);
  } catch (error) {
    console.error(`Error acquiring NFT ${nftId}:`, error);
    throw error;
  }
};

/**
 * Update entire NFT collection for a user
 * @param {string} uid - User ID
 * @param {Object} nfts - NFTs object
 * @returns {Promise<void>}
 */
export const updateNFTCollection = async (uid, nfts) => {
  try {
    await saveUserNFTs(uid, nfts);
  } catch (error) {
    console.error("Error updating NFT collection:", error);
    throw error;
  }
};

/**
 * Get NFT details by ID
 * @param {string} uid - User ID
 * @param {string} nftId - NFT ID
 * @returns {Promise<Object|null>} NFT data or null if not found
 */
export const getNFTDetails = async (uid, nftId) => {
  try {
    const nfts = await getUserNFTs(uid);
    return nfts[nftId] || null;
  } catch (error) {
    console.error(`Error fetching NFT ${nftId}:`, error);
    throw error;
  }
};

/**
 * Check if user owns a specific NFT
 * @param {string} uid - User ID
 * @param {string} nftId - NFT ID
 * @returns {Promise<boolean>} True if user owns the NFT
 */
export const userOwnsNFT = async (uid, nftId) => {
  try {
    const nfts = await getUserNFTs(uid);
    return nftId in nfts;
  } catch (error) {
    console.error(`Error checking NFT ownership:`, error);
    throw error;
  }
};
