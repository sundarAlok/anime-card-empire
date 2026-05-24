import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import {
  loadUserDataFromFirestore,
  initializeUserDocument,
  saveGameState,
} from "../services/firestoreService";

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
        await loadUserData(currentUser.uid, currentUser);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user data from Firestore
  const loadUserData = async (uid, authUser) => {
    try {
      let userData = await loadUserDataFromFirestore(uid);
      
      if (!userData) {
        // Create new user document if doesn't exist
        userData = await initializeUserDocument(uid, {
          email: authUser?.email || "",
          displayName: authUser?.displayName || "Player",
          photoURL: authUser?.photoURL || "",
        });
      }
      
      setUserData(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
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
      await saveGameState(user.uid, gameData);
      setUserData((prev) => ({ 
        ...prev, 
        ...gameData,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error saving game data:", error);
      throw error;
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

