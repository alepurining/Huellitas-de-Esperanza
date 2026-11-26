import { UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdoptanteForm from "@/components/AdoptanteForm";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import PanelHeading from "@/components/PanelHeading";

export const metadata = { title: "Nuevo adoptante" };

export default async function NuevoAdoptantePage() {
  const mascotas = await prisma.mascota.findMany({
    where: { estado: "en_adopcion" },
    select: { id: true, nombre: true, especie: true, raza: true },
    orderBy: { nombre: "asc" },
  });

  return (
    <>
      <header className="mb-6">
        <GhostButton href="/admin/adoptantes">← Volver a adoptantes</GhostButton>
        <div className="mt-5">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
            Nuevo adoptante
          </h1>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            Registra los datos de contacto y, si lo deseas, selecciona una mascota para iniciar
            su solicitud de adopción.
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
        <AdoptanteForm mascotas={mascotas} />
      </DashPanel>
    </>
  );
}
