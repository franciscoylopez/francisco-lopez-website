/**
 * Los grupos de hermanos comparables. **Lo usan el detector Y su caso malo**, y
 * eso no es aseo: la primera versión del caso malo elegía su víctima por su cuenta
 * —el primer `p`/`li`/`span`/`a` con hermanos— y caía en grupos que el detector ni
 * mira, así que inyectaba un incumplimiento donde nadie iba a buscarlo y el
 * auto-test suspendía sin que hubiera nada roto. Un caso malo tiene que estar
 * escrito en los términos del guardián que pone a prueba.
 *
 * HERMANOS DE VERDAD, NO «HIJOS DE ALGÚN UL» (2026-09-02, calibrado contra la
 * pasada limpia). La primera versión agrupaba por el NOMBRE de la etiqueta del
 * padre, así que metía en un mismo grupo todos los `li` de la página: los de una
 * lista y los de otra, que no tienen por qué parecerse en nada. Con eso, un
 * `--border` que cambia porque las dos listas están sobre superficies distintas se
 * leía como «un estado codificado por color». El padre tiene que ser el mismo
 * NODO, y por eso lleva un identificador propio.
 */
/** Solo lo que se ve y ocupa sitio: un elemento oculto no codifica nada. */
function cuentaComoMiembro(el, cs) {
  if (cs.visibility === "hidden" || cs.display === "none") return false;
  if (parseFloat(cs.opacity) === 0) return false;
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;
  return Boolean(el.parentElement);
}

function gruposComparables() {
  const grupos = new Map();
  let nPadre = 0;
  const idPadre = new WeakMap();
  const padreDe = (el) => {
    const p = el.parentElement;
    if (!idPadre.has(p)) idPadre.set(p, (nPadre += 1));
    return idPadre.get(p);
  };
  const clave = (el) => `${padreDe(el)}|${el.tagName}|${forma(el)}`;

  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (!cuentaComoMiembro(el, cs)) continue;
    const k = clave(el);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(el);
  }
  return grupos;
}
