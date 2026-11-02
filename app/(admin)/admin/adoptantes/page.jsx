import { SearchX, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DashPanel from "@/components/DashPanel";
import PanelHeading from "@/components/PanelHeading";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import Chip from "@/components/Chip";
import PrimaryButton from "@/components/PrimaryButton";
import Toast from "@/components/Toast";
import { mensajes } from "@/lib/mensajes";

export const metadata = { title: "Adoptantes" };

export default async function AdminAdoptantesPage({ searchParams }) {
  const { q, nuevo } = await searchParams;
  const busqueda = typeof q === "string" ? q.trim() : "";
  const idNuevo = typeof nuevo === "string" ? Number(nuevo) : 0;

  const [adoptantes, total, adoptanteNuevo] = await Promise.all([
    prisma.adoptante.findMany({
      where: busqueda ? { documento: { contains: busqueda } } : {},
      orderBy: { fecha_registro: "desc" },
    }),
    prisma.adoptante.count(),
    Number.isSafeInteger(idNuevo) && idNuevo > 0
      ? prisma.adoptante.findUnique({ where: { id: idNuevo } })
      : Promise.resolve(null),
  ]);

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
            Adoptantes
          </h1>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            {total} {total === 1 ? "persona registrada" : "personas registradas"} · US 2.1 y 2.2
          </p>
        </div>
        <PrimaryButton href="/admin/adoptantes/nuevo" icono={UserPlus} tamano="sm">
          Nuevo adoptante
        </PrimaryButton>
      </header>

      {adoptanteNuevo ? (
        <section
          aria-labelledby="titulo-adoptante-registrado"
          className="mb-6 rounded-card border border-[#dce8e1] bg-[#f0fdf4] p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 id="titulo-adoptante-registrado" className="font-display text-xl text-ink">
                Adoptante registrado
              </h2>
              <p className="mt-1 text-sm text-ink-500">Perfil #{adoptanteNuevo.id}</p>
            </div>
            <StatusBadge estado={adoptanteNuevo.estado} />
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-ink">Nombre</dt>
              <dd className="mt-0.5 text-ink-500">{adoptanteNuevo.nombre_completo}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink">Cédula</dt>
              <dd className="mt-0.5 text-ink-500">{adoptanteNuevo.documento}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      <DashPanel>
        <PanelHeading
          titulo="Buscar por cédula"
          subtitulo="Escribe el número de documento para encontrar al adoptante."
        />

        <form action="/admin/adoptantes" method="get" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            inputMode="numeric"
            defaultValue={busqueda}
            placeholder="Número de documento"
            aria-label="Buscar por número de documento"
            className="h-11 w-full rounded-input border border-border bg-surface px-3 font-sans text-[15px] text-ink outline-none transition duration-200 placeholder:text-ink-300 focus:border-primary focus:shadow-[0_0_0_3px_#fce7f3]"
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-pill bg-primary-600 px-5 font-sans text-[13px] font-extrabold text-white transition duration-200 hover:bg-primary-700"
          >
            Buscar
          </button>
        </form>

        {adoptantes.length === 0 ? (
          <EmptyState
            icono={SearchX}
            titulo="No encontramos ese documento"
            texto="Revisa el número o consulta el listado completo."
          >
            <Chip href="/admin/adoptantes" className="mt-2">
              Ver todos
            </Chip>
          </EmptyState>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Adoptantes registrados</caption>
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-500">
                  <th scope="col" className="py-2">
                    Nombre
                  </th>
                  <th scope="col" className="py-2">
                    Documento
                  </th>
                  <th scope="col" className="py-2">
                    Teléfono
                  </th>
                  <th scope="col" className="py-2">
                    Dirección
                  </th>
                  <th scope="col" className="hidden py-2 md:table-cell">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {adoptantes.map((adoptante) => (
                  <tr key={adoptante.id} className="border-t border-[#f1edef]">
                    <td className="py-3 text-[14px] font-extrabold text-ink">
                      {adoptante.nombre_completo}
                    </td>
                    <td className="py-3 text-[13px] text-ink-500">{adoptante.documento}</td>
                    <td className="py-3 text-[13px] text-ink-500">{adoptante.telefono}</td>
                    <td className="py-3 text-[13px] text-ink-500">{adoptante.direccion}</td>
                    <td className="hidden py-3 md:table-cell">
                      <StatusBadge estado={adoptante.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashPanel>
      {adoptanteNuevo ? <Toast mensaje={mensajes.adoptanteRegistrado} /> : null}
    </>
  );
}
