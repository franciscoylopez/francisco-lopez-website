"use client";

// @pieza primitiva · design-system/02-tokens.tsx · Copiar un valor al portapapeles: directo si hay uno, con menú si hay dos.

import { Check, Copy } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

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
 * LA CONFIRMACIÓN, que es lo que las dos piezas de abajo comparten de verdad.
 *
 * EL CHECK SOLO NO ORIENTA. Un icono que pasa de copia a marca de verificación
 * dice que ALGO pasó, y en una rejilla de nueve tarjetas con un botón cada una no
 * dice ni qué ni cuál. La asimetría lo delataba: el `aria-live` ya daba la frase
 * entera, así que la única persona informada era la que no ve la pantalla.
 *
 * NI TOOLTIP NI TOAST. Un tooltip aparece en HOVER y esto llega después de un
 * CLIC, que en táctil no tiene hover: sería invisible en móvil justo donde más
 * falta hace. Un toast pide dependencia y saca la confirmación del sitio donde
 * ocurrió la acción.
 *
 * VA ABSOLUTA, y anclada al borde DERECHO. Absoluta porque si creciera dentro del
 * flujo empujaría al hex que tiene al lado, un salto de layout a los 1.800 ms y
 * otro a la vuelta. Y a la derecha porque centrada NO CABE: la tarjeta del Brand
 * Kit mide 13rem y lleva `overflow-hidden`, y «#F7F3EC Copiado» son unos 110px
 * sobre un control que vive en el borde. Centrada, la tarjeta la corta —se vio en
 * el prototipo de P70.36, no leyendo el código—. Anclada a la derecha crece hacia
 * dentro, que es donde hay sitio.
 *
 * `aria-hidden` porque el `aria-live` del control ya lo anuncia: sin él, un lector
 * de pantalla lo diría dos veces.
 */
function Confirm({
  text,
  on,
  onInverted,
}: {
  text: string;
  on: boolean;
  onInverted: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-0 bottom-full mb-1 rounded-md px-2 py-[0.2rem] text-[0.72rem] font-medium whitespace-nowrap transition-opacity duration-150 motion-reduce:transition-none",
        // La pastilla se apoya en el carril contrario al del control, igual que
        // hace `onInverted`: sobre la banda invertida el fondo de la página ES
        // `--foreground`, así que vuelve a `--background` para verse. Es el par
        // de texto principal en los dos casos, ya medido por el censo.
        onInverted
          ? "bg-background text-foreground"
          : "bg-foreground text-background",
        on ? "opacity-100" : "opacity-0",
      )}
    >
      {text}
    </span>
  );
}

/** El disparador: mismo aspecto en las dos piezas. */
const trigger = (onInverted: boolean) =>
  cn(
    actionVariants({ variant: "ghost", size: "icon" }),
    onInverted &&
      "text-background hover:bg-background/15 focus-visible:bg-background/15",
  );

type Comun = {
  /**
   * Nombre accesible del control. No se pinta, y NO lleva el valor dentro: un
   * nombre accesible que se reescribe solo es peor que uno estable. Nombra la
   * COSA («Copiar el hex de --background»), no su contenido de ahora mismo.
   */
  label: string;
  /**
   * Lo que se anuncia al lograrlo. `{value}` se sustituye por lo copiado, y es
   * donde tiene que estar: el anuncio ocurre después del clic, o sea cuando ya se
   * sabe qué se copió.
   */
  announcement: string;
  /**
   * Lo que se PINTA al lograrlo. También admite `{value}` —y en el Brand Kit lo
   * lleva, porque «Copiado» a secas no dice cuál de los dos hexes se ha llevado—.
   * Donde lo copiado es un bloque entero de CSS no hay valor corto que nombrar y
   * la plantilla se queda sin `{value}`.
   */
  copiedLabel: string;
  /**
   * Sobre una banda cuyo fondo es `--foreground`. Es §Controles con dos fondos de
   * `BRAND.md`: la pieza es el `foreground` de su propio carril, y en un carril
   * invertido ese `foreground` es `--background`.
   */
  onInverted?: boolean;
  className?: string;
};

/**
 * UN VALOR, UN CLIC.
 *
 * YA NO RESUELVE NADA EN EL CLIC, y esa simplificación la trajo el prototipo. La
 * versión anterior aceptaba también el par `{ light, dark }` y decidía cuál
 * copiar mirando la clase `.dark` del documento, porque quien pinta la tarjeta es
 * un Server Component y no sabe en qué tema está el navegador. Funcionaba, y era
 * la respuesta equivocada: dejaba **inalcanzable el otro hex**, que en un Brand
 * Kit es un valor tan legítimo como el primero. Con la elección explícita
 * (`CopyChoice`), toda esa maquinaria sobra.
 */
export function CopyButton({
  value,
  label,
  announcement,
  copiedLabel,
  onInverted = false,
  className,
}: Comun & { value: string }) {
  const { copied, announce, copy } = useCopyToClipboard();

  return (
    <>
      <span className={cn("relative inline-flex shrink-0", className)}>
        <button
          type="button"
          aria-label={label}
          onClick={() => {
            if (value) copy(value, announcement.replaceAll("{value}", value));
          }}
          className={trigger(onInverted)}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </button>
        <Confirm
          text={copiedLabel.replaceAll("{value}", value)}
          on={copied}
          onInverted={onInverted}
        />
      </span>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </>
  );
}

/**
 * DOS VALORES: se elige cuál, y se elige POR SU NOMBRE.
 *
 * El caso es el token que conmuta con el tema y publica sus dos hexes. Antes se
 * copiaba el del tema activo sin decirlo, así que la mitad del dato de la tarjeta
 * no se podía llevar. Ahora el control abre un menú de dos entradas nombradas.
 *
 * EL WIDGET NO SE ESCRIBE A MANO, y no hace falta bajar hasta shadcn: la
 * plataforma lo trae entero con `popover`, que da capa superior, cierre con
 * `Esc`, cierre al pulsar fuera y devolución del foco al disparador. Es el paso 3
 * de la cascada de `CLAUDE.md` contestado en su primera pregunta.
 *
 * DÓNDE SE COLOCA lo hace `anchor-name` / `position-anchor`, también de
 * plataforma, en la clase `.copy-menu` de `globals.css`. En un navegador que aún
 * no las tenga, un popover sin posicionar se centra en la pantalla: pierde la
 * relación espacial con su botón y **sigue funcionando entero** —etiquetado,
 * copiando, cerrando con `Esc`—. Es degradación aceptable y sin una línea de JS;
 * si algún día deja de serlo, la palanca es posicionar en el evento `toggle`.
 */
export function CopyChoice({
  values,
  label,
  optionLabels,
  announcement,
  copiedLabel,
  onInverted = false,
  className,
}: Comun & {
  /** Los dos valores, en el orden en que se ofrecen. */
  values: { light: string; dark: string };
  /** Cómo se llama cada uno en el menú. */
  optionLabels: { light: string; dark: string };
}) {
  const { copied, announce, copy } = useCopyToClipboard();
  const [ultimo, setUltimo] = useState("");
  const id = useId().replace(/:/g, "");
  const menu = useRef<HTMLDivElement>(null);

  const elegir = (valor: string) => {
    menu.current?.hidePopover();
    copy(valor, announcement.replaceAll("{value}", valor));
    setUltimo(valor);
  };

  const opciones = [
    { k: "light" as const, texto: optionLabels.light, valor: values.light },
    { k: "dark" as const, texto: optionLabels.dark, valor: values.dark },
  ];

  return (
    <>
      <span className={cn("relative inline-flex shrink-0", className)}>
        <button
          type="button"
          aria-label={label}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- `popovertarget` aún no está en los tipos de React
          {...({ popoverTarget: id } as any)}
          style={{ anchorName: `--${id}` } as React.CSSProperties}
          className={trigger(onInverted)}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </button>
        <Confirm
          text={copiedLabel.replaceAll("{value}", ultimo)}
          on={copied}
          onInverted={onInverted}
        />
      </span>

      <div
        ref={menu}
        id={id}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ídem
        {...({ popover: "auto" } as any)}
        style={{ positionAnchor: `--${id}` } as React.CSSProperties}
        className="copy-menu"
      >
        {opciones.map((o) => (
          <button
            key={o.k}
            type="button"
            onClick={() => elegir(o.valor)}
            // SALE DE LA CAPA, compuesto con `cn()` como la variante `card`: de
            // `ghost` vienen la pastilla `muted` del hover, el foco y el suelo de
            // 44px; lo único que se añade aquí es la FORMA de fila —ancho completo
            // y los dos extremos separados—, que no depende de esta pieza sino de
            // vivir dentro de un menú. Escrito a mano se quedaba sin el hover del
            // sistema y sin el radio, y `check:excepciones` lo cazó.
            className={cn(
              actionVariants({ variant: "ghost", size: "sm" }),
              "w-full shrink justify-between gap-3 font-normal",
            )}
          >
            <span className="text-muted-foreground text-[0.68rem] tracking-[0.04em] uppercase">
              {o.texto}
            </span>
            <span className="font-mono">{o.valor}</span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </>
  );
}
