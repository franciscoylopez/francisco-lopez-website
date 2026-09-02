/**
 * El check de medición, con salida escrita — `npm run medicion`.
 *
 * QUÉ ES. El paso 3 del ritual de cierre de etapa (`CLAUDE.md` §Gestión de etapas,
 * `sprint-review` §12) tenía cuatro fuentes y ninguna dejaba rastro: cada cierre
 * volvía a leerlas a mano y apuntaba la cifra en la prosa de un D-entry. Esto lee
 * lo que se pueda leer, **dice en voz alta lo que no**, compara contra el sello
 * anterior y —con `--sellar`— deja el suyo para el cierre siguiente.
 *
 * QUÉ NO ES. No automatiza GA4 ni monta un ETL. GA4 necesita una sesión
 * autenticada en el navegador y eso sigue siendo trabajo de quien cierra; lo que
 * cambia es que su cifra deja de vivir en un párrafo. Entra por bandera y el sello
 * anota que entró a mano.
 *
 * USO
 *   npm run medicion
 *     Lee lo automático (consentimiento, Vercel) y compara con el sello anterior.
 *
 *   npm run medicion -- --sellar --etapa=Higiene \
 *     --ventana=2026-08-05..2026-09-02 \
 *     --ga4-eventos=240 --ga4-usuarios=39 --primaria=1
 *     Escribe el sello. Exige ventana y etapa: una cifra de analítica sin su
 *     ventana no significa nada, y dos sellos sin etapa no se ordenan.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  declaraLooker,
  leeConsentimiento,
  leeVercelWebAnalytics,
  type Lectura,
} from "./medicion/fuentes";
import {
  comparaConAnterior,
  escribeRegistro,
  FUENTES,
  leeRegistro,
  MEDICION_REGISTRO,
  type FuenteSellada,
  type RegistroMedicion,
} from "./medicion/registro";

const bandera = (nombre: string): string | undefined =>
  process.argv.find((a) => a.startsWith(`--${nombre}=`))?.split("=")[1];

const numero = (nombre: string): number | undefined => {
  const crudo = bandera(nombre);
  if (crudo === undefined) return undefined;
  const v = Number(crudo);
  return Number.isFinite(v) ? v : undefined;
};

/** El proyecto al que se le pregunta. Del enlace de la CLI, no cableado. */
function proyectoVercel(): { proyecto: string; equipo: string } | null {
  try {
    const j = JSON.parse(
      readFileSync(join(".vercel", "project.json"), "utf8"),
    ) as { projectId?: string; orgId?: string };
    return j.projectId && j.orgId
      ? { proyecto: j.projectId, equipo: j.orgId }
      : null;
  } catch {
    return null;
  }
}

/**
 * El token de la CLI de Vercel. Se lee de su propio almacén y NUNCA se imprime:
 * lo único que sale de aquí es si estaba o no.
 */
function tokenVercel(): string | undefined {
  const base =
    process.env.APPDATA ??
    (process.env.HOME ? join(process.env.HOME, ".local", "share") : undefined);
  if (!base) return undefined;
  for (const ruta of [
    join(base, "xdg.data", "com.vercel.cli", "auth.json"),
    join(base, "com.vercel.cli", "auth.json"),
  ]) {
    try {
      const j = JSON.parse(readFileSync(ruta, "utf8")) as { token?: string };
      if (j.token) return j.token;
    } catch {
      /* la siguiente ruta */
    }
  }
  return undefined;
}

/** Una línea por fuente, con el mismo ancho, para que la lista se lea de un vistazo. */
function pinta(f: FuenteSellada): string {
  const icono =
    f.estado === "leida" ? "✓" : f.estado === "no-aporta" ? "–" : "✗";
  const nombre = f.fuente.padEnd(21);
  if (f.estado !== "leida") return `  ${icono} ${nombre}${f.motivo ?? ""}`;
  const cifras = Object.entries(f.cifras ?? {})
    .map(([k, v]) => `${k} ${v ?? "—"}`)
    .join(" · ");
  return `  ${icono} ${nombre}${cifras}${f.aMano ? "   (a mano)" : ""}`;
}

async function main() {
  const sellar = process.argv.includes("--sellar");
  const ventanaCruda = bandera("ventana");
  const etapa = bandera("etapa");

  const fuentes: FuenteSellada[] = [];

  // 1 · GA4 — a mano, por bandera. Sin banderas no se inventa un cero.
  const eventos = numero("ga4-eventos");
  const usuarios = numero("ga4-usuarios");
  const primaria = numero("primaria");
  fuentes.push(
    eventos === undefined && usuarios === undefined && primaria === undefined
      ? {
          fuente: "ga4",
          estado: "ilegible",
          motivo:
            "no se ha pasado ninguna cifra — necesita sesión autenticada en el navegador (sprint-review §12); entra por --ga4-eventos / --ga4-usuarios / --primaria",
        }
      : {
          fuente: "ga4",
          estado: "leida",
          aMano: true,
          cifras: {
            eventos: eventos ?? null,
            usuarios: usuarios ?? null,
            contact_submit: primaria ?? null,
          },
        },
  );

  // 2 · Looker — se declara, no se intenta.
  const looker = declaraLooker();
  fuentes.push({
    fuente: "looker",
    estado: "no-aporta",
    motivo: looker.estado === "no-aporta" ? looker.motivo : "",
  });

  // 3 · Consentimiento — automático.
  const consent = await leeConsentimiento(bandera("entorno") ?? "production");
  fuentes.push(
    consent.estado === "leida"
      ? {
          fuente: "consentimiento",
          estado: "leida",
          cifras: {
            visto: consent.valor.contadores.visto,
            aceptado: consent.valor.contadores.aceptado,
            rechazado: consent.valor.contadores.rechazado,
            // La tasa en puntos porcentuales con un decimal, o `null` cuando no
            // hay denominador: un 0 % impreso junto a «0 vistos» se lee como un
            // hallazgo demoledor y es la ausencia de dato.
            tasa_pct:
              consent.valor.tasa === null
                ? null
                : Number((consent.valor.tasa * 100).toFixed(1)),
          },
        }
      : {
          fuente: "consentimiento",
          estado: "ilegible",
          motivo: motivoDe(consent),
        },
  );

  // 4 · Vercel Web Analytics — se intenta siempre, aunque hoy sepamos que falla.
  const proy = proyectoVercel();
  const vercel = proy
    ? await leeVercelWebAnalytics(proy.proyecto, proy.equipo, tokenVercel())
    : ({
        estado: "ilegible",
        motivo: "no hay .vercel/project.json: el proyecto no está enlazado",
      } as const);
  fuentes.push(
    vercel.estado === "leida"
      ? {
          fuente: "vercel-web-analytics",
          estado: "leida",
          cifras: {
            visitantes: vercel.valor.visitantes,
            paginas: vercel.valor.paginas,
          },
        }
      : {
          fuente: "vercel-web-analytics",
          estado: "ilegible",
          motivo: motivoDe(vercel),
        },
  );

  const leidas = fuentes.filter((f) => f.estado === "leida").length;
  const ilegibles = fuentes.filter((f) => f.estado === "ilegible").length;

  console.log(`\nmedición — ${FUENTES.length} fuentes:\n`);
  for (const f of fuentes) console.log(pinta(f));
  console.log(
    `\n  ${leidas} con cifra · ${ilegibles} sin poder leerse · ${fuentes.length - leidas - ilegibles} que no aportan.`,
  );
  if (consent.estado === "leida" && consent.valor.tasa !== null) {
    console.log(`\n  ${consent.valor.salvedad}`);
  }

  const anterior = leeRegistro();

  if (!sellar) {
    console.log("");
    const actual: RegistroMedicion = {
      fecha: hoy(),
      ventana: ventana(ventanaCruda) ?? { desde: "—", hasta: "—" },
      etapa: etapa ?? "—",
      fuentes,
    };
    for (const linea of comparaConAnterior(anterior, actual)) {
      console.log(linea);
    }
    console.log(
      `\n  Sin sellar (falta --sellar). ${MEDICION_REGISTRO} se queda como estaba.\n`,
    );
    return;
  }

  const rango = ventana(ventanaCruda);
  if (!rango || !etapa) {
    console.error(
      "\n  NO SE SELLA: falta --ventana=DESDE..HASTA o --etapa=Nombre.\n" +
        "  Una cifra de analítica sin su ventana no significa nada —son 28 días\n" +
        "  rodantes— y dos sellos sin etapa no se ordenan.\n",
    );
    process.exit(1);
  }

  const registro: RegistroMedicion = {
    fecha: hoy(),
    ventana: rango,
    etapa,
    fuentes,
  };

  console.log("");
  for (const linea of comparaConAnterior(anterior, registro)) {
    console.log(linea);
  }

  escribeRegistro(registro);
  console.log(
    `\n  Sellado en ${MEDICION_REGISTRO} — etapa «${etapa}», ventana ${rango.desde} → ${rango.hasta}, ` +
      `${leidas}/${FUENTES.length} con cifra.`,
  );
  console.log(
    "  El cierre siguiente resta contra este archivo, no contra un párrafo.\n",
  );
}

const hoy = () => new Date().toISOString().slice(0, 10);

function ventana(
  crudo: string | undefined,
): { desde: string; hasta: string } | null {
  const m = /^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/.exec(crudo ?? "");
  return m?.[1] && m[2] ? { desde: m[1], hasta: m[2] } : null;
}

const motivoDe = (l: Lectura<unknown>): string =>
  l.estado === "leida" ? "" : l.motivo;

void main().catch((e: unknown) => {
  console.error(`\n${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
