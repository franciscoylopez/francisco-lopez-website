"use client";

import type { ReactNode } from "react";

import { LEAD_GAP, SectionHeader } from "@/components/ui/heading";
import { PANEL, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

import { ErrorSummary, Field, Legal, Sent, Submit } from "./parts";
import { COPY, useContactForm } from "./use-contact-form";

// SEGUNDA RONDA (riff sobre Ficha). La estructura ya NO es lo que se compara:
// queda fija aquí y lo único que diverge entre variantes es el bloque de canales,
// que entra por el slot `channels`.
//
//   cabecera (eyebrow + h1 a la izquierda · canales a la derecha)
//   ───────────────────────────── separador
//   formulario
//
// La cabecera copia la forma de la apertura del Design System —`HERO_ROW` con
// `size="page"`— porque es la que Francisco señaló: allí la derecha la ocupa una
// ilustración y aquí la ocupan los canales, que es el mismo papel estructural.
// No se usa `HERO_ROW` literal porque su `md:min-h-[19rem]` existe para cuadrar
// las TRES páginas que documentan el sistema entre sí (ver su comentario), y esta
// no es una de ellas: heredarlo metería un agujero bajo la cabecera.

export function FichaShell({ channels }: { channels: ReactNode }) {
  const form = useContactForm();

  return (
    <div className={cn(WRAP, "py-[clamp(3rem,7vw,6rem)]")}>
      {/* REJILLA, y no una fila de dos columnas, por una razón concreta: los canales
          se centran en altura contra LA ENTRADILLA, no contra la cabecera entera.
          Para eso tienen que COMPARTIR FILA con ella, así que la cabecera se parte
          en dos filas —titular arriba, entradilla abajo— y los canales ocupan la
          segunda de la columna derecha. Con un `flex` de dos columnas eso no se
          puede expresar: el centrado sería contra el bloque completo.

          El hueco titular→entradilla NO se escribe aquí: es `LEAD_GAP.page` (24px),
          el mismo valor que pone `SectionHeader` cuando lleva `children`. Se importa
          en vez de copiarse, que es lo que pide D34 y lo que evita que este bloque
          se desincronice el día que ese hueco cambie. */}
      <div className="grid items-start gap-x-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,22rem)]">
        <div className={cn(LEAD_GAP.page, "lg:col-start-1 lg:row-start-1")}>
          <SectionHeader
            eyebrow={COPY.eyebrow}
            title={COPY.title}
            level={1}
            size="page"
          />
        </div>

        <p className="text-muted-foreground m-0 max-w-[44ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6] lg:col-start-1 lg:row-start-2">
          {COPY.lead}
        </p>

        {/* Apilado en móvil, el hueco lo pone este margen; en la rejilla de dos
            columnas se anula y manda el centrado vertical. */}
        <div className="mt-[clamp(2rem,4vw,2.5rem)] lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-center">
          {channels}
        </div>
      </div>

      <div className="border-border mt-[clamp(2.5rem,5vw,4rem)] border-t pt-[clamp(2.5rem,5vw,4rem)]">
        <div
          className={cn(
            PANEL,
            "mx-auto max-w-[52rem] p-[clamp(1.5rem,3vw,2.25rem)]",
          )}
          data-surface="card"
        >
          {form.phase === "sent" ? (
            <div className="proto-enter">
              <Sent form={form} tone="card" />
            </div>
          ) : (
            <form
              onSubmit={form.submit}
              noValidate
              className="flex flex-col gap-[1.1rem]"
            >
              <div>
                <h2 className="font-display text-foreground m-0 text-[1.35rem] font-semibold">
                  {COPY.formTitle}
                </h2>
                <p className="text-muted-foreground m-0 mt-[0.3rem] text-[0.875rem]">
                  {COPY.respuesta}
                </p>
              </div>
              <ErrorSummary form={form} />
              {/* Dos columnas para los cortos: bajo una cabecera a ancho completo,
                  una sola columna de campos deja el bloque encogido y descentrado. */}
              <div className="grid grid-cols-1 gap-[1.1rem] sm:grid-cols-2">
                <Field form={form} name="nombre" look="boxed" />
                <Field form={form} name="email" look="boxed" />
              </div>
              <Field
                form={form}
                name="mensaje"
                look="boxed"
                multiline
                rows={5}
              />
              <Submit form={form} />
              <Legal />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
