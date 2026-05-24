import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import { initializeApp as initClient } from "firebase/app";
import { getFirestore as getClientFirestore, doc as clientDoc, setDoc as clientSetDoc } from "firebase/firestore";
import { firebaseConfig as clientFirebaseConfig } from "../src/firebase/firebaseConfig.js";

const PROJECT_ROOT = path.resolve(process.cwd());
const possibleKeys = [process.env.GOOGLE_APPLICATION_CREDENTIALS, path.join(PROJECT_ROOT, "serviceAccountKey.json"), path.join(PROJECT_ROOT, "scripts", "serviceAccountKey.json")];
const serviceAccountPath = possibleKeys.find((p) => p && fs.existsSync(p));

async function createDocsWithAdmin(db, Timestamp) {
  console.log("Using Firebase Admin SDK to create documents...");

  const now = Timestamp ? Timestamp.now() : { toDate: () => new Date() };

  await db.collection("users").doc("demo_user_1").set({
    uid: "demo_user_1",
    email: "demo1@example.com",
    displayName: "DemoPlayer1",
    photoURL: "https://via.placeholder.com/150",
    coins: 1000,
    stars: 50,
    highestCoins: 5000,
    level: 5,
    tapLimit: 100,
    streakDays: 3,
    lastClaimDate: new Date().toISOString().split("T")[0],
    cards: {
      card_001: { name: "Starter Card", level: 2, lastUpdated: admin.firestore.Timestamp.now() },
      card_002: { name: "Support Card", level: 1, lastUpdated: admin.firestore.Timestamp.now() }
    },
    nfts: {
      nft_001: { name: "Rare Card", acquiredAt: admin.firestore.Timestamp.now(), metadata: { rarity: "rare" } }
    },
    createdAt: admin.firestore.Timestamp.now(),
    lastUpdated: admin.firestore.Timestamp.now(),
  });
  console.log("  ✅ demo_user_1 created");

  await db.collection("users").doc("demo_user_2").set({
    uid: "demo_user_2",
    email: "demo2@example.com",
    displayName: "DemoPlayer2",
    photoURL: "https://via.placeholder.com/150",
    coins: 2500,
    stars: 120,
    highestCoins: 10000,
    level: 8,
    tapLimit: 150,
    streakDays: 7,
    lastClaimDate: new Date().toISOString().split("T")[0],
    cards: {
      card_001: { name: "Starter Card", level: 3, lastUpdated: admin.firestore.Timestamp.now() },
      card_002: { name: "Support Card", level: 2, lastUpdated: admin.firestore.Timestamp.now() },
      card_003: { name: "Attacker Card", level: 1, lastUpdated: admin.firestore.Timestamp.now() }
    },
    nfts: {
      nft_001: { name: "Rare Card", acquiredAt: admin.firestore.Timestamp.now(), metadata: { rarity: "rare" } },
      nft_002: { name: "Epic Card", acquiredAt: admin.firestore.Timestamp.now(), metadata: { rarity: "epic" } }
    },
    createdAt: admin.firestore.Timestamp.now(),
    lastUpdated: admin.firestore.Timestamp.now(),
  });
  console.log("  ✅ demo_user_2 created");

  await db.collection("users").doc("demo_user_3").set({
    uid: "demo_user_3",
    email: "demo3@example.com",
    displayName: "TopPlayer",
    photoURL: "https://via.placeholder.com/150",
    coins: 50000,
    stars: 500,
    highestCoins: 100000,
    level: 15,
    tapLimit: 500,
    streakDays: 30,
    lastClaimDate: new Date().toISOString().split("T")[0],
    cards: {
      card_001: { name: "Starter Card", level: 5, lastUpdated: admin.firestore.Timestamp.now() },
      card_002: { name: "Support Card", level: 4, lastUpdated: admin.firestore.Timestamp.now() },
      card_003: { name: "Attacker Card", level: 3, lastUpdated: admin.firestore.Timestamp.now() },
      card_004: { name: "Defense Card", level: 2, lastUpdated: admin.firestore.Timestamp.now() }
    },
    nfts: {
      nft_001: { name: "Rare Card", acquiredAt: admin.firestore.Timestamp.now(), metadata: { rarity: "rare" } },
      nft_002: { name: "Epic Card", acquiredAt: admin.firestore.Timestamp.now(), metadata: { rarity: "epic" } },
      nft_003: { name: "Legendary Card", acquiredAt: admin.firestore.Timestamp.now(), metadata: { rarity: "legendary" } }
    },
    createdAt: admin.firestore.Timestamp.now(),
    lastUpdated: admin.firestore.Timestamp.now(),
  });
  console.log("  ✅ demo_user_3 created (Top Player)");

  await db.collection("leaderboard").doc("global").set({
    lastUpdated: admin.firestore.Timestamp.now(),
    topPlayers: [
      { uid: "demo_user_3", displayName: "TopPlayer", coins: 50000 },
      { uid: "demo_user_2", displayName: "DemoPlayer2", coins: 2500 },
      { uid: "demo_user_1", displayName: "DemoPlayer1", coins: 1000 }
    ]
  });
  console.log("  ✅ leaderboard created");
}

async function createDocsWithClient() {
  console.log("Using Firebase Client SDK to create documents (requires permissive rules/auth)...");

  if (!clientFirebaseConfig) {
    throw new Error(
      "No client firebaseConfig found. Add and export `firebaseConfig` from src/firebase/firebaseConfig.js or provide a service account (set GOOGLE_APPLICATION_CREDENTIALS)."
    );
  }
  const app = initClient(clientFirebaseConfig);
  const db = getClientFirestore(app);

  await clientSetDoc(clientDoc(db, "users", "demo_user_1"), {
    uid: "demo_user_1",
    email: "demo1@example.com",
    displayName: "DemoPlayer1",
    photoURL: "https://via.placeholder.com/150",
    coins: 1000,
    stars: 50,
    highestCoins: 5000,
    level: 5,
    tapLimit: 100,
    streakDays: 3,
    lastClaimDate: new Date().toISOString().split("T")[0],
    cards: {
      card_001: { name: "Starter Card", level: 2, lastUpdated: new Date().toISOString() },
      card_002: { name: "Support Card", level: 1, lastUpdated: new Date().toISOString() }
    },
    nfts: {
      nft_001: { name: "Rare Card", acquiredAt: new Date().toISOString(), metadata: { rarity: "rare" } }
    },
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });
  console.log("  ✅ demo_user_1 created");

  await clientSetDoc(clientDoc(db, "users", "demo_user_2"), {
    uid: "demo_user_2",
    email: "demo2@example.com",
    displayName: "DemoPlayer2",
    photoURL: "https://via.placeholder.com/150",
    coins: 2500,
    stars: 120,
    highestCoins: 10000,
    level: 8,
    tapLimit: 150,
    streakDays: 7,
    lastClaimDate: new Date().toISOString().split("T")[0],
    cards: {
      card_001: { name: "Starter Card", level: 3, lastUpdated: new Date().toISOString() },
      card_002: { name: "Support Card", level: 2, lastUpdated: new Date().toISOString() },
      card_003: { name: "Attacker Card", level: 1, lastUpdated: new Date().toISOString() }
    },
    nfts: {
      nft_001: { name: "Rare Card", acquiredAt: new Date().toISOString(), metadata: { rarity: "rare" } },
      nft_002: { name: "Epic Card", acquiredAt: new Date().toISOString(), metadata: { rarity: "epic" } }
    },
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });
  console.log("  ✅ demo_user_2 created");

  await clientSetDoc(clientDoc(db, "users", "demo_user_3"), {
    uid: "demo_user_3",
    email: "demo3@example.com",
    displayName: "TopPlayer",
    photoURL: "https://via.placeholder.com/150",
    coins: 50000,
    stars: 500,
    highestCoins: 100000,
    level: 15,
    tapLimit: 500,
    streakDays: 30,
    lastClaimDate: new Date().toISOString().split("T")[0],
    cards: {
      card_001: { name: "Starter Card", level: 5, lastUpdated: new Date().toISOString() },
      card_002: { name: "Support Card", level: 4, lastUpdated: new Date().toISOString() },
      card_003: { name: "Attacker Card", level: 3, lastUpdated: new Date().toISOString() },
      card_004: { name: "Defense Card", level: 2, lastUpdated: new Date().toISOString() }
    },
    nfts: {
      nft_001: { name: "Rare Card", acquiredAt: new Date().toISOString(), metadata: { rarity: "rare" } },
      nft_002: { name: "Epic Card", acquiredAt: new Date().toISOString(), metadata: { rarity: "epic" } },
      nft_003: { name: "Legendary Card", acquiredAt: new Date().toISOString(), metadata: { rarity: "legendary" } }
    },
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });
  console.log("  ✅ demo_user_3 created (Top Player)");

  await clientSetDoc(clientDoc(db, "leaderboard", "global"), {
    lastUpdated: new Date().toISOString(),
    topPlayers: [
      { uid: "demo_user_3", displayName: "TopPlayer", coins: 50000 },
      { uid: "demo_user_2", displayName: "DemoPlayer2", coins: 2500 },
      { uid: "demo_user_1", displayName: "DemoPlayer1", coins: 1000 }
    ]
  });
  console.log("  ✅ leaderboard created");
}

async function createFirestoreTables() {
  console.log("🚀 Creating Firestore tables...\n");

  try {
    if (serviceAccountPath) {
      console.log(`Found service account at: ${serviceAccountPath}`);
      const content = fs.readFileSync(serviceAccountPath, "utf8");
      const serviceAccount = JSON.parse(content);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      const db = admin.firestore();
      await createDocsWithAdmin(db, admin.firestore.Timestamp);
    } else {
      console.log("No service account found. Falling back to client SDK. Make sure Firestore rules allow writes from this client or authenticate properly.");
      await createDocsWithClient();
    }

    console.log("\n✨ Firestore tables created successfully!\n");
    console.log("📍 Collections:");
    console.log("   ✓ users (3 documents)");
    console.log("   ✓ leaderboard\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createFirestoreTables();
