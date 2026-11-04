import { redirect } from "next/navigation";
import { PawPrint } from "lucide-react";
import { getSesion } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import SecondaryButton from "@/components/SecondaryButton";

export const metadata = { title: "Iniciar sesión" };

export default async function LoginPage() {
  const sesion = await getSesion();
  if (sesion) redirect("/admin/mascotas");

  return (
    <div className="mx-auto flex max-w-[420px] flex-col px-4 py-14">
      <div className="rounded-card border border-border-soft bg-surface p-7 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50">
            <PawPrint size={26} strokeWidth={2} aria-hidden="true" className="text-primary" />
          </span>
          <div className="leading-none">
            <p className="font-display text-lg font-semibold text-ink">
              <span className="text-primary-600">Huellitas</span> de Esperanza
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[1.7px] text-ink-500">
              Refugio · Medellín
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
          Panel del refugio
        </h1>
        <p className="mt-2 text-sm leading-[1.6] text-ink-500">
          Acceso solo para el equipo: administración, veterinaria y voluntariado.
        </p>

        <LoginForm />

        <div className="mt-4">
          <SecondaryButton href="/" tamano="full">
            Volver al sitio
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
