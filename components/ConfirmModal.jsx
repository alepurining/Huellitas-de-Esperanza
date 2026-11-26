"use client";

import { useEffect, useRef } from "react";
import { Loader2, TriangleAlert, X } from "lucide-react";
import OutlineButton from "@/components/OutlineButton";
import PrimaryButton from "@/components/PrimaryButton";

/** Modal accesible de confirmación para acciones críticas o irreversibles (ISO/IEC 25010). */
export default function ConfirmModal({
  abierto,
  kicker = "Confirmar acción",
  titulo,
  descripcion,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  varianteConfirmar = "primary",
  enviando = false,
  alConfirmar,
  alCancelar,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    function alPresionarTecla(evento) {
      if (evento.key === "Escape" && !enviando) {
        alCancelar();
      }
    }

    document.addEventListener("keydown", alPresionarTecla);
    document.body.style.overflow = "hidden";

    const primerBoton = panelRef.current?.querySelector("button:not([disabled])");
    primerBoton?.focus();

    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.body.style.overflow = "";
    };
  }, [abierto, enviando, alCancelar]);

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

  if (!abierto) return null;

  const clasesDanger =
    varianteConfirmar === "danger"
      ? "bg-danger hover:bg-danger-700"
      : "";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[rgba(50,41,47,0.55)] p-4 backdrop-blur-[8px]"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget && !enviando) {
          alCancelar();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmacion"
        aria-describedby="descripcion-confirmacion"
        onKeyDown={atraparFoco}
        className="relative w-full max-w-[540px] rounded-modal bg-bg p-[27px] shadow-modal md:p-[33px]"
      >
        <button
          type="button"
          onClick={alCancelar}
          disabled={enviando}
          aria-label="Cerrar"
          className="absolute right-5 top-5 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-primary-50 text-primary-600 transition duration-200 hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </button>

        <div className="flex items-start gap-4 pr-10">
          <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[18px] bg-warning-50">
            <TriangleAlert size={26} strokeWidth={2} aria-hidden="true" className="text-warning-700" />
          </span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
              {kicker}
            </p>
            <h2
              id="titulo-confirmacion"
              className="mt-1 font-display text-[23px] leading-[1.15] text-ink md:text-[27px]"
            >
              {titulo}
            </h2>
          </div>
        </div>

        <p
          id="descripcion-confirmacion"
          className="mt-4 text-[14px] leading-[1.7] text-ink-700"
        >
          {descripcion}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <OutlineButton type="button" onClick={alCancelar} disabled={enviando}>
            {textoCancelar}
          </OutlineButton>
          <PrimaryButton
            type="button"
            onClick={alConfirmar}
            disabled={enviando}
            className={clasesDanger}
          >
            {enviando ? (
              <>
                <Loader2 size={18} strokeWidth={2} aria-hidden="true" className="animate-spin" />
                Confirmando…
              </>
            ) : (
              textoConfirmar
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
