"use client";

import { Download, Mail, Phone } from "lucide-react";

import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { trackContactClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  EMAIL,
  LINKEDIN_DISPLAY,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/contact";

import { LinkedinIcon } from "@/components/ui/icons";

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

// La receta de estos enlaces ya no vive aquí: es `shape: "inline"` de la capa de
// chrome (P37.656). Era una constante local con la métrica escrita a mano —suelo
// de 44px y área de clic ampliada con márgenes negativos— y existía por el motivo
// correcto (que hubiera UNA receta), pero de las catorce del sitio: la capa la
// generaliza. Aquí solo queda el tamaño de texto, que es tipografía de la sección.

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
//
// Esa dirección visible ADEMÁS es un `mailto:` desde P37.5987. Antes era texto
// plano, y el motivo escrito arriba justificaba que se mostrara, no que no fuera
// accionable — respondía a otra pregunta. Las dos cosas son compatibles: sigue
// escrita y copiable (no se sustituye por «Escríbeme»), y encima se puede pulsar.
// Lleva tratamiento de CHROME y no de contenido (H1) por el mismo motivo,
// documentado, que `ContactSecondary` justo debajo: un subrayado permanente con su
// propio hover a 15px de un CTA sólido compite con él en vez de acompañarlo. No es
// un criterio nuevo, es el mismo caso.
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
        className={actionVariants({ variant: "solid", size: "lg" })}
      >
        {/* El icono se escribe SIEMPRE primero; la variante `solid` es la que lo
            manda detrás de la etiqueta y le da el empujón de 2px en hover. Antes
            iba detrás en el JSX y con su tamaño y su clase de movimiento a mano
            —`.contact-cta` en globals.css—, que es lo que hacía que la demo de
            esta misma variante en el Design System no se moviera (P37.5988). */}
        <Mail aria-hidden="true" />
        {label}
      </a>
      {showAddress && (
        <p className="m-0 mt-[0.9rem]">
          <a
            href={`mailto:${EMAIL}`}
            onClick={() => trackContactClick("email")}
            className={cn(
              chromeLinkVariants(),
              "text-muted-foreground text-[0.9rem] break-all",
            )}
          >
            {EMAIL}
          </a>
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
  // Los tres llevan icono porque los tres sacan al usuario de la página: uno abre
  // el marcador del teléfono, otro se va a LinkedIn y el tercero descarga un
  // archivo (regla del icono, P37.5988). El tamaño ya no se escribe aquí: lo pone
  // `.link-chrome svg` en globals.css, igual que `size` lo pone en las acciones
  // con caja.
  const link = cn(chromeLinkVariants(), "text-[0.95rem]");
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
          <Phone aria-hidden="true" />
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
          <LinkedinIcon />
          {dict.linkedinLabel}
        </a>
      </li>
      <li>
        <a href={cvHref} download className={link}>
          <Download aria-hidden="true" />
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
