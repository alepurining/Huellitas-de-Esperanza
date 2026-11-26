import { redirect } from "next/navigation";
import { ArrowLeft, Coins, HandHeart, PackageOpen, SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSesion } from "@/lib/auth";
import { esquemaFiltroInformeDonaciones } from "@/lib/validaciones";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import Chip from "@/components/Chip";
import InformeDonacionesControles from "@/components/InformeDonacionesControles";

export const metadata = { title: "Informe de donaciones" };

const moneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const fechaCorta = new Intl.DateTimeFormat("es-CO", { dateStyle: "short" });
const fechaHora = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeStyle: "short",
});

const etiquetasTipo = {
  todas: "Monetarias y en especie",
  monetaria: "Solo monetarias",
  especie: "Solo en especie",
};

function calcularRango(periodo, desde, hasta) {
  const ahora = new Date();

  if (periodo === "semana") {
    const inicio = new Date(ahora);
    inicio.setDate(ahora.getDate() - 7);
    inicio.setHours(0, 0, 0, 0);
    return { gte: inicio, lte: ahora, texto: "Última semana (7 días)" };
  }

  if (periodo === "mes") {
    const inicio = new Date(ahora);
    inicio.setDate(ahora.getDate() - 30);
    inicio.setHours(0, 0, 0, 0);
    return { gte: inicio, lte: ahora, texto: "Último mes (30 días)" };
  }

  if (periodo === "personalizado") {
    const gte = desde ? new Date(`${desde}T00:00:00`) : undefined;
    const lte = hasta ? new Date(`${hasta}T23:59:59.999`) : undefined;
    const partes = [
      desde ? `desde ${desde}` : null,
      hasta ? `hasta ${hasta}` : null,
    ].filter(Boolean);
    return {
      gte,
      lte,
      texto: partes.length ? `Personalizado (${partes.join(" ")})` : "Todo el historial",
    };
  }

  return { gte: undefined, lte: undefined, texto: "Todo el historial" };
}

export default async function InformeDonacionesPage({ searchParams }) {
  const sesion = await getSesion();
  if (sesion?.rol !== "administrador") {
    redirect(sesion?.rol === "voluntario" ? "/admin/mascotas" : "/admin/donaciones");
  }

  const raw = await searchParams;
  const entrada = {
    tipo: typeof raw.tipo === "string" ? raw.tipo : "todas",
    periodo: typeof raw.periodo === "string" ? raw.periodo : "todo",
    desde: typeof raw.desde === "string" ? raw.desde : "",
    hasta: typeof raw.hasta === "string" ? raw.hasta : "",
  };

  const validado = esquemaFiltroInformeDonaciones.safeParse(entrada);
  const filtros = validado.success
    ? {
        tipo: validado.data.tipo,
        periodo: validado.data.periodo,
        desde: validado.data.desde ?? "",
        hasta: validado.data.hasta ?? "",
      }
    : { tipo: "todas", periodo: "todo", desde: "", hasta: "" };

  const rango = calcularRango(filtros.periodo, filtros.desde, filtros.hasta);

  const donaciones = await prisma.donacion.findMany({
    where: {
      ...(filtros.tipo !== "todas" ? { tipo_aporte: filtros.tipo } : {}),
      ...(rango.gte || rango.lte
        ? {
            fecha_donacion: {
              ...(rango.gte ? { gte: rango.gte } : {}),
              ...(rango.lte ? { lte: rango.lte } : {}),
            },
          }
        : {}),
    },
    include: {
      adoptante: { select: { documento: true } },
    },
    orderBy: { fecha_donacion: "desc" },
  });

  const totalMonetarioRecibido = donaciones
    .filter((d) => d.tipo_aporte === "monetaria" && d.estado === "recibida")
    .reduce((suma, d) => suma + (d.monto ?? 0), 0);

  const totalMonetarioPendiente = donaciones
    .filter((d) => d.tipo_aporte === "monetaria" && d.estado === "por_coordinar")
    .reduce((suma, d) => suma + (d.monto ?? 0), 0);

  const totalUnidadesEspecie = donaciones
    .filter((d) => d.tipo_aporte === "especie")
    .reduce((suma, d) => suma + (d.cantidad ?? 0), 0);

  return (
    <>
      <div className="mb-5 print:hidden">
        <GhostButton href="/admin/donaciones" icono={ArrowLeft}>
          Volver a donaciones
        </GhostButton>
      </div>

      <header className="mb-6 print:hidden">
        <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
          Informe de donaciones (PDF)
        </h1>
        <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
          Consulta las métricas consolidadas y exporta el reporte en PDF para la toma de decisiones.
        </p>
      </header>

      <InformeDonacionesControles
        filtrosIniciales={filtros}
        totalResultados={donaciones.length}
      />

      {/* Área imprimible del informe */}
      <section aria-label="Vista previa del informe de donaciones" className="space-y-6">
        <DashPanel className="print:border print:border-border-soft print:shadow-none">
          <div className="flex flex-col gap-3 border-b border-border-soft pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
                Huellitas de Esperanza · Refugio Medellín
              </p>
              <h2 className="mt-1 font-display text-2xl leading-[1.2] text-ink md:text-3xl">
                Informe ejecutivo de donaciones
              </h2>
            </div>
            <div className="text-[12px] leading-[1.6] text-ink-500 sm:text-right">
              <p>
                <strong className="text-ink">Generado:</strong> {fechaHora.format(new Date())}
              </p>
              <p>
                <strong className="text-ink">Responsable:</strong> {sesion?.nombre ?? "Staff"} (
                {sesion?.rol ?? "—"})
              </p>
            </div>
          </div>

          <dl className="mt-4 grid gap-3 text-[13px] sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">
                Tipo incluido
              </dt>
              <dd className="mt-0.5 font-bold text-ink">{etiquetasTipo[filtros.tipo]}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">
                Período consultado
              </dt>
              <dd className="mt-0.5 font-bold text-ink">{rango.texto}</dd>
            </div>
          </dl>
        </DashPanel>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-card bg-surface p-5 shadow-soft print:border print:border-border-soft print:shadow-none">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[15px] bg-primary-50">
              <HandHeart size={21} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
            </span>
            <div>
              <p className="text-[13px] text-ink-500">Aportes en el período</p>
              <p className="font-display text-[30px] font-semibold leading-none text-ink">
                {donaciones.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-card bg-surface p-5 shadow-soft print:border print:border-border-soft print:shadow-none">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[15px] bg-success-50">
              <Coins size={21} strokeWidth={2} aria-hidden="true" className="text-success-700" />
            </span>
            <div>
              <p className="text-[13px] text-ink-500">Dinero recibido</p>
              <p className="font-display text-[26px] font-semibold leading-none text-ink">
                {moneda.format(totalMonetarioRecibido)}
              </p>
              {totalMonetarioPendiente > 0 ? (
                <p className="mt-1 text-[11px] font-bold text-warning-700">
                  + {moneda.format(totalMonetarioPendiente)} por coordinar
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-card bg-surface p-5 shadow-soft print:border print:border-border-soft print:shadow-none">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[15px] bg-warning-50">
              <PackageOpen size={21} strokeWidth={2} aria-hidden="true" className="text-warning-700" />
            </span>
            <div>
              <p className="text-[13px] text-ink-500">Unidades en especie</p>
              <p className="font-display text-[30px] font-semibold leading-none text-ink">
                {totalUnidadesEspecie}
              </p>
            </div>
          </div>
        </div>

        <DashPanel className="print:border print:border-border-soft print:shadow-none">
          <h3 className="font-display text-2xl leading-[1.2] text-ink">
            Detalle de donaciones ({donaciones.length})
          </h3>

          {donaciones.length === 0 ? (
            <EmptyState
              icono={SearchX}
              titulo="No hay donaciones en este período"
              texto="Prueba ampliando el rango de fechas o seleccionando todos los tipos de aporte."
            >
              <Chip href="/admin/donaciones/informe" className="mt-2 print:hidden">
                Ver todo el historial
              </Chip>
            </EmptyState>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left print:min-w-0">
                <caption className="sr-only">Detalle de donaciones incluidas en el informe</caption>
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
                        {fechaCorta.format(donacion.fecha_donacion)}
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
                      <td className="py-3 text-[13px] text-ink-700">
                        {donacion.tipo_aporte === "monetaria"
                          ? moneda.format(donacion.monto ?? 0)
                          : `${donacion.cantidad ?? 0} × ${donacion.descripcion_insumo ?? "insumo"}`}
                      </td>
                      <td className="py-3">
                        <StatusBadge estado={donacion.estado} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashPanel>
      </section>
    </>
  );
}
