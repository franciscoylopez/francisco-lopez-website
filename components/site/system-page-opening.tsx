import { type ReactNode } from "react";

import { SectionHeader } from "@/components/ui/heading";
import { FOLD_CRUMB, FOLD_GROUP, HERO_ROW, WRAP } from "@/components/ui/layout";
import { StatRow } from "@/components/ui/stat-row";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";

/**
 * LA APERTURA DE LAS TRES PÁGINAS QUE DOCUMENTAN EL SISTEMA — Brand Kit, Design
 * System y Accesibilidad (P63.5, 2026-08-29).
 *
 * POR QUÉ ES UNA PIEZA Y NO TRES COPIAS, que es lo único que la justifica: estas
 * tres aperturas comparten una INVARIANTE, no un aspecto. **Cuál es, cuántas
 * veces se ha roto y con qué cifras, en `components/ui/layout.ts`** —`FOLD_CRUMB`
 * y `FOLD_GROUP`, que son quienes la producen— y en `DECISIONS.md` D144. Aquí
 * solo lo que cambia por existir esta pieza:
 *
 * La vigilaba `npm run pliegue` (D144) y nada más. Con una pieza compartida esa
 * vigilancia pasa a ser RED DE SEGURIDAD en vez de único guardián: tres
 * aperturas no pueden divergir porque son la misma. Es la regla 2 de
 * `BRAND.md` §Cómo se escribe una regla —lo que impide el drift es el recorrido
 * completo, no la disciplina—. Contacto sigue dependiendo solo del gate: no
 * entra en el bloque, y el porqué está más abajo.
 *
 * QUÉ VARÍA, Y ES TODO LO QUE PUEDE VARIAR: el copy, la fila de datos y la
 * composición decorativa de la derecha, que entra por `children`.
 *
 * QUIÉN NO ENTRA, COMPROBADO Y NO SUPUESTO (regla 4 de `BRAND.md`): Contacto.
 * Usa el mismo `FOLD_GROUP`, pero su grupo es un GRID con `content-start` —y ese
 * `content-start` tiene su porqué escrito al lado, en `contacto-pagina.tsx`—, no
 * usa `HERO_ROW` y no tiene fila de cifras. Es otra cosa que se parece, no la
 * misma con un mando. El bloque sirve a tres y está bien.
 *
 * HASTA AQUÍ Y NO MÁS ALLÁ. Lo que sigue pareciéndose entre `brand-kit/index.tsx`
 * y `design-system/index.tsx` (79 de masa para `qlty`) NO sube, y es a propósito:
 * ahí lo que se repite es el SIGNIFICADO —firma, hero, índice, bloques, páginas
 * relacionadas— o sea el hecho de que las tres hermanas son la misma clase de
 * página. Factorizarlo pediría un envoltorio que se tragara justo lo que esos
 * archivos existen para enseñar: el orden de la página, legible de un vistazo.
 * El corte: sube lo que tiene una invariante que proteger; no sube lo que solo
 * comparte silueta.
 */
export function SystemPageOpening({
  crumb,
  breadcrumb,
  homeHref,
  eyebrow,
  title,
  lead,
  leadClassName,
  stats,
  children,
}: {
  crumb: string;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  eyebrow: string;
  title: string;
  lead: string;
  /**
   * Medida y tamaño de la entradilla, que es lo que cada página ajusta a su
   * copy: `max-w-[46ch] text-[clamp(…)]`. Va aquí y no dentro porque las tres
   * traen entradillas de largo distinto y la medida es decisión de página.
   *
   * OJO: hoy Brand Kit trae además un tamaño distinto (1,0625→1,25rem contra
   * 1,05→1,2rem de las otras dos). Eso es DRIFT, no decisión —no hay nada
   * escrito que lo justifique—, y no se unifica aquí porque este refactor se
   * declara transparente (`gate:html` con diff vacío, D42/D45) y cambiarlo
   * movería píxeles. Se arregla en una tarea de copy, no en una de estructura.
   */
  leadClassName: string;
  stats: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)] md:min-h-[calc(100svh-5rem)]">
      {/* LA APERTURA OCUPA EL PLIEGUE (P54, 2026-08-19), con la MISMA constante
          y el mismo guard de breakpoint que el hero de la home
          (`site/hero.tsx`) y que el deep-dive: 5rem es el alto del header
          sticky y `md:` deja el móvil fuera, donde llenar el pliegue no compra
          nada.

          POR QUÉ HACÍA FALTA, medido antes de tocarlo: a 1920×1080 la apertura
          terminaba a 797px y dejaba 283px de hueco por debajo (227 en Design
          System, 234 en Accesibilidad), así que el rótulo de la segunda sección
          asomaba y la primera vista pasaba de ser una portada a ser portada +
          principio de otra cosa. A 2560×1440 el hueco era de 643px.

          Y ES `min-h`, NO `h`: a 1280×618 y 1536×740 —el 1920 de Windows al
          150% y al 125%— esta apertura ya mide MÁS que el pliegue (medido:
          desborda 150 y 51px), así que la regla simplemente no aplica y no
          puede recortar nada. Es D50 al revés.

          El `w-full` de abajo no sobra: al volver flex el contenedor, el
          `mx-auto` de `WRAP` pasa a ser margen del eje transversal y por
          especificación DESACTIVA el stretch, con lo que la caja se encoge a su
          contenido y se desalinea del nav. No da ningún error de compilación. */}
      <div className={`${WRAP} flex w-full flex-1 flex-col`}>
        <div data-reveal className={FOLD_CRUMB}>
          <Breadcrumb
            routeLabel={breadcrumb.routeLabel}
            items={[
              { label: breadcrumb.home, href: homeHref },
              { label: crumb },
            ]}
          />
        </div>
        {/* EL GRUPO VA CENTRADO, como el deep-dive y por la misma razón: una
            portada reparte el aire arriba y abajo, no lo acumula debajo de un
            bloque pegado al breadcrumb. Francisco lo pidió al ver estas tres al
            lado de `/trayectoria`, que ya lo hacía.

            Y AHORA SE PUEDE, que en el primer intento no. Centrar reparte el
            sobrante, así que si los grupos miden distinto el eyebrow cae a
            distinta altura en cada página — que es exactamente lo que pasó (h1 a
            406, 378 y 409). Lo que lo arregla no es el anclaje: es que los tres
            grupos midan LO MISMO, y de eso se encargan el `min-h` de `HERO_ROW`
            y las composiciones compactadas. Con eso hecho, centrar es seguro. */}
        <div className={FOLD_GROUP}>
          <div className={HERO_ROW}>
            {/* `self-start`: la fila sigue centrada —la composición decorativa
              queda equilibrada frente al texto— pero la COLUMNA DE TEXTO se ancla
              arriba. Sin eso el hueco breadcrumb→eyebrow lo decidía el alto de la
              ilustración: la fila la manda el elemento más alto y `items-center`
              empuja al otro, así que el eyebrow caía a 72px en Brand Kit (texto más
              alto que su composición), 83 en Design System y 99 en Accesibilidad
              (composición 54px más alta que el texto → 27 de empuje). Tres alturas
              distintas en tres páginas hermanas, y NO lo causaba el pliegue: venía
              de antes. Con esto, 72 en las tres. */}
            <div className="min-w-[min(100%,18rem)] flex-[1.2_1_24rem] self-start">
              <SectionHeader
                eyebrow={eyebrow}
                title={title}
                level={1}
                size="page"
                reveal
              >
                <p
                  data-reveal
                  className={`text-muted-foreground ${leadClassName} leading-[1.6]`}
                >
                  {lead}
                </p>
              </SectionHeader>
            </div>
            {children}
          </div>
          <StatRow>{stats}</StatRow>
        </div>
      </div>
    </section>
  );
}
