"use client";

import { useActionState, useState } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { iniciarSesion } from "@/lib/actions/auth";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";

export default function LoginForm() {
  const [estado, accion, enviando] = useActionState(iniciarSesion, null);
  const [verContrasena, setVerContrasena] = useState(false);

  const faltantes = estado?.camposFaltantes ?? [];
  const errorDe = (campo) => (faltantes.includes(campo) ? "Revisa este dato" : undefined);

  return (
    <form action={accion} noValidate className="mt-6">
      {estado?.error ? (
        <p className="mb-4 flex items-center gap-2 rounded-[12px] bg-danger-50 p-4 text-[13px] font-bold leading-[1.5] text-danger-700">
          <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="shrink-0" />
          {estado.error}
        </p>
      ) : null}

      <FormField
        etiqueta="Correo"
        nombre="correo"
        tipo="email"
        placeholder="admin@huellitas.co"
        autoComplete="email"
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
