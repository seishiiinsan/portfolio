/** Couleur de texte lisible sur l'accent (noir ou blanc). */
export function contrastOn(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.4 ? "#0f0f0f" : "#ffffff";
}

export function safeHex(hex: string, fallback = "#be3455") {
  return /^#[0-9a-f]{6}$/i.test(hex.trim()) ? hex.trim() : fallback;
}
