"use client";

import { useActionState, useEffect, useRef } from "react";
import { CircleAlert } from "lucide-react";
import { crearSolicitudAdopcion } from "@/lib/actions/solicitudes";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";

const etiquetasCampos = {
  mascota_id: "mascota",
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

export default function SolicitudAdopcionForm({
  mascotas,
  mascotaInicial,
  alCancelar,
  hrefCancelar = "/mascotas",
  origen = "ficha",
}) {
  const [estado, accion, enviando] = useActionState(crearSolicitudAdopcion, null);
  const formularioRef = useRef(null);
  const camposFaltantes = estado?.camposFaltantes ?? [];

  useEffect(() => {
    if (camposFaltantes.length) {
      formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [estado, camposFaltantes.length]);

  const errorDe = (campo) =>
    estado?.errores?.[campo] ?? (camposFaltantes.includes(campo) ? "Revisa este dato" : undefined);

  return (
    <form ref={formularioRef} action={accion} noValidate className="mt-4">
      {mascotaInicial ? (
        <input type="hidden" name="mascota_id" value={mascotaInicial.id} />
      ) : (
        <FormField
          etiqueta="Mascota que deseas adoptar"
          nombre="mascota_id"
          tipo="select"
          placeholder="Selecciona una mascota"
          opciones={mascotas.map((mascota) => ({
            valor: String(mascota.id),
            etiqueta: `${mascota.nombre} · ${mascota.especie}`,
          }))}
          defaultValue=""
          required
          error={errorDe("mascota_id")}
        />
      )}
      <input type="hidden" name="origen" value={origen} />

      {camposFaltantes.length ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-[12px] bg-danger-50 p-4 text-[13px] font-bold leading-[1.5] text-danger-700"
        >
          <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
          {estado.mensaje ??
            `Revisa estos campos: ${camposFaltantes
              .map((campo) => etiquetasCampos[campo] ?? campo)
              .join(", ")}.`}
        </p>
      ) : null}

      <div className="grid gap-x-[15px] md:grid-cols-2">
        <FormField
          etiqueta="Cédula"
          nombre="documento"
          inputMode="numeric"
          maxLength={15}
          placeholder="Solo números"
          ayuda="La usamos para identificar tu solicitud."
          required
          error={errorDe("documento")}
        />
        <FormField
          etiqueta="Nombre completo"
          nombre="nombre_completo"
          autoComplete="name"
          maxLength={80}
          placeholder="María Fernanda Gómez"
          required
          error={errorDe("nombre_completo")}
        />
        <FormField
          etiqueta="Correo"
          nombre="correo"
          tipo="email"
          autoComplete="email"
          maxLength={80}
          placeholder="tucorreo@example.com"
          required
          error={errorDe("correo")}
        />
        <FormField
          etiqueta="Teléfono"
          nombre="telefono"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="3001234567"
          required
          error={errorDe("telefono")}
        />
        <div className="md:col-span-2">
          <FormField
            etiqueta="Dirección"
            nombre="direccion"
            autoComplete="street-address"
            maxLength={100}
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
            maxLength={1000}
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

      <label
        className="mt-[18px] flex items-start gap-[9px] text-[13px] font-semibold leading-[1.5] text-ink"
      >
        <input
          type="checkbox"
          name="acepta_terminos"
          aria-invalid={errorDe("acepta_terminos") ? "true" : undefined}
          className="mt-0.5 h-4 w-4 accent-primary"
          required
        />
        Acepto los términos de adopción y el seguimiento del refugio.
      </label>
      {errorDe("acepta_terminos") ? (
        <p className="mt-1 text-xs font-semibold text-danger-700">{errorDe("acepta_terminos")}</p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        {alCancelar ? (
          <OutlineButton onClick={alCancelar}>Cancelar</OutlineButton>
        ) : (
          <OutlineButton href={hrefCancelar}>Cancelar</OutlineButton>
        )}
        <PrimaryButton type="submit" disabled={enviando}>
          {enviando ? "Enviando…" : "Enviar solicitud"}
        </PrimaryButton>
      </div>
    </form>
  );
}
