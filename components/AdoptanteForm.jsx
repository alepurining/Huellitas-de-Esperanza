"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { crearAdoptante } from "@/lib/actions/adoptantes";
import {
  esquemaAdoptante,
  esquemaActualizarAdoptante,
  erroresDe,
} from "@/lib/validaciones";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";
import ConfirmModal from "@/components/ConfirmModal";

function extraerDatosFormulario(formData, incluirEstado) {
  const datos = {
    documento: String(formData.get("documento") ?? "").trim(),
    nombre_completo: String(formData.get("nombre_completo") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    direccion: String(formData.get("direccion") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim(),
  };

  if (incluirEstado) {
    datos.estado = String(formData.get("estado") ?? "").trim();
  }

  return datos;
}

export default function AdoptanteForm({
  adoptanteInicial = null,
  accionServidor = crearAdoptante,
  hrefCancelar = "/admin/adoptantes",
  textoBoton = "Registrar Adoptante",
}) {
  const esEdicion = Boolean(adoptanteInicial?.id);
  const [estado, accion, enviando] = useActionState(accionServidor, null);
  const [enviandoTransicion, startTransition] = useTransition();
  const [validacionCliente, setValidacionCliente] = useState(null);
  const [confirmacionPendiente, setConfirmacionPendiente] = useState(null);
  const formularioRef = useRef(null);

  const estaEnviando = enviando || enviandoTransicion;
  const estadoVisible = validacionCliente ?? estado;
  const camposFaltantes = estadoVisible?.camposFaltantes ?? [];

  useEffect(() => {
    if (camposFaltantes.length) {
      formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [camposFaltantes.length, validacionCliente, estado]);

  const errorDe = (campo) => estadoVisible?.errores?.[campo];
  // React 19 resetea el form al terminar la action; estos valores conservan lo escrito o lo cargado.
  const valorDe = (campo) => estado?.valores?.[campo] ?? adoptanteInicial?.[campo] ?? "";

  const manejarEnvio = (evento) => {
    if (estaEnviando) {
      evento.preventDefault();
      return;
    }

    const formData = new FormData(evento.currentTarget);
    const datos = extraerDatosFormulario(formData, esEdicion);
    const esquema = esEdicion ? esquemaActualizarAdoptante : esquemaAdoptante;
    const resultado = esquema.safeParse(datos);

    if (!resultado.success) {
      evento.preventDefault();
      setValidacionCliente({
        ...erroresDe(resultado),
        mensaje: "Revisa los campos marcados antes de continuar.",
      });
      return;
    }

    setValidacionCliente(null);

    // ISO/IEC 25010 (User Error Protection): confirmar cambios de estado críticos antes de guardar.
    if (esEdicion && resultado.data.estado !== adoptanteInicial.estado) {
      evento.preventDefault();
      setConfirmacionPendiente({
        formData,
        nuevoEstado: resultado.data.estado,
        nombreAdoptante: resultado.data.nombre_completo,
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
        {esEdicion ? <input type="hidden" name="id" value={adoptanteInicial.id} /> : null}

        {estadoVisible?.camposFaltantes?.length ? (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-[12px] bg-danger-50 p-4 text-[13px] font-bold leading-[1.5] text-danger-700"
          >
            <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
            {estadoVisible.mensaje ?? "Revisa los campos marcados antes de continuar."}
          </p>
        ) : null}

        <div className="grid gap-x-[15px] md:grid-cols-2">
          <FormField
            etiqueta="Cédula"
            nombre="documento"
            defaultValue={valorDe("documento")}
            inputMode="numeric"
            autoComplete="off"
            maxLength={15}
            placeholder="1037654321"
            ayuda="Obligatorio. Solo números, entre 6 y 15 dígitos."
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
            ayuda="Obligatorio. Nombres y apellidos del responsable."
            required
            error={errorDe("nombre_completo")}
          />
          <FormField
            etiqueta="Teléfono"
            nombre="telefono"
            defaultValue={valorDe("telefono")}
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="3001234567"
            ayuda="Obligatorio. Solo números, entre 7 y 10 dígitos."
            required
            error={errorDe("telefono")}
          />
          <FormField
            etiqueta="Correo electrónico"
            nombre="correo"
            defaultValue={valorDe("correo")}
            tipo="email"
            autoComplete="email"
            maxLength={80}
            placeholder="nombre@dominio.com"
            ayuda="Opcional. Para enviar seguimiento o comprobantes."
            error={errorDe("correo")}
          />
          <div className={esEdicion ? "" : "md:col-span-2"}>
            <FormField
              etiqueta="Dirección"
              nombre="direccion"
              defaultValue={valorDe("direccion")}
              autoComplete="street-address"
              maxLength={100}
              placeholder="Calle 45 # 12-30, Medellín"
              ayuda="Obligatorio. Dirección actual de residencia."
              required
              error={errorDe("direccion")}
            />
          </div>
          {esEdicion ? (
            <FormField
              etiqueta="Estado"
              nombre="estado"
              defaultValue={valorDe("estado")}
              tipo="select"
              opciones={[
                { valor: "activo", etiqueta: "Activo" },
                { valor: "inactivo", etiqueta: "Inactivo" },
              ]}
              ayuda="Obligatorio. Define si el perfil está habilitado en el refugio."
              required
              error={errorDe("estado")}
            />
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <OutlineButton href={hrefCancelar} disabled={estaEnviando}>
            Cancelar
          </OutlineButton>
          <PrimaryButton type="submit" disabled={estaEnviando}>
            {estaEnviando ? (
              <>
                <Loader2 size={18} strokeWidth={2} aria-hidden="true" className="animate-spin" />
                {esEdicion ? "Guardando cambios…" : "Registrando…"}
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
          confirmacionPendiente?.nuevoEstado === "inactivo"
            ? `¿Marcar a ${confirmacionPendiente?.nombreAdoptante} como Inactivo?`
            : `¿Marcar a ${confirmacionPendiente?.nombreAdoptante} como Activo?`
        }
        descripcion={
          confirmacionPendiente?.nuevoEstado === "inactivo"
            ? "Al marcar este perfil como Inactivo, quedará deshabilitado en el seguimiento de adoptantes del refugio."
            : "Al marcar este perfil como Activo, volverá a figurar como adoptante habilitado en el seguimiento del refugio."
        }
        textoConfirmar={
          confirmacionPendiente?.nuevoEstado === "inactivo"
            ? "Sí, marcar como Inactivo"
            : "Sí, marcar como Activo"
        }
        textoCancelar="Seguir editando"
        varianteConfirmar={confirmacionPendiente?.nuevoEstado === "inactivo" ? "danger" : "primary"}
        enviando={estaEnviando}
        alConfirmar={confirmarCambioEstado}
        alCancelar={() => setConfirmacionPendiente(null)}
      />
    </>
  );
}
