/**
 * Congela transiciones y animaciones, y fuerza el reflow que las resuelve al
 * estado final. Devuelve la función que lo deshace. Sin esto se MIDE A MEDIO
 * CAMINO.
 *
 * No es teórico: llamar al censo dos veces conmutando el tema —que es el uso que
 * este archivo documenta arriba y la mitad del trabajo de una auditoría— daba
 * cuatro pares fantasma de 1,06 · 1,11 · 1,42 · 2,05 en la segunda llamada, o sea
 * el aspecto exacto de un fallo catastrófico, y la página estaba perfecta: eran
 * las tarjetas y los enlaces todavía interpolando su color. `.link-content` tarda
 * 380ms (0,3s con 0,08s de retardo), así que cualquier espera «prudente» de 300 o
 * 400ms cae justo dentro. Esperar más no es la solución —es la misma apuesta con
 * otro número—; la solución es que no haya nada que esperar.
 *
 * Vale también para el pase de hover: el clon adopta el estado final de golpe en
 * vez de arrancar una transición que nadie va a esperar. Es la lección de D35 —
 * un elemento se quedaba clavado en su color de reposo— vista desde el medidor.
 *
 * ESTÁ SUELTA A PROPÓSITO (P37.6595): **axe la necesita igual y no la tenía**.
 * Conmutar el tema y lanzar axe sin congelar da siete violaciones fantasma
 * (`#005859` sobre `#191d21`) con la página perfecta — el mismo fallo, en la otra
 * herramienta. Antes de un `axe.run()`:
 *
 *     const descongelar = window.freezeMotion();
 *     const r = await axe.run();
 *     descongelar();
 */
window.freezeMotion = () => {
  const freeze = document.createElement("style");
  freeze.textContent =
    "*,*::before,*::after{transition:none !important;animation:none !important;}";
  document.head.appendChild(freeze);
  void document.body.offsetHeight;
  return () => freeze.remove();
};

/**
 * Enciende TODOS los reveals, y devuelve cuántos ha tenido que encender.
 *
 * POR QUÉ (P50.79, 2026-08-28). `.reveal-on [data-reveal]` sin `[data-shown]` es
 * `opacity: 0`, y **axe excluye del contraste todo lo que tiene un ancestro
 * invisible**. Medido en `/accesibilidad`: en frío la página tenía 8 de 29 reveals
 * encendidos y axe devolvía **2 nodos** en `incomplete`; con los 29 encendidos,
 * **44**. O sea que la primera pasada de cada sesión miraba una fracción de la
 * página y el informe se leía igual de limpio. Es el modo de fallo de la casa: un
 * metro que devuelve menos de lo que hay parece un aprobado.
 *
 * NO SIRVE HACER SCROLL Y ESPERAR, que es lo que hacía el censo: bajar al 50% y
 * esperar 900ms encendió **9 de 29**, porque el `IntersectionObserver` solo dispara
 * lo que cruza en ese momento. Encenderlos a mano es determinista y no depende de
 * un reloj.
 *
 * DEVUELVE LA CIFRA a propósito, para que quien mida pueda decir sobre cuánta
 * página ha medido. Y no se revierte: encendido es el estado final de la página,
 * no un apaño para la foto.
 */
window.mostrarReveals = () => {
  const ocultos = [...document.querySelectorAll("[data-reveal]")].filter(
    (el) => !el.hasAttribute("data-shown"),
  );
  for (const el of ocultos) el.setAttribute("data-shown", "");
  void document.body.offsetHeight;
  return {
    encendidos: ocultos.length,
    total: document.querySelectorAll("[data-reveal]").length,
  };
};
/** Redondeo a dos decimales, que es la unidad en la que se publican las cifras. */
