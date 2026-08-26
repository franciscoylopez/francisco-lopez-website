module.exports = (viejo) => ({
  ...viejo.movimiento,
  num: "07 — Motion",
  navBullets: [
    "Symbol 48 → 28px and bar 80 → 64px, continuously with the scroll.",
    "The split's colour layers fade out before the symbol drops below 48px: it never passes through a badly registered state.",
    "The wordmark fades in opacity without clipping glyphs: the gap only collapses once it is already invisible.",
    "Under reduced motion, it jumps between states instead of interpolating.",
  ],
});
