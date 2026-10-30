import Link from "next/link";
import { PawPrint } from "lucide-react";

const enlaces = [
  { etiqueta: "Mascotas", href: "/mascotas" },
  { etiqueta: "Cómo ayudar", href: "/#ayudar" },
  { etiqueta: "Nosotros", href: "/#nosotros" },
  { etiqueta: "Iniciar sesión", href: "/login" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#454c58] text-on-dark">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-6 px-4 py-10 text-center md:flex-row md:items-start md:justify-between md:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <PawPrint size={24} strokeWidth={2} aria-hidden="true" className="text-primary-200" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold">Huellitas de Esperanza</p>
            <p className="text-[10px] font-bold uppercase tracking-[1.7px] text-on-dark/70">
              Refugio · Medellín
            </p>
          </div>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <ul className="flex flex-wrap items-center justify-center gap-5">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className="text-[13px] font-bold transition duration-200 hover:text-primary-200"
                >
                  {enlace.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="max-w-[260px] text-[11px] leading-[1.4] text-on-dark/70">
          Proyecto de clase. Cifras, fotos y contactos son de muestra: no hay adopciones ni cobros
          reales.
        </p>
      </div>
    </footer>
  );
}
