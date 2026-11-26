"use client";

import { useActionState, useState } from "react";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { actualizarEstadoSolicitud } from "@/lib/actions/solicitudes";

const ESTADOS = [
  { valor: "en_revision", etiqueta: "En revisión", clase: "border-border bg-warning-50 text-warning-700" },
  { valor: "aprobada", etiqueta: "Aprobar solicitud", clase: "border-border bg-success-50 text-success-700" },
  { valor: "rechazada", etiqueta: "Rechazar solicitud", clase: "border-border bg-danger-50 text-danger-700" },
];

const CONSECUENCIAS = {
  aprobada:
    "Aprobar esta solicitud marcará la mascota como adoptada y no podrá recibir nuevas solicitudes. Esta acción es definitiva.",
  rechazada:
    "Rechazar esta solicitud notificará al adoptante que su solicitud no fue aceptada. Podrá volver a postularse para otra mascota.",
};

const MAX_MENSAJE = 500;

export default function DecisionSolicitud({ solicitudId, correoAdoptante }) {
  const [estado, setEstado] = useState("en_revision");
  const [mensaje, setMensaje] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  // useActionState para acceder al resultado del server action
  const [resultado, accion, pendiente] = useActionState(actualizarEstadoSolicitud, null);

  const esCritico = estado === "aprobada" || estado === "rechazada";
  const sinCorreo = !correoAdoptante;
  const restanChars = MAX_MENSAJE - mensaje.length;

  // Gate de confirmación: si la acción es crítica y aún no confirma, se abre el
  // diálogo y se cancela el envío (React ejecuta la acción solo si no se hace
  // preventDefault, y entonces sí actualiza `pendiente` para deshabilitar botones).
  function handleSubmit(e) {
    if (esCritico && !confirmando) {
      e.preventDefault();
      setConfirmando(true);
      return;
    }
    setConfirmando(false);
  }

  return (
    <div>
      <form action={accion} onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
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

        {/* Modal de confirmación para acciones críticas */}
        {confirmando && esCritico && (
          <div
            role="alertdialog"
            aria-labelledby="confirm-titulo"
            aria-describedby="confirm-desc"
            className="rounded-xl border border-border bg-warning-50 p-5"
          >
            <p id="confirm-titulo" className="font-extrabold text-warning-700">
              ¿Confirmar acción?
            </p>
            <p id="confirm-desc" className="mt-1 text-sm text-warning-700">
              {CONSECUENCIAS[estado]}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                autoFocus
                disabled={pendiente}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-ink-300 disabled:opacity-70"
              >
                {pendiente ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
                {pendiente ? "Guardando…" : "Sí, confirmar"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-bold text-ink hover:bg-surface-alt"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Botón principal (solo visible si no estamos en modo confirmación) */}
        {!confirmando && (
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
        )}

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
