"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { crearSolicitudAdopcion } from "@/lib/actions/solicitudes";
import { esquemaSolicitud, erroresDe } from "@/lib/validaciones";
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

function datosDelFormulario(formData) {
  const personas = String(formData.get("personas_en_hogar") ?? "").trim();
  return {
    mascota_id: Number(formData.get("mascota_id")),
    documento: String(formData.get("documento") ?? "").trim(),
    nombre_completo: String(formData.get("nombre_completo") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    direccion: String(formData.get("direccion") ?? "").trim(),
    tipo_vivienda: String(formData.get("tipo_vivienda") ?? ""),
    personas_en_hogar: personas ? Number(personas) : undefined,
    animales_en_hogar: formData.get("animales_en_hogar") === "on",
    descripcion_vivienda: String(formData.get("descripcion_vivienda") ?? "").trim(),
    acepta_terminos: formData.get("acepta_terminos") === "on",
  };
}

export default function SolicitudAdopcionForm({
  mascotas,
  mascotaInicial,
  alCancelar,
  hrefCancelar = "/mascotas",
  origen = "ficha",
}) {
  const [estado, accion, enviando] = useActionState(crearSolicitudAdopcion, null);
  const [validacionCliente, setValidacionCliente] = useState(null);
  const formularioRef = useRef(null);
  const estadoVisible = validacionCliente ?? estado;
  const camposFaltantes = estadoVisible?.camposFaltantes ?? [];

  useEffect(() => {
    if (camposFaltantes.length) {
      formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [camposFaltantes.length, validacionCliente, estado]);

  const errorDe = (campo) => estadoVisible?.errores?.[campo];
  // React 19 resetea el form al terminar la action; estos valores evitan perder lo escrito.
  const valorDe = (campo) => estado?.valores?.[campo] ?? "";

  const manejarEnvio = (evento) => {
    if (enviando) {
      evento.preventDefault();
      return;
    }

    const resultado = esquemaSolicitud.safeParse(datosDelFormulario(new FormData(evento.currentTarget)));
    if (!resultado.success) {
      evento.preventDefault();
      setValidacionCliente({
        ...erroresDe(resultado),
        mensaje: "Revisa los campos marcados antes de enviar la solicitud.",
      });
      return;
    }

    setValidacionCliente(null);
  };

  return (
    <form ref={formularioRef} action={accion} onSubmit={manejarEnvio} noValidate className="mt-4">
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
          defaultValue={valorDe("mascota_id") > 0 ? String(valorDe("mascota_id")) : ""}
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
          {estadoVisible.mensaje ??
            `Revisa estos campos: ${camposFaltantes
              .map((campo) => etiquetasCampos[campo] ?? campo)
              .join(", ")}.`}
        </p>
      ) : null}

      <div className="grid gap-x-[15px] md:grid-cols-2">
        <FormField
          etiqueta="Cédula"
          nombre="documento"
          defaultValue={valorDe("documento")}
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
          defaultValue={valorDe("nombre_completo")}
          autoComplete="name"
          maxLength={80}
          placeholder="María Fernanda Gómez"
          required
          error={errorDe("nombre_completo")}
        />
        <FormField
          etiqueta="Correo"
          nombre="correo"
          defaultValue={valorDe("correo")}
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
          defaultValue={valorDe("telefono")}
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
            defaultValue={valorDe("direccion")}
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
          defaultValue={valorDe("tipo_vivienda")}
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
          defaultValue={valorDe("personas_en_hogar")}
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
            defaultValue={valorDe("descripcion_vivienda")}
            tipo="textarea"
            maxLength={1000}
            placeholder="Cuéntanos si tienes patio, balcón, rejas..."
            required
            error={errorDe("descripcion_vivienda")}
          />
        </div>
      </div>

      <label className="mt-[18px] flex items-start gap-[9px] text-[13px] font-semibold leading-[1.5] text-ink">
        <input
          type="checkbox"
          name="animales_en_hogar"
          defaultChecked={estado?.valores?.animales_en_hogar === true}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        Ya tengo animales en casa
      </label>

      <label
        className="mt-[18px] flex items-start gap-[9px] text-[13px] font-semibold leading-[1.5] text-ink"
      >
        <input
          type="checkbox"
          name="acepta_terminos"
          defaultChecked={estado?.valores?.acepta_terminos === true}
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
