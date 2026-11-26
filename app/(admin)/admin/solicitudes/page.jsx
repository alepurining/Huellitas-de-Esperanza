import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DashPanel from "@/components/DashPanel";
import PanelHeading from "@/components/PanelHeading";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import Chip from "@/components/Chip";

export const metadata = { title: "Solicitudes de adopción" };

const fecha = new Intl.DateTimeFormat("es-CO", { dateStyle: "short" });

const VISTAS = [
  { clave: "pendientes", etiqueta: "Pendientes", tono: "oscuro" },
  { clave: "resueltas", etiqueta: "Resueltas", tono: "rosa" },
];

export default async function AdminSolicitudesPage({ searchParams }) {
  const { vista } = await searchParams;
  const filtro = vista === "resueltas" ? "resueltas" : "pendientes";

  const todas = await prisma.solicitudAdopcion.findMany({
    include: {
      adoptante: { select: { nombre_completo: true, documento: true } },
      mascota: { select: { nombre: true } },
    },
    orderBy: { fecha_solicitud: "desc" },
  });
  const pendientes = todas.filter((s) => s.estado === "en_revision");
  const resueltas = todas.filter((s) => s.estado !== "en_revision");
  const visibles = filtro === "pendientes" ? pendientes : resueltas;
  const conteos = { pendientes: pendientes.length, resueltas: resueltas.length };
  const vacio =
    filtro === "pendientes"
      ? {
          titulo: "No hay solicitudes pendientes",
          texto: "Las solicitudes enviadas desde el sitio público aparecerán aquí para su revisión.",
        }
      : {
          titulo: "Todavía no hay solicitudes resueltas",
          texto: "Las solicitudes aprobadas o rechazadas se guardarán aquí como historial.",
        };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
          Solicitudes de adopción
        </h1>
        <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
          {pendientes.length}{" "}
          {pendientes.length === 1 ? "solicitud pendiente" : "solicitudes pendientes"} ·{" "}
          {resueltas.length} {resueltas.length === 1 ? "resuelta" : "resueltas"}
        </p>
      </header>

      <DashPanel>
        <PanelHeading
          titulo="Bandeja de solicitudes"
          subtitulo={
            filtro === "pendientes"
              ? "Abre cada solicitud para revisar los datos del adoptante y su hogar."
              : "Historial de las decisiones ya tomadas sobre las solicitudes."
          }
        />

        <nav aria-label="Filtrar solicitudes" className="mb-4 flex flex-wrap gap-2">
          {VISTAS.map((opcion) => (
            <Chip
              key={opcion.clave}
              href={`/admin/solicitudes?vista=${opcion.clave}`}
              activo={filtro === opcion.clave}
              tono={opcion.tono}
            >
              {opcion.etiqueta} ({conteos[opcion.clave]})
            </Chip>
          ))}
        </nav>

        {visibles.length === 0 ? (
          <EmptyState icono={ClipboardList} titulo={vacio.titulo} texto={vacio.texto} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <caption className="sr-only">
                {filtro === "pendientes"
                  ? "Solicitudes de adopción pendientes de revisión"
                  : "Solicitudes de adopción resueltas"}
              </caption>
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-500">
                  <th scope="col" className="py-2">Adoptante</th>
                  <th scope="col" className="py-2">Mascota</th>
                  <th scope="col" className="py-2">Fecha</th>
                  <th scope="col" className="py-2">Estado</th>
                  <th scope="col" className="py-2"><span className="sr-only">Acción</span></th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((solicitud) => (
                  <tr key={solicitud.id} className="border-t border-[#f1edef]">
                    <td className="py-3">
                      <p className="text-[14px] font-extrabold text-ink">
                        {solicitud.adoptante.nombre_completo}
                      </p>
                      <p className="text-[12px] text-ink-500">
                        Cédula {solicitud.adoptante.documento}
                      </p>
                    </td>
                    <td className="py-3 text-[13px] text-ink-700">{solicitud.mascota.nombre}</td>
                    <td className="py-3 text-[13px] text-ink-500">
                      {fecha.format(solicitud.fecha_solicitud)}
                    </td>
                    <td className="py-3">
                      <StatusBadge estado={solicitud.estado} />
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/solicitudes/${solicitud.id}`}
                        className="text-[13px] font-extrabold text-primary-600 underline-offset-2 hover:underline"
                      >
                        Revisar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashPanel>
    </>
  );
}
