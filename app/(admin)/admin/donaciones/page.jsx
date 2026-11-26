import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSesion } from "@/lib/auth";
import DashPanel from "@/components/DashPanel";
import PanelHeading from "@/components/PanelHeading";
import DonacionForm from "@/components/DonacionForm";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";
import EmptyState from "@/components/EmptyState";
import { FileText, HandHeart, SearchX } from "lucide-react";
import { mensajes } from "@/lib/mensajes";
import { esquemaFiltroInformeDonaciones } from "@/lib/validaciones";
import ConfirmarRecepcion from "@/components/ConfirmarRecepcion";
import OutlineButton from "@/components/OutlineButton";
import GhostButton from "@/components/GhostButton";
import Chip from "@/components/Chip";
import HistorialDonacionesFiltros from "@/components/HistorialDonacionesFiltros";

export const metadata = { title: "Donaciones" };

const moneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const fecha = new Intl.DateTimeFormat("es-CO", { dateStyle: "short" });
const fechaLarga = new Intl.DateTimeFormat("es-CO", { dateStyle: "long" });

function Dato({ etiqueta, valor }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">{etiqueta}</dt>
      <dd className="mt-1 text-[14px] font-bold leading-[1.5] text-ink">{valor || "Sin registrar"}</dd>
    </div>
  );
}

function Comprobante({ donacion }) {
  const aporte =
    donacion.tipo_aporte === "monetaria"
      ? moneda.format(donacion.monto ?? 0)
      : [donacion.cantidad, donacion.descripcion_insumo].filter(Boolean).join(" × ");

  return (
    <dl className="mt-6 grid gap-4 rounded-card border border-border-soft bg-[#f7f7f5] p-5 sm:grid-cols-2">
      <Dato etiqueta="Comprobante" valor={`#${donacion.id}`} />
      <Dato etiqueta="Fecha" valor={fechaLarga.format(donacion.fecha_donacion)} />
      <Dato
        etiqueta="Donante"
        valor={donacion.adoptante?.nombre_completo ?? donacion.nombre_donante}
      />
      <div>
        <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">Estado</dt>
        <dd className="mt-1">
          <StatusBadge estado={donacion.estado} />
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">Aporte</dt>
        <dd className="mt-1 flex flex-wrap items-center gap-2 text-[14px] font-bold leading-[1.5] text-ink">
          <StatusBadge estado={donacion.tipo_aporte} />
          {aporte}
        </dd>
      </div>
    </dl>
  );
}

function calcularRango(periodo, desde, hasta) {
  const ahora = new Date();

  if (periodo === "semana") {
    const inicio = new Date(ahora);
    inicio.setDate(ahora.getDate() - 7);
    inicio.setHours(0, 0, 0, 0);
    return { gte: inicio, lte: ahora };
  }

  if (periodo === "mes") {
    const inicio = new Date(ahora);
    inicio.setDate(ahora.getDate() - 30);
    inicio.setHours(0, 0, 0, 0);
    return { gte: inicio, lte: ahora };
  }

  if (periodo === "personalizado") {
    return {
      gte: desde ? new Date(`${desde}T00:00:00`) : undefined,
      lte: hasta ? new Date(`${hasta}T23:59:59.999`) : undefined,
    };
  }

  return { gte: undefined, lte: undefined };
}

export default async function AdminDonacionesPage({ searchParams }) {
  const sesion = await getSesion();
  if (sesion?.rol === "voluntario") {
    redirect("/admin/mascotas");
  }

  const raw = await searchParams;
  const { nuevo, adoptante } = raw;
  const idNuevo = typeof nuevo === "string" ? Number(nuevo) : 0;
  const esPorAdoptante = adoptante === "1";

  const entradaFiltro = {
    tipo: typeof raw.tipo === "string" ? raw.tipo : "todas",
    periodo: typeof raw.periodo === "string" ? raw.periodo : "todo",
    desde: typeof raw.desde === "string" ? raw.desde : "",
    hasta: typeof raw.hasta === "string" ? raw.hasta : "",
  };
  const validado = esquemaFiltroInformeDonaciones.safeParse(entradaFiltro);
  const filtros = validado.success
    ? {
        tipo: validado.data.tipo,
        periodo: validado.data.periodo,
        desde: validado.data.desde ?? "",
        hasta: validado.data.hasta ?? "",
        estado: raw.estado === "recibida" || raw.estado === "por_coordinar" ? raw.estado : "todas",
      }
    : { tipo: "todas", periodo: "todo", desde: "", hasta: "", estado: "todas" };

  const rango = calcularRango(filtros.periodo, filtros.desde, filtros.hasta);

  const [donaciones, donacionNueva] = await Promise.all([
    prisma.donacion.findMany({
      where: {
        ...(filtros.tipo !== "todas" ? { tipo_aporte: filtros.tipo } : {}),
        ...(filtros.estado !== "todas" ? { estado: filtros.estado } : {}),
        ...(rango.gte || rango.lte
          ? {
              fecha_donacion: {
                ...(rango.gte ? { gte: rango.gte } : {}),
                ...(rango.lte ? { lte: rango.lte } : {}),
              },
            }
          : {}),
      },
      include: { adoptante: { select: { documento: true, nombre_completo: true } } },
      orderBy: { fecha_donacion: "desc" },
    }),
    Number.isSafeInteger(idNuevo) && idNuevo > 0
      ? prisma.donacion.findUnique({
          where: { id: idNuevo },
          include: { adoptante: { select: { nombre_completo: true } } },
        })
      : Promise.resolve(null),
  ]);

  const totalMonetario = donaciones
    .filter((donacion) => donacion.tipo_aporte === "monetaria" && donacion.estado === "recibida")
    .reduce((suma, donacion) => suma + (donacion.monto ?? 0), 0);

  const totalUnidadesEspecie = donaciones
    .filter((donacion) => donacion.tipo_aporte === "especie" && donacion.estado === "recibida")
    .reduce((suma, donacion) => suma + (donacion.cantidad ?? 0), 0);

  const hayFiltros =
    filtros.tipo !== "todas" || filtros.estado !== "todas" || filtros.periodo !== "todo";

  if (donacionNueva && esPorAdoptante) {
    return (
      <div className="mx-auto max-w-[820px] px-4 py-8 md:py-12">
        <GhostButton href="/admin/donaciones">← Volver a donaciones</GhostButton>
        <Toast mensaje={mensajes.aporteRegistrado} />
        <section className="mt-6 rounded-panel bg-surface p-6 shadow-soft">
          <h1 className="font-display text-2xl leading-[1.2] text-ink">
            ¡Aporte registrado!
          </h1>
          <p className="mt-2 text-sm leading-[1.7] text-ink-500">
            El aporte quedó asociado al adoptante y marcado como recibido.
          </p>
          <Comprobante donacion={donacionNueva} />
        </section>
      </div>
    );
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
            Donaciones
          </h1>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            {donaciones.length} {donaciones.length === 1 ? "aporte registrado" : "aportes registrados"}
          </p>
        </div>
        {sesion?.rol === "administrador" ? (
          <OutlineButton href="/admin/donaciones/informe" icono={FileText} tamano="sm">
            Generar informe PDF
          </OutlineButton>
        ) : null}
      </header>

      <DashPanel className="mb-6">
        <PanelHeading
          titulo="Registrar aporte de adoptante"
          subtitulo="Busca un adoptante por cédula y registra su aporte. Queda marcado como recibido."
        >
          <HandHeart size={20} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
        </PanelHeading>
        <DonacionForm buscarAdoptante />
      </DashPanel>

      <DashPanel>
        <PanelHeading
          titulo="Historial de aportes"
          subtitulo={`Recursos recibidos: ${moneda.format(totalMonetario)} en dinero · ${totalUnidadesEspecie} unidades en especie.`}
        />

        <HistorialDonacionesFiltros filtrosIniciales={filtros} />

        {donaciones.length === 0 ? (
          <EmptyState
            icono={hayFiltros ? SearchX : HandHeart}
            titulo={hayFiltros ? "No hay donaciones con esos filtros" : "Todavía no hay aportes"}
            texto={
              hayFiltros
                ? "Prueba con otro tipo, estado o rango de fechas para consultar los recursos disponibles."
                : "Los aportes monetarios y en especie aparecerán en esta tabla."
            }
          >
            {hayFiltros ? (
              <Chip href="/admin/donaciones" className="mt-2">
                Ver todo el historial
              </Chip>
            ) : null}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <caption className="sr-only">Donaciones registradas</caption>
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-500">
                  <th scope="col" className="py-2">
                    Fecha
                  </th>
                  <th scope="col" className="py-2">
                    Donante
                  </th>
                  <th scope="col" className="py-2">
                    Tipo
                  </th>
                  <th scope="col" className="py-2">
                    Detalle
                  </th>
                  <th scope="col" className="py-2">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {donaciones.map((donacion) => (
                  <tr key={donacion.id} className="border-t border-[#f1edef]">
                    <td className="py-3 text-[13px] text-ink-500">
                      {fecha.format(donacion.fecha_donacion)}
                    </td>
                    <td className="py-3 text-[14px] font-extrabold text-ink">
                      {donacion.nombre_donante}
                      {donacion.adoptante ? (
                        <span className="block text-[11px] font-semibold text-ink-500">
                          Adoptante · cédula {donacion.adoptante.documento}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3">
                      <StatusBadge estado={donacion.tipo_aporte} />
                    </td>
                    <td className="py-3 text-[13px] text-ink-500">
                      {donacion.tipo_aporte === "monetaria"
                        ? moneda.format(donacion.monto ?? 0)
                        : `${donacion.cantidad ?? 0} × ${donacion.descripcion_insumo ?? "insumo"}`}
                    </td>
                    <td className="py-3">
                      {donacion.estado === "por_coordinar" ? (
                        <ConfirmarRecepcion
                          donacionId={donacion.id}
                          nombreDonante={donacion.nombre_donante}
                        />
                      ) : (
                        <StatusBadge estado={donacion.estado} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashPanel>

      {typeof raw.recibida === "string" ? <Toast mensaje={mensajes.donacionRecibida} /> : null}
      {donacionNueva && !esPorAdoptante ? <Toast mensaje={mensajes.aporteRegistrado} /> : null}
    </>
  );
}
