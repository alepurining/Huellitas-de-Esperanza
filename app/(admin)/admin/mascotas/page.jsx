import { prisma } from "@/lib/prisma";
import DashPanel from "@/components/DashPanel";
import PanelHeading from "@/components/PanelHeading";
import StatusBadge from "@/components/StatusBadge";
import Chip from "@/components/Chip";
import EmptyState from "@/components/EmptyState";
import { SearchX } from "lucide-react";

export const metadata = { title: "Mascotas registradas" };

export default async function AdminMascotasPage({ searchParams }) {
  const { q, estado } = await searchParams;
  const busqueda = typeof q === "string" ? q.trim() : "";
  const filtroEstado = estado === "en_adopcion" || estado === "adoptado" ? estado : null;

  const mascotas = await prisma.mascota.findMany({
    where: {
      ...(busqueda ? { nombre: { contains: busqueda, mode: "insensitive" } } : {}),
      ...(filtroEstado ? { estado: filtroEstado } : {}),
    },
    orderBy: { fecha_registro: "desc" },
  });

  const total = await prisma.mascota.count();

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
          Mascotas registradas
        </h1>
        <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
          {total} {total === 1 ? "ficha en el refugio" : "fichas en el refugio"} · US 1.2
        </p>
      </header>

      <DashPanel>
        <PanelHeading
          titulo="Listado de fichas"
          subtitulo={`${mascotas.length} ${mascotas.length === 1 ? "resultado" : "resultados"} con los filtros actuales`}
        />

        <form action="/admin/mascotas" method="get" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={busqueda}
            placeholder="Buscar por nombre"
            aria-label="Buscar por nombre"
            className="h-11 w-full rounded-input border border-border bg-surface px-3 font-sans text-[15px] text-ink outline-none transition duration-200 placeholder:text-ink-300 focus:border-primary focus:shadow-[0_0_0_3px_#fce7f3]"
          />
          {filtroEstado ? <input type="hidden" name="estado" value={filtroEstado} /> : null}
          <button
            type="submit"
            className="h-11 shrink-0 rounded-pill bg-primary-600 px-5 font-sans text-[13px] font-extrabold text-white transition duration-200 hover:bg-primary-700"
          >
            Buscar
          </button>
        </form>

        <div
          role="group"
          aria-label="Filtrar por estado"
          className="mt-4 flex gap-2.5 overflow-x-auto pb-1"
        >
          <Chip href="/admin/mascotas" activo={!filtroEstado} tono="oscuro">
            Todas
          </Chip>
          <Chip href="/admin/mascotas?estado=en_adopcion" activo={filtroEstado === "en_adopcion"}>
            En adopción
          </Chip>
          <Chip href="/admin/mascotas?estado=adoptado" activo={filtroEstado === "adoptado"}>
            Adoptado
          </Chip>
        </div>

        {mascotas.length === 0 ? (
          <EmptyState
            icono={SearchX}
            titulo="No hay mascotas con esos filtros"
            texto="Cambia la búsqueda o vuelve al listado completo."
          >
            <Chip href="/admin/mascotas" className="mt-2">
              Ver todas
            </Chip>
          </EmptyState>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">Mascotas registradas en el refugio</caption>
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-500">
                  <th scope="col" className="py-2">
                    Mascota
                  </th>
                  <th scope="col" className="py-2">
                    Id
                  </th>
                  <th scope="col" className="hidden py-2 md:table-cell">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map((mascota) => (
                  <tr key={mascota.id} className="border-t border-[#f1edef]">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {mascota.foto_url ? (
                          <img
                            src={mascota.foto_url}
                            alt=""
                            className="h-[46px] w-[46px] shrink-0 rounded-[14px] object-cover"
                          />
                        ) : (
                          <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] bg-primary-50 text-[11px] font-bold text-primary-600">
                            {mascota.nombre.slice(0, 1)}
                          </span>
                        )}
                        <div>
                          <p className="text-[14px] font-extrabold leading-[1.4] text-ink">
                            {mascota.nombre}
                          </p>
                          <p className="text-[12px] leading-[1.4] text-ink-500">
                            {mascota.raza} · {mascota.edad_estimada}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[13px] text-ink-500">#{mascota.id}</td>
                    <td className="hidden py-3 md:table-cell">
                      <StatusBadge estado={mascota.estado} />
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
