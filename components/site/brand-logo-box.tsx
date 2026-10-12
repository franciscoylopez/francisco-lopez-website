import Image from "next/image";

import { Tile } from "@/components/ui/tile";

// Logo de marca monocromo (empresa/herramienta/institución) en su caja, con swap
// claro/oscuro por CSS puro (D6/§16). Decorativo (aria-hidden, alt=""). `fill` +
// object-contain preserva el aspecto sin necesidad de conocer las dimensiones.
//
// LA CAJA YA NO ES SUYA: la pone `Tile` (P83.5). Esta pieza se queda en `site/`
// porque sabe algo de ESTE sitio —la convención de `/logos/<nombre>-{light,dark}`—
// y eso es justo lo que D36 usa para decidir el lado. Lo que no sabía nada del
// sitio era el recuadro, y por eso subió.
//
// Y SE FUE LA PROP `className`, que era la grieta: existía para que Formación
// pudiera pasarle `h-10 w-10`, o sea para decidir el tamaño desde el punto de
// uso. Ahora el tamaño lo pone la pieza y no hay por dónde discrepar.
export function BrandLogoBox({ name }: { name: string }) {
  return (
    <Tile decorative>
      <Image
        src={`/logos/${name}-light.png`}
        alt=""
        fill
        sizes="48px"
        className="object-contain p-[0.35rem] dark:hidden"
      />
      <Image
        src={`/logos/${name}-dark.png`}
        alt=""
        fill
        sizes="48px"
        className="hidden object-contain p-[0.35rem] dark:block"
      />
    </Tile>
  );
}
