import {
  loadUserDataFromFirestore,
  initializeUserDocument,
  updateUserProfile,
} from "./firestoreService";

/**
 * Get user profile data
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserProfile = async (uid) => {
  try {
    const userData = await loadUserDataFromFirestore(uid);
    return userData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Create a new user document in Firestore
 * @param {string} uid - User ID
 * @param {Object} profileDefaults - Initial profile data
 * @returns {Promise<Object>} Created user data
 */
export const createNewUser = async (uid, profileDefaults) => {
  try {
    const userData = await initializeUserDocument(uid, profileDefaults);
    return userData;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
};

/**
 * Update user profile information
 * @param {string} uid - User ID
 * @param {Object} profileData - Profile fields to update
 * @returns {Promise<void>}
 */
export const updateUserInfo = async (uid, profileData) => {
  try {
    await updateUserProfile(uid, profileData);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Update user's display name
 * @param {string} uid - User ID
 * @param {string} displayName - New display name
 * @returns {Promise<void>}
 */
export const updateDisplayName = async (uid, displayName) => {
  try {
    await updateUserProfile(uid, { displayName });
  } catch (error) {
    console.error("Error updating display name:", error);
    throw error;
  }
};

/**
 * Update user's profile picture
 * @param {string} uid - User ID
 * @param {string} photoURL - New profile picture URL
 * @returns {Promise<void>}
 */
export const updateProfilePicture = async (uid, photoURL) => {
  try {
    await updateUserProfile(uid, { photoURL });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

/**
 * Check if user document exists
 * @param {string} uid - User ID
 * @returns {Promise<boolean>} True if user exists
 */
export const userExists = async (uid) => {
  try {
    const userData = await loadUserDataFromFirestore(uid);
    return userData !== null;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};
