"use client";

import { Download, Mail, Phone } from "lucide-react";

import { actionVariants } from "@/components/ui/action";
import { trackContactClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  EMAIL,
  mailtoHref,
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
// Desde P67 va en variante de CONTENIDO, como todo lo de este archivo: llevaba
// chrome por el mismo motivo que `ContactSecondary`, y ese motivo se retiró con
// la excepción (2026-08-23).
export function EmailCta({
  label,
  href,
  showAddress = false,
  className = "",
  subject,
}: {
  label: string;
  /**
   * A dónde lleva el botón. Sin `href` abre el cliente de correo, que es como
   * nació y como sigue funcionando en Accesibilidad. Con `href` navega DENTRO
   * del sitio, que es lo que hacen la franja de la home y el cierre de Sobre mí
   * desde que existe `/contacto` (P67).
   *
   * Y de esa diferencia cuelgan otras dos, que por eso no se escriben en el call
   * site: el ICONO —la regla mira la acción, y navegar dentro del sitio no saca
   * a nadie de él, así que solo lo lleva el `mailto:`— y el TRACKING, que deja
   * de tener sentido cuando el clic ya no es el contacto sino el paso previo:
   * la métrica primaria pasa a ser el envío del formulario (PRD §7).
   */
  href?: string;
  showAddress?: boolean;
  className?: string;
  /**
   * Asunto del correo, si esta superficie lo necesita. OPCIONAL a propósito: el
   * componente lo comparten la home, Sobre mí y Accesibilidad (D29), y solo la
   * última tiene una petición concreta que preencabezar. Un asunto de
   * accesibilidad en el CTA de contratación de la home sería peor que ninguno.
   */
  subject?: string;
}) {
  return (
    <div className={className}>
      <a
        href={href ?? mailtoHref(subject)}
        onClick={href ? undefined : () => trackContactClick("email")}
        className={actionVariants({ variant: "solid", size: "lg" })}
      >
        {/* El icono se escribe SIEMPRE primero; la variante `solid` es la que lo
            manda detrás de la etiqueta y le da el empujón de 2px en hover. Antes
            iba detrás en el JSX y con su tamaño y su clase de movimiento a mano
            —`.contact-cta` en globals.css—, que es lo que hacía que la demo de
            esta misma variante en el Design System no se moviera (P37.5988).
            Y solo aparece en el caso `mailto:`: ver la nota del prop `href`. */}
        {href ? null : <Mail aria-hidden="true" />}
        {label}
      </a>
      {showAddress && (
        <p className="m-0 mt-[0.9rem]">
          {/* `tone: "muted"` Y NO `text-muted-foreground` a mano, que es como
              estaba (P50.36). La diferencia no se ve en reposo —los dos pintan el
              mismo gris— pero el `tone` trae además el salto a `--foreground` en
              hover y en foco, y sin él este par caía a **6,42 claro / 5,59
              oscuro**: AA, no AAA, justo el caso que D30 prohíbe y que el
              comentario de la variante describe palabra por palabra.

              ERA EL QUINTO USO DEL MISMO FALLO. Cuando se creó el `tone`, cuatro
              de siete usos ya subían el color y el footer y el breadcrumb no; este
              se quedó fuera de aquel recuento porque pisaba el color en el call
              site en vez de omitir la variante. Y sobrevivió año y medio de
              auditorías por la razón que lo hace interesante: **el par solo existe
              mientras el cursor está encima**, y el censo que tenía que verlo
              llevaba roto desde que Chrome soporta CSS Nesting. */}
          {/* DESDE P67 VA EN VARIANTE DE CONTENIDO, como el resto de esta pieza.
              La nota de arriba explica por qué llevaba tratamiento de chrome
              —el mismo motivo que `ContactSecondary`— y ese motivo se retira
              entero con la excepción: aquí ya no hay un CTA sólido a 15px con el
              que competir, porque el sólido de esta página es este mismo bloque.

              Lo que la nota decía de la MEDIDA sigue siendo cierto y ahora lo
              resuelve otro: `.link-content` pinta el texto en `--foreground`, no
              en el atenuado, así que el par no puede caer a AA en hover. */}
          <a
            href={mailtoHref(subject)}
            onClick={() => trackContactClick("email")}
            className="link-content link-content--underline text-[0.9rem] break-all"
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
  // LA EXCEPCIÓN SE RETIRÓ EL 2026-08-23 (P67), y con ella el bloque que la
  // documentaba en `BRAND.md`. Estos tres son acciones, no navegación, así que
  // por regla les tocaba variante de CONTENIDO desde el principio; llevaban
  // chrome porque a 15px de un CTA sólido de correo el subrayado permanente
  // competía con él en vez de acompañarlo (feedback 2026-08-04). Ese motivo se
  // acabó: el sólido de al lado ya no abre el correo, lleva a `/contacto`, y la
  // conversación entera se resuelve allí. Es el desenlace que la propia
  // excepción predijo por escrito.
  //
  // LOS ICONOS SE QUEDAN, y eso sí es regla nueva (BRAND.md, 2026-08-23): los
  // tres sacan al usuario de la página —marcador del teléfono, LinkedIn,
  // descarga—, así que la regla del icono los pide, y la exclusión que hace
  // `.link-content` está escrita contra la PROSA, donde un glifo rompe la línea
  // base. Esto es una fila de canales, no un párrafo.
  //
  // Y LO QUE TRAÍA `chromeLinkVariants` HAY QUE REPONERLO, que es la parte que
  // se olvida al cambiar de capa: el suelo táctil de 44px (checklist §3), la
  // caja flexible que alinea glifo y etiqueta, y el tamaño del icono, que lo
  // ponía `.link-chrome svg` en globals.css y aquí ya no aplica.
  const link = cn(
    "link-content link-content--underline",
    "inline-flex min-h-[44px] items-center gap-[0.5rem] text-[0.95rem]",
    "[&_svg]:size-[17px] [&_svg]:shrink-0",
  );
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
  contactoHref,
  className = "",
}: {
  dict: ContactActionsDict;
  cvHref: string;
  /** Desde P67 el CTA no abre el correo: lleva a la página de contacto. */
  contactoHref: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <EmailCta label={dict.emailCta} href={contactoHref} />
      <ContactSecondary
        dict={dict}
        cvHref={cvHref}
        className="mt-[clamp(1.5rem,3vw,2rem)]"
      />
    </div>
  );
}
