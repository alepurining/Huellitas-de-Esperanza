import { PawPrint } from "lucide-react";
import MascotaForm from "@/components/MascotaForm";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import PanelHeading from "@/components/PanelHeading";

export const metadata = { title: "Nueva ficha" };

export default function NuevaMascotaPage() {
  return (
    <>
      <header className="mb-6">
        <GhostButton href="/admin/mascotas">← Volver a mascotas</GhostButton>
        <div className="mt-5">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
            Nueva ficha
          </h1>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            Registra los datos del animal en su ficha digital
          </p>
        </div>
      </header>

      <DashPanel>
        <PanelHeading
          titulo="Datos de la mascota"
          subtitulo="Los campos marcados con * son obligatorios."
        >
          <PawPrint size={20} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
        </PanelHeading>
        <MascotaForm />
      </DashPanel>
    </>
  );
}
