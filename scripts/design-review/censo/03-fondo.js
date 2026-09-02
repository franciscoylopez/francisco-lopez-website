/**
 * El fondo EFECTIVO de un elemento: se sube por la cadena de padres hasta dar
 * con uno opaco y se componen encima los semitransparentes que había en medio.
 * Leer un `color-mix(…, transparent 86%)` sin componer da una cifra falsa y
 * optimista — es el punto 2 de D30.
 */
/**
 * El color que pinta un `background-image`, cuando de verdad se puede saber.
 *
 * POR QUÉ HACE FALTA, y no es un caso raro: el hover de los enlaces de
 * contenido de este sitio NO es un `background-color`. Es
 * `linear-gradient(var(--primary), var(--primary))` —un relleno SÓLIDO
 * disfrazado de degradado— con `background-size: 100% 0%` en reposo y
 * `100% 100%` en hover, que es lo que permite animar el relleno creciendo de
 * abajo arriba. `backdrop()` solo componía `background-color`, así que en el
 * pase de hover veía el texto pasar a `--primary-foreground` y NO veía
 * aparecer el relleno debajo: medía hueso sobre hueso y daba **1,06:1**, o sea
 * el aspecto exacto de un incumplimiento catastrófico sobre un par que está en
 * AAA. Apareció en cuanto el hover volvió a medirse (P50.36) — llevaba
 * escondido justo detrás del fallo que lo tapaba.
 *
 * DOS CONDICIONES, y las dos importan:
 * · **Que cubra.** Con `background-size: 100% 0%` el relleno existe y no pinta
 *   nada. Por eso el reposo del mismo enlace es correcto sin este código.
 * · **Que sea un color y no un degradado.** Si las paradas no son todas
 *   iguales, aquí no hay UN color que componer y devolvemos `null` — ese texto
 *   se va a `sinMedir`, que es el cajón de lo que hay que mirar a ojo. Inventar
 *   una media sería exactamente lo que este archivo existe para no hacer.
 */
function fillColor(el) {
  const cs = getComputedStyle(el);
  const img = cs.backgroundImage;
  if (!img || img === "none") return null;
  // Alguna dimensión a cero = no cubre. `100% 0%`, `0% 100%`, `0px`…
  if (/(^|[\s,])0(%|px)?([\s,]|$)/.test(cs.backgroundSize)) return null;
  // EL COMPUTED NO DEVUELVE LO QUE ESTÁ ESCRITO. La hoja dice
  // `linear-gradient(var(--primary), var(--primary))` y el token es `oklch`,
  // pero Chrome resuelve el gradiente a **`lab(...)`**. Un matcher de `rgb` y
  // hex —lo primero que uno escribe— no encuentra nada y el par se cae al cajón
  // de «sin medir» sin que nada avise: el mismo modo de fallo silencioso que
  // este archivo lleva tres iteraciones persiguiendo. Se cubren todas las
  // funciones de color, que no anidan paréntesis y por eso se pueden recortar
  // así.
  const stops = img.match(
    /(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^()]*\)|#[0-9a-fA-F]{3,8}/g,
  );
  if (!stops) return null;
  const colores = new Set(stops.map((s) => paint(s).join(",")));
  if (colores.size !== 1) return null; // degradado de verdad
  const c = paint(stops[0]);
  return c[3] === 0 ? null : c;
}

function backdrop(el) {
  const stack = [];
  for (let n = el; n; n = n.parentElement) {
    // El relleno de imagen va ENCIMA del `background-color` del mismo
    // elemento, así que se mira primero.
    const fill = fillColor(n);
    if (fill) {
      stack.push(fill);
      if (fill[3] === 1) break;
    }
    const c = paint(getComputedStyle(n).backgroundColor);
    if (c[3] === 0) continue;
    stack.push(c);
    if (c[3] === 1) break;
  }
  if (stack.length === 0) return [255, 255, 255];
  let base = stack.pop().slice(0, 3);
  while (stack.length) base = over(stack.pop(), base);
  return base;
}

/**
 * ¿El fondo de este texto es una IMAGEN (foto, degradado)? Entonces no hay
 * cifra que dar: `backdrop()` solo sabe componer `background-color`, así que
 * ignora la foto y el velo en degradado que lleva encima, y devuelve el fondo
 * de la página — que no es lo que hay detrás del texto.
 *
 * Añadido en P37.6565 tras un falso positivo del propio censo: el titular
 * blanco sobre la foto de Sobre mí salía a **1,09:1** en claro, o sea el peor
 * hallazgo de toda la auditoría, cuando lo que ocurre es que el medidor lo
 * comparaba con el blanco hueso de la página en vez de con la foto. Se separan
 * en `sinMedir` en lugar de descartarse: son los pares que hay que mirar a ojo,
 * y esconderlos sería cambiar un fallo por otro que no sale en el informe.
 */
const MEDIA_SEL = "img, video, canvas, svg image";

const solapan = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** ¿El fondo de este elemento es una imagen que CUBRE y no se puede reducir a
 *  un color? `background-size` con una dimensión a cero no pinta nada, y un
 *  relleno sólido escrito como degradado lo resuelve `fillColor`. */
const cubreConImagen = (n, cs) =>
  cs.backgroundImage !== "none" &&
  !/(^|[\s,])0(%|px)?([\s,]|$)/.test(cs.backgroundSize) &&
  fillColor(n) === null;

/** ¿Hay un `<img>`/`<video>` DENTRO de `ancestro` que se solape con la caja
 *  del texto sin contenerlo? Es la foto que se interpone. */
function tapaMedia(ancestro, el, r) {
  for (const m of ancestro.querySelectorAll(MEDIA_SEL)) {
    if (m.contains(el)) continue;
    const mr = m.getBoundingClientRect();
    if (mr.width > 0 && mr.height > 0 && solapan(r, mr)) return true;
  }
  return false;
}

function overImage(el) {
  // La comprobación es GEOMÉTRICA y no de cascada: se pregunta si el texto cae
  // ENCIMA de una foto, que es el hecho. El primer intento miraba si algún
  // ancestro tenía `background-image` y se equivocó en las dos direcciones —
  // marcaba `.link-content` (cuyo relleno de hover ES un `background-image`, de
  // tamaño cero en reposo) y NO marcaba el titular sobre la foto de Sobre mí,
  // porque ahí la imagen es un HERMANO posicionado, no un fondo. Es el mismo
  // error de disparador que este censo existe para no repetir.
  // Y un DEGRADADO DE VERDAD detrás del texto también es «sin medir»: cubre,
  // así que `background-color` no dice lo que hay debajo, y no tiene un color
  // único que componer. Un relleno sólido escrito como gradiente —el idioma del
  // hover de los enlaces de contenido— sí lo tiene, y lo resuelve `fillColor`;
  // esto es solo para el resto. Hoy no hay ninguno, y por eso está escrito:
  // el día que aparezca, tiene que salir en el informe como «míralo a ojo» y no
  // como una cifra inventada.
  // Y LA GEOMETRÍA SE MIRA DENTRO DE LA SUBRAMA, no en toda la página
  // (2026-08-22). La primera versión comparaba el texto contra CUALQUIER
  // `<img>`/`<video>` del documento por solape de rectángulos, sin mirar el
  // apilamiento: el diálogo de consentimiento, que es `fixed` y pinta su
  // propio `bg-card` OPACO, cae encima de la foto del hero y salía marcado
  // «sobre imagen». Con eso, 22 de los 26 pares que el censo mandaba mirar a
  // ojo no tenían imagen debajo — y una lista de revisión manual inflada con
  // falsos positivos es una lista que nadie lee, que es la misma forma de
  // fallo que el resto de este archivo combate.
  //
  // La pregunta correcta es si hay una imagen pintada ENTRE el texto y el
  // primer fondo opaco de su cadena: en cuanto un ancestro pinta opaco, lo
  // que haya detrás ya no se ve, y el color queda determinado. Por eso ahora
  // se recorre subiendo, buscando media DENTRO de cada ancestro, y el fondo
  // opaco devuelve `false` en vez de romper el bucle y seguir preguntando.
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;

  for (let n = el; n; n = n.parentElement) {
    const cs = getComputedStyle(n);
    if (cubreConImagen(n, cs)) return true;
    // El hermano posicionado que es el caso de Sobre mí: la foto vive dentro
    // del `<figure>`, no en el fondo de ningún ancestro del texto.
    if (n !== el && tapaMedia(n, el, r)) return true;
    if (paint(cs.backgroundColor)[3] === 1) return false;
  }

  return false;
}

/** Un elemento cuenta si pinta texto propio y se ve. */
