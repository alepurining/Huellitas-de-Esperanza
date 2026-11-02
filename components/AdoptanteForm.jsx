"use client";

import { useActionState, useEffect, useRef } from "react";
import { CircleAlert } from "lucide-react";
import { crearAdoptante } from "@/lib/actions/adoptantes";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";

export default function AdoptanteForm() {
  const [estado, accion, enviando] = useActionState(crearAdoptante, null);
  const formularioRef = useRef(null);

  useEffect(() => {
    if (estado?.camposFaltantes?.length) {
      formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [estado]);

  const errorDe = (campo) => estado?.errores?.[campo];

  return (
    <form ref={formularioRef} action={accion} noValidate>
      {estado?.camposFaltantes?.length ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-[12px] bg-danger-50 p-4 text-[13px] font-bold leading-[1.5] text-danger-700"
        >
          <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
          {estado.mensaje ?? "Revisa los campos marcados antes de continuar."}
        </p>
      ) : null}

      <div className="grid gap-x-[15px] md:grid-cols-2">
        <FormField
          etiqueta="Cédula"
          nombre="documento"
          inputMode="numeric"
          autoComplete="off"
          maxLength={15}
          placeholder="Solo números"
          ayuda="Entre 6 y 15 dígitos."
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
          etiqueta="Teléfono"
          nombre="telefono"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="3001234567"
          ayuda="Entre 7 y 10 dígitos."
          required
          error={errorDe("telefono")}
        />
        <FormField
          etiqueta="Correo electrónico"
          nombre="correo"
          tipo="email"
          autoComplete="email"
          maxLength={80}
          placeholder="tucorreo@example.com"
          ayuda="Opcional."
          error={errorDe("correo")}
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
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <OutlineButton href="/admin/adoptantes">Cancelar</OutlineButton>
        <PrimaryButton type="submit" disabled={enviando}>
          {enviando ? "Registrando…" : "Registrar Adoptante"}
        </PrimaryButton>
      </div>
    </form>
  );
}
