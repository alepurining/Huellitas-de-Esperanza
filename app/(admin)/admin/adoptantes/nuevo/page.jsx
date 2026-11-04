import { UserPlus } from "lucide-react";
import AdoptanteForm from "@/components/AdoptanteForm";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import PanelHeading from "@/components/PanelHeading";

export const metadata = { title: "Nuevo adoptante" };

export default function NuevoAdoptantePage() {
  return (
    <>
      <header className="mb-6">
        <GhostButton href="/admin/adoptantes">← Volver a adoptantes</GhostButton>
        <div className="mt-5">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
            Nuevo adoptante
          </h1>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            Registra los datos de contacto de una persona interesada en adoptar
          </p>
        </div>
      </header>

      <DashPanel>
        <PanelHeading
          titulo="Datos del adoptante"
          subtitulo="Los campos marcados con * son obligatorios."
        >
          <UserPlus size={20} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
        </PanelHeading>
        <AdoptanteForm />
      </DashPanel>
    </>
  );
}
