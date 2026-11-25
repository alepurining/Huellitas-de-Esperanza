import { HandHeart } from "lucide-react";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import DonacionForm from "@/components/DonacionForm";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";
import { prisma } from "@/lib/prisma";
import { mensajes } from "@/lib/mensajes";

export const metadata = { title: "Donar" };

const moneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const fecha = new Intl.DateTimeFormat("es-CO", { dateStyle: "long" });

function Dato({ etiqueta, valor }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">{etiqueta}</dt>
      <dd className="mt-1 text-[14px] font-bold leading-[1.5] text-ink">{valor || "Sin registrar"}</dd>
    </div>
  );
}

// US 3.4: comprobante con los datos del aporte que acaba de registrar el donante.
function Comprobante({ donacion }) {
  const aporte =
    donacion.tipo_aporte === "monetaria"
      ? moneda.format(donacion.monto ?? 0)
      : [donacion.cantidad, donacion.descripcion_insumo].filter(Boolean).join(" × ");

  return (
    <dl className="mt-6 grid gap-4 rounded-card border border-border-soft bg-[#f7f7f5] p-5 sm:grid-cols-2">
      <Dato etiqueta="Comprobante" valor={`#${donacion.id}`} />
      <Dato etiqueta="Fecha" valor={fecha.format(donacion.fecha_donacion)} />
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

export default async function DonarPage({ searchParams }) {
  const { nuevo } = await searchParams;
  const idNuevo = typeof nuevo === "string" ? Number(nuevo) : 0;

  const donacion =
    Number.isSafeInteger(idNuevo) && idNuevo > 0
      ? await prisma.donacion.findUnique({
          where: { id: idNuevo },
          include: { adoptante: { select: { nombre_completo: true } } },
        })
      : null;

  if (donacion) {
    return (
      <div className="mx-auto max-w-[820px] px-4 py-8 md:py-12">
        <GhostButton href="/">← Volver al inicio</GhostButton>
        <Toast mensaje={mensajes.donacionPublicaRegistrada} />
        <section className="mt-6 rounded-panel bg-surface p-6 shadow-soft">
          <h1 className="font-display text-2xl leading-[1.2] text-ink">
            ¡Gracias por apoyar al refugio!
          </h1>
          <p className="mt-2 text-sm leading-[1.7] text-ink-500">
            Registramos tu aporte. El equipo se comunicará contigo para coordinar la entrega; este
            formulario no procesa pagos en línea.
          </p>
          <Comprobante donacion={donacion} />
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[820px] px-4 py-8 md:py-12">
      <GhostButton href="/">← Volver al inicio</GhostButton>
      <header className="mt-6">
        <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
          Tu ayuda cambia vidas
        </p>
        <h1 className="mt-2 font-display text-[36px] leading-[1.1] text-ink md:text-5xl">
          Haz un aporte
        </h1>
        <p className="mt-3 max-w-[620px] text-base leading-[1.7] text-ink-500">
          Esta opción es para adoptantes ya registrados. Identifícate con tu cédula y cuéntanos qué
          aporte quieres coordinar. No se realizan cobros en línea.
        </p>
      </header>

      <DashPanel className="mt-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-mint">
            <HandHeart size={22} strokeWidth={2} aria-hidden="true" className="text-mint-ink" />
          </span>
          <div>
            <h2 className="font-display text-2xl leading-[1.2] text-ink">Cuéntanos tu aporte</h2>
            <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
              El equipo coordinará contigo cómo hacerlo llegar al refugio.
            </p>
          </div>
        </div>
        <DonacionForm publico />
      </DashPanel>
    </div>
  );
}
