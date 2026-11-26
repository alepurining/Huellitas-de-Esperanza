"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { CircleAlert, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { crearMascota } from "@/lib/actions/mascotas";
import { esquemaMascota, erroresDe } from "@/lib/validaciones";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";
import ConfirmModal from "@/components/ConfirmModal";

// El select puede quedar con la opción del placeholder seleccionada (""), igual que un vacío.
const opcionesDe = (placeholder, opciones) => [{ valor: "", etiqueta: placeholder }, ...opciones];

function extraerDatosFormulario(formData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    raza: String(formData.get("raza") ?? "").trim(),
    edad_estimada: String(formData.get("edad_estimada") ?? "").trim(),
    especie: String(formData.get("especie") ?? "").trim(),
    sexo: String(formData.get("sexo") ?? "").trim(),
    tamano: String(formData.get("tamano") ?? "").trim(),
    estado: String(formData.get("estado") ?? "").trim(),
    personalidad: String(formData.get("personalidad") ?? "").trim(),
    salud_resumen: String(formData.get("salud_resumen") ?? "").trim(),
    foto_url: String(formData.get("foto_url") ?? "").trim(),
  };
}

export default function MascotaForm({
  mascotaInicial = null,
  accionServidor = crearMascota,
  hrefCancelar = "/admin/mascotas",
  textoBoton = "Guardar Ficha",
}) {
  const esEdicion = Boolean(mascotaInicial?.id);
  const [estado, accion, enviando] = useActionState(accionServidor, null);
  const [enviandoTransicion, startTransition] = useTransition();
  const [validacionCliente, setValidacionCliente] = useState(null);
  const [errorFotoLocal, setErrorFotoLocal] = useState("");
  const [confirmacionPendiente, setConfirmacionPendiente] = useState(null);

  const fotoInicial = estado?.valores?.foto_url ?? mascotaInicial?.foto_url ?? "";
  const [fotoUrl, setFotoUrl] = useState(fotoInicial);
  const [fotoPreview, setFotoPreview] = useState(fotoInicial);

  const formularioRef = useRef(null);
  const inputFileRef = useRef(null);

  const estaEnviando = enviando || enviandoTransicion;
  const estadoVisible = validacionCliente ?? estado;
  const camposFaltantes = estadoVisible?.camposFaltantes ?? [];

  useEffect(() => {
    if (camposFaltantes.length) {
      formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [camposFaltantes.length, validacionCliente, estado]);

  const errorDe = (campo) => {
    if (campo === "foto_url" && errorFotoLocal) return errorFotoLocal;
    return estadoVisible?.errores?.[campo];
  };

  // React 19 resetea el form al terminar la action; estos valores conservan lo escrito o lo cargado.
  const valorDe = (campo) => estado?.valores?.[campo] ?? mascotaInicial?.[campo] ?? "";

  const manejarArchivo = (evento) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setErrorFotoLocal("Solo se permiten archivos de imagen (JPG, PNG o WebP).");
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setErrorFotoLocal("La imagen supera 5 MB. Elige una más liviana o pega una URL en línea.");
      return;
    }

    if (fotoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(fotoPreview);
    }

    const objectUrl = URL.createObjectURL(archivo);
    setErrorFotoLocal("");
    setFotoPreview(objectUrl);
    setFotoUrl(objectUrl);
  };

  const limpiarFoto = () => {
    if (fotoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(fotoPreview);
    }
    setErrorFotoLocal("");
    setFotoPreview("");
    setFotoUrl("");
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const manejarEnvio = (evento) => {
    if (estaEnviando) {
      evento.preventDefault();
      return;
    }

    const formData = new FormData(evento.currentTarget);
    const datos = extraerDatosFormulario(formData);
    const resultado = esquemaMascota.safeParse(datos);

    if (!resultado.success) {
      evento.preventDefault();
      setValidacionCliente({
        ...erroresDe(resultado),
        mensaje: "Revisa los campos marcados antes de guardar la ficha.",
      });
      return;
    }

    setValidacionCliente(null);

    // ISO/IEC 25010 (User Error Protection): confirmar cambios de estado críticos antes de guardar.
    if (esEdicion && resultado.data.estado !== mascotaInicial.estado) {
      evento.preventDefault();
      setConfirmacionPendiente({
        formData,
        nuevoEstado: resultado.data.estado,
        nombreMascota: resultado.data.nombre,
      });
    }
  };

  const confirmarCambioEstado = () => {
    if (!confirmacionPendiente || estaEnviando) return;
    const { formData } = confirmacionPendiente;
    setConfirmacionPendiente(null);
    startTransition(() => {
      accion(formData);
    });
  };

  return (
    <>
      <form ref={formularioRef} action={accion} onSubmit={manejarEnvio} noValidate>
        {esEdicion ? <input type="hidden" name="id" value={mascotaInicial.id} /> : null}

        {estadoVisible?.camposFaltantes?.length || errorFotoLocal ? (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-[12px] bg-danger-50 p-4 text-[13px] font-bold leading-[1.5] text-danger-700"
          >
            <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
            {errorFotoLocal || estadoVisible?.mensaje || "Revisa los campos marcados antes de continuar."}
          </p>
        ) : null}

        <div className="grid gap-x-[15px] md:grid-cols-2">
          <FormField
            etiqueta="Nombre"
            nombre="nombre"
            defaultValue={valorDe("nombre")}
            autoComplete="off"
            maxLength={50}
            placeholder="Bruno"
            ayuda="Obligatorio. Máximo 50 caracteres."
            required
            error={errorDe("nombre")}
          />
          <FormField
            etiqueta="Raza"
            nombre="raza"
            defaultValue={valorDe("raza")}
            autoComplete="off"
            maxLength={50}
            placeholder="Labrador mestizo"
            ayuda="Obligatorio. Indica la raza o si es mestizo."
            required
            error={errorDe("raza")}
          />
          <FormField
            etiqueta="Edad estimada"
            nombre="edad_estimada"
            defaultValue={valorDe("edad_estimada")}
            autoComplete="off"
            maxLength={30}
            placeholder="2 años"
            ayuda="Obligatorio. Ejemplo: 8 meses o 2 años."
            required
            error={errorDe("edad_estimada")}
          />
          <FormField
            etiqueta="Especie"
            nombre="especie"
            defaultValue={valorDe("especie")}
            tipo="select"
            opciones={opcionesDe("Selecciona la especie", [
              { valor: "perro", etiqueta: "Perro" },
              { valor: "gato", etiqueta: "Gato" },
            ])}
            ayuda="Obligatorio. Define el tipo de animal."
            required
            error={errorDe("especie")}
          />
          <FormField
            etiqueta="Sexo"
            nombre="sexo"
            defaultValue={valorDe("sexo")}
            tipo="select"
            opciones={opcionesDe("Sin registrar", [
              { valor: "macho", etiqueta: "Macho" },
              { valor: "hembra", etiqueta: "Hembra" },
            ])}
            ayuda="Opcional. Ayuda a los adoptantes en el catálogo."
            error={errorDe("sexo")}
          />
          <FormField
            etiqueta="Tamaño"
            nombre="tamano"
            defaultValue={valorDe("tamano")}
            tipo="select"
            opciones={opcionesDe("Sin registrar", [
              { valor: "pequeño", etiqueta: "Pequeño" },
              { valor: "mediano", etiqueta: "Mediano" },
              { valor: "grande", etiqueta: "Grande" },
            ])}
            ayuda="Opcional. Tamaño estimado en edad adulta."
            error={errorDe("tamano")}
          />
          <FormField
            etiqueta="Estado"
            nombre="estado"
            defaultValue={valorDe("estado")}
            tipo="select"
            opciones={opcionesDe("Selecciona el estado", [
              { valor: "en_adopcion", etiqueta: "Disponible" },
              { valor: "adoptado", etiqueta: "Adoptado" },
            ])}
            ayuda="Obligatorio. Solo las disponibles aparecen en el catálogo público."
            required
            error={errorDe("estado")}
          />
          <div>
            <div className="mb-2 flex items-end gap-2">
              <FormField
                etiqueta="Foto de la mascota"
                nombre="foto_url"
                value={fotoUrl}
                tipo="url"
                autoComplete="off"
                maxLength={255}
                placeholder="https://ejemplo.com/bruno.jpg"
                ayuda="Opcional. Pega una URL https:// de una imagen en línea."
                onChange={(evento) => {
                  const valor = evento.target.value;
                  setErrorFotoLocal("");
                  setFotoUrl(valor);
                  if (valor.trim() && !valor.startsWith("blob:")) {
                    setFotoPreview(valor);
                  } else if (!valor.trim()) {
                    setFotoPreview("");
                  }
                }}
                error={errorDe("foto_url")}
                className="flex-1"
              />
              <label
                htmlFor="foto_archivo"
                title="Previsualizar imagen local"
                className="mb-[26px] shrink-0 cursor-pointer rounded-input border border-border-soft bg-surface px-3 py-3 font-sans text-[15px] font-normal text-ink outline-none transition duration-200 hover:bg-primary-50 hover:text-[#b74581]"
              >
                <input
                  ref={inputFileRef}
                  id="foto_archivo"
                  type="file"
                  accept="image/*"
                  onChange={manejarArchivo}
                  className="sr-only"
                  aria-label="Previsualizar foto desde archivo"
                />
                <Upload size={20} strokeWidth={2} aria-hidden="true" />
              </label>
            </div>
            {fotoPreview ? (
              <div className="relative mt-2 overflow-hidden rounded-[14px] border border-border-soft">
                <img
                  src={fotoPreview}
                  alt="Vista previa de la foto"
                  className="h-32 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={limpiarFoto}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1 transition hover:bg-white"
                  aria-label="Eliminar foto"
                >
                  <X size={16} strokeWidth={2} aria-hidden="true" className="text-ink-500" />
                </button>
              </div>
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
              defaultValue={valorDe("personalidad")}
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
              defaultValue={valorDe("salud_resumen")}
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
          <OutlineButton href={hrefCancelar} disabled={estaEnviando}>
            Cancelar
          </OutlineButton>
          <PrimaryButton type="submit" disabled={estaEnviando}>
            {estaEnviando ? (
              <>
                <Loader2 size={18} strokeWidth={2} aria-hidden="true" className="animate-spin" />
                {esEdicion ? "Guardando cambios…" : "Guardando…"}
              </>
            ) : (
              textoBoton
            )}
          </PrimaryButton>
        </div>
      </form>

      <ConfirmModal
        abierto={Boolean(confirmacionPendiente)}
        kicker="Cambio de estado"
        titulo={
          confirmacionPendiente?.nuevoEstado === "adoptado"
            ? `¿Marcar a ${confirmacionPendiente?.nombreMascota} como Adoptado?`
            : `¿Marcar a ${confirmacionPendiente?.nombreMascota} como Disponible?`
        }
        descripcion={
          confirmacionPendiente?.nuevoEstado === "adoptado"
            ? "Al cambiar su estado a Adoptado, dejará de mostrarse en el catálogo público y no podrá recibir nuevas solicitudes de adopción."
            : "Al cambiar su estado a Disponible, volverá a publicarse en el catálogo público y podrá recibir nuevas solicitudes de adopción."
        }
        textoConfirmar={
          confirmacionPendiente?.nuevoEstado === "adoptado"
            ? "Sí, marcar como Adoptado"
            : "Sí, marcar como Disponible"
        }
        textoCancelar="Seguir editando"
        varianteConfirmar={confirmacionPendiente?.nuevoEstado === "adoptado" ? "danger" : "primary"}
        enviando={estaEnviando}
        alConfirmar={confirmarCambioEstado}
        alCancelar={() => setConfirmacionPendiente(null)}
      />
    </>
  );
}
