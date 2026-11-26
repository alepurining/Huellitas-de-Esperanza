"use client";

import { useActionState, useRef, useState } from "react";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { actualizarEstadoSolicitud } from "@/lib/actions/solicitudes";
import ConfirmModal from "@/components/ConfirmModal";

const ESTADOS = [
  { valor: "en_revision", etiqueta: "En revisión", clase: "border-border bg-warning-50 text-warning-700" },
  { valor: "aprobada", etiqueta: "Aprobar solicitud", clase: "border-border bg-success-50 text-success-700" },
  { valor: "rechazada", etiqueta: "Rechazar solicitud", clase: "border-border bg-danger-50 text-danger-700" },
];

const CONSECUENCIAS = {
  aprobada:
    "Aprobar esta solicitud marcará la mascota como adoptada y rechazará automáticamente las otras solicitudes pendientes de esa mascota. Podrás revertir la decisión desde la bandeja.",
  rechazada:
    "Rechazar esta solicitud notificará al adoptante que su solicitud no fue aceptada. Podrá volver a postularse para otra mascota.",
};

// Volver a "en revisión" también cambia el estado de la mascota: se confirma igual que una decisión.
const CONSECUENCIAS_REVERSION = {
  aprobada:
    "Volver a en revisión dejará la mascota disponible para nuevas solicitudes. Se notificará al adoptante si escribiste un mensaje.",
  rechazada:
    "Volver a en revisión permitiría aprobar esta solicitud más adelante. Se notificará al adoptante si escribiste un mensaje.",
};

const MAX_MENSAJE = 500;

export default function DecisionSolicitud({ solicitudId, correoAdoptante, estadoActual = "en_revision" }) {
  const [estado, setEstado] = useState(estadoActual);
  const [mensaje, setMensaje] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const formularioRef = useRef(null);

  // useActionState para acceder al resultado del server action
  const [resultado, accion, pendiente] = useActionState(actualizarEstadoSolicitud, null);

  const consecuencia =
    estado === "en_revision" ? CONSECUENCIAS_REVERSION[estadoActual] : CONSECUENCIAS[estado];
  const tituloConfirmacion =
    estado === "en_revision"
      ? "¿Volver a en revisión?"
      : estado === "aprobada"
      ? "¿Aprobar esta solicitud?"
      : "¿Rechazar esta solicitud?";
  const sinCorreo = !correoAdoptante;
  const restanChars = MAX_MENSAJE - mensaje.length;

  // Gate de confirmación: si el cambio afecta un estado importante y aún no se
  // confirma, se abre el diálogo y se cancela el envío. El botón del modal vuelve
  // a enviar el formulario con `confirmando` en true para que corra la action.
  function handleSubmit(e) {
    if (consecuencia && !confirmando) {
      e.preventDefault();
      setConfirmando(true);
      return;
    }
    setConfirmando(false);
  }

  return (
    <div>
      <form ref={formularioRef} action={accion} onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
        <input type="hidden" name="id" value={solicitudId} />

        {/* Selector de decisión */}
        <fieldset>
          <legend className="text-sm font-bold text-ink mb-2">
            Decisión <span className="text-danger-700">*</span>
          </legend>
          <div className="flex flex-col gap-2 sm:flex-row">
            {ESTADOS.map((op) => (
              <label
                key={op.valor}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition-all ${
                  estado === op.valor
                    ? op.clase + " ring-2 ring-offset-1 ring-primary-600"
                    : "border-border bg-white text-ink-700 hover:bg-surface-alt"
                }`}
              >
                <input
                  type="radio"
                  name="estado"
                  value={op.valor}
                  checked={estado === op.valor}
                  onChange={() => { setEstado(op.valor); setConfirmando(false); }}
                  className="sr-only"
                />
                {op.etiqueta}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Mensaje opcional */}
        <div>
          <label htmlFor="mensaje_adoptante" className="block text-sm font-bold text-ink mb-1">
            Mensaje para el adoptante{" "}
            <span className="font-normal text-ink-400">(opcional)</span>
          </label>
          {sinCorreo && (
            <p className="mb-2 flex items-center gap-1.5 rounded-md border border-border bg-warning-50 px-3 py-2 text-xs font-medium text-warning-700">
              <AlertCircle size={14} aria-hidden="true" />
              Este adoptante no tiene correo registrado; el mensaje no podrá enviarse por correo electrónico.
            </p>
          )}
          <textarea
            id="mensaje_adoptante"
            name="mensaje"
            rows={4}
            maxLength={MAX_MENSAJE}
            placeholder={
              estado === "aprobada"
                ? "Ej.: ¡Felicitaciones! Tu solicitud ha sido aprobada. Te contactaremos para coordinar la entrega."
                : estado === "rechazada"
                ? "Ej.: Lamentamos informarte que tu solicitud no fue aprobada en esta ocasión. Gracias por tu interés."
                : "Escribe un mensaje de seguimiento para el adoptante (opcional)"
            }
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-300 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
          />
          <p className={`mt-1 text-right text-xs ${restanChars < 50 ? "text-warning-700 font-semibold" : "text-ink-400"}`}>
            {restanChars} caracteres restantes
          </p>
          <p className="mt-1 text-xs text-ink-400">
            Si escribes un mensaje, el adoptante{correoAdoptante ? ` (${correoAdoptante})` : ""} recibirá una notificación por correo.
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={pendiente}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-extrabold text-white hover:bg-primary-700 disabled:opacity-60 transition-colors"
          >
            {pendiente ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Send size={16} aria-hidden="true" />
            )}
            {pendiente ? "Guardando…" : "Guardar decisión"}
          </button>
        </div>

        <ConfirmModal
          abierto={confirmando && Boolean(consecuencia)}
          kicker="Decisión de adopción"
          titulo={tituloConfirmacion}
          descripcion={consecuencia ?? ""}
          textoConfirmar="Sí, confirmar"
          enviando={pendiente}
          alConfirmar={() => {
            if (!pendiente) formularioRef.current?.requestSubmit();
          }}
          alCancelar={() => {
            if (!pendiente) setConfirmando(false);
          }}
        />

        {/* Errores del server action */}
        {resultado?.error && (
          <p role="alert" className="flex items-center gap-2 rounded-lg border border-border bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
            <AlertCircle size={16} aria-hidden="true" />
            {resultado.error}
          </p>
        )}
      </form>
    </div>
  );
}
