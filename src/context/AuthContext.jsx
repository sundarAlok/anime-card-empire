import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Load user data from Firestore
        await loadUserData(currentUser.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user data from Firestore
  const loadUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        // Create new user document if doesn't exist
        await initializeUserData(uid);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // Initialize new user in Firestore
  const initializeUserData = async (uid) => {
    try {
      const initialData = {
        uid,
        email: auth.currentUser?.email || "",
        displayName: auth.currentUser?.displayName || "Player",
        photoURL: auth.currentUser?.photoURL || "",
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
        cards: {},
        nfts: {},
      };

      await setDoc(doc(db, "users", uid), initialData);
      setUserData(initialData);
    } catch (error) {
      console.error("Error initializing user data:", error);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Save game data to Firestore
  const saveGameData = async (gameData) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...gameData,
        lastUpdated: serverTimestamp(),
      });
      setUserData(prev => ({ ...prev, ...gameData }));
    } catch (error) {
      console.error("Error saving game data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signInWithGoogle,
        signOut,
        saveGameData,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
