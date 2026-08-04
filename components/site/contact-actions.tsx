"use client";

import { Download, Mail, Phone } from "lucide-react";

import { trackContactClick } from "@/lib/analytics";
import {
  EMAIL,
  LINKEDIN_DISPLAY,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/contact";

import { LinkedinIcon } from "./icons";

export type ContactActionsDict = {
  emailCta: string;
  phoneLabel: string;
  linkedinLabel: string;
  cvCta: string;
};

// Superficie de contacto compartida — UN solo patrón de "hablemos" para los tres
// puntos que antes divergían: la franja de cierre de la home, el cierre de Sobre mí
// y el "reportar una barrera" de Accesibilidad (que usaba un outline con el email
// entero dentro del botón). Datos vía `lib/contact.ts`, nunca hardcodeados.
//
// Jerarquía deliberada: el email es la métrica primaria (PRD §7), así que es el
// ÚNICO botón sólido del sitio; el resto de canales son enlaces de apoyo. El
// tracking de clics (P30) se cablea aquí, en un solo sitio, no en tres.

// Botón de email. `.contact-cta` resuelve hover/foco sin bajar contraste; el
// anillo de foco lo pone la regla global.
//
// `showAddress` muestra la dirección debajo, y por defecto NO lo hace: junto a un
// botón que ya dice "Escríbeme" es redundante, y donde acompaña a teléfono y
// LinkedIn tampoco hace de plan B (si el `mailto:` no abre nada, quedan esos dos
// canales). Se enciende en Accesibilidad, donde el bloque ES el canal de reporte,
// no hay otro camino al lado, y esconder la dirección tras un `mailto:` sería
// irónico justo en esa página: quien use tecnología de asistencia puede necesitar
// escribir desde su propio cliente o anotarla.
export function EmailCta({
  label,
  showAddress = false,
  className = "",
}: {
  label: string;
  showAddress?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <a
        href={`mailto:${EMAIL}`}
        onClick={() => trackContactClick("email")}
        className="contact-cta bg-primary text-primary-foreground inline-flex min-h-[48px] items-center gap-[0.6rem] rounded-md px-[1.6rem] text-[1rem] font-semibold no-underline"
      >
        {label}
        <Mail className="contact-cta-icon size-[18px]" aria-hidden="true" />
      </a>
      {showAddress && (
        <p className="contact-dim m-0 mt-[0.9rem] text-[0.9rem] break-words">
          {EMAIL}
        </p>
      )}
    </div>
  );
}

// Canales de apoyo: teléfono, LinkedIn y CV. Enlaces de texto (no botones) para
// que la jerarquía sea inequívoca. Cada uno ≥44px de alto (checklist a11y §3) y
// con nombre accesible explícito donde el texto visible no basta por sí solo.
export function ContactSecondary({
  dict,
  cvHref,
  className = "",
}: {
  dict: ContactActionsDict;
  cvHref: string;
  className?: string;
}) {
  // Excepción a la regla de dos capas de BRAND.md: aunque son acciones (no
  // navegación), llevan tratamiento de chrome (`.link-chrome`, sin subrayado) en
  // vez de contenido — el subrayado + hover propio al lado del CTA sólido
  // generaba ruido visual (feedback 2026-08-04). Probablemente se resuelva de
  // otra forma cuando exista una sección de contacto dedicada.
  const link =
    "link-chrome text-foreground inline-flex min-h-[44px] items-center gap-[0.55rem] px-[0.6rem] py-[0.35rem] -mx-[0.6rem] -my-[0.35rem] text-[0.95rem]";
  const icon = "size-[17px] flex-none";
  return (
    <ul
      // `gap-y` solo actúa cuando la fila envuelve (en móvil los tres canales no
      // caben en una línea): sin él, dos objetivos táctiles de 44px quedan pegados.
      className={`m-0 flex list-none flex-wrap items-center gap-x-[clamp(1.25rem,3.5vw,2.5rem)] gap-y-2 p-0 ${className}`}
    >
      <li>
        <a
          href={`tel:${PHONE_TEL}`}
          aria-label={`${dict.phoneLabel}: ${PHONE_DISPLAY}`}
          onClick={() => trackContactClick("phone")}
          className={link}
        >
          <Phone className={icon} aria-hidden="true" />
          <span className="[font-variant-numeric:tabular-nums]">
            {PHONE_DISPLAY}
          </span>
        </a>
      </li>
      <li>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${dict.linkedinLabel}: ${LINKEDIN_DISPLAY}`}
          className={link}
        >
          <LinkedinIcon className={icon} aria-hidden="true" />
          {dict.linkedinLabel}
        </a>
      </li>
      <li>
        <a href={cvHref} download className={link}>
          <Download className={icon} aria-hidden="true" />
          {dict.cvCta}
        </a>
      </li>
    </ul>
  );
}

// Conjunto completo (email + canales de apoyo), que es como aparece en la franja
// de la home y en el cierre de Sobre mí. Accesibilidad usa solo `EmailCta`: ahí el
// canal es reportar una barrera, no la conversación de contratación.
export function ContactActions({
  dict,
  cvHref,
  className = "",
}: {
  dict: ContactActionsDict;
  cvHref: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <EmailCta label={dict.emailCta} />
      <ContactSecondary
        dict={dict}
        cvHref={cvHref}
        className="mt-[clamp(1.5rem,3vw,2rem)]"
      />
    </div>
  );
}
