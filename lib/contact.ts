// Fuente única de los datos de contacto (email, teléfono, LinkedIn). Misma
// disciplina de fuente única que los tokens de marca (D4) y `cvPath` (D22):
// todo el sitio importa de aquí, nunca hardcodea el dato en el componente.

export const EMAIL = "franciscojavier.lopezmartinez@gmail.com";

export const PHONE_TEL = "+34629832720";
export const PHONE_DISPLAY = "629 832 720";

export const LINKEDIN_URL = "https://www.linkedin.com/in/franciscolopez1975/";
export const LINKEDIN_DISPLAY = "linkedin.com/in/franciscolopez1975";

// El repositorio de ESTE sitio. Vive aquí y no en el footer porque es el mismo
// tipo de dato que los de arriba: un canal público que puede citarse en más de
// un sitio. Enlazarlo solo tiene sentido desde que el repo es público.
export const GITHUB_URL =
  "https://github.com/franciscoylopez/francisco-lopez-website";
export const GITHUB_DISPLAY = "github.com/franciscoylopez";

/**
 * El `mailto:` del sitio, con asunto OPCIONAL. El asunto entra por parámetro y
 * no vive aquí porque es COPY: se traduce, y solo lo tiene la superficie que lo
 * necesita. La misma pieza sirve a las tres superficies de contacto (D29), y un
 * asunto de accesibilidad en el CTA de contratación de la home sería peor que
 * no tener ninguno.
 */
export function mailtoHref(subject?: string): string {
  return subject
    ? `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${EMAIL}`;
}
