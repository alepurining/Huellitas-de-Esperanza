import { notFound } from "next/navigation";
import { ArrowLeft, UserCog } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { actualizarAdoptante } from "@/lib/actions/adoptantes";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import PanelHeading from "@/components/PanelHeading";
import AdoptanteForm from "@/components/AdoptanteForm";

export const metadata = { title: "Editar adoptante" };

export default async function EditarAdoptantePage({ params }) {
  const { id } = await params;

  const numero = Number(id);
  if (!Number.isSafeInteger(numero) || numero < 1) notFound();

  const adoptante = await prisma.adoptante.findUnique({ where: { id: numero } });
  if (!adoptante) notFound();

  return (
    <>
      <header className="mb-6">
        <GhostButton href="/admin/adoptantes" icono={ArrowLeft}>
          Volver a adoptantes
        </GhostButton>
        <div className="mt-5">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
            Editar adoptante — {adoptante.nombre_completo}
          </h1>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            Actualiza los datos de contacto o el estado del adoptante para dar seguimiento.
          </p>
        </div>
      </header>

      <DashPanel>
        <PanelHeading
          titulo="Datos del adoptante"
          subtitulo="Los campos marcados con * son obligatorios."
        >
          <UserCog size={20} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
        </PanelHeading>
        <AdoptanteForm
          adoptanteInicial={adoptante}
          accionServidor={actualizarAdoptante}
          hrefCancelar="/admin/adoptantes"
          textoBoton="Guardar cambios"
        />
      </DashPanel>
    </>
  );
}
