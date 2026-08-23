"use client";

import { Mail, Phone } from "lucide-react";

import { CARD } from "@/components/ui/layout";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, mailtoHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

import { FichaShell } from "./ficha-shell";

// Tercera ronda: converge sobre TARJETAS con los ajustes de Francisco.
//   · sin el rótulo «Vías de contacto»
//   · sin LinkedIn — quedan dos canales, y se centran en altura contra la cabecera
//   · el formulario, centrado
//
// LinkedIn desaparece de la página entera con este cambio: ya no está aquí ni
// estaba en el formulario, así que su único punto en el sitio pasa a ser el footer.
// Queda anotado porque es una decisión de alcance, no de maquetación.

const CANALES = [
  { icon: Mail, rotulo: "Correo", valor: EMAIL, href: mailtoHref() },
  {
    icon: Phone,
    rotulo: "Teléfono",
    valor: PHONE_DISPLAY,
    href: `tel:${PHONE_TEL}`,
  },
] as const;

/**
 * Cada canal es una tarjeta pulsable entera.
 *
 * OJO SI ESTO SE CONSTRUYE: una tarjeta pulsable NO existe hoy en `action.tsx`.
 * Según la «Regla de construcción», eso no es un caso especial sino una VARIANTE
 * QUE FALTA —algo así como `card-link`— y hay que crearla y publicarla en el
 * Design System antes de dar la tarea por hecha, no escribirla suelta en la
 * página. Aquí va con clases sueltas porque es un prototipo.
 */
export function Tarjetas() {
  return (
    <FichaShell
      channels={
        <ul className="m-0 flex list-none flex-col gap-[0.6rem] p-0">
          {CANALES.map(({ icon: Icon, rotulo, valor, href }) => (
            <li key={valor}>
              <a
                href={href}
                data-surface="card"
                className={cn(
                  CARD,
                  "hover:bg-muted focus-visible:bg-muted flex min-h-[44px] items-center gap-[0.75rem] px-[1rem] py-[0.85rem] no-underline transition-colors",
                )}
              >
                <Icon
                  aria-hidden
                  className="text-muted-foreground size-[18px] shrink-0"
                />
                <span className="min-w-0">
                  <span className="text-muted-foreground block text-[0.75rem] tracking-[0.06em] uppercase">
                    {rotulo}
                  </span>
                  <span className="text-foreground block text-[0.9rem] break-words">
                    {valor}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      }
    />
  );
}
