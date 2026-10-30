"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HandHeart, LogOut, PawPrint, Users } from "lucide-react";
import { cerrarSesion } from "@/lib/actions/auth";

const items = [
  { etiqueta: "Mascotas", href: "/admin/mascotas", icono: PawPrint },
  { etiqueta: "Adoptantes", href: "/admin/adoptantes", icono: Users },
  { etiqueta: "Donaciones", href: "/admin/donaciones", icono: HandHeart },
];

export default function Sidebar({ sesion }) {
  const ruta = usePathname();

  return (
    <aside className="flex flex-col gap-4 border-b border-[#eee5e8] bg-surface p-5 md:min-h-screen md:border-b-0 md:border-r md:py-[30px] md:px-5">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50">
          <PawPrint size={26} strokeWidth={2} aria-hidden="true" className="text-primary" />
        </span>
        <span className="font-display text-lg font-semibold leading-none text-ink">
          <span className="text-primary-600">Huellitas</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[1.7px] text-ink-500">
            Panel del refugio
          </span>
        </span>
      </Link>

      <nav aria-label="Panel del refugio">
        <ul className="flex gap-1 overflow-x-auto md:flex-col">
          {items.map((item) => {
            const activo = ruta.startsWith(item.href);
            const Icono = item.icono;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={activo ? "page" : undefined}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-[13px] px-3.5 py-3 text-[14px] font-bold transition duration-200 ${
                    activo ? "bg-primary-50 text-[#b74581]" : "text-ink-700 hover:bg-[#f9f9f9]"
                  }`}
                >
                  <Icono size={20} strokeWidth={2} aria-hidden="true" />
                  {item.etiqueta}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="md:mt-auto">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] bg-secondary text-[13px] font-extrabold text-secondary-ink">
            {String(sesion?.nombre ?? "?").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-extrabold text-ink">{sesion?.nombre ?? "Sin sesión"}</p>
            <p className="truncate text-[11px] uppercase tracking-[1.7px] text-ink-500">{sesion?.rol ?? "—"}</p>
          </div>
        </div>

        <Link
          href="/"
          className="mb-2 block rounded-[12px] bg-blue-50 px-3 py-2.5 text-center text-[13px] font-bold text-info-700"
        >
          Volver al sitio
        </Link>

        <form action={cerrarSesion}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-[12px] px-3 py-2.5 text-[13px] font-bold text-ink-500 transition duration-200 hover:bg-primary-50 hover:text-[#b74581]"
          >
            <LogOut size={18} strokeWidth={2} aria-hidden="true" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
