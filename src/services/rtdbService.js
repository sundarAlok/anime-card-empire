import { getDatabase, ref, get, set, update } from "firebase/database";
import { dbRTDB } from "../firebase/firebaseConfig";

const userRef = (uid) => ref(dbRTDB, `users/${uid}`);
const userGameRef = (uid) => ref(dbRTDB, `users/${uid}/game`);
const userProfileRef = (uid) => ref(dbRTDB, `users/${uid}/profile`);

export const ensureUserProfileDefaults = async (uid, profileDefaults) => {
  // profileDefaults shape: { name, email, image, memberSince }
  await set(
    ref(dbRTDB, `users/${uid}/profile`),
    {
      ...(profileDefaults || {}),
      updatedAt: Date.now()
    }
  );
};

export const loadUserGameFromRTDB = async (uid) => {
  const snapshot = await get(userGameRef(uid));
  return snapshot.exists() ? snapshot.val() : null;
};

export const loadUserProfileFromRTDB = async (uid) => {
  const snapshot = await get(userProfileRef(uid));
  return snapshot.exists() ? snapshot.val() : null;
};

export const saveUserGameToRTDB = async (uid, gameData) => {
  await update(userRef(uid), {
    game: gameData
  });
};

export const saveUserProfileToRTDB = async (uid, profileData) => {
  await update(userRef(uid), {
    profile: {
      ...(profileData || {}),
      updatedAt: Date.now()
    }
  });
};

