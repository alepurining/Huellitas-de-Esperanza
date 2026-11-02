"use client";

import { useEffect, useRef, useState } from "react";
import { HeartHandshake, X } from "lucide-react";
import SolicitudAdopcionForm from "@/components/SolicitudAdopcionForm";
import PrimaryButton from "@/components/PrimaryButton";

export default function AdoptionModal({ mascota }) {
  const [abierto, setAbierto] = useState(false);
  const disparadorRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    function alPresionarTecla(evento) {
      if (evento.key === "Escape") cerrar();
    }

    document.addEventListener("keydown", alPresionarTecla);
    document.body.style.overflow = "hidden";
    const primerCampo = panelRef.current?.querySelector("input, select, textarea");
    const primerBoton = panelRef.current?.querySelector("button");
    (primerCampo ?? primerBoton)?.focus();

    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  function cerrar() {
    setAbierto(false);
    disparadorRef.current?.querySelector("button")?.focus();
  }

  // Foco atrapado dentro del modal mientras está abierto.
  function atraparFoco(evento) {
    if (evento.key !== "Tab" || !panelRef.current) return;

    const enfocables = panelRef.current.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
    );
    if (enfocables.length === 0) return;

    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  return (
    <>
      <div ref={disparadorRef}>
        <PrimaryButton onClick={() => setAbierto(true)} icono={HeartHandshake}>
          Quiero conocer a {mascota.nombre}
        </PrimaryButton>
      </div>

      {abierto ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[rgba(50,41,47,0.55)] p-4 backdrop-blur-[8px]"
          onClick={(evento) => {
            if (evento.target === evento.currentTarget) cerrar();
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-solicitud"
            onKeyDown={atraparFoco}
            className="relative my-6 w-full max-w-[650px] rounded-modal bg-bg p-[27px] shadow-modal md:p-[33px]"
          >
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="absolute right-5 top-5 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-primary-50 text-primary-600 transition duration-200 hover:bg-primary-200"
            >
              <X size={20} strokeWidth={2} aria-hidden="true" />
            </button>

            <div className="flex items-start gap-4 pr-10">
              <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[18px] bg-primary-50">
                <HeartHandshake size={26} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
                  Postular a adopción
                </p>
                <h2
                  id="titulo-solicitud"
                  className="mt-1 font-display text-[23px] leading-[1.15] text-ink md:text-[29px]"
                >
                  Solicitud para adoptar a {mascota.nombre}
                </h2>
              </div>
            </div>

            <SolicitudAdopcionForm
              mascotas={[mascota]}
              mascotaInicial={mascota}
              alCancelar={cerrar}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
