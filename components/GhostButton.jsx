import Link from "next/link";

// Variante ghost / link de STYLEGUIDE.md. `tono="oscuro"` es para bandas oscuras.
const tonos = {
  claro: "text-[#b74581] hover:bg-primary-50 hover:underline",
  oscuro: "text-gold hover:bg-white/10 hover:underline",
};

export default function GhostButton({
  children,
  href,
  tono = "claro",
  icono: Icono,
  className = "",
  ...resto
}) {
  const clases = [
    "inline-flex h-11 items-center justify-center gap-2 rounded-pill px-4",
    "font-sans text-[13px] font-extrabold leading-[1.2]",
    "transition duration-200 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 focus-visible:shadow-[0_0_0_3px_#fce7f3]",
    "motion-reduce:transition-none",
    tonos[tono] ?? tonos.claro,
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
    <button type="button" className={clases} {...resto}>
      {contenido}
    </button>
  );
}
