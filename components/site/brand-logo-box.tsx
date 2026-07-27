import Image from "next/image";

// Logo de marca monocromo (empresa/herramienta/institución) en su caja, con swap
// claro/oscuro por CSS puro (D6/§16). Decorativo (aria-hidden, alt=""). `fill` +
// object-contain preserva el aspecto sin necesidad de conocer las dimensiones.
export function BrandLogoBox({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={
        "border-border relative flex flex-none items-center justify-center overflow-hidden rounded-md border " +
        (className ?? "h-[2.1rem] w-[2.1rem]")
      }
    >
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
    </span>
  );
}
