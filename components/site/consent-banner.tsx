"use client";

import { useEffect, useRef, useState } from "react";

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

const BTN =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 text-[0.9rem] font-semibold transition-colors";
const BTN_PRIMARY = cn(
  BTN,
  "bg-primary text-primary-foreground hover:bg-primary/90",
);
const BTN_OUTLINE = cn(
  BTN,
  "border-border bg-background text-foreground hover:bg-muted border",
);
const BTN_GHOST = cn(
  BTN,
  "text-foreground hover:bg-muted underline-offset-4 hover:underline",
);

// Banner de consentimiento + centro de preferencias granular (P22). Isla de cliente:
// el default denegado ya lo fijó consent-init (beforeInteractive) antes de GTM; aquí
// se recoge la elección, se persiste y se aplica al Consent Mode. Solo se monta en
// producción (gate por GTM_ID en el layout).
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
          className="consent-enter fixed inset-x-0 bottom-0 z-[60] px-[var(--page-x)] pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="border-border bg-card mx-auto flex max-w-[var(--container)] flex-col gap-4 rounded-xl border p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] md:flex-row md:items-center md:gap-6 md:p-6">
            <div className="min-w-0 flex-1">
              <p className="font-display text-foreground text-[1.05rem] font-semibold">
                {dict.title}
              </p>
              <p className="text-muted-foreground mt-1 text-[0.9rem] leading-relaxed">
                {dict.description}{" "}
                <a
                  href={policyHref}
                  className="text-foreground underline underline-offset-4"
                >
                  {dict.policyLink}
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:flex-nowrap md:justify-end">
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
              className="border-border bg-background text-foreground -mt-1 -mr-1 inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md border"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
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

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
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
  return (
    <li className="border-border flex items-start justify-between gap-4 rounded-lg border p-3.5">
      <div className="min-w-0">
        <p
          id={titleId}
          className="text-foreground text-[0.95rem] font-semibold"
        >
          {title}
        </p>
        <p className="text-muted-foreground mt-0.5 text-[0.85rem] leading-relaxed">
          {description}
        </p>
      </div>
      {locked ? (
        <span className="text-muted-foreground border-border bg-muted mt-0.5 shrink-0 rounded-full border px-2.5 py-1 text-[0.75rem] font-medium">
          {badge}
        </span>
      ) : (
        <label className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center">
          <input
            type="checkbox"
            role="switch"
            className="peer sr-only"
            checked={checked}
            aria-labelledby={titleId}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span
            aria-hidden="true"
            className="bg-muted peer-checked:bg-primary peer-focus-visible:ring-ring relative h-6 w-11 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5 motion-reduce:transition-none motion-reduce:after:transition-none"
          />
        </label>
      )}
    </li>
  );
}
