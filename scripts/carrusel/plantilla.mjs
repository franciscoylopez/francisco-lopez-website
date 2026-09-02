/**
 * Plantilla visual del carrusel — la parte REUTILIZABLE de la serie.
 *
 * Los colores son los tokens del tema oscuro de franciscolopez.es, convertidos
 * de oklch a hex (el navegador recorta el gamut igual, pero aquí no hay
 * cascada de la que heredarlos). Ninguno se ha inventado.
 *
 * Contrastes medidos sobre #191D21:
 *   foreground #F7F3EC → 15,32:1   ·  primary #3FC9C4 → 8,36:1
 *   muted-fg   #AAA8A0 →  7,12:1   ·  purple  #9B87F5 → 5,79:1 (solo decorativo)
 * Sobre la tarjeta #21262B: foreground 13,79:1 · muted-fg 6,40:1 · primary 7,53:1.
 * Todo el texto está en AAA, que es el listón del sitio.
 */

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { brandHex, paletteHex } from "../../lib/design-values";

/** La plantilla vive dentro del repo desde el 2026-09-01, así que la raíz la
 *  deduce de su propia ruta en vez de pedirla. Antes se pasaba en `raizRepo`
 *  (o en `REPO=`) porque el generador vivía en el Escritorio, y eso significaba
 *  que el aspecto de la marca no estaba en git. */
const RAIZ_REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * LOS DIEZ COLORES SE DERIVAN, NO SE COPIAN *(P72.07, 2026-09-02)*. Estaban
 * escritos a mano aquí desde que el generador entró al repo, y el barrido de
 * copias de `check:palette` no los veía porque solo abría `.ts` y `.tsx`: la
 * misma copia era invisible en un `.mjs` y roja en un `.ts`. Cerrada la ceguera,
 * salieron los diez de golpe.
 *
 * Por eso este archivo corre bajo `tsx` y no bajo `node` a secas: es lo que le
 * permite importar `lib/design-values.ts`, que es la fuente de la que ya beben el
 * Design System, el Brand Kit y las imágenes OG. Un carrusel publicado con el cian
 * de antes de un cambio de token es exactamente la clase de deriva que la marca
 * fuera del sitio no puede permitirse.
 */
const OSCURO = paletteHex("dark");
const MARCA = brandHex();

const T = {
  bg: OSCURO.background,
  fg: OSCURO.foreground,
  card: OSCURO.card,
  primary: OSCURO.primary,
  muted: OSCURO.muted,
  mutedFg: OSCURO["muted-foreground"],
  border: OSCURO["border-base"],
  purple: MARCA["brand-purple"],
  cyanSplit: MARCA["brand-cyan-split"],
  purpleSplit: MARCA["brand-purple-split"],
};

const W = 1080;
const H = 1350;

function fuente(rutaRepo, familia, peso) {
  const b64 = readFileSync(rutaRepo).toString("base64");
  return `@font-face{font-family:"${familia}";font-weight:${peso};font-style:normal;font-display:block;src:url(data:font/woff;base64,${b64}) format("woff");}`;
}

/** El monograma del sitio, con la firma split. Misma geometría que
 *  components/ui/logo.tsx: dos circunferencias desplazadas debajo de la negra.
 *
 *  EL `viewBox` NO ES EL DEL COMPONENTE, y no puede serlo. El del sitio está
 *  recortado a los límites del símbolo *flat* y deja que las capas del split
 *  asomen por fuera, porque allí el `<svg>` lleva `overflow-visible`. Aquí no
 *  hay nada que las recoja: fuera del viewBox se cortan. Así que la caja se
 *  amplía a lo que ocupan de verdad las tres circunferencias más su trazo
 *  (x 28..92, y 15..87 contando la barra), con dos unidades de aire. */
function logo(alto = 52) {
  return `<svg class="logo" viewBox="26 13 68 77" fill="none" style="height:${alto}px;overflow:visible" aria-hidden="true">
    <circle cx="57" cy="44" r="26" stroke="${T.cyanSplit}" stroke-width="6"/>
    <circle cx="63" cy="48" r="26" stroke="${T.purpleSplit}" stroke-width="6"/>
    <circle cx="60" cy="46" r="26" stroke="${T.fg}" stroke-width="6"/>
    <rect x="42" y="82" width="36" height="5" rx="2.5" fill="${T.fg}"/>
  </svg>`;
}

function barras(distribucion) {
  const max = Math.max(...distribucion.map((d) => d.alto));
  return distribucion
    .map((d) => {
      const pct = (d.alto / max) * 100;
      const cls = d.destacado ? "barra destacada" : "barra";
      return `<div class="col">
        <div class="pista"><div class="${cls}" style="height:${pct}%"></div></div>
        <div class="rango${d.destacado ? " rango-destacado" : ""}">${d.rango}</div>
      </div>`;
    })
    .join("");
}

function cuerpoLamina(l, distribucion) {
  switch (l.tipo) {
    case "portada":
      return `
        <div class="bloque bloque-portada">
          <h1 class="titular titular-xl">${l.titulo}<span class="punto">.</span></h1>
          <p class="entradilla entradilla-lg">${l.entradilla}</p>
        </div>`;

    // La portada del R1: el gráfico ES el gancho, así que abre él y no hay
    // lámina de gráfico suelta. Titular a tamaño `lg` y no `xl` porque aquí
    // comparte lámina con la figura.
    case "portada-grafico":
      return `
        <div class="bloque bloque-portada-grafico">
          <h1 class="titular titular-lg">${l.titulo}<span class="punto">.</span></h1>
          <p class="entradilla entradilla-lg">${l.entradilla}</p>
          <div class="gráfico grafico-portada">${barras(distribucion)}</div>
          <p class="pie-figura">${l.pieGrafico}</p>
        </div>`;

    case "grafico":
      return `
        <div class="bloque">
          <h2 class="titular">${l.titulo}</h2>
          <div class="gráfico">${barras(distribucion)}</div>
          <p class="pie-figura">${l.pieGrafico}</p>
        </div>`;

    case "tabla":
      return `
        <div class="bloque">
          <h2 class="titular">${l.titulo}</h2>
          <div class="tabla">
            <div class="fila fila-cabecera">
              <span>${l.cabecera[0]}</span><span class="num">${l.cabecera[1]}</span><span class="num">${l.cabecera[2]}</span>
            </div>
            ${l.filas
              .map(
                (f) => `<div class="fila">
                  <span class="dominio">${f.a}</span>
                  <span class="num cifra">${f.b}</span>
                  <span class="num"><span class="grado">${f.c}</span></span>
                </div>`,
              )
              .join("")}
          </div>
          <p class="nota">${l.nota}</p>
        </div>`;

    case "afirmacion":
      return `
        <div class="bloque">
          <h2 class="titular titular-lg">${l.titulo}</h2>
          <p class="remate">${l.remate}</p>
          <p class="entradilla">${l.entradilla}</p>
        </div>`;

    case "antes-despues":
      return `
        <div class="bloque">
          <h2 class="titular">${l.titulo}</h2>
          <ul class="credenciales">${l.credenciales.map((c) => `<li>${c}</li>`).join("")}</ul>
          <div class="marcador">
            <div class="caja">
              <div class="marcador-cifra apagada">${l.antes.cifra}</div>
              <div class="marcador-grado">${l.antes.grado}</div>
              <div class="marcador-pie">${l.antes.pie}</div>
            </div>
            <div class="flecha">→</div>
            <div class="caja caja-viva">
              <div class="marcador-cifra">${l.despues.cifra}</div>
              <div class="marcador-grado">${l.despues.grado}</div>
              <div class="marcador-pie">${l.despues.pie}</div>
            </div>
          </div>
          <p class="nota">${l.nota}</p>
        </div>`;

    case "accion":
      return `
        <div class="bloque">
          <div class="ordinal">${l.ordinal}</div>
          <h2 class="titular">${l.titulo}</h2>
          <p class="entradilla">${l.cuerpo}</p>
          <p class="remate">${l.remate}</p>
          <div class="dato">
            <span class="dato-cifra">${l.dato.cifra}</span>
            <span class="dato-pie">${l.dato.pie}</span>
          </div>
        </div>`;

    case "codigo":
      return `
        <div class="bloque">
          <h2 class="titular">${l.titulo}</h2>
          <pre class="codigo">${l.codigo}</pre>
          <p class="entradilla">${l.nota}</p>
        </div>`;

    case "cierre":
      return `
        <div class="bloque">
          <h2 class="titular">${l.titulo}</h2>
          <p class="entradilla">${l.entradilla}</p>
          <p class="remate remate-cierre">${l.remate}</p>
          <div class="cierre-cta">
            ${l.ctaIntro ? `<p class="cta-intro">${l.ctaIntro}</p>` : ""}
            <div class="cta">${l.cta}</div>
          </div>
        </div>`;

    default:
      throw new Error(`Tipo de lámina desconocido: ${l.tipo}`);
  }
}

export function construirHtml({ laminas, distribucion, meta }) {
  const fuentes = [
    fuente(
      join(RAIZ_REPO, "assets/fonts/bricolage-600.woff"),
      "Bricolage",
      600,
    ),
    fuente(join(RAIZ_REPO, "assets/fonts/inter-400.woff"), "Inter", 400),
    fuente(join(RAIZ_REPO, "assets/fonts/inter-600.woff"), "Inter", 600),
  ].join("\n");

  const secciones = laminas
    .map((l, i) => {
      const n = String(i + 1).padStart(2, "0");
      const total = String(laminas.length).padStart(2, "0");
      const esPortada = l.tipo.startsWith("portada");
      // El pie ya no publica la URL del sitio: en fase de calentamiento la
      // firma es el monograma y el nombre, no un enlace. El rol solo va en la
      // portada, que es donde alguien que no me conoce necesita situarme.
      return `<section class="lamina ${esPortada ? "es-portada" : ""}" id="l${n}">
        <header class="cabecera">
          <span class="eyebrow">${l.eyebrow}</span>
          ${esPortada ? "" : `<span class="paginacion">${n}<span class="sep">/</span>${total}</span>`}
        </header>
        ${cuerpoLamina(l, distribucion)}
        <footer class="pie">
          <span class="firma">${logo(esPortada ? 62 : 52)}<span class="firma-texto">${meta.firma}</span></span>
          <span class="pie-rol">${esPortada ? "Senior Product Manager" : ""}</span>
        </footer>
      </section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>${meta.titulo}</title>
<style>
${fuentes}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0F1214;font-family:"Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}

.lamina{
  width:${W}px;height:${H}px;background:${T.bg};color:${T.fg};
  padding:80px;display:flex;flex-direction:column;position:relative;overflow:hidden;
}
/* El filete cian superior: la única marca de acción constante, como el nav del sitio. */
.lamina::before{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:${T.primary}}
.es-portada::before{height:10px}

.cabecera{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:56px}
.eyebrow{
  font-size:33px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;
  color:${T.primary};
}
.paginacion{font-size:33px;font-weight:600;color:${T.mutedFg};font-variant-numeric:tabular-nums}
.paginacion .sep{color:${T.border};margin:0 4px}

.bloque{flex:1;display:flex;flex-direction:column;justify-content:center;gap:34px}
.bloque-portada{gap:44px}
.bloque-portada-grafico{gap:26px;justify-content:center}

.titular{font-family:"Bricolage",system-ui,sans-serif;font-weight:600;line-height:1.06;letter-spacing:-.02em;font-size:66px}
.titular-lg{font-size:74px}
.titular-xl{font-size:92px;line-height:1.02}
.punto{color:${T.purple}}

.entradilla{font-size:33px;line-height:1.5;color:${T.mutedFg};max-width:850px}
.entradilla-lg{font-size:38px;line-height:1.45;color:${T.fg}}
.entradilla code,.nota code{
  font-family:ui-monospace,"Cascadia Mono",Consolas,monospace;font-size:.88em;
  background:${T.muted};color:${T.fg};padding:2px 8px;border-radius:7px;
}

.remate{font-size:40px;line-height:1.25;font-weight:600;color:${T.primary};max-width:880px}
.remate-cierre{font-size:36px;color:${T.fg};font-weight:600;line-height:1.35}

.nota{font-size:33px;line-height:1.45;color:${T.mutedFg}}
.pie-figura{font-size:33px;color:${T.mutedFg}}

/* — Gráfico de distribución — */
.gráfico{display:flex;align-items:flex-end;gap:16px;height:520px;padding-top:8px}
.grafico-portada{height:400px;margin-top:10px}
.col{flex:1;display:flex;flex-direction:column;height:100%}
.pista{flex:1;display:flex;align-items:flex-end}
.barra{width:100%;background:${T.muted};border-radius:8px 8px 0 0;min-height:4px}
.barra.destacada{background:${T.primary}}
.rango{
  margin-top:18px;text-align:center;font-size:33px;color:${T.mutedFg};
  font-variant-numeric:tabular-nums;padding-top:16px;border-top:2px solid ${T.border};white-space:nowrap;
}
.rango-destacado{color:${T.primary};font-weight:600}

/* — Tabla — */
.tabla{display:flex;flex-direction:column;background:${T.card};border-radius:20px;padding:14px 34px}
.fila{
  display:grid;grid-template-columns:1fr 140px 140px;align-items:center;
  padding:26px 0;border-bottom:2px solid ${T.border};font-size:34px;
}
.fila:last-child{border-bottom:none}
.fila-cabecera{
  font-size:33px;letter-spacing:.1em;text-transform:uppercase;color:${T.mutedFg};
  font-weight:600;padding:20px 0;
}
.num{text-align:right;font-variant-numeric:tabular-nums}
.dominio{font-weight:600}
.cifra{color:${T.primary};font-weight:600}
.grado{
  display:inline-block;min-width:56px;text-align:center;padding:6px 0;border-radius:10px;
  background:${T.muted};color:${T.fg};font-size:33px;font-weight:600;
}

/* — Antes / después — */
.credenciales{list-style:none;display:flex;flex-wrap:wrap;gap:14px}
.credenciales li{
  font-size:33px;color:${T.fg};background:${T.card};border:2px solid ${T.border};
  padding:12px 24px;border-radius:999px;
}
.marcador{display:flex;align-items:center;gap:36px}
.caja{
  flex:1;background:${T.card};border:2px solid ${T.border};border-radius:22px;
  padding:38px 34px;text-align:center;
}
.caja-viva{border-color:${T.primary}}
.marcador-cifra{
  font-family:"Bricolage",sans-serif;font-weight:600;font-size:120px;line-height:1;
  color:${T.primary};font-variant-numeric:tabular-nums;
}
.marcador-cifra.apagada{color:${T.mutedFg}}
.marcador-grado{font-size:36px;font-weight:600;margin-top:14px}
.marcador-pie{font-size:33px;color:${T.mutedFg};margin-top:6px}
.flecha{font-size:52px;color:${T.mutedFg}}

/* — Acción — */
.ordinal{
  font-family:"Bricolage",sans-serif;font-size:34px;font-weight:600;color:${T.bg};
  background:${T.primary};width:76px;height:76px;border-radius:20px;
  display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;
}
.dato{display:flex;align-items:baseline;gap:22px;border-top:3px solid ${T.border};padding-top:30px}
.dato-cifra{
  font-family:"Bricolage",sans-serif;font-size:76px;font-weight:600;color:${T.primary};
  line-height:1;font-variant-numeric:tabular-nums;
}
.dato-pie{font-size:33px;color:${T.mutedFg}}

/* — Código — */
.codigo{
  font-family:ui-monospace,"Cascadia Mono",Consolas,monospace;font-size:33px;line-height:1.55;
  background:${T.card};border:2px solid ${T.border};border-radius:20px;padding:36px 40px;
  color:${T.fg};white-space:pre-wrap;
}

/* — CTA — */
.cierre-cta{display:flex;flex-direction:column;align-items:flex-start;gap:18px}
.cta-intro{font-size:33px;color:${T.mutedFg}}
.cta{
  align-self:flex-start;background:${T.primary};color:${T.bg};font-size:32px;font-weight:600;
  padding:24px 44px;border-radius:16px;
}

/* — Pie — */
.pie{
  display:flex;justify-content:space-between;align-items:center;
  border-top:2px solid ${T.border};padding-top:30px;margin-top:44px;
}
.firma{display:flex;align-items:center;gap:18px}
.firma-texto{
  font-family:"Bricolage",sans-serif;font-weight:600;font-size:33px;letter-spacing:-.01em;
}
.pie-rol{font-size:33px;color:${T.mutedFg}}
</style></head>
<body>${secciones}</body></html>`;
}

export const DIMENSIONES = { W, H };
export const TOKENS = T;
