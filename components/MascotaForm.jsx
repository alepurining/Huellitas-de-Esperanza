"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleAlert, ImageIcon } from "lucide-react";
import { crearMascota } from "@/lib/actions/mascotas";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";

// El select puede quedar con la opción del placeholder seleccionada (""), igual que un vacío.
const opcionesDe = (placeholder, opciones) => [{ valor: "", etiqueta: placeholder }, ...opciones];

export default function MascotaForm() {
  const [estado, accion, enviando] = useActionState(crearMascota, null);
  const [fotoUrl, setFotoUrl] = useState("");
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
          etiqueta="Nombre"
          nombre="nombre"
          autoComplete="off"
          maxLength={50}
          placeholder="Bruno"
          required
          error={errorDe("nombre")}
        />
        <FormField
          etiqueta="Raza"
          nombre="raza"
          autoComplete="off"
          maxLength={50}
          placeholder="Labrador mestizo"
          required
          error={errorDe("raza")}
        />
        <FormField
          etiqueta="Edad estimada"
          nombre="edad_estimada"
          autoComplete="off"
          maxLength={30}
          placeholder="2 años"
          ayuda="Edad aproximada, en texto."
          required
          error={errorDe("edad_estimada")}
        />
        <FormField
          etiqueta="Especie"
          nombre="especie"
          tipo="select"
          opciones={opcionesDe("Selecciona la especie", [
            { valor: "perro", etiqueta: "Perro" },
            { valor: "gato", etiqueta: "Gato" },
          ])}
          required
          error={errorDe("especie")}
        />
        <FormField
          etiqueta="Sexo"
          nombre="sexo"
          tipo="select"
          opciones={opcionesDe("Sin registrar", [
            { valor: "macho", etiqueta: "Macho" },
            { valor: "hembra", etiqueta: "Hembra" },
          ])}
          error={errorDe("sexo")}
        />
        <FormField
          etiqueta="Tamaño"
          nombre="tamano"
          tipo="select"
          opciones={opcionesDe("Sin registrar", [
            { valor: "pequeño", etiqueta: "Pequeño" },
            { valor: "mediano", etiqueta: "Mediano" },
            { valor: "grande", etiqueta: "Grande" },
          ])}
          error={errorDe("tamano")}
        />
        <FormField
          etiqueta="Estado"
          nombre="estado"
          tipo="select"
          opciones={opcionesDe("Selecciona el estado", [
            { valor: "en_adopcion", etiqueta: "En adopción" },
            { valor: "adoptado", etiqueta: "Adoptado" },
          ])}
          required
          error={errorDe("estado")}
        />
        <div>
          <FormField
            etiqueta="Foto (URL)"
            nombre="foto_url"
            tipo="url"
            autoComplete="off"
            maxLength={255}
            placeholder="https://…/foto.jpg"
            ayuda="Opcional. Pega el enlace de una imagen en línea."
            onChange={(evento) => setFotoUrl(evento.target.value)}
            error={errorDe("foto_url")}
          />
          {fotoUrl.trim() ? (
            <img
              src={fotoUrl}
              alt="Vista previa de la foto"
              className="mt-2 h-24 w-full rounded-[14px] border border-border-soft object-cover"
            />
          ) : (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-400">
              <ImageIcon size={14} strokeWidth={2} aria-hidden="true" />
              Sin vista previa: la ficha usará el placeholder del refugio.
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <FormField
            etiqueta="Personalidad"
            nombre="personalidad"
            tipo="textarea"
            filas={3}
            maxLength={500}
            placeholder="Juguetón y muy sociable. Se lleva bien con niños."
            ayuda="Opcional. Cómo se comporta y con quién convive mejor."
            error={errorDe("personalidad")}
          />
        </div>
        <div className="md:col-span-2">
          <FormField
            etiqueta="Resumen de salud"
            nombre="salud_resumen"
            tipo="textarea"
            filas={2}
            maxLength={300}
            placeholder="Vacunas al día y desparasitado. Pendiente de esterilizar."
            ayuda="Opcional. Vacunas, desparasitación y tratamientos en curso."
            error={errorDe("salud_resumen")}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <OutlineButton href="/admin/mascotas">Cancelar</OutlineButton>
        <PrimaryButton type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar Ficha"}
        </PrimaryButton>
      </div>
    </form>
  );
}
