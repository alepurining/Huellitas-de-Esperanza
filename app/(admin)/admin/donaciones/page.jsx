import { prisma } from "@/lib/prisma";
import DashPanel from "@/components/DashPanel";
import PanelHeading from "@/components/PanelHeading";
import DonacionForm from "@/components/DonacionForm";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";
import EmptyState from "@/components/EmptyState";
import { HandHeart } from "lucide-react";
import { mensajes } from "@/lib/mensajes";

export const metadata = { title: "Donaciones" };

const moneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const fecha = new Intl.DateTimeFormat("es-CO", { dateStyle: "short" });

export default async function AdminDonacionesPage({ searchParams }) {
  const { nuevo } = await searchParams;
  const idNuevo = typeof nuevo === "string" ? Number(nuevo) : 0;

  const [donaciones, donacionNueva] = await Promise.all([
    prisma.donacion.findMany({ orderBy: { fecha_donacion: "desc" } }),
    Number.isSafeInteger(idNuevo) && idNuevo > 0
      ? prisma.donacion.findUnique({ where: { id: idNuevo } })
      : Promise.resolve(null),
  ]);

  const totalMonetario = donaciones
    .filter((donacion) => donacion.tipo_aporte === "monetaria")
    .reduce((suma, donacion) => suma + (donacion.monto ?? 0), 0);

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
          titulo="Registrar aporte"
          subtitulo="Elige si es dinero o un insumo y diligencia los campos. Solo personal del refugio."
        >
          <HandHeart size={20} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
        </PanelHeading>
        <DonacionForm />
      </DashPanel>

      <DashPanel>
        <PanelHeading
          titulo="Aportes recibidos"
          subtitulo={`Dinero registrado: ${moneda.format(totalMonetario)} · Los aportes en especie se cuentan por cantidad.`}
        />

        {donaciones.length === 0 ? (
          <EmptyState
            icono={HandHeart}
            titulo="Todavía no hay aportes"
            texto="Los aportes monetarios y en especie aparecerán en esta tabla."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
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
                    </td>
                    <td className="py-3">
                      <StatusBadge estado={donacion.tipo_aporte} />
                    </td>
                    <td className="py-3 text-[13px] text-ink-500">
                      {donacion.tipo_aporte === "monetaria"
                        ? moneda.format(donacion.monto ?? 0)
                        : `${donacion.cantidad ?? 0} × ${donacion.descripcion_insumo ?? "insumo"}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashPanel>

      {donacionNueva ? <Toast mensaje={mensajes.aporteRegistrado} /> : null}
    </>
  );
}
