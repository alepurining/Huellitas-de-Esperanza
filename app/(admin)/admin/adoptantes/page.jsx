import Link from "next/link";
import { Pencil, SearchX, UserPlus } from "lucide-react";
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

const VISTAS = [
  { clave: "todos", etiqueta: "Todos", tono: "oscuro" },
  { clave: "adoptantes", etiqueta: "Adoptantes", tono: "rosa" },
  { clave: "postulados", etiqueta: "Postulados", tono: "rosa" },
  { clave: "donantes", etiqueta: "Donantes", tono: "rosa" },
];

// La URL usa plural ("adoptantes") y la situación derivada, singular ("adoptante").
const SITUACION_DE_VISTA = { adoptantes: "adoptante", postulados: "postulado" };

// Situación principal: adopción > postulación > donación. Donar es independiente,
// así que "Donantes" se filtra aparte y puede solaparse con las otras dos vistas.
function situacionDe(solicitudes, donaciones) {
  if (solicitudes.some((s) => s.estado === "aprobada")) return "adoptante";
  if (solicitudes.some((s) => s.estado === "en_revision")) return "postulado";
  if (donaciones.length > 0) return "donante";
  return "sin_actividad";
}

function hrefVista(clave, busqueda) {
  const params = new URLSearchParams();
  if (clave !== "todos") params.set("vista", clave);
  if (busqueda) params.set("q", busqueda);
  const sufijo = params.toString();
  return `/admin/adoptantes${sufijo ? `?${sufijo}` : ""}`;
}

function textoVacio(busqueda, vista) {
  if (busqueda) {
    return {
      titulo: "No encontramos ese documento",
      texto: "Revisa el número o consulta el listado completo.",
    };
  }
  if (vista === "adoptantes") {
    return {
      titulo: "Aún no hay adoptantes con mascota",
      texto: "Cuando apruebes una solicitud, la persona aparecerá aquí con su mascota.",
    };
  }
  if (vista === "postulados") {
    return {
      titulo: "No hay postulaciones pendientes",
      texto: "Las solicitudes en revisión aparecerán aquí hasta que decidas su estado.",
    };
  }
  if (vista === "donantes") {
    return {
      titulo: "Aún no hay donantes con perfil vinculado",
      texto: "Los aportes hechos con la cédula de un adoptante aparecerán aquí.",
    };
  }
  return {
    titulo: "Todavía no hay adoptantes",
    texto: "Registra al primero para empezar a dar seguimiento.",
  };
}

export default async function AdminAdoptantesPage({ searchParams }) {
  const { q, nuevo, actualizado, vista, solicitud } = await searchParams;
  const busqueda = typeof q === "string" ? q.trim() : "";
  const filtroVista = ["adoptantes", "postulados", "donantes"].includes(vista) ? vista : "todos";
  const idNuevo = typeof nuevo === "string" ? Number(nuevo) : 0;
  const idActualizado = typeof actualizado === "string" ? Number(actualizado) : 0;
  const conSolicitud = typeof solicitud === "string" && Number(solicitud) > 0;

  const [adoptantes, total, adoptanteNuevo] = await Promise.all([
    prisma.adoptante.findMany({
      where: busqueda ? { documento: { contains: busqueda } } : {},
      include: {
        solicitudes: {
          include: { mascota: { select: { id: true, nombre: true } } },
          orderBy: { fecha_solicitud: "desc" },
        },
        donaciones: { select: { id: true } },
      },
      orderBy: { fecha_registro: "desc" },
    }),
    prisma.adoptante.count(),
    Number.isSafeInteger(idNuevo) && idNuevo > 0
      ? prisma.adoptante.findUnique({ where: { id: idNuevo } })
      : Promise.resolve(null),
  ]);

  const filas = adoptantes.map((adoptante) => ({
    ...adoptante,
    situacion: situacionDe(adoptante.solicitudes, adoptante.donaciones),
    esDonante: adoptante.donaciones.length > 0,
  }));
  const conteos = {
    todos: filas.length,
    adoptantes: filas.filter((fila) => fila.situacion === "adoptante").length,
    postulados: filas.filter((fila) => fila.situacion === "postulado").length,
    donantes: filas.filter((fila) => fila.esDonante).length,
  };
  const situacionFiltro = SITUACION_DE_VISTA[filtroVista] ?? null;
  const visibles = filas.filter((fila) => {
    if (filtroVista === "todos") return true;
    if (filtroVista === "donantes") return fila.esDonante;
    return fila.situacion === situacionFiltro;
  });
  const vacio = textoVacio(busqueda, filtroVista);

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
            Adoptantes
          </h1>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            {total} {total === 1 ? "persona registrada" : "personas registradas"}
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
          {filtroVista !== "todos" ? (
            <input type="hidden" name="vista" value={filtroVista} />
          ) : null}
          <input
            type="search"
            name="q"
            inputMode="numeric"
            defaultValue={busqueda}
            placeholder="Número de cédula"
            aria-label="Buscar por número de cédula…"
            className="h-11 w-full rounded-input border border-border bg-surface px-3 font-sans text-[15px] text-ink outline-none transition duration-200 placeholder:text-ink-300 focus:border-primary focus:shadow-[0_0_0_3px_#fce7f3]"
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-pill bg-primary-600 px-5 font-sans text-[13px] font-extrabold text-white transition duration-200 hover:bg-primary-700"
          >
            Buscar
          </button>
        </form>

        <nav aria-label="Filtrar adoptantes por situación" className="mt-4 flex flex-wrap gap-2">
          {VISTAS.map((opcion) => (
            <Chip
              key={opcion.clave}
              href={hrefVista(opcion.clave, busqueda)}
              activo={filtroVista === opcion.clave}
              tono={opcion.tono}
            >
              {opcion.etiqueta} ({conteos[opcion.clave]})
            </Chip>
          ))}
        </nav>

        {visibles.length === 0 ? (
          <EmptyState icono={SearchX} titulo={vacio.titulo} texto={vacio.texto}>
            <Chip href="/admin/adoptantes" className="mt-2">
              Ver todos
            </Chip>
          </EmptyState>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-left">
              <caption className="sr-only">Adoptantes registrados y su situación de adopción</caption>
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-500">
                  <th scope="col" className="py-2">Nombre</th>
                  <th scope="col" className="py-2">Documento</th>
                  <th scope="col" className="py-2">Situación</th>
                  <th scope="col" className="py-2">Mascota</th>
                  <th scope="col" className="hidden py-2 sm:table-cell">Teléfono</th>
                  <th scope="col" className="hidden py-2 lg:table-cell">Dirección</th>
                  <th scope="col" className="py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((adoptante) => (
                  <tr key={adoptante.id} className="border-t border-[#f1edef]">
                    <td className="py-3 text-[14px] font-extrabold text-ink">
                      {adoptante.nombre_completo}
                    </td>
                    <td className="py-3 text-[13px] text-ink-500">{adoptante.documento}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge estado={adoptante.situacion} />
                        {adoptante.esDonante && adoptante.situacion !== "donante" ? (
                          <StatusBadge estado="donante" />
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3">
                      {adoptante.solicitudes.length === 0 ? (
                        <span className="text-[13px] text-ink-400">Sin solicitudes</span>
                      ) : (
                        <ul className="space-y-1">
                          {adoptante.solicitudes.slice(0, 3).map((solicitud) => (
                            <li
                              key={solicitud.id}
                              className="flex flex-wrap items-center gap-1.5 text-[13px]"
                            >
                              <Link
                                href={`/admin/mascotas/${solicitud.mascota.id}`}
                                className="font-bold text-ink underline-offset-2 hover:text-primary-600 hover:underline"
                              >
                                {solicitud.mascota.nombre}
                              </Link>
                              <StatusBadge
                                estado={solicitud.estado}
                                texto={solicitud.estado === "aprobada" ? "Adoptado" : undefined}
                              />
                            </li>
                          ))}
                          {adoptante.solicitudes.length > 3 ? (
                            <li className="text-[12px] text-ink-400">
                              +{adoptante.solicitudes.length - 3} más
                            </li>
                          ) : null}
                        </ul>
                      )}
                    </td>
                    <td className="hidden py-3 text-[13px] text-ink-500 sm:table-cell">
                      {adoptante.telefono}
                    </td>
                    <td className="hidden py-3 text-[13px] text-ink-500 lg:table-cell">
                      {adoptante.direccion}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/adoptantes/${adoptante.id}/editar`}
                        aria-label={`Editar a ${adoptante.nombre_completo}`}
                        className="inline-flex h-10 items-center gap-1.5 rounded-pill px-3 text-[13px] font-extrabold text-[#b74581] transition duration-200 hover:bg-primary-50"
                      >
                        <Pencil size={15} strokeWidth={2} aria-hidden="true" />
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashPanel>
      {adoptanteNuevo ? (
        <Toast
          mensaje={
            conSolicitud
              ? mensajes.adoptanteRegistradoConSolicitud
              : mensajes.adoptanteRegistrado
          }
        />
      ) : null}
      {Number.isSafeInteger(idActualizado) && idActualizado > 0 ? (
        <Toast mensaje={mensajes.adoptanteActualizado} />
      ) : null}
    </>
  );
}
