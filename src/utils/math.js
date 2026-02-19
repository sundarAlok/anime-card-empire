export const preciseAdd = (a, b) =>
  Number((a + b).toFixed(6));

export const preciseMultiply = (a, b) =>
  Number((a * b).toFixed(6));

export const hoursBetween = (start, end) =>
  (end - start) / 3600000;
