import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, House, PawPrint, UserRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { actualizarEstadoSolicitud } from "@/lib/actions/solicitudes";
import { mensajes } from "@/lib/mensajes";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";

export const metadata = { title: "Revisar solicitud" };

const fecha = new Intl.DateTimeFormat("es-CO", { dateStyle: "long" });
const tiposVivienda = { apartamento: "Apartamento", casa: "Casa", finca: "Finca" };

function Dato({ etiqueta, valor }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">{etiqueta}</dt>
      <dd className="mt-1 text-[14px] font-bold leading-[1.5] text-ink">{valor || "Sin registrar"}</dd>
    </div>
  );
}

export default async function AdminSolicitudDetallePage({ params, searchParams }) {
  const [{ id }, { actualizada }] = await Promise.all([params, searchParams]);
  const numero = Number(id);
  if (!Number.isSafeInteger(numero) || numero < 1) notFound();

  const solicitud = await prisma.solicitudAdopcion.findUnique({
    where: { id: numero },
    include: {
      adoptante: true,
      mascota: { select: { id: true, nombre: true, especie: true, raza: true } },
    },
  });
  if (!solicitud) notFound();

  return (
    <div className="mx-auto max-w-[980px]">
      <GhostButton href="/admin/solicitudes" icono={ArrowLeft}>
        Volver a solicitudes
      </GhostButton>

      {actualizada === "1" ? <Toast mensaje={mensajes.solicitudActualizada} /> : null}

      <header className="mt-6 flex flex-wrap items-center gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
            Revisión de adopción
          </p>
          <h1 className="mt-1 text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
            Solicitud #{solicitud.id}
          </h1>
        </div>
        <StatusBadge estado={solicitud.estado} />
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DashPanel>
          <h2 className="flex items-center gap-2 font-display text-2xl leading-[1.2] text-ink">
            <UserRound size={20} aria-hidden="true" />
            Datos del adoptante
          </h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Dato etiqueta="Nombre" valor={solicitud.adoptante.nombre_completo} />
            <Dato etiqueta="Cédula" valor={solicitud.adoptante.documento} />
            <Dato etiqueta="Teléfono" valor={solicitud.adoptante.telefono} />
            <Dato etiqueta="Correo" valor={solicitud.adoptante.correo} />
            <div className="sm:col-span-2">
              <Dato etiqueta="Dirección" valor={solicitud.adoptante.direccion} />
            </div>
          </dl>
        </DashPanel>

        <DashPanel>
          <h2 className="flex items-center gap-2 font-display text-2xl leading-[1.2] text-ink">
            <PawPrint size={20} aria-hidden="true" />
            Mascota solicitada
          </h2>
          <p className="mt-4 text-lg font-extrabold text-ink">{solicitud.mascota.nombre}</p>
          <p className="mt-1 text-sm text-ink-500">
            {solicitud.mascota.especie} · {solicitud.mascota.raza}
          </p>
          <Link
            href={`/admin/mascotas/${solicitud.mascota.id}`}
            className="mt-3 inline-block text-[13px] font-extrabold text-primary-600 underline-offset-2 hover:underline"
          >
            Ver ficha de la mascota
          </Link>
        </DashPanel>

        <DashPanel className="lg:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-2xl leading-[1.2] text-ink">
            <House size={20} aria-hidden="true" />
            Condiciones del hogar
          </h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Dato etiqueta="Tipo de vivienda" valor={tiposVivienda[solicitud.tipo_vivienda] ?? solicitud.tipo_vivienda} />
            <Dato
              etiqueta="Personas en el hogar"
              valor={solicitud.personas_en_hogar ? String(solicitud.personas_en_hogar) : "Sin registrar"}
            />
            <Dato
              etiqueta="¿Tiene otros animales?"
              valor={solicitud.animales_en_hogar ? "Sí" : "No"}
            />
            <Dato
              etiqueta="Aceptó términos"
              valor={solicitud.acepta_terminos ? "Sí" : "No"}
            />
            <div className="sm:col-span-2">
              <Dato etiqueta="Descripción de la vivienda" valor={solicitud.descripcion_vivienda} />
            </div>
            <Dato etiqueta="Fecha de solicitud" valor={fecha.format(solicitud.fecha_solicitud)} />
          </dl>
        </DashPanel>

        <DashPanel className="lg:col-span-2">
          <h2 className="font-display text-2xl leading-[1.2] text-ink">Actualizar estado</h2>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            Registra la decisión del equipo para esta solicitud.
          </p>
          <form action={actualizarEstadoSolicitud} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="id" value={solicitud.id} />
            <OutlineButton type="submit" name="estado" value="en_revision">
              En revisión
            </OutlineButton>
            <PrimaryButton type="submit" name="estado" value="aprobada">
              Aprobar
            </PrimaryButton>
            <OutlineButton
              type="submit"
              name="estado"
              value="rechazada"
              className="border-danger text-danger-700 hover:bg-danger-50"
            >
              Rechazar
            </OutlineButton>
          </form>
        </DashPanel>
      </div>
    </div>
  );
}
