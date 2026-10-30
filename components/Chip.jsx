import Link from "next/link";

// Chip de filtro (píldora) de STYLEGUIDE.md: reposo blanco, activo rosa, "Todos" en verde oscuro.
const reposo =
  "rounded-pill border border-border-soft bg-surface px-5 py-[11px] text-[13px] font-bold text-ink-500 transition duration-200 hover:bg-primary-50 hover:text-[#b74581]";
const activoRosa =
  "rounded-pill border border-primary-200 bg-primary-50 px-5 py-[11px] text-[13px] font-bold text-[#b74581] shadow-[0_3px_0_#f9a8d4]";
const activoOscuro =
  "rounded-pill border border-forest bg-forest px-5 py-[11px] text-[13px] font-bold text-[#faf7f0]";

export default function Chip({ children, href, activo = false, tono = "rosa", className = "" }) {
  const clases = [
    "inline-flex items-center justify-center",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 focus-visible:shadow-[0_0_0_3px_#fce7f3]",
    activo ? (tono === "oscuro" ? activoOscuro : activoRosa) : reposo,
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={clases} aria-current={activo ? "page" : undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={clases} aria-pressed={activo}>
      {children}
    </button>
  );
}
