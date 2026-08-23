"use client";

import { ArrowRight } from "lucide-react";

import { actionVariants } from "@/components/ui/action";
import { trackContactClick } from "@/lib/analytics";
import { EMAIL, mailtoHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

export type ContactActionsDict = {
  emailCta: string;
};

// Las dos superficies de contacto que NO son la página de contacto (D29), que
// desde P67 es donde vive la conversación entera.
//
// QUÉ SE FUE DE AQUÍ, Y POR QUÉ NO ES UNA PÉRDIDA. Esta pieza tenía además una
// fila de canales de apoyo —teléfono, LinkedIn y CV— repetida bajo el CTA de la
// home y de Sobre mí. Con `/contacto` publicada, esa fila decía por segunda vez
// lo que la página dice mejor: allí los canales son tarjetas pulsables con su
// rótulo, y aquí eran tres enlaces compitiendo con el único botón que la franja
// necesita. Se retiró el 2026-08-23, y con ella se fueron el tratamiento de
// chrome que arrastraba —que ya era una excepción documentada— y la regla que lo
// sustituía, porque una regla sin caso no es una regla.
//
// Lo que NO se fue: `shape: "inline"` de `chrome.tsx`, que parecía quedarse
// huérfano y no lo está. Lo usan los tres enlaces de la navegación de capítulos
// del artículo largo. Se comprobó antes de proponer retirarlo.

/**
 * El CTA de la franja de cierre de la home y de Sobre mí. Único botón sólido de
 * esas dos páginas, y lo que hace es LLEVAR A `/contacto`, no abrir el correo.
 *
 * SÍ LLEVA ICONO, y no contradice la regla del icono: la variante `solid` es su
 * excepción POR FORMA, no por caso (`BRAND.md` §Cuándo una acción lleva icono).
 * Ahí el glifo no clasifica la acción —es la única de la pantalla, no hay nada
 * que distinguir—, marca **la dirección del viaje**, y por eso va detrás de la
 * etiqueta y avanza 2px en hover. Una flecha es exactamente eso; un sobre habría
 * prometido un cliente de correo que ya no se abre.
 */
export function ContactCta({
  label,
  href,
  className = "",
}: {
  label: string;
  href: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <a
        href={href}
        className={actionVariants({ variant: "solid", size: "lg" })}
      >
        {/* El icono se escribe SIEMPRE primero; `solid` es quien lo manda detrás
            y le da el empujón. Escribirlo aquí al final es el fallo que hacía que
            la demo del Design System no se moviera (P37.5988). */}
        <ArrowRight aria-hidden="true" />
        {label}
      </a>
    </div>
  );
}

/**
 * La dirección de correo, visible y pulsable. Es lo único que queda del bloque
 * de contacto de Accesibilidad (P67), y ahí NO hay botón a propósito: esa página
 * no enruta al formulario, porque obligar a usarlo para reportar una barrera
 * sería una trampa el día que la barrera fuera el formulario. Con la dirección
 * escrita basta, y encima lleva el asunto preencabezado.
 *
 * ESCRITA Y COPIABLE, no escondida tras un «Escríbeme»: quien use tecnología de
 * asistencia puede necesitar escribir desde su propio cliente o anotarla. Va en
 * variante de contenido como el resto del sitio desde que se retiró la excepción
 * de chrome.
 */
export function EmailLink({
  subject,
  className = "",
}: {
  /** Preencabeza el asunto. Solo lo usa Accesibilidad: ver D29. */
  subject?: string;
  className?: string;
}) {
  return (
    <p className={cn("m-0", className)}>
      <a
        href={mailtoHref(subject)}
        onClick={() => trackContactClick("email")}
        className="link-content text-[0.95rem] [overflow-wrap:anywhere]"
      >
        {EMAIL}
      </a>
    </p>
  );
}
