// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Build firebaseConfig from environment variables.
// For client builds (Vite) use `import.meta.env.VITE_*`.
// For Node scripts, use `process.env.*`.
const env = (typeof process !== "undefined" && process.env && Object.keys(process.env).length)
  ? process.env
  : (typeof import.meta !== "undefined" ? (import.meta.env || {}) : {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || env.FIREBASE_API_KEY || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN || "",
  projectId: env.VITE_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID || "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: env.VITE_FIREBASE_APP_ID || env.FIREBASE_APP_ID || "",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || env.FIREBASE_MEASUREMENT_ID || ""
};

export { firebaseConfig };
// Initialize Firebase only in browser environments to avoid server-side errors

let app = null;
let analytics = null;
let auth = null;
let db = null;
let dbRTDB = null;

if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  app = initializeApp(firebaseConfig);
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // analytics not available in this environment
  }
  auth = getAuth(app);
  db = getFirestore(app);
  dbRTDB = getDatabase(app);
}

export { app as default, analytics, auth, db, dbRTDB };

