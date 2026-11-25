import { HandHeart } from "lucide-react";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import DonacionForm from "@/components/DonacionForm";
import Toast from "@/components/Toast";
import { mensajes } from "@/lib/mensajes";

export const metadata = { title: "Donar" };

export default async function DonarPage({ searchParams }) {
  const { nuevo } = await searchParams;

  if (typeof nuevo === "string" && Number.isSafeInteger(Number(nuevo)) && Number(nuevo) > 0) {
    return (
      <div className="mx-auto max-w-[820px] px-4 py-8 md:py-12">
        <GhostButton href="/">← Volver al inicio</GhostButton>
        <Toast mensaje={mensajes.donacionPublicaRegistrada} />
        <section className="mt-6 rounded-panel bg-surface p-6 shadow-soft">
          <h1 className="font-display text-2xl leading-[1.2] text-ink">¡Gracias por apoyar al refugio!</h1>
          <p className="mt-2 text-sm leading-[1.7] text-ink-500">
            Registramos tu intención de aporte. El equipo se comunicará contigo para coordinar la
            entrega; este formulario no procesa pagos en línea.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[820px] px-4 py-8 md:py-12">
      <GhostButton href="/">← Volver al inicio</GhostButton>
      <header className="mt-6">
        <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
          Tu ayuda cambia vidas
        </p>
        <h1 className="mt-2 font-display text-[36px] leading-[1.1] text-ink md:text-5xl">
          Haz un aporte
        </h1>
        <p className="mt-3 max-w-[620px] text-base leading-[1.7] text-ink-500">
          Esta opción es para adoptantes ya registrados. Identifícate con tu cédula y cuéntanos qué
          aporte quieres coordinar. No se realizan cobros en línea.
        </p>
      </header>

      <DashPanel className="mt-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-mint">
            <HandHeart size={22} strokeWidth={2} aria-hidden="true" className="text-mint-ink" />
          </span>
          <div>
            <h2 className="font-display text-2xl leading-[1.2] text-ink">Cuéntanos tu aporte</h2>
            <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
              El equipo coordinará contigo cómo hacerlo llegar al refugio.
            </p>
          </div>
        </div>
        <DonacionForm publico />
      </DashPanel>
    </div>
  );
}
