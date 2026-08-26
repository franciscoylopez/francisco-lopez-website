"use client";

// @pieza primitiva · design-system/02-tokens.tsx · El botón que lleva un valor al portapapeles, con su confirmación anunciada.

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { actionVariants } from "@/components/ui/action";
import { cn } from "@/lib/utils";

/**
 * Copiar al portapapeles, con la confirmación que se desvanece.
 *
 * NO ES NUEVO: esta mecánica ya existía dentro de `useShareLink`
 * (`article-islands.tsx`), pegada a `window.location.href` y a la capa de
 * artículo. Al aparecer el segundo y el tercer call site —los tokens del Design
 * System y los hexes del Brand Kit (P70.24)— se aplicó la regla que el propio
 * repo ya había escrito ahí: «una lógica de estado con dos call sites no se
 * copia, se comparte».
 *
 * LO QUE DE VERDAD SE COMPARTE NO SON LAS LÍNEAS, ES EL CONTRATO: 1800 ms de
 * confirmación, un anuncio para lector de pantalla, y el fallo en silencio. Si
 * eso vive en dos sitios, uno de los dos deriva —y la parte que derivaría es el
 * anuncio, que es justo la que nadie ve al mirar la página.
 *
 * FALLA EN SILENCIO A PROPÓSITO. `navigator.clipboard` no existe en contextos no
 * seguros y `writeText` puede rechazarse sin que el usuario haya hecho nada mal.
 * Copiar es una comodidad —el valor está escrito al lado, visible y
 * seleccionable—, así que un error aquí no merece una alerta: merece que no pase
 * nada.
 */
export function useCopyToClipboard(resetMs = 1800) {
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sin esto, copiar y navegar antes de los 1800 ms deja un `setState` sobre un
  // componente desmontado. El `ShareActions` original no lo limpiaba porque su
  // isla vive toda la página; una pieza reutilizable no puede suponer eso.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = (value: string, announcement: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setAnnounce(announcement);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          setCopied(false);
          setAnnounce("");
        }, resetMs);
      })
      .catch(() => {});
  };

  return { copied, announce, copy };
}

/**
 * El control.
 *
 * POR QUÉ HAY DOS FORMAS DE DAR EL VALOR. Un bloque de CSS es el mismo se mire
 * como se mire: `value`. El hex de una muestra que conmuta con el tema, no —y
 * **no se puede resolver al renderizar**: quien lo pinta es un Server Component,
 * que no sabe en qué tema está el navegador, y leerlo en el primer render de
 * cliente sería una discrepancia de hidratación esperando a ocurrir. De ahí
 * `valueByTheme`, que se resuelve **en el momento del clic** mirando la clase
 * `.dark` del documento, que es donde `next-themes` deja la verdad.
 *
 * Y NO ES UNA FUNCIÓN, que sería lo obvio, porque cruzando la frontera RSC no
 * viaja: un Server Component no puede pasarle una función a una isla. Un objeto
 * plano sí.
 *
 * EL ANUNCIO NO ES DECORADO, ES EL PUNTO 6 DEL GATE. Un icono que pasa de copia
 * a marca de verificación distingue el estado **por forma**, que es lo que la
 * regla pide de la parte visible; pero un control solo-icono sin nombre no le
 * dice nada a quien no lo ve, y «se ha copiado» es precisamente la información
 * que no está escrita en ningún otro sitio de la página. De ahí que `announce`
 * sea obligatorio y nombre QUÉ se ha copiado, no solo que algo se copió.
 */
export function CopyButton({
  value,
  label,
  announcement,
  copiedLabel,
  onInverted = false,
  className,
}: {
  /**
   * El texto a copiar. Un string cuando no depende del tema; el par
   * `{ light, dark }` cuando sí. Es la misma forma que `Swatch.hex`, y a
   * propósito: así el punto de uso pasa el dato tal cual lo tiene, sin
   * desmontarlo en dos props que luego hay que volver a juntar aquí.
   */
  value: string | { light: string; dark: string };
  /**
   * Nombre accesible del control. No se pinta, y NO lleva el valor dentro: en el
   * caso por tema el valor cambia bajo los pies del rótulo, y un nombre
   * accesible que se reescribe solo es peor que uno estable. Nombra la COSA
   * («Copiar el hex de --background»), no su contenido de ahora mismo.
   */
  label: string;
  /**
   * Lo que se anuncia al lograrlo. Aquí `{value}` SÍ se sustituye por lo
   * copiado, y es donde tiene que estar: el anuncio ocurre después del clic, o
   * sea cuando ya se sabe qué se copió, y es la única forma de que quien no ve
   * la pantalla sepa cuál de los dos hexes se ha llevado.
   */
  announcement: string;
  /**
   * Lo que se PINTA al lograrlo, en una etiqueta anclada al botón.
   *
   * ES OTRA COSA QUE `announcement`, aunque digan lo mismo: el anuncio nombra el
   * valor porque quien no ve la pantalla no puede saber cuál se llevó; la
   * etiqueta no lo nombra porque quien la ve ya lo tiene delante. Dos audiencias,
   * dos textos, y por eso son dos props y no una.
   */
  copiedLabel: string;
  /**
   * Sobre una banda cuyo fondo es `--foreground`. Es §Controles con dos fondos
   * de `BRAND.md`: la pieza es el `foreground` de su propio carril, y en un
   * carril invertido ese `foreground` es `--background`. No lleva borde, así
   * que no pisa nada de lo que D97 resuelve por superficie.
   */
  onInverted?: boolean;
  className?: string;
}) {
  const { copied, announce, copy } = useCopyToClipboard();

  // El tema se lee EN EL CLIC, no al renderizar. `next-themes` escribe la clase
  // `.dark` en <html> (`@custom-variant dark (&:is(.dark *))` en globals.css),
  // así que esa clase es la fuente, y consultarla ya montado no puede
  // desincronizarse de lo que se está viendo.
  const resolve = () => {
    if (typeof value === "string") return value;
    const dark = document.documentElement.classList.contains("dark");
    return dark ? value.dark : value.light;
  };

  const onClick = () => {
    const copiado = resolve();
    if (!copiado) return;
    copy(copiado, announcement.replaceAll("{value}", copiado));
  };

  return (
    <>
      {/* EL CHECK SOLO NO ORIENTA (P70.31). Un icono que pasa de copia a marca de
          verificación dice que ALGO pasó, y en una rejilla de nueve tarjetas con
          un botón cada una no dice ni qué ni cuál. La asimetría lo delataba: el
          `aria-live` de abajo ya daba la frase completa, así que la única persona
          informada era la que no ve la pantalla.

          NI TOOLTIP NI TOAST. Un tooltip aparece en HOVER y esta confirmación
          llega después de un CLIC, que en táctil no tiene hover: sería invisible
          en móvil justo donde más falta hace. Un toast pide dependencia y saca la
          confirmación del sitio donde ocurrió la acción. Esto es una etiqueta
          anclada al propio botón: sin portal, sin posicionamiento en JS, sin
          nada que instalar.

          Y VA ABSOLUTA A PROPÓSITO. Si creciera dentro del flujo, el botón
          engordaría ~70px y empujaría al hex que tiene al lado en la tarjeta del
          Brand Kit —un salto de layout a los 1.800 ms y otro a la vuelta—. Fuera
          del flujo, el control conserva su caja y su suelo táctil de 44px intacto
          en los dos estados.

          `aria-hidden` porque el `aria-live` ya lo anuncia: sin él, un lector de
          pantalla lo diría dos veces. */}
      <span className={cn("relative inline-flex shrink-0", className)}>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className={cn(
            actionVariants({ variant: "ghost", size: "icon" }),
            onInverted &&
              "text-background hover:bg-background/15 focus-visible:bg-background/15",
          )}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </button>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-md px-2 py-[0.2rem] text-[0.72rem] font-medium whitespace-nowrap transition-opacity duration-150 motion-reduce:transition-none",
            // La etiqueta se apoya en el carril contrario al del botón, igual que
            // el propio botón hace con su `onInverted`: sobre la banda invertida
            // el fondo de la página ES `--foreground`, así que la pastilla tiene
            // que volver a `--background` para verse. Es el par de texto
            // principal en los dos casos, ya medido por el censo; no estrena
            // ningún color.
            onInverted
              ? "bg-background text-foreground"
              : "bg-foreground text-background",
            copied ? "opacity-100" : "opacity-0",
          )}
        >
          {copiedLabel}
        </span>
      </span>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </>
  );
}
