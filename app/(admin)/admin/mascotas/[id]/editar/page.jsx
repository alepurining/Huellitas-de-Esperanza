import { notFound } from "next/navigation";
import { ArrowLeft, PawPrint } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { actualizarMascota } from "@/lib/actions/mascotas";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import PanelHeading from "@/components/PanelHeading";
import MascotaForm from "@/components/MascotaForm";

export const metadata = { title: "Editar ficha de mascota" };

export default async function EditarMascotaPage({ params }) {
  const { id } = await params;

  const numero = Number(id);
  if (!Number.isSafeInteger(numero) || numero < 1) notFound();

  const mascota = await prisma.mascota.findUnique({ where: { id: numero } });
  if (!mascota) notFound();

  return (
    <>
      <header className="mb-6">
        <GhostButton href={`/admin/mascotas/${mascota.id}`} icono={ArrowLeft}>
          Volver a la ficha
        </GhostButton>
        <div className="mt-5">
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
            Editar ficha — {mascota.nombre}
          </h1>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            Actualiza la información registrada del animal para mantener su ficha al día.
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
        <MascotaForm
          mascotaInicial={mascota}
          accionServidor={actualizarMascota}
          hrefCancelar={`/admin/mascotas/${mascota.id}`}
          textoBoton="Guardar cambios"
        />
      </DashPanel>
    </>
  );
}
