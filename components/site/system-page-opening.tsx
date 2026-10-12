import { type ReactNode } from "react";

import { LEAD_SIZE, LEADING, SectionHeader } from "@/components/ui/heading";
import { FOLD_CRUMB, FOLD_GROUP, HERO_ROW, WRAP } from "@/components/ui/layout";
import { StatRow } from "@/components/ui/stat-row";
import { cn } from "@/lib/utils";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";

/**
 * LA APERTURA COMPARTIDA (P63.5, 2026-08-29). Nació para las tres páginas que
 * documentan el sistema —Brand Kit, Design System y Accesibilidad— y hoy la usa
 * también el índice de Trayectoria (P72.465, 2026-09-04).
 *
 * CUÁNTAS SON NO SE ESCRIBE AQUÍ: se cuentan sus llamadas, o se lanza
 * `npm run pliegue`, que las detecta en el DOM. Este mismo párrafo decía «tres»
 * el día que ya eran cuatro.
 *
 * POR QUÉ ES UNA PIEZA Y NO VARIAS COPIAS, que es lo único que la justifica:
 * estas aperturas comparten una INVARIANTE, no un aspecto. **Cuál es, cuántas
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
 * misma con un mando.
 *
 * Y EL CRITERIO PARA ENTRAR, que hasta ahora no hacía falta escribir porque las
 * tres primeras nacieron juntas: se entra cuando la apertura tiene composición
 * decorativa Y fila de cifras. Trayectoria no las tenía y por eso escribía su
 * apertura a mano; en cuanto las ganó, dejó de PARECERSE a estas y pasó a ser la
 * misma cosa.
 *
 * ═══ LO QUE LE PIDE A QUIEN ENTRE DESPUÉS, y no se ve leyendo el código ═══
 *
 * **EL `h1` TIENE QUE CABER EN UNA LÍNEA.** Dentro de `HERO_ROW` la columna de
 * texto mide **611px a 1920** —no el ancho del contenedor—, así que a `page`
 * (80px) solo caben unos catorce caracteres por línea. Los tres titulares
 * originales son rótulos cortos («Brand Kit», «Design System»), y por eso nadie
 * lo había notado: cabían por casualidad, no por diseño.
 *
 * Medido con el cuarto caso, que llegó con un titular largo: a 80px caía a
 * CUATRO líneas, la fila de texto se iba de 304 a 503 y el grupo de 464 a 655,
 * o sea que `npm run pliegue` se ponía rojo. Con la fila de cifras puesta no hay
 * holgura que lo absorba.
 *
 * **Y LO ARREGLA EL COPY, NO EL CSS**, que es la parte contraintuitiva: el
 * titular pasó a «Mi Trayectoria» y el grupo volvió a 464 sin tocar una regla.
 * Antes de meter una quinta apertura aquí, mírale el titular.
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
  leadMeasure,
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
   * LA MEDIDA de la entradilla y nada más: `max-w-[46ch]`. Va en el punto de uso
   * porque las tres traen entradillas de largo distinto y cuántos caracteres
   * caben por línea es decisión de copy.
   *
   * EL TAMAÑO NO, y por eso ya no cabe aquí. Estaba en el punto de uso y las
   * tres habían divergido: Brand Kit servía `clamp(1,0625rem…1,25rem)` contra
   * el `clamp(1,05rem…1,2rem)` de sus dos hermanas —y del de Contacto, que
   * comparte pliegue sin compartir bloque—, sin nada escrito que lo
   * justificara. Un valor que tienen que compartir tres páginas no se escribe
   * tres veces: se sube a la capa (D34).
   */
  leadMeasure: string;
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
                  className={cn(
                    LEAD_SIZE,
                    LEADING.lead,
                    "text-muted-foreground",
                    leadMeasure,
                  )}
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
