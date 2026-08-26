"use client";

// @pieza primitiva · design-system/07-botones.tsx · La facade de vídeo de terceros: póster propio y el clic como gate (D55).

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Vídeo de terceros incrustado con FACADE: hasta que alguien pulsa, en la página
// no hay iframe, no hay JS de YouTube y no sale una sola petición a Google. Lo que
// se pinta es un póster AUTO-HOSPEDADO (`public/img/`) y un disco de play.
//
// LAS TRES COSAS QUE RESUELVE, Y NINGUNA ES OPCIONAL (PRD-Historical §43):
//
//  1. PESO. El reproductor de YouTube son cientos de KB de JS antes de que nadie
//     decida verlo, en una página que ya carga un dibujo grande. Con el facade se
//     pagan los 44 KB del póster y nada más.
//  2. PRIVACIDAD. El póster no se sirve desde `i.ytimg.com` sino desde este
//     dominio, a propósito: tirar del thumbnail de Google haría exactamente la
//     petición a un tercero que el facade viene a evitar, y encima obligaría a
//     ampliar `img-src`. Se descarga una vez y se versiona.
//  3. CONSENTIMIENTO. El clic ES el gate. No hace falta colgarlo de la categoría
//     `analytics` ni de `marketing` (`lib/consent.ts`) porque antes del clic no
//     hay nada que consentir —ningún almacenamiento, ninguna petición—, y el clic
//     es un acto explícito e informado: el pie dice qué va a pasar al pulsar. Es
//     el patrón click-to-load, y es más estricto que gatearlo por categoría, no
//     menos: quien acepte todas las cookies TAMPOCO carga YouTube sin pulsar.
//
// El `title` del iframe no es decorativo: es lo único que un lector de pantalla
// tiene para saber qué hay dentro del marco (punto 8 del checklist).
export function VideoEmbed({
  id,
  poster,
  title,
  playLabel,
}: {
  /** Id del vídeo en YouTube. */
  id: string;
  /** Ruta del póster auto-hospedado. */
  poster: string;
  /** Qué se ve en el vídeo: título del iframe y parte de la etiqueta del botón. */
  title: string;
  /** Verbo de la acción («Reproducir el vídeo»), traducido. */
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-xl border">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          // `autoplay=1` porque el usuario YA ha pulsado play: sin él habría que
          // pulsar dos veces para una sola intención. `rel=0` limita los vídeos
          // sugeridos del final al mismo canal.
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          // El objetivo táctil es el póster ENTERO, no el disco: muy por encima
          // de los 44px del punto 3 del checklist. El anillo de foco lo pone la
          // regla global `:focus-visible` de `globals.css`.
          className="video-facade absolute inset-0 block h-full w-full"
          aria-label={`${playLabel}: ${title}`}
        >
          {/* `alt` vacío A PROPÓSITO: el botón ya lleva su etiqueta, y repetirla
              en la imagen haría que un lector de pantalla anunciara lo mismo dos
              veces. La imagen aquí es decoración de un control ya nombrado. */}
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 736px"
            className="object-cover"
          />
          <span
            aria-hidden
            // El centrado (`translate(-50%,-50%)`) lo pone `.video-play` en
            // `globals.css`, no una utilidad: comparte `transform` con el hover
            // y D35 pide que los dos extremos vivan en la misma regla.
            className="video-play absolute top-1/2 left-1/2 flex h-16 w-16 items-center justify-center rounded-full"
          >
            {/* El triángulo va RELLENO: un play contorneado a este tamaño se lee
                como un icono de sistema y no como el botón de reproducir. Es el
                único sitio del sitio donde un lucide lleva `fill`. */}
            <Play className="ml-[3px] h-7 w-7 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
