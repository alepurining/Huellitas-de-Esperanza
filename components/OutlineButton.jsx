import Link from "next/link";

// Variante outline de STYLEGUIDE.md: transparente, borde suave, hover rosa claro.
const tamanos = {
  sm: "h-10 px-[18px] text-[13px]",
  md: "h-[52px] px-6 text-[15px]",
  full: "h-[52px] w-full px-6 text-[15px]",
};

export default function OutlineButton({
  children,
  href,
  tamano = "md",
  type = "button",
  icono: Icono,
  className = "",
  ...resto
}) {
  const clases = [
    "inline-flex items-center justify-center gap-4 rounded-pill border border-border bg-transparent",
    "font-sans font-extrabold leading-[1.2] text-ink",
    "transition duration-200 ease-out",
    "hover:translate-y-0.5 hover:bg-primary-50",
    "active:translate-y-[3px] active:brightness-95",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 focus-visible:shadow-[0_0_0_3px_#fce7f3]",
    "disabled:cursor-not-allowed disabled:text-ink-300 disabled:opacity-70",
    "motion-reduce:transform-none motion-reduce:transition-none",
    tamanos[tamano] ?? tamanos.md,
    className,
  ].join(" ");

  const contenido = (
    <>
      {Icono ? <Icono size={20} strokeWidth={2} aria-hidden="true" /> : null}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={clases} {...resto}>
        {contenido}
      </Link>
    );
  }

  return (
    <button type={type} className={clases} {...resto}>
      {contenido}
    </button>
  );
}
