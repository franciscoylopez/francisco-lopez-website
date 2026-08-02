// Copy de las páginas-sistema (404 y error). Vive FUERA del diccionario runtime
// (es.json / en.json) a propósito, siguiendo el precedente de D22 (el texto rico del
// CV vive en scripts/cv/content.*.ts, no en el diccionario): el error boundary es un
// componente de CLIENTE que se renderiza justo cuando el pipeline normal puede estar
// roto, así que no debe depender de getDictionary (server-only) ni arrastrar los
// diccionarios completos al bundle de cliente. Módulo pequeño, tipado, con ES como
// fuente de verdad y EN revisado contra el ES (D20). Client/edge-safe (sin
// `server-only`): lo consumen el not-found de servidor y el error boundary de cliente.

import type { Locale } from "./config";

// El ES fija la forma; `en` se tipa contra ella, de modo que una clave que falte en
// inglés es error de compilación (mismo criterio que el diccionario, dictionaries.ts).
type SystemMessages = {
  homeAria: string;
  home: string;
  notFound: { code: string; title: string; body: string };
  error: { title: string; body: string; retry: string };
};

const es: SystemMessages = {
  homeAria: "Inicio — Francisco López",
  home: "Volver al inicio",
  notFound: {
    code: "Error 404",
    title: "Página no encontrada",
    body: "La página que buscas no existe o se ha movido.",
  },
  error: {
    title: "Algo ha ido mal",
    body: "Se ha producido un error inesperado. Puedes reintentarlo o volver al inicio.",
    retry: "Reintentar",
  },
};

const en: SystemMessages = {
  homeAria: "Home — Francisco López",
  home: "Back to home",
  notFound: {
    code: "Error 404",
    title: "Page not found",
    body: "The page you’re looking for doesn’t exist or has moved.",
  },
  error: {
    title: "Something went wrong",
    body: "An unexpected error occurred. You can try again or go back home.",
    retry: "Try again",
  },
};

const messages: Record<Locale, SystemMessages> = { es, en };

export const getSystemMessages = (locale: Locale): SystemMessages =>
  messages[locale];
