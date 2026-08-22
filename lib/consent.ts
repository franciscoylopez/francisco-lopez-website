// Lógica de consentimiento de cookies (P22) — Google Consent Mode v2.
//
// Modelo de categorías (el más amplio, para no rehacerlo al añadir marketing):
//   - Necesarias  → siempre concedidas (no requieren consentimiento). Cubren
//                   security_storage y functionality_storage.
//   - Analíticas  → analytics_storage (GA4, P24).
//   - Marketing   → ad_storage, ad_user_data, ad_personalization,
//                   personalization_storage (sin uso hoy; el cableado ya existe).
//
// El estado se guarda en localStorage (no es cookie → es almacenamiento necesario,
// no requiere consentimiento). El script de arranque (consent-init) fija el default
// DENEGADO antes de que cargue GTM y, si hay una decisión previa, la aplica ya.

export type ConsentSignal = "granted" | "denied";

export type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
};

// Registro persistido. `v` versiona el esquema: si algún día cambian las categorías
// se invalidan las decisiones viejas subiendo el número.
export type StoredConsent = ConsentChoice & { v: number; ts: number };

export const CONSENT_STORAGE_KEY = "flm-consent";
export const CONSENT_VERSION = 1;

// Señales de Consent Mode v2 que dependen de la elección del usuario. Las necesarias
// (security/functionality) van concedidas en el default y no se tocan aquí.
export function signalsForChoice(
  choice: ConsentChoice,
): Record<string, ConsentSignal> {
  const analytics: ConsentSignal = choice.analytics ? "granted" : "denied";
  const marketing: ConsentSignal = choice.marketing ? "granted" : "denied";
  return {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    personalization_storage: marketing,
  };
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// Aplica una decisión al Consent Mode. Replica gtag() empujando el objeto
// `arguments` al dataLayer, que es lo que GTM sabe interpretar (un array normal no
// vale). Seguro en SSR (no hace nada sin window).
export function applyConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const dataLayer = window.dataLayer;
  // gtag() empuja su objeto `arguments` (lo que GTM sabe leer; un array normal no
  // sirve). Se tipa como variádica solo para TS; el cuerpo usa `arguments`.
  const gtag: (...args: unknown[]) => void = function () {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  gtag("consent", "update", signalsForChoice(choice));
}

// Lee la decisión guardada (o null si no hay o el esquema cambió de versión).
export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (!parsed || parsed.v !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

// Persiste la decisión y la aplica al Consent Mode en un solo paso.
export function saveConsent(choice: ConsentChoice): void {
  if (typeof window !== "undefined") {
    const record: StoredConsent = {
      ...choice,
      v: CONSENT_VERSION,
      ts: Date.now(),
    };
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // almacenamiento no disponible (modo privado, etc.): se aplica igual en memoria.
    }
  }
  applyConsent(choice);
}

// Evento que abre el panel de preferencias desde fuera del banner (enlace del
// footer), incluso después de haber decidido.
export const OPEN_CONSENT_EVENT = "flm:open-consent";

// Script inline de arranque (se renderiza como <script> en el HTML del servidor y
// corre en el parseo, ANTES del loader de GTM). Fija el default denegado y, si hay
// decisión previa, la aplica de inmediato para que la analítica del visitante
// recurrente no espere. Es JS autocontenido (sin imports) porque se inyecta como
// texto; se interpolan la clave y la versión para que no diverjan de las constantes.
export function consentInitScript(): string {
  return `(function(){
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',personalization_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
try{var raw=localStorage.getItem('${CONSENT_STORAGE_KEY}');if(raw){var c=JSON.parse(raw);if(c&&c.v===${CONSENT_VERSION}){gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied',personalization_storage:c.marketing?'granted':'denied'});}}}catch{}
})();`;
}
