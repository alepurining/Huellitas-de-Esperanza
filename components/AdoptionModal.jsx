"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleAlert, HeartHandshake, X } from "lucide-react";
import { crearSolicitudAdopcion } from "@/lib/actions/solicitudes";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";

const etiquetasCampos = {
  documento: "documento",
  nombre_completo: "nombre completo",
  correo: "correo",
  telefono: "teléfono",
  direccion: "dirección",
  tipo_vivienda: "tipo de vivienda",
  personas_en_hogar: "personas en el hogar",
  animales_en_hogar: "animales en el hogar",
  descripcion_vivienda: "descripción de la vivienda",
  acepta_terminos: "aceptación de términos",
};

export default function AdoptionModal({ mascota }) {
  const [abierto, setAbierto] = useState(false);
  const [estado, accion, enviando] = useActionState(crearSolicitudAdopcion, null);
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

  const faltantes = estado?.camposFaltantes ?? [];
  const errorDe = (campo) => (faltantes.includes(campo) ? "Revisa este dato" : undefined);

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

            <form action={accion} noValidate className="mt-4">
              <input type="hidden" name="mascota_id" value={mascota.id} />

              {faltantes.length > 0 ? (
                <p className="mt-4 flex items-start gap-2 rounded-[12px] bg-danger-50 p-4 text-[13px] font-bold leading-[1.5] text-danger-700">
                  <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
                  Faltan datos o hay errores en:{" "}
                  {faltantes.map((campo) => etiquetasCampos[campo] ?? campo).join(", ")}.
                </p>
              ) : null}

              <div className="grid gap-x-[15px] md:grid-cols-2">
                <FormField
                  etiqueta="Cédula"
                  nombre="documento"
                  inputMode="numeric"
                  placeholder="Solo números"
                  ayuda="La usamos para identificar tu solicitud."
                  required
                  error={errorDe("documento")}
                />
                <FormField
                  etiqueta="Nombre completo"
                  nombre="nombre_completo"
                  placeholder="María Fernanda Gómez"
                  required
                  error={errorDe("nombre_completo")}
                />
                <FormField
                  etiqueta="Correo"
                  nombre="correo"
                  tipo="email"
                  placeholder="tucorreo@example.com"
                  required
                  error={errorDe("correo")}
                />
                <FormField
                  etiqueta="Teléfono"
                  nombre="telefono"
                  inputMode="numeric"
                  placeholder="3001234567"
                  required
                  error={errorDe("telefono")}
                />
                <div className="md:col-span-2">
                  <FormField
                    etiqueta="Dirección"
                    nombre="direccion"
                    placeholder="Calle 45 # 12-30, Medellín"
                    required
                    error={errorDe("direccion")}
                  />
                </div>
                <FormField
                  etiqueta="Tipo de vivienda"
                  nombre="tipo_vivienda"
                  tipo="select"
                  placeholder="Selecciona una opción"
                  opciones={[
                    { valor: "apartamento", etiqueta: "Apartamento" },
                    { valor: "casa", etiqueta: "Casa" },
                    { valor: "finca", etiqueta: "Finca" },
                  ]}
                  required
                  error={errorDe("tipo_vivienda")}
                />
                <FormField
                  etiqueta="Personas en el hogar"
                  nombre="personas_en_hogar"
                  tipo="number"
                  min={1}
                  max={20}
                  placeholder="3"
                  error={errorDe("personas_en_hogar")}
                />
                <div className="md:col-span-2">
                  <FormField
                    etiqueta="¿Cómo es tu vivienda?"
                    nombre="descripcion_vivienda"
                    tipo="textarea"
                    placeholder="Cuéntanos si tienes patio, balcón, rejas..."
                    required
                    error={errorDe("descripcion_vivienda")}
                  />
                </div>
              </div>

              <label className="mt-[18px] flex items-start gap-[9px] text-[13px] font-semibold leading-[1.5] text-ink">
                <input type="checkbox" name="animales_en_hogar" className="mt-0.5 h-4 w-4 accent-primary" />
                Ya tengo animales en casa
              </label>

              <label className="mt-[18px] flex items-start gap-[9px] text-[13px] font-semibold leading-[1.5] text-ink">
                <input
                  type="checkbox"
                  name="acepta_terminos"
                  className="mt-0.5 h-4 w-4 accent-primary"
                  required
                />
                Acepto los términos de adopción y el seguimiento del refugio.
              </label>
              {errorDe("acepta_terminos") ? (
                <p className="mt-1 text-xs font-semibold text-danger-700">
                  Debes aceptar los términos para enviar la solicitud.
                </p>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <OutlineButton onClick={cerrar}>Cancelar</OutlineButton>
                <PrimaryButton type="submit" disabled={enviando}>
                  {enviando ? "Enviando…" : "Enviar solicitud"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
