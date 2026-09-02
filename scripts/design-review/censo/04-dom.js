function paintsText(el) {
  const cs = getComputedStyle(el);
  if (cs.visibility === "hidden" || cs.display === "none") return false;
  if (parseFloat(cs.opacity) === 0) return false;
  if (!el.getClientRects().length) return false;
  return [...el.childNodes].some(
    (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
  );
}

const label = (el) => {
  const cls = (el.getAttribute("class") || "").split(/\s+/).slice(0, 3);
  return `${el.tagName.toLowerCase()}${cls.length ? "." + cls.join(".") : ""}`;
};

/**
 * Las declaraciones que una regla `:hover` aplica de verdad a un elemento. Se
 * LEEN de la hoja de estilo en vez de asumirse: la corrección del hover del
 * chrome secundario consistió justo en que la regla declara dos cosas —la
 * pastilla y el color del texto— y quien lo revisó antes solo contó con una.
 * Simular el ratón no vale: el estado no sobrevive entre llamadas.
 */
/**
 * ÍNDICE de las reglas `:hover` de la página, construido UNA VEZ.
 *
 * DOS VECES SE HA CAÍDO ESTA MISMA FUNCIÓN, y por la misma familia de causa:
 *
 * 1 · Un bucle plano se saltaba las utilidades `hover:` de Tailwind v4, que van
 *     envueltas en `@media (hover: hover)` — un `@media` no tiene
 *     `selectorText`. El censo daba 6,42 para el hover del chrome secundario:
 *     veía aparecer la pastilla y no el texto subiendo a `foreground`, que es
 *     la mitad que lo arregla.
 * 2 · Se arregló con `if (rule.cssRules) { bajar; continue; }`, o sea con un
 *     test de «esto es una regla de grupo» que el navegador invalidó después:
 *     DESDE QUE CHROME SOPORTA CSS NESTING, toda `CSSStyleRule` expone
 *     `cssRules` —vacío—, así que la condición era siempre cierta, el `continue`
 *     se ejecutaba siempre y la línea del selector NUNCA se alcanzaba. Medido en
 *     la página servida el 2026-08-18: encontraba **0** reglas con `:hover`
 *     donde hay **21**.
 *
 * La lección que sí generaliza, y por eso está escrita en el código y no solo en
 * el commit: **no es o-grupo-o-selector**. Con nesting una regla puede tener
 * las DOS cosas, así que se evalúa el selector si lo tiene Y se baja si tiene
 * hijas — nunca se elige una rama. Y sobre todo: **un metro que devuelve una
 * lista vacía parece un aprobado**, así que este índice se PUBLICA en el
 * resultado y el censo falla si sale a cero (ver `reglasHover` abajo).
 */
const HOVER_RULES = (() => {
  const idx = [];
  const walk = (rules) => {
    for (const rule of rules) {
      // Rama 1: ¿declara algo? Se mira SIEMPRE, tenga o no hijas.
      if (rule.selectorText?.includes(":hover")) {
        for (const sel of rule.selectorText.split(",")) {
          const s = sel.trim();
          if (s.includes(":hover")) idx.push({ sel: s, style: rule.style });
        }
      }
      // Rama 2: ¿tiene hijas DE VERDAD? `length > 0`, no la mera existencia.
      if (rule.cssRules?.length > 0) walk(rule.cssRules);
    }
  };
  for (const sheet of document.styleSheets) {
    try {
      walk(sheet.cssRules);
    } catch {
      continue; // hoja de otro origen
    }
  }
  return idx;
})();

/**
 * Las declaraciones que una regla `:hover` aplica de verdad a un elemento. Se
 * LEEN de la hoja de estilo en vez de asumirse: la corrección del hover del
 * chrome secundario consistió justo en que la regla declara dos cosas —la
 * pastilla y el color del texto— y quien lo revisó antes solo contó con una.
 * Simular el ratón no vale: el estado no sobrevive entre llamadas.
 */
function hoverDeclarations(el) {
  const out = [];
  for (const { sel, style } of HOVER_RULES) {
    try {
      if (el.matches(sel.replaceAll(":hover", ""))) out.push(style);
    } catch {
      continue;
    }
  }
  return out;
}

/**
 * El umbral que le toca a ESTE texto, que depende de su tamaño. WCAG llama
 * «grande» a ≥18pt (24px), o ≥14pt (18,66px) con peso ≥700, y ahí AAA es 4,5 y
 * AA es 3 — no 7 y 4,5.
 *
 * Añadido en P37.6595, y es la cuarta vez que el medidor falla antes que la
 * página. Hasta aquí el censo puntuaba TODO contra 7:1, así que su `bajoAAA`
 * era una lista de candidatos vendida como lista de incumplimientos: el PRD
 * llegó a publicar «cuatro pares incumpliendo en la escalera del logo» cuando
 * era **uno** —los otros tres eran los «Aa» de las muestras de color, de 24px y
 * peso 600, y dos de ellos (5,21 y 6,57) cumplían de sobra—. Un umbral mal
 * aplicado inventa hallazgos igual que un metro mal calibrado (D41).
 */
function umbralDe(el) {
  const cs = getComputedStyle(el);
  const px = round(parseFloat(cs.fontSize));
  const peso = parseInt(cs.fontWeight, 10) || 400;
  const grande = px >= 24 || (px >= 18.66 && peso >= 700);
  return { px, peso, grande, AA: grande ? 3 : 4.5, AAA: grande ? 4.5 : 7 };
}

/* --- Lo que hace falta para decidir si algo ES un control -----------------
 *
 * Vive aquí y no en el pase de contornos porque son predicados de DOM y de caja,
 * no de WCAG: `esVisible` mira lo mismo que mira `paintsText`, y `dibujaCaja` es
 * la pregunta que separa un botón de un enlace de texto. El pase que los usa
 * —`04-contornos.js`— se queda con el criterio, que es lo suyo.
 */
const CONTROL_SEL = [
  "a[href]",
  "button",
  "input:not([type='hidden'])",
  "textarea",
  "select",
  "summary",
  "[role='button']",
  "[role='switch']",
  "[role='tab']",
  "[role='checkbox']",
  "[role='radio']",
].join(", ");

const LADOS = ["Top", "Right", "Bottom", "Left"];

const esVisible = (el, cs) => {
  if (cs.visibility === "hidden" || cs.display === "none") return false;
  if (parseFloat(cs.opacity) === 0) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
};

const ladosConBorde = (cs) =>
  LADOS.filter(
    (l) =>
      parseFloat(cs[`border${l}Width`]) > 0 && cs[`border${l}Style`] !== "none",
  );

const dibujaCaja = (cs) =>
  ladosConBorde(cs).length > 0 || paint(cs.backgroundColor)[3] !== 0;

/**
 * LA CAJA DE UN CONTROL PUEDE NO ESTAR EN EL CONTROL (P68.585, 2026-08-24).
 *
 * El criterio anterior miraba solo al elemento que casa `CONTROL_SEL`: si él
 * no dibujaba borde ni relleno, se descartaba por «enlace de texto». El riel
 * de secciones del artículo dibuja su píldora en un `<span>` HIJO, así que el
 * `<a>` se descartaba por no tener caja y el `<span>` no se miraba por no
 * casar el selector. Doce controles invisibles, y once de ellos con el borde
 * a 1,21:1 contra un umbral de 3 — la misma cifra que D97 arregló en la capa
 * de componentes y que aquí se quedó fuera, porque el riel es la excepción
 * viva de `BRAND.md` que no compone `chromeLinkVariants`.
 *
 * Es el modo de fallo de siempre: el metro devolvía «cero contornos bajo 3:1»
 * y eso se leía como un aprobado. La sexta vez en este proyecto.
 *
 * SIN UMBRAL DE ÁREA, y eso se midió antes de elegirlo. Sobre seis páginas
 * servidas, la puerta nueva sin umbral deja entrar exactamente los doce del
 * riel y ni un falso positivo; los doce ocupan el 0,30 del área de su control,
 * así que un umbral del 50% los habría perdido y 0/10/25% dan el mismo
 * resultado. Un número que no cambia nada solo añade algo que se puede
 * desajustar. El criterio es el que se puede defender: si el control no dibuja
 * nada y algo dentro sí, ESO es lo que el usuario ve como el control.
 */
const cajaDelHijo = (control) => {
  let mejor = null;
  for (const h of control.querySelectorAll("*")) {
    const hs = getComputedStyle(h);
    if (!esVisible(h, hs) || !dibujaCaja(hs)) continue;
    const r = h.getBoundingClientRect();
    const area = r.width * r.height;
    if (!mejor || area > mejor.area) mejor = { el: h, area };
  }
  return mejor && mejor.el;
};
