import { prisma } from "@/lib/prisma";
import DashPanel from "@/components/DashPanel";
import PanelHeading from "@/components/PanelHeading";
import DonacionForm from "@/components/DonacionForm";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";
import EmptyState from "@/components/EmptyState";
import { HandHeart } from "lucide-react";
import { mensajes } from "@/lib/mensajes";
import { confirmarRecepcionDonacion } from "@/lib/actions/donaciones";
import PrimaryButton from "@/components/PrimaryButton";
import GhostButton from "@/components/GhostButton";

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

export default async function AdminDonacionesPage({ searchParams }) {
  const { nuevo, adoptante } = await searchParams;
  const idNuevo = typeof nuevo === "string" ? Number(nuevo) : 0;
  const esPorAdoptante = adoptante === "1";

  const [donaciones, donacionNueva] = await Promise.all([
    prisma.donacion.findMany({
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
      <header className="mb-6">
        <h1 className="text-[28px] font-extrabold leading-[1.2] text-ink md:text-[34px]">
          Donaciones
        </h1>
        <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
          {donaciones.length} {donaciones.length === 1 ? "aporte registrado" : "aportes registrados"}
        </p>
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
          titulo="Aportes registrados"
          subtitulo={`Dinero recibido: ${moneda.format(totalMonetario)} · Los aportes en especie se cuentan por cantidad.`}
        />

        {donaciones.length === 0 ? (
          <EmptyState
            icono={HandHeart}
            titulo="Todavía no hay aportes"
            texto="Los aportes monetarios y en especie aparecerán en esta tabla."
          />
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
                        <form action={confirmarRecepcionDonacion}>
                          <input type="hidden" name="id" value={donacion.id} />
                          <PrimaryButton type="submit" tamano="sm">
                            Marcar recibido
                          </PrimaryButton>
                        </form>
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

      {donacionNueva && !esPorAdoptante ? <Toast mensaje={mensajes.aporteRegistrado} /> : null}
    </>
  );
}
