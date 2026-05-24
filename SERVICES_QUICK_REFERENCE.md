# Firestore Services - Quick Reference

## Service Methods Overview

Complete reference for all Firestore service methods organized by category.

---

## 🔐 AuthService (`src/services/authService.js`)

### `getUserProfile(uid)`
Get all user data from Firestore.
```javascript
import { getUserProfile } from "../services/authService";

const userData = await getUserProfile(userId);
// Returns: { uid, email, displayName, coins, level, ... }
```

### `createNewUser(uid, profileDefaults)`
Create a new user document with initial data.
```javascript
import { createNewUser } from "../services/authService";

const newUser = await createNewUser(uid, {
  email: "player@example.com",
  displayName: "PlayerName",
  photoURL: "https://..."
});
```

### `updateUserInfo(uid, profileData)`
Update any user profile fields.
```javascript
await updateUserInfo(uid, {
  displayName: "NewName",
  photoURL: "https://new-photo.jpg"
});
```

### `updateDisplayName(uid, displayName)`
Update only the display name.
```javascript
await updateDisplayName(uid, "SaiyanHunter");
```

### `updateProfilePicture(uid, photoURL)`
Update only the profile picture.
```javascript
await updateProfilePicture(uid, "https://avatar.jpg");
```

### `userExists(uid)`
Check if a user document exists.
```javascript
const exists = await userExists(uid);
// Returns: true | false
```

---

## 🎮 Game State Operations (`src/services/firestoreService.js`)

### `saveGameState(uid, gameData)`
Save complete game state to Firestore.
```javascript
import { saveGameState } from "../services/firestoreService";

await saveGameState(uid, {
  coins: 50000,
  stars: 250,
  highestCoins: 150000,
  level: 8,
  tapLimit: 100,
  streakDays: 12,
  lastClaimDate: "2025-01-20"
});
```

### `loadGameState(uid)`
Load game state from Firestore.
```javascript
import { loadGameState } from "../services/firestoreService";

const gameState = await loadGameState(uid);
// Returns: { coins, stars, level, streakDays, ... }
```

### `updateGameCounter(uid, field, value)`
Update a single game counter.
```javascript
import { updateGameCounter } from "../services/firestoreService";

// Increase coins
await updateGameCounter(uid, "coins", 5000);

// Update level
await updateGameCounter(uid, "level", 10);

// Update streak
await updateGameCounter(uid, "streakDays", 7);
```

---

## 🃏 Card Service (`src/services/cardService.js`)

### `getAllUserCards(uid)`
Get all cards owned by user.
```javascript
import { getAllUserCards } from "../services/cardService";

const cards = await getAllUserCards(uid);
// Returns: { card_001: { level: 3, lastUpdated: "..." }, ... }
```

### `upgradeCard(uid, cardId, newLevel)`
Upgrade a specific card to new level.
```javascript
import { upgradeCard } from "../services/cardService";

await upgradeCard(uid, "card_001", 5);
// card_001 now at level 5
```

### `updateCardCollection(uid, cards)`
Replace entire card collection.
```javascript
import { updateCardCollection } from "../services/cardService";

await updateCardCollection(uid, {
  card_001: { level: 5, lastUpdated: "2025-01-20T..." },
  card_002: { level: 3, lastUpdated: "2025-01-18T..." }
});
```

### `getCardDetails(uid, cardId)`
Get details of a specific card.
```javascript
import { getCardDetails } from "../services/cardService";

const cardData = await getCardDetails(uid, "card_001");
// Returns: { level: 5, lastUpdated: "..." } or null
```

---

## 🎨 NFT Service (`src/services/nftService.js`)

### `getAllUserNFTs(uid)`
Get all NFTs owned by user.
```javascript
import { getAllUserNFTs } from "../services/nftService";

const nfts = await getAllUserNFTs(uid);
// Returns: { nft_001: { name: "Rare", acquiredAt: "..." }, ... }
```

### `acquireNFT(uid, nftId, nftData)`
Add new NFT to user's collection.
```javascript
import { acquireNFT } from "../services/nftService";

await acquireNFT(uid, "nft_001", {
  name: "Legendary Saiyan",
  metadata: { rarity: "legendary", power: 9000 }
});
```

### `updateNFTCollection(uid, nfts)`
Replace entire NFT collection.
```javascript
import { updateNFTCollection } from "../services/nftService";

await updateNFTCollection(uid, {
  nft_001: { name: "Legendary", acquiredAt: "2025-01-15T..." },
  nft_002: { name: "Epic", acquiredAt: "2025-01-18T..." }
});
```

### `getNFTDetails(uid, nftId)`
Get details of a specific NFT.
```javascript
import { getNFTDetails } from "../services/nftService";

const nftData = await getNFTDetails(uid, "nft_001");
// Returns: { name: "Legendary Saiyan", metadata: {...} } or null
```

### `userOwnsNFT(uid, nftId)`
Check if user owns a specific NFT.
```javascript
import { userOwnsNFT } from "../services/nftService";

const owns = await userOwnsNFT(uid, "nft_001");
// Returns: true | false
```

---

## 🔄 Advanced Operations (`src/services/firestoreService.js`)

### `batchUpdateUsers(operations)`
Perform batch updates for multiple users (atomic).
```javascript
import { batchUpdateUsers } from "../services/firestoreService";

await batchUpdateUsers([
  { uid: "user1", data: { coins: 1000, streakDays: 5 } },
  { uid: "user2", data: { coins: 2000, level: 10 } },
  { uid: "user3", data: { stars: 100 } }
]);
// All updates happen atomically
```

### `deleteUserDocument(uid)`
Delete user document from Firestore (use with caution).
```javascript
import { deleteUserDocument } from "../services/firestoreService";

// WARNING: This permanently deletes all user data
await deleteUserDocument(uid);
```

### `searchUsers(searchTerm, field)`
Search users by displayName or email.
```javascript
import { searchUsers } from "../services/firestoreService";

// Search by display name
const results = await searchUsers("Player", "displayName");
// Returns: [{ id: uid, displayName, coins, ... }, ...]

// Search by email
const results = await searchUsers("player@example", "email");
```

### `getTopUsersByCoins(limit)`
Get top users for leaderboard.
```javascript
import { getTopUsersByCoins } from "../services/firestoreService";

const topUsers = await getTopUsersByCoins(10);
// Returns: [
//   { id: uid, displayName: "Winner", coins: 1000000 },
//   { id: uid, displayName: "Runner-up", coins: 500000 },
//   ...
// ]
```

---

## 📝 Practical Usage Examples

### Example 1: Complete Login Flow
```javascript
import { useAuth } from "../context/useAuth";
import { getUserProfile } from "../services/authService";

export function LoginExample() {
  const { user, userData, signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    const loggedInUser = await signInWithGoogle();
    // userData is automatically loaded by AuthContext
    console.log("User data:", userData);
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
}
```

### Example 2: Save Game Progress
```javascript
import { useAuth } from "../context/useAuth";
import { saveGameState } from "../services/firestoreService";

export function SaveGameExample() {
  const { user } = useAuth();

  const handleTap = async (coinsEarned) => {
    const newCoins = coins + coinsEarned;
    setCoins(newCoins);

    // Auto-save to Firestore
    if (user) {
      await saveGameState(user.uid, { coins: newCoins });
    }
  };

  return <button onClick={() => handleTap(10)}>Tap!</button>;
}
```

### Example 3: Upgrade Card
```javascript
import { upgradeCard } from "../services/cardService";

export function CardUpgradeExample() {
  const handleUpgrade = async (cardId) => {
    const result = await upgradeCard(user.uid, cardId, currentLevel + 1);
    console.log("Card upgraded!");
  };

  return <button onClick={() => handleUpgrade("card_001")}>Upgrade</button>;
}
```

### Example 4: Acquire NFT
```javascript
import { acquireNFT } from "../services/nftService";

export function AcquireNFTExample() {
  const handleWinNFT = async () => {
    await acquireNFT(user.uid, "nft_001", {
      name: "Legendary Card",
      metadata: { rarity: "legendary" }
    });
    console.log("NFT acquired!");
  };

  return <button onClick={handleWinNFT}>Claim Reward</button>;
}
```

### Example 5: Leaderboard Display
```javascript
import { getTopUsersByCoins } from "../services/firestoreService";

export function LeaderboardExample() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const users = await getTopUsersByCoins(10);
      setTopUsers(users);
    };
    loadLeaderboard();
  }, []);

  return (
    <div>
      {topUsers.map((user, index) => (
        <div key={user.id}>
          {index + 1}. {user.displayName} - {user.coins} coins
        </div>
      ))}
    </div>
  );
}
```

---

## 🛡️ Error Handling Best Practices

### Always Use Try-Catch
```javascript
try {
  await saveGameState(uid, gameData);
  console.log("Saved successfully");
} catch (error) {
  console.error("Save failed:", error);
  // Show user a message
  // Implement retry logic
}
```

### Handle Specific Errors
```javascript
try {
  await updateGameCounter(uid, "coins", 5000);
} catch (error) {
  if (error.code === 'permission-denied') {
    console.log("User not authorized");
  } else if (error.code === 'not-found') {
    console.log("User document not found");
  } else {
    console.log("Unknown error:", error);
  }
}
```

### Offline Detection
```javascript
import { loadGameState } from "../services/firestoreService";

try {
  await loadGameState(uid);
} catch (error) {
  if (navigator.onLine === false) {
    console.log("Offline - data may be stale");
  } else {
    console.log("Network error:", error);
  }
}
```

---

## 📊 Performance Tips

### 1. Batch Operations
```javascript
// ✅ Good - Single Firestore call
await batchUpdateUsers([...operations]);

// ❌ Bad - Multiple Firestore calls
for (const op of operations) {
  await updateGameCounter(op.uid, op.field, op.value);
}
```

### 2. Auto-save Debouncing
```javascript
// ✅ Good - Save every 5 seconds max
const timer = setTimeout(() => {
  saveGameState(uid, gameData);
}, 5000);

// ❌ Bad - Save on every change
useEffect(() => {
  saveGameState(uid, gameData);
}, [coins]);
```

### 3. Query Optimization
```javascript
// ✅ Good - Use indexed field
const topUsers = await getTopUsersByCoins(10);

// ❌ Bad - Fetch all and sort client-side (slow)
const allUsers = await searchUsers("", "displayName");
```

---

## 🔗 Service Dependencies

```
AuthContext.jsx
  └─> firestoreService.js
      ├─> FirebaseAuth (auth)
      └─> Firestore (db)

GameContext.jsx
  ├─> AuthContext.jsx
  └─> firestoreService.js

authService.js
  └─> firestoreService.js

cardService.js
  └─> firestoreService.js

nftService.js
  └─> firestoreService.js
```

---

## 🆘 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Permission denied` | Security rules blocking access | Check UID matches doc ID |
| `Document not found` | User doc not created | Call `initializeUserDocument()` first |
| `Network error` | No internet connection | Implement retry logic |
| `Timeout` | Firestore quota exceeded | Reduce frequency of writes |
| `Invalid argument` | Wrong data type | Validate data before saving |

---

## 📚 Documentation Links

- Complete Setup: See `FIRESTORE_SETUP.md`
- Migration Guide: See `FIRESTORE_MIGRATION.md`
- Implementation: See `IMPLEMENTATION_CHECKLIST.md`
- Firebase Docs: https://firebase.google.com/docs/firestore
- Security Rules: https://firebase.google.com/docs/firestore/security/start

---

**Last Updated**: May 23, 2026  
**SDK Version**: Firebase v12.13.0  
**Status**: ✅ Ready for Production
