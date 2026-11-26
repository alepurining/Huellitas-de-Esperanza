"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { confirmarRecepcionDonacion } from "@/lib/actions/donaciones";
import ConfirmModal from "@/components/ConfirmModal";
import PrimaryButton from "@/components/PrimaryButton";

/** Confirmación accesible para marcar como recibido un aporte pendiente (ISO/IEC 25010). */
export default function ConfirmarRecepcion({ donacionId, nombreDonante }) {
  const [abierto, setAbierto] = useState(false);
  const [estado, accion, enviando] = useActionState(confirmarRecepcionDonacion, null);
  const formularioRef = useRef(null);

  useEffect(() => {
    if (estado?.error) setAbierto(false);
  }, [estado]);

  return (
    <>
      <form ref={formularioRef} action={accion}>
        <input type="hidden" name="id" value={donacionId} />
        <PrimaryButton
          type="button"
          tamano="sm"
          onClick={() => setAbierto(true)}
          disabled={enviando || Boolean(estado?.error)}
        >
          Marcar recibido
        </PrimaryButton>
      </form>

      {estado?.error ? (
        <p
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-[12px] font-semibold leading-[1.5] text-danger-700"
        >
          <CircleAlert size={14} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
          {estado.error}
        </p>
      ) : null}

      <ConfirmModal
        abierto={abierto}
        kicker="Confirmar recepción"
        titulo="¿Marcar este aporte como recibido?"
        descripcion={`Confirmas que recibiste el aporte de ${nombreDonante}. El cambio quedará registrado en el historial de donaciones.`}
        textoConfirmar="Sí, marcar recibido"
        varianteConfirmar="primary"
        enviando={enviando}
        alConfirmar={() => {
          if (!enviando) formularioRef.current?.requestSubmit();
        }}
        alCancelar={() => {
          if (!enviando) setAbierto(false);
        }}
      />
    </>
  );
}
