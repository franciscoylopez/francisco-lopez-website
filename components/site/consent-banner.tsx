"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BANNER_ACTIONS, DIALOG_ACTIONS } from "@/components/ui/layout";
import { actionVariants } from "@/components/ui/action";
import { Badge } from "@/components/ui/badge";
import { registrarConsentimiento } from "@/app/consent-actions";
import {
  type ConsentChoice,
  OPEN_CONSENT_EVENT,
  readConsent,
  saveConsent,
} from "@/lib/consent";
import {
  CONSENT_SEEN_KEY,
  cuentaComoAceptado,
  type EventoConsentimiento,
  SENALES_DE_PERSONA,
} from "@/lib/consent-metrics";
import { cn } from "@/lib/utils";

export type ConsentDict = {
  region: string;
  title: string;
  description: string;
  policyLink: string;
  acceptAll: string;
  rejectAll: string;
  preferences: string;
  savePreferences: string;
  close: string;
  prefs: { title: string; intro: string };
  categories: {
    necessary: { title: string; description: string; badge: string };
    analytics: { title: string; description: string };
    marketing: { title: string; description: string };
  };
};

// Los tres botones del banner salen de la capa de acción del sistema (P37.592). El
// ghost pierde el subrayado en hover que tenía de más: su afordancia es la pastilla,
// igual que la del outline neutro con el que convive.
const BTN_PRIMARY = actionVariants({ variant: "solid" });
const BTN_OUTLINE = actionVariants({ variant: "outline-neutral" });
const BTN_GHOST = actionVariants({ variant: "ghost" });

// ── El contador de consentimiento (P68.61, D168) ──────────────────────────────
//
// DISPARO Y OLVIDO, SIEMPRE. Ni una de las tres llamadas puede hacer esperar a
// nada: el «visto» corre detrás del primer pintado y las decisiones tienen que
// cerrar el diálogo en el mismo gesto del clic. Un contador que retrasa un
// mecanismo de consentimiento sería cambiar una medición por un defecto.
//
// Y el `catch` vacío no es descuido: `registrarConsentimiento` ya falla callada
// hacia dentro, pero una Server Action puede fallar ANTES de entrar (la red), y
// una promesa rechazada sin manejar en el cliente ensucia la consola de cualquiera
// que abra el inspector, que es media audiencia de este sitio.
function contar(evento: EventoConsentimiento): void {
  void registrarConsentimiento(evento).catch(() => {});
}

// El «visto» se cuenta UNA VEZ POR NAVEGADOR, no por pintado. El porqué está en
// `lib/consent-metrics.ts`: contarlo por pintado convierte el denominador en
// páginas vistas y el ratio deja de significar lo que dice significar.
//
// El `try` envuelve la LECTURA además de la escritura porque en un navegador que
// bloquea el almacenamiento `localStorage` lanza al tocarlo, no al escribir. Ahí
// se cuenta de más y está contabilizado como salvedad, no como error.
//
// ES IDEMPOTENTE A PROPÓSITO, y de eso depende la corrección de lo de abajo: se
// llama desde dos sitios —la primera señal de persona y la primera decisión— y el
// segundo no puede volver a contar.
function contarVistoUnaVez(): void {
  try {
    if (window.localStorage.getItem(CONSENT_SEEN_KEY)) return;
    window.localStorage.setItem(CONSENT_SEEN_KEY, "1");
  } catch {
    // Sin almacén local no hay marca posible: se cuenta y se sigue.
  }
  contar("visto");
}

/**
 * EL «VISTO» ESPERA A QUE HAYA ALGUIEN DELANTE *(2026-09-04, D200)*.
 *
 * Antes se contaba en el efecto de montaje, o sea a cualquier cliente que ejecute
 * JS con perfil limpio — y uno de ellos es nuestro: `npm run psi -- --registro`
 * son 84 cargas de producción por corrida, cada una un `visto` y ninguna una
 * decisión. Con la puerta, el denominador pasa a ser «vistos con oportunidad de
 * decidir», que es el honesto para una tasa de aceptación.
 *
 * SE ARMA SOLO SI EL DIÁLOGO SE ABRE, o sea solo a quien no ha decidido: quien ya
 * decidió no ve nada que contar.
 *
 * `once` NO BASTA, y por eso el desarme es explícito: `once` retira **ese**
 * oyente, no los otros cinco, y quedarían cinco cierres vivos esperando un suceso
 * que ya no significa nada. `capture` para que un `stopPropagation` de cualquier
 * isla no se coma la señal, y `passive` porque ninguno de los seis se cancela.
 *
 * Devuelve su propio desarme para el `return` del efecto: si el componente se va
 * antes de que nadie toque nada, no queda nada enganchado a `window`.
 */
function cuentaVistoTrasInteraccion(): () => void {
  const opciones = { capture: true, passive: true } as const;
  let desarmado = false;

  const desarmar = () => {
    if (desarmado) return;
    desarmado = true;
    for (const senal of SENALES_DE_PERSONA) {
      window.removeEventListener(senal, alHaberAlguien, opciones);
    }
  };

  function alHaberAlguien() {
    desarmar();
    contarVistoUnaVez();
  }

  for (const senal of SENALES_DE_PERSONA) {
    window.addEventListener(senal, alHaberAlguien, opciones);
  }
  return desarmar;
}

// Banner de consentimiento + centro de preferencias granular (P22). Isla de cliente:
// en producción el default denegado ya lo fijó consent-init (beforeInteractive) antes
// de GTM; aquí se recoge la elección, se persiste y se aplica al Consent Mode.
//
// Se monta en TODOS los entornos desde P37.5975 (antes solo en producción, colgado
// del gate de GTM). Fuera de producción no hay contenedor que lea el `dataLayer`, así
// que aplicar el consentimiento es un no-op y lo único que ocurre de verdad es la
// escritura en `localStorage` — pero la interfaz existe y se puede revisar, que es lo
// que no pasaba: era la única superficie del sitio imposible de mirar antes de
// publicarla.
export function ConsentBanner({
  dict,
  lang,
}: {
  dict: ConsentDict;
  lang: string;
}) {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const policyHref = `${lang === "es" ? "" : `/${lang}`}/cookies`;

  // Lectura de localStorage tras el montaje (no existe en SSR): si no hay decisión,
  // se muestra el banner. El SSR renderiza sin banner, así que no hay desajuste de
  // hidratación. Las escrituras de estado van envueltas en funciones (el efecto no
  // las llama directas), como en `nav.tsx`.
  useEffect(() => {
    let desarmarVisto: (() => void) | undefined;
    const applyStored = () => {
      const stored = readConsent();
      if (stored) {
        setAnalytics(stored.analytics);
        setMarketing(stored.marketing);
      } else {
        setBannerOpen(true);
        // Aquí y no en el render: este es el único punto del componente donde
        // consta que el diálogo se le enseña a alguien que aún no ha decidido.
        // Pero «se le enseña a alguien» hay que comprobarlo, no suponerlo: lo que
        // se arma es la espera de una señal de persona (D200).
        desarmarVisto = cuentaVistoTrasInteraccion();
      }
    };
    applyStored();
    // El footer (u otra pieza) puede reabrir las preferencias con este evento.
    const open = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setPrefsOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => {
      window.removeEventListener(OPEN_CONSENT_EVENT, open);
      desarmarVisto?.();
    };
  }, []);

  // Sincroniza el <dialog> nativo con el estado (showModal atrapa el foco y ESC lo
  // cierra; el foco vuelve solo al elemento previo).
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (prefsOpen && !el.open) el.showModal();
    if (!prefsOpen && el.open) el.close();
  }, [prefsOpen]);

  function decide(choice: ConsentChoice) {
    // SOLO CUENTA LA PRIMERA DECISIÓN DE CADA NAVEGADOR, y hay que mirarlo ANTES
    // de guardar. `decide` es la puerta de las tres formas de decidir —aceptar
    // todo, rechazar todo y guardar preferencias— y también la del centro de
    // preferencias cuando se reabre desde el pie. Sin esta guarda, quien cambia
    // de opinión suma una decisión más contra un «visto» que solo contó una vez,
    // y `aceptado + rechazado` puede superar al denominador.
    //
    // Se apoya en el registro que ya existe en vez de en una marca nueva: si
    // había decisión previa, esto es un cambio de opinión y no una conversión.
    const esPrimeraDecision = readConsent() === null;
    // Y EL «VISTO» SE ASEGURA ANTES DE LA DECISIÓN (D200). Decidir es la señal de
    // persona más fuerte que hay, pero puede llegar por una vía que la puerta de
    // arriba no oyó —un `click` sintético, un `Enter` que el botón traduce, o el
    // desarme por desmontaje— y sin esto `aceptado + rechazado` podría superar a
    // `visto`, que es justo la cuenta imposible que el resto del módulo evita.
    // `contarVistoUnaVez` es idempotente, así que cuando ya se contó no hace nada.
    if (esPrimeraDecision) contarVistoUnaVez();
    saveConsent(choice);
    // Cuál de los dos sucesos es lo decide `cuentaComoAceptado`, no la etiqueta
    // del botón que se pulsó: por eso significa lo mismo en las tres puertas.
    if (esPrimeraDecision) contar(cuentaComoAceptado(choice));
    setAnalytics(choice.analytics);
    setMarketing(choice.marketing);
    setBannerOpen(false);
    setPrefsOpen(false);
  }

  return (
    <>
      {/* LA LIVE REGION ES ESTE ENVOLTORIO, Y ESTÁ SIEMPRE (P70.08). El aviso no
          se anunciaba al aparecer: quien usa lector recorría las diez secciones
          de la home y el pie entero antes de enterarse de que existe. No
          incumple WCAG —no hay criterio que obligue a anunciar un banner— pero
          es un mecanismo de consentimiento con peso legal, así que la elección
          no puede presentarse de inmediato a unos y de facto la última a otros.

          POR QUÉ EL ENVOLTORIO Y NO `role="status"` EN LA FRANJA: una live
          region tiene que existir en el DOM ANTES de que le entre contenido. La
          franja nace en un efecto —`localStorage` no existe en SSR—, así que
          ponerle el rol a ella la insertaría ya poblada y el anuncio se
          perdería. El envoltorio se renderiza vacío desde el primer pintado.

          Y la franja conserva su `role="region"` con nombre: el rol de live
          region anuncia, pero no es un punto de navegación. Son dos cosas y por
          eso son dos elementos.

          Y NO LLEVA `role="status"`, QUE ES LO QUE SE CORRIGE HOY *(P82)*. El rol
          hace dos cosas a la vez: anuncia —`aria-live="polite"` y
          `aria-atomic="true"` implícitos— **y** expone un elemento que el cursor
          virtual pisa. Vacío, ese elemento no tiene nombre, así que quien usa
          lector se encontraba una parada muda en la SEGUNDA posición del
          documento, en las catorce páginas y en los dos idiomas.

          El envoltorio se queda —es el mecanismo, y sigue siendo bueno—; lo que
          sale es el rol. Un `aria-live` a secas anuncia igual y deja el elemento
          genérico, que es exactamente lo que hacen las otras cuatro live regions
          del repo (`article-islands` ×2 y `copy-button` ×2): esta era la única
          que se desviaba. `aria-atomic` va explícito porque el rol lo traía
          implícito y se quiere el MISMO comportamiento, no uno parecido. */}
      <div aria-live="polite" aria-atomic="true">
        {bannerOpen && !prefsOpen && (
          <div
            role="region"
            aria-label={dict.region}
            className="consent-enter fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[var(--page-x)] z-[60] w-[calc(100%-2*var(--page-x))] max-w-[40rem]"
          >
            <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <div className="min-w-0">
                <p className="font-display text-foreground text-[1.05rem] font-semibold">
                  {dict.title}
                </p>
                <p className="text-muted-foreground mt-1 text-[0.9rem] leading-relaxed">
                  {dict.description}{" "}
                  <a href={policyHref} className="link-content">
                    {dict.policyLink}
                  </a>
                </p>
              </div>
              <div className={BANNER_ACTIONS}>
                <button
                  type="button"
                  className={BTN_GHOST}
                  onClick={() => setPrefsOpen(true)}
                >
                  {dict.preferences}
                </button>
                <button
                  type="button"
                  className={BTN_OUTLINE}
                  onClick={() => decide({ analytics: false, marketing: false })}
                >
                  {dict.rejectAll}
                </button>
                <button
                  type="button"
                  className={BTN_PRIMARY}
                  onClick={() => decide({ analytics: true, marketing: true })}
                >
                  {dict.acceptAll}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="consent-prefs-title"
        onClose={() => setPrefsOpen(false)}
        onCancel={() => setPrefsOpen(false)}
        onClick={(e) => {
          // Clic en el backdrop (fuera del contenido) cierra.
          if (e.target === dialogRef.current) setPrefsOpen(false);
        }}
        className="text-foreground bg-card border-border fixed inset-0 m-auto h-fit max-h-[85vh] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border p-0 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop:bg-black/50"
      >
        <div className="p-5 md:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            {/* EL TÍTULO DEL DIÁLOGO NO ES UN ENCABEZADO, y la diferencia no es
                cosmética (2026-08-30). Era un `h2`, y este diálogo vive en el
                layout: se renderiza cerrado pero PRESENTE en el DOM de las 28
                variantes, y por delante del `<main>` desde P70.08 —que lo puso
                ahí a propósito, para que el orden del documento dijera lo mismo
                que la prominencia visual—. Resultado: el primer encabezado de
                todas las páginas del sitio era «Preferencias de cookies», por
                delante del `h1`.

                NADA LO CAZABA, y son tres guardianes: `check:marco` exige UN solo
                `h1` no vacío, y eso se cumplía; `heading-order` de axe mira saltos
                hacia ABAJO (h2 → h4), y h2 → h1 baja de nivel, que es legal. Lo vio
                un escáner externo leyendo el HTML servido: «first content heading
                is H2, not H1».

                La forma correcta es la que ya usaba la franja doce líneas más
                arriba: un `p` con el mismo aspecto. El diálogo conserva su nombre
                accesible por `aria-labelledby`, que es de donde lo toma un lector
                de pantalla al abrirse —nunca del nivel del encabezado—, así que no
                se pierde nada. Lo vigila ahora `check:marco`. */}
            <p
              id="consent-prefs-title"
              className="font-display text-foreground text-[1.2rem] font-semibold"
            >
              {dict.prefs.title}
            </p>
            <button
              type="button"
              aria-label={dict.close}
              onClick={() => setPrefsOpen(false)}
              // Solo-icono: misma pastilla de hover que el resto del chrome. No la
              // tenía — se escapó en P37.57, que sí cubrió nav y footer.
              className={cn(
                actionVariants({ variant: "icon", size: "icon" }),
                "-mt-1 -mr-1 [--icon-chrome-bg:var(--background)]",
              )}
            >
              {/* Sin `width`/`height`: el tamaño lo pone `size: "icon"`. */}
              <X />
            </button>
          </div>

          <p className="text-muted-foreground text-[0.9rem] leading-relaxed">
            {dict.prefs.intro}
          </p>

          <ul className="mt-4 flex flex-col gap-3">
            <ConsentRow
              title={dict.categories.necessary.title}
              description={dict.categories.necessary.description}
              badge={dict.categories.necessary.badge}
            />
            <ConsentRow
              title={dict.categories.analytics.title}
              description={dict.categories.analytics.description}
              checked={analytics}
              onChange={setAnalytics}
            />
            <ConsentRow
              title={dict.categories.marketing.title}
              description={dict.categories.marketing.description}
              checked={marketing}
              onChange={setMarketing}
            />
          </ul>

          <div className={DIALOG_ACTIONS}>
            <button
              type="button"
              className={BTN_OUTLINE}
              onClick={() => decide({ analytics: false, marketing: false })}
            >
              {dict.rejectAll}
            </button>
            <button
              type="button"
              className={BTN_OUTLINE}
              onClick={() => decide({ analytics: true, marketing: true })}
            >
              {dict.acceptAll}
            </button>
            <button
              type="button"
              className={BTN_PRIMARY}
              onClick={() => decide({ analytics, marketing })}
            >
              {dict.savePreferences}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

// Fila de categoría: texto + switch. Si `onChange` falta, es la categoría necesaria
// (switch fijo en ON, deshabilitado, con etiqueta "siempre activas").
function ConsentRow({
  title,
  description,
  badge,
  checked = true,
  onChange,
}: {
  title: string;
  description: string;
  badge?: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const locked = !onChange;
  const titleId = `consent-cat-${title.replace(/\s+/g, "-").toLowerCase()}`;

  // Categoría necesaria: switch fijo, sin control real; badge "siempre activas".
  if (locked) {
    return (
      <li className="border-border flex items-start justify-between gap-4 rounded-lg border p-3.5">
        <div className="min-w-0">
          <p className="text-foreground text-[0.95rem] font-semibold">
            {title}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[0.85rem] leading-relaxed">
            {description}
          </p>
        </div>
        <Badge className="mt-0.5">{badge}</Badge>
      </li>
    );
  }

  // El <label> envuelve el título/descripción visibles (no un texto vacío): así el
  // control tiene una etiqueta con texto real —sin el "empty form label" que marcaba
  // WAVE— y toda la fila es área clicable. `aria-labelledby` acota el nombre accesible
  // al título; la descripción va como `aria-describedby`.
  const descId = `${titleId}-desc`;
  return (
    <li className="border-border rounded-lg border">
      {/* `items-center`: el control gobierna la fila entera, así que se centra
          contra ella. Estaba en `items-start`, y como el switch vive dentro de su
          objetivo táctil de 44px, su centro caía ~11px por debajo del centro del
          título: ni alineado con el título ni centrado en la fila. Se veía sobre
          todo con descripciones de tres líneas (modal estrecho). El desajuste era
          previo; lo destapó darle contraste a la bolita en P37.593 — con la bolita
          blanca sobre carril casi blanco (1,22:1) no se distinguía dónde estaba. */}
      <label className="flex cursor-pointer items-center justify-between gap-4 p-3.5">
        {/* `span` y no `div`/`p`: el content model de `<label>` es phrasing content,
            así que un `div` o un `p` dentro son inválidos (dos errores del validador
            del W3C). El contenedor no necesita `block` —es flex item, y eso lo
            blockifica—, pero los dos hijos SÍ: sin él quedarían en línea, uno al lado
            del otro. Cero cambio visual con él. */}
        <span className="min-w-0">
          <span
            id={titleId}
            className="text-foreground block text-[0.95rem] font-semibold"
          >
            {title}
          </span>
          <span
            id={descId}
            className="text-muted-foreground mt-0.5 block text-[0.85rem] leading-relaxed"
          >
            {description}
          </span>
        </span>
        {/* @fuera-de-capa: el switch se dibuja con cadena inline y traerlo hecho es lo que
            mandaría la cascada, que aplica hacia delante y no hacia atrás (2026-08-08) */}
        <span className="inline-flex min-h-[44px] shrink-0 items-center">
          <input
            type="checkbox"
            role="switch"
            className="peer sr-only"
            checked={checked}
            aria-labelledby={titleId}
            aria-describedby={descId}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span
            aria-hidden="true"
            // La bolita es el `foreground` de su propio carril: `--foreground`
            // sobre el carril apagado (`--muted`), `--primary-foreground` sobre el
            // encendido (`--primary`). Antes era `bg-white` fijo — el único color
            // hardcodeado del sitio y el único que no conmutaba con el tema— y
            // fallaba el 3:1 de componente en DOS de las cuatro combinaciones:
            // 1,22:1 en claro-apagado (bolita blanca sobre carril casi blanco) y
            // 2,03:1 en oscuro-encendido (blanca sobre el cian aclarado). Medido en
            // navegador, no estimado; con los tokens da 12,47/12,04 apagado y
            // 7,93/8,36 encendido — este último es el par «texto sobre botón» que
            // BRAND.md ya tenía verificado.
            // Este control es la ÚNICA excepción a «ningún control se escribe a
            // mano»: está documentada con fecha en BRAND.md §Ningún control se
            // escribe a mano. La regla de shadcn (D6) aplica hacia delante, así
            // que no lo reescribe; la excepción caduca el día que aparezca un
            // SEGUNDO switch. Lo de arriba justifica el COLOR, no la excepción.
            // El anillo de foco lleva su offset del color de la superficie que hay
            // detrás (`--card`, la del diálogo): sin declararlo, Tailwind usa blanco
            // y en tema oscuro dibujaba un halo claro alrededor del control.
            className="bg-muted peer-checked:bg-primary peer-focus-visible:ring-ring peer-focus-visible:ring-offset-card after:bg-foreground peer-checked:after:bg-primary-foreground relative h-6 w-11 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:shadow-sm after:transition-transform peer-checked:after:translate-x-5 motion-reduce:transition-none motion-reduce:after:transition-none"
          />
        </span>
      </label>
    </li>
  );
}
