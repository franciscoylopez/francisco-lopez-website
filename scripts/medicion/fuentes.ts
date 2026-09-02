/**
 * Las cuatro fuentes del check de medición, cada una con lo mismo: una cifra, o el
 * motivo por el que hoy no la hay.
 *
 * LA REGLA QUE ORDENA ESTE ARCHIVO. Un metro que devuelve lista vacía parece un
 * aprobado, y este proyecto se lo ha encontrado cinco veces (D38/D57/D60/D63).
 * Así que ninguna fuente devuelve `null` a secas: devuelve `{ estado: "ilegible",
 * motivo }`, y el motivo se escribe en el sello. La diferencia entre «cero» y «no
 * he podido mirar» es la mitad del valor de este módulo, igual que ya lo era en
 * `consentimiento.ts`.
 *
 * QUÉ SE LEE SOLO Y QUÉ NO, medido el 2026-09-02:
 *
 *   · `consentimiento` — SÍ, contra el almacén de producción, con las
 *     `KV_REST_API_*` que trae `vercel env pull .env.vercel`.
 *   · Vercel Web Analytics — NO, y no por falta de credencial: la API contesta
 *     404 en plan Hobby, comprobado por dos caminos distintos (REST con el token
 *     de la CLI y el conector de Vercel). Se sigue intentando en cada pasada
 *     porque el día que el plan cambie, el sello lo dirá solo.
 *   · GA4 — NO desde aquí. Necesita una sesión autenticada en el navegador, que
 *     es trabajo de la persona que cierra la etapa (`sprint-review` §12). Entra
 *     por bandera, y el sello guarda que entró a mano.
 *   · El panel de Looker — NO APORTA, que es distinto de no legible: publica un
 *     subconjunto de lo que da GA4. Se declara para que su ausencia no se lea
 *     como un olvido.
 */
import {
  SALVEDAD_TASA,
  tasaDeAceptacion,
  type Contadores,
} from "../../lib/consent-metrics";
import { COMANDO_PULL, delEntornoAlguna } from "./entorno";

export type Lectura<T> =
  | { estado: "leida"; valor: T }
  | { estado: "ilegible"; motivo: string }
  | { estado: "no-aporta"; motivo: string };

export interface Consentimiento {
  entorno: string;
  contadores: Contadores;
  /** `null` mientras no haya denominador: no es un 0 %, es que no hay tasa. */
  tasa: number | null;
  salvedad: string;
}

/** Los tres contadores del banner, del almacén de producción. */
export async function leeConsentimiento(
  entorno = "production",
): Promise<Lectura<Consentimiento>> {
  const url = delEntornoAlguna("KV_REST_API_URL", "UPSTASH_REDIS_REST_URL");
  const token = delEntornoAlguna(
    "KV_REST_API_TOKEN",
    "UPSTASH_REDIS_REST_TOKEN",
  );

  if (!url || !token) {
    return {
      estado: "ilegible",
      motivo: `sin almacén configurado — faltan KV_REST_API_URL y KV_REST_API_TOKEN; se traen con \`${COMANDO_PULL}\``,
    };
  }

  const prefijo = `flm:consent:${entorno}:`;
  const claves = ["visto", "aceptado", "rechazado"] as const;

  let res: Response;
  try {
    res = await fetch(
      `${url}/MGET/${claves.map((c) => encodeURIComponent(prefijo + c)).join("/")}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (e: unknown) {
    return {
      estado: "ilegible",
      motivo: `el almacén no contestó (${e instanceof Error ? e.message : String(e)})`,
    };
  }

  if (!res.ok) {
    return { estado: "ilegible", motivo: `el almacén contestó ${res.status}` };
  }

  const cuerpo = (await res.json()) as { result?: unknown };
  const crudo = Array.isArray(cuerpo.result) ? cuerpo.result : [];
  const n = (i: number): number => {
    const v = Number(crudo[i]);
    return Number.isFinite(v) ? v : 0;
  };

  const contadores: Contadores = {
    visto: n(0),
    aceptado: n(1),
    rechazado: n(2),
  };

  return {
    estado: "leida",
    valor: {
      entorno,
      contadores,
      tasa: tasaDeAceptacion(contadores),
      salvedad: SALVEDAD_TASA,
    },
  };
}

/**
 * Vercel Web Analytics. Se INTENTA de verdad, aunque hoy sepamos que falla: un
 * «no legible» copiado a mano envejece igual de mal que la cifra que sustituye.
 */
export async function leeVercelWebAnalytics(
  proyecto: string,
  equipo: string,
  token: string | undefined,
): Promise<Lectura<{ visitantes: number; paginas: number }>> {
  if (!token) {
    return {
      estado: "ilegible",
      motivo:
        "sin token de la CLI de Vercel (se crea con `vercel login`; vive en com.vercel.cli/auth.json)",
    };
  }

  const url =
    `https://api.vercel.com/v1/web-analytics/timeseries` +
    `?projectId=${encodeURIComponent(proyecto)}&teamId=${encodeURIComponent(equipo)}`;

  let res: Response;
  try {
    res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  } catch (e: unknown) {
    return {
      estado: "ilegible",
      motivo: `la API no contestó (${e instanceof Error ? e.message : String(e)})`,
    };
  }

  if (res.status === 404) {
    return {
      estado: "ilegible",
      motivo:
        "la API contesta 404 en plan Hobby — la cifra existe y solo se lee a mano en el panel de Vercel (comprobado 2026-09-02 por dos caminos)",
    };
  }
  if (!res.ok) {
    return { estado: "ilegible", motivo: `la API contestó ${res.status}` };
  }

  const cuerpo = (await res.json()) as {
    visitors?: number;
    pageviews?: number;
  };
  return {
    estado: "leida",
    valor: {
      visitantes: cuerpo.visitors ?? 0,
      paginas: cuerpo.pageviews ?? 0,
    },
  };
}

/** El panel de Looker: no es que no se pueda leer, es que no añade nada. */
export function declaraLooker(): Lectura<never> {
  return {
    estado: "no-aporta",
    motivo:
      "publica «número de eventos», un subconjunto de lo que da GA4; y su canvas no pinta en pestaña automatizada",
  };
}
