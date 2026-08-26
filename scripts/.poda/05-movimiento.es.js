// Nueva §05 — movimiento. Ya cumplía el presupuesto (175 palabras); solo se
// renumera y se recorta un punto del bloque del nav.
module.exports = (viejo) => ({
  ...viejo.movimiento,
  num: "07 — Movimiento",
  navBullets: [
    "Símbolo 48 → 28px y barra 80 → 64px, de forma continua con el scroll.",
    "Las capas de color del split se extinguen antes de que el símbolo baje de 48px: nunca pasa por un estado de mala registración.",
    "El wordmark se desvanece en opacidad sin recortar glifos: el hueco solo se colapsa cuando ya es invisible.",
    "Con movimiento reducido, salto entre estados, sin interpolar.",
  ],
});
