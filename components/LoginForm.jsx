"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { iniciarSesion } from "@/lib/actions/auth";
import { esquemaLogin, erroresDe } from "@/lib/validaciones";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";

export default function LoginForm() {
  const [estado, accion, enviando] = useActionState(iniciarSesion, null);
  const [validacionCliente, setValidacionCliente] = useState(null);
  const [verContrasena, setVerContrasena] = useState(false);
  const formularioRef = useRef(null);
  const estadoVisible = validacionCliente ?? estado;

  useEffect(() => {
    if (estadoVisible?.camposFaltantes?.length) {
      formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [estadoVisible]);

  // ISO/IEC 25010 (User Assistance): el error dice qué campo falló y cómo corregirlo.
  const errorDe = (campo) => estadoVisible?.errores?.[campo];

  const manejarEnvio = (evento) => {
    if (enviando) {
      evento.preventDefault();
      return;
    }

    const datos = new FormData(evento.currentTarget);
    const resultado = esquemaLogin.safeParse({
      correo: String(datos.get("correo") ?? "").trim().toLowerCase(),
      contrasena: String(datos.get("contrasena") ?? ""),
    });
    if (!resultado.success) {
      evento.preventDefault();
      setValidacionCliente(erroresDe(resultado));
      return;
    }
    setValidacionCliente(null);
  };

  return (
    <form ref={formularioRef} action={accion} onSubmit={manejarEnvio} noValidate className="mt-6">
      {estadoVisible?.error ? (
        <p className="mb-4 flex items-center gap-2 rounded-[12px] bg-danger-50 p-4 text-[13px] font-bold leading-[1.5] text-danger-700">
          <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="shrink-0" />
          {estadoVisible.error}
        </p>
      ) : null}

      <FormField
        etiqueta="Correo"
        nombre="correo"
        tipo="email"
        placeholder="admin@huellitas.co"
        autoComplete="email"
        defaultValue={estado?.valores?.correo ?? ""}
        required
        error={errorDe("correo")}
      />

      <div className="relative">
        <FormField
          etiqueta="Contraseña"
          nombre="contrasena"
          tipo={verContrasena ? "text" : "password"}
          placeholder="Tu contraseña"
          autoComplete="current-password"
          required
          error={errorDe("contrasena")}
          className="pr-14"
        />
        <button
          type="button"
          onClick={() => setVerContrasena((valor) => !valor)}
          aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-1 top-10 flex h-11 w-11 items-center justify-center rounded-full text-ink-500 transition duration-200 hover:bg-primary-50 hover:text-primary-600"
        >
          {verContrasena ? (
            <EyeOff size={20} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={20} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      <PrimaryButton type="submit" tamano="full" className="mt-6" disabled={enviando}>
        {enviando ? "Ingresando…" : "Ingresar"}
      </PrimaryButton>
    </form>
  );
}
