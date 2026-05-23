// Starter Rewards
export const STARTER_REWARDS = [
  { coin: [6.342, 7.118, 8.413], star: [2.851, 3.124, 3.742, 4.386, 5.314, 6.541, 8.213] },
  { coin: [6.145, 7.056, 8.327], star: [2.653, 3.041, 3.663, 4.257, 5.187, 6.437, 8.071] },
  { coin: [6.241, 7.089, 8.356], star: [2.754, 3.075, 3.705, 4.298, 5.231, 6.462, 8.125] },
  { coin: [6.018, 6.983, 8.219], star: [2.557, 2.986, 3.612, 4.173, 5.103, 6.298, 7.983] },
  { coin: [6.327, 7.142, 8.429], star: [2.956, 3.153, 3.784, 4.421, 5.369, 6.598, 8.314] }
];

// Rare Rewards
export const RARE_REWARDS = [
  { coin: [14.921, 17.245, 20.642], star: [4.315, 4.932, 5.921, 7.221, 8.943, 10.982, 13.472] },
  { coin: [14.623, 17.118, 20.514], star: [4.126, 4.781, 5.842, 7.083, 8.711, 10.873, 13.315] },
  { coin: [14.827, 17.189, 20.583], star: [4.214, 4.853, 5.873, 7.142, 8.814, 10.892, 13.361] },
  { coin: [14.529, 16.984, 20.412], star: [4.051, 4.712, 5.741, 6.984, 8.621, 10.653, 13.214] },
  { coin: [15.121, 17.332, 20.702], star: [4.537, 5.014, 6.012, 7.341, 9.023, 11.124, 13.501] }
];

// Epic Rewards
export const EPIC_REWARDS = [
  { coin: [32.651, 38.412, 46.843], star: [7.113, 8.184, 10.312, 12.264, 15.131, 18.762, 23.314] },
  { coin: [32.257, 38.166, 46.521], star: [6.721, 7.992, 9.842, 12.091, 14.943, 18.521, 23.072] },
  { coin: [32.459, 38.248, 46.612], star: [6.913, 8.073, 9.921, 12.158, 15.012, 18.623, 23.161] },
  { coin: [32.153, 38.021, 46.431], star: [6.534, 7.881, 9.713, 11.943, 14.781, 18.341, 22.931] },
  { coin: [32.957, 38.563, 46.963], star: [7.324, 8.281, 10.134, 12.413, 15.223, 18.903, 23.412] }
];

// Legendary Rewards
export const LEGENDARY_REWARDS = [
  { coin: [72.681, 87.024, 107.721], star: [12.315, 14.281, 17.442, 21.534, 26.671, 32.954, 40.492] },
  { coin: [72.283, 86.712, 107.381], star: [11.834, 13.984, 17.063, 21.073, 26.112, 32.321, 40.281] },
  { coin: [72.589, 86.861, 107.532], star: [12.063, 14.132, 17.231, 21.221, 26.314, 32.561, 40.364] },
  { coin: [72.089, 86.553, 107.214], star: [11.642, 13.841, 16.932, 20.881, 25.933, 32.074, 40.132] },
  { coin: [73.081, 87.241, 107.742], star: [12.641, 14.421, 17.623, 21.762, 26.921, 33.214, 40.531] }
];

// Mythic Rewards
export const MYTHIC_REWARDS = [
  { coin: [165.742, 202.441, 254.821], star: [21.341, 25.104, 30.842, 38.271, 47.412, 58.992, 72.981] },
  { coin: [165.040, 201.893, 254.341], star: [20.734, 24.561, 30.214, 37.711, 46.873, 58.214, 72.771] },
  { coin: [165.942, 202.121, 254.521], star: [21.013, 24.803, 30.451, 37.982, 47.131, 58.451, 72.842] },
  { coin: [165.243, 201.702, 254.132], star: [20.413, 24.332, 29.981, 37.341, 46.412, 57.821, 72.642] },
  { coin: [167.542, 202.773, 254.842], star: [21.642, 25.431, 31.021, 38.602, 47.703, 59.231, 72.995] }
];

// Card to rewards mapping
export const CARD_REWARDS_MAP = {
  // Starter tier
  zenitsu: STARTER_REWARDS[0],
  usopp: STARTER_REWARDS[1],
  krillin: STARTER_REWARDS[2],
  sakura: STARTER_REWARDS[3],
  armin: STARTER_REWARDS[4],
  // Rare tier
  levi: RARE_REWARDS[0],
  zoro: RARE_REWARDS[1],
  bakugo: RARE_REWARDS[2],
  aizen: RARE_REWARDS[3],
  inosuke: RARE_REWARDS[4],
  // Epic tier
  tanjiro: EPIC_REWARDS[0],
  yuji: EPIC_REWARDS[1],
  sasuke: EPIC_REWARDS[2],
  eren: EPIC_REWARDS[3],
  asta: EPIC_REWARDS[4],
  // Legendary tier
  ichigo: LEGENDARY_REWARDS[0],
  naruto: LEGENDARY_REWARDS[1],
  gojo: LEGENDARY_REWARDS[2],
  rimuru: LEGENDARY_REWARDS[3],
  ichibe: LEGENDARY_REWARDS[4],
  // Mythic tier
  goku: MYTHIC_REWARDS[0],
  jinwoo: MYTHIC_REWARDS[1],
  saitama: MYTHIC_REWARDS[2],
  madara: MYTHIC_REWARDS[3],
  luffy: MYTHIC_REWARDS[4]
};
