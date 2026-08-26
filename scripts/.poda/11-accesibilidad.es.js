// Nueva §11 — el checklist de cierre y el censo de contraste.
//
// AQUÍ CASI TODO SON DATOS: trece filas de pares medidos y nueve puntos de
// checklist. La única prosa larga era `contrastNote`, que contaba entera la
// historia de `brand-purple-accent` —por qué ningún color fijo pasaba de 3,71:1
// contra dos superficies que conmutan—. Eso es una D-entry, no una nota de
// sección: se queda el hecho, se va la reconstrucción.
module.exports = (viejo) => ({
  ...viejo.accesibilidad,
  num: "13 — Checklist de cierre",
  lead: "La lista con la que se cierra cada página. Es el criterio interno de construcción; la declaración pública de conformidad vive en la página de Accesibilidad.",
  contrastNote:
    "Todos los pares de texto del sistema alcanzan AAA en claro y en oscuro, y no solo en reposo: también en hover, que es donde suele escaparse. Sin excepciones.",
});
