"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, PawPrint, X } from "lucide-react";
import SecondaryButton from "@/components/SecondaryButton";

const enlaces = [
  { etiqueta: "Inicio", href: "/#inicio" },
  { etiqueta: "Cómo ayudar", href: "/#ayudar" },
  { etiqueta: "Nosotros", href: "/#nosotros" },
  { etiqueta: "Ubicación", href: "/#ubicacion" },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;

    function alPresionarTecla(evento) {
      if (evento.key === "Escape") setAbierto(false);
    }

    document.addEventListener("keydown", alPresionarTecla);
    return () => document.removeEventListener("keydown", alPresionarTecla);
  }, [abierto]);

  return (
    <header className="sticky top-0 z-40 border-b border-border-pink bg-[rgba(255,250,250,0.94)] backdrop-blur-xl">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between px-[15px] md:h-[100px] md:px-8 xl:px-20"
      >
        <Link href="/" className="flex items-center gap-3" onClick={() => setAbierto(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50">
            <PawPrint size={26} strokeWidth={2} aria-hidden="true" className="text-primary" />
          </span>
          <span className="leading-none">
            <span className="block whitespace-nowrap font-display text-[19px] font-semibold leading-none text-ink md:text-[23px]">
              <span className="text-primary-600">Huellitas</span> de Esperanza
            </span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[1.7px] text-ink-500">
              Refugio · Medellín
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-[34px] md:flex">
          {enlaces.map((enlace) => (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                className="text-[14px] font-bold text-ink-700 transition duration-200 hover:text-primary"
              >
                {enlace.etiqueta}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <SecondaryButton href="/login">
            Iniciar sesión
          </SecondaryButton>
        </div>

        <button
          type="button"
          onClick={() => setAbierto((valor) => !valor)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600 md:hidden"
        >
          {abierto ? (
            <X size={20} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Menu size={20} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </nav>

      {abierto ? (
        <div
          id="menu-movil"
          className="absolute left-[15px] right-[15px] top-[calc(100%+8px)] rounded-card bg-surface p-5 shadow-menu md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  onClick={() => setAbierto(false)}
                  className="block rounded-[13px] px-3 py-3 text-[15px] font-bold text-ink-700 hover:bg-primary-50 hover:text-[#b74581]"
                >
                  {enlace.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
          <SecondaryButton href="/login" tamano="full" className="mt-3" onClick={() => setAbierto(false)}>
            Iniciar sesión
          </SecondaryButton>
        </div>
      ) : null}
    </header>
  );
}
