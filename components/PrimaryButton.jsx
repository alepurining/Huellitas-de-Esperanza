import Link from "next/link";

// Píldora plana de STYLEGUIDE.md: h52 (md/full), radio 100px, Nunito 800 15px.
const tamanos = {
  sm: "h-10 px-[18px] text-[13px]",
  md: "h-[52px] px-6 text-[15px]",
  full: "h-[52px] w-full px-6 text-[15px]",
};

export default function PrimaryButton({
  children,
  href,
  tamano = "md",
  type = "button",
  icono: Icono,
  className = "",
  ...resto
}) {
  const clases = [
    "inline-flex items-center justify-center gap-4 rounded-pill bg-primary-600",
    "font-sans font-extrabold leading-[1.2] text-white",
    "transition duration-200 ease-out",
    "hover:translate-y-0.5 hover:bg-primary-700",
    "active:translate-y-[3px] active:brightness-95",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 focus-visible:shadow-[0_0_0_3px_#fce7f3]",
    "disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-ink-300 disabled:opacity-70 disabled:hover:translate-y-0",
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
