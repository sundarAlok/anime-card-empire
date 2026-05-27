import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithRedirect,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { getPlatformId, getScopedUid } from "../utils/platform";
import { updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { useRef } from "react";
import {
  loadUserDataFromFirestore,
  initializeUserDocument,
  saveGameState,
  updateUserProfile,
} from "../services/firestoreService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userSnapshotUnsub = useRef(null);
  const lastLocalSaveMs = useRef(null);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // detach any previous snapshot listener
      if (userSnapshotUnsub.current) {
        try { userSnapshotUnsub.current(); } catch (e) {}
        userSnapshotUnsub.current = null;
      }

      if (currentUser) {
        setUser(currentUser);

        // Attach a realtime listener to the user's document so changes sync across clients
        const scopedUid = getScopedUid(currentUser.uid);
        const userDocRef = doc(db, "users", scopedUid);
          userSnapshotUnsub.current = onSnapshot(userDocRef, async (snap) => {
            if (snap && snap.exists()) {
              try {
                const serverData = snap.data();
                const serverLast = serverData.lastUpdated && serverData.lastUpdated.toMillis ? serverData.lastUpdated.toMillis() : null;
                // If we recently performed a local save, avoid applying older server snapshot that would overwrite local state
                if (lastLocalSaveMs.current && serverLast && serverLast < lastLocalSaveMs.current) {
                  // skip applying this snapshot because local save is newer
                  return;
                }
                setUserData(serverData);
              } catch (e) {
                console.error('Error processing user snapshot:', e);
              }
            } else {
            // Create user doc if missing
            try {
              const initial = await initializeUserDocument(currentUser.uid, {
                email: currentUser?.email || "",
                displayName: currentUser?.displayName || "Player",
                photoURL: currentUser?.photoURL || "",
              });
              setUserData(initial);
            } catch (err) {
              console.error("Error creating missing user document:", err);
            }
          }
        }, (err) => {
          console.error('User snapshot error:', err);
        });
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (userSnapshotUnsub.current) {
        try { userSnapshotUnsub.current(); } catch (e) {}
      }
    };
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
      try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
      } catch (e) {
        // Popup may be blocked; fallback to redirect flow
        console.warn('Popup sign-in failed, falling back to redirect:', e);
        await signInWithRedirect(auth, provider);
        return null;
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  // Update user profile fields in Firestore and local state
  const updateProfile = async (uid, profileData) => {
    if (!uid) throw new Error('No uid provided');
    try {
      // Update Firebase Auth profile if available
      try {
        if (auth.currentUser) {
          await firebaseUpdateProfile(auth.currentUser, {
            displayName: profileData.displayName,
            photoURL: profileData.photoURL,
          });
        }
      } catch (e) {
        // Non-fatal: continue to update Firestore
        console.warn('Failed to update Firebase Auth profile:', e);
      }

      await updateUserProfile(uid, profileData);
      // local state will be updated by snapshot listener, but merge immediately for responsiveness
      setUserData((prev) => ({ ...(prev || {}), ...profileData, lastUpdated: new Date().toISOString() }));
    } catch (error) {
      console.error('Error updating profile:', error);
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
      // Accept optional local timestamp for conflict resolution
      const localTs = gameData && gameData._localUpdateTimeMs ? gameData._localUpdateTimeMs : null;
      if (localTs) lastLocalSaveMs.current = localTs;
      // Remove internal field before sending
      if (localTs) delete gameData._localUpdateTimeMs;
      await saveGameState(user.uid, gameData, localTs);
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
        updateProfile,
        signOut,
        saveGameData,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

