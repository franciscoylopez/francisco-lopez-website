"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DIALOG_ACTIONS } from "@/components/site/layout";
import { actionVariants } from "@/components/ui/action";
import {
  type ConsentChoice,
  OPEN_CONSENT_EVENT,
  readConsent,
  saveConsent,
} from "@/lib/consent";
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
    const applyStored = () => {
      const stored = readConsent();
      if (stored) {
        setAnalytics(stored.analytics);
        setMarketing(stored.marketing);
      } else {
        setBannerOpen(true);
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
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
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
    saveConsent(choice);
    setAnalytics(choice.analytics);
    setMarketing(choice.marketing);
    setBannerOpen(false);
    setPrefsOpen(false);
  }

  return (
    <>
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
                <a
                  href={policyHref}
                  className="link-content link-content--underline"
                >
                  {dict.policyLink}
                </a>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
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
            <h2
              id="consent-prefs-title"
              className="font-display text-foreground text-[1.2rem] font-semibold"
            >
              {dict.prefs.title}
            </h2>
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
        <span className="text-muted-foreground border-border bg-muted mt-0.5 shrink-0 rounded-full border px-2.5 py-1 text-[0.75rem] font-medium">
          {badge}
        </span>
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
        <div className="min-w-0">
          <p
            id={titleId}
            className="text-foreground text-[0.95rem] font-semibold"
          >
            {title}
          </p>
          <p
            id={descId}
            className="text-muted-foreground mt-0.5 text-[0.85rem] leading-relaxed"
          >
            {description}
          </p>
        </div>
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
            // 7,10/8,36 encendido — este último es el par «texto sobre botón» que
            // BRAND.md ya tenía verificado.
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
