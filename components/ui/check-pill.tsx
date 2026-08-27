// @pieza primitiva · design-system/11-accesibilidad.tsx · La marca de verificación de un checklist: pastilla teñida y su check.

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * LA MARCA DE VERIFICACIÓN de un checklist: una pastilla teñida de cian con un
 * check dentro (P70.44, 2026-08-26).
 *
 * POR QUÉ EXISTE. Estaba escrita a mano TRES VECES en DOS archivos, y la cadena
 * `color-mix(in oklch, var(--primary), transparent 86%)` aparecía literal en las
 * tres. Dos de ellas son `/accesibilidad` y `/design-system` §11: las dos páginas
 * cuyo argumento entero es que el sistema es coherente. Si el check cambiaba en
 * una, la página que DOCUMENTA el sistema pasaba a enseñar algo que la página
 * real no tiene, que es justo el fallo que la Fase 0 de `design-review` busca por
 * nombre. Misma forma que P70.22 y P70.38: una pieza repetida que sale a la capa.
 *
 * ESTÁ EN `ui/` Y NO EN `site/` porque no sabe nada de este sitio: no conoce
 * copy, ni rutas, ni secciones (frontera de D36).
 *
 * EL `aria-hidden` LO PONE LA PIEZA, no el call site. Esta marca es SIEMPRE
 * decorativa: en las dos listas el punto del checklist lo dice el texto de al
 * lado, y en el collage la ilustración entera ya está oculta. Dejarlo en el punto
 * de uso es cómo se escapa —de las tres copias, la del collage no lo llevaba— y
 * es una decisión de accesibilidad, que es de las que no se repiten a mano.
 *
 * POR QUÉ NO DECLARA `data-surface`, que es lo que `BRAND.md` §El atenuado lo
 * pone la superficie le exige a un bloque que se pinta su propia superficie con
 * `color-mix`. Aquí NO aplica, y conviene que esté escrito para que no se
 * «arregle» al revés: el velo es un 86% TRANSPARENTE, así que la superficie que
 * manda sigue siendo la de debajo —`bg-card` en las dos listas, `bg-background`
 * en el collage— y esa ya se hereda correctamente. Declarar una familia aquí
 * sería fijar la equivocada en dos de los tres usos.
 */

/**
 * Los dos tamaños, y no son «grande y pequeño».
 *
 * · `md` es LA MARCA: la de un punto de checklist, en las dos listas reales.
 * · `sm` es la del COLLAGE decorativo del hero de `/accesibilidad`, donde la
 *   pastilla es una coordenada de un dibujo a escala —como los marcos de
 *   dispositivo o el «0» del 404 (`CLAUDE.md` §Tokens, excepción de las
 *   ilustraciones)—, no una variante más pequeña del sistema.
 *
 * Si aparece un tercer tamaño, la pregunta antes de añadir un número es cuál de
 * los dos casos es. El glifo mide 15px en los dos a propósito: en la pastilla
 * chica llena el hueco, que es lo que hace que se lea a esa escala.
 */
const CAJA = {
  md: "h-[26px] w-[26px] rounded-[7px]",
  sm: "h-[18px] w-[18px] rounded-[5px]",
} as const;

export function CheckPill({
  size = "md",
  className,
}: {
  size?: keyof typeof CAJA;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "text-primary inline-flex flex-none items-center justify-center",
        CAJA[size],
        className,
      )}
      style={{
        background: "color-mix(in oklch, var(--primary), transparent 86%)",
      }}
    >
      <Check className="size-[15px]" />
    </span>
  );
}
