import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft, House, PawPrint, UserRound, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { mensajes } from "@/lib/mensajes";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";
import DecisionSolicitud from "@/components/DecisionSolicitud";

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
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const numero = Number(id);
  if (!Number.isSafeInteger(numero) || numero < 1) notFound();

  const solicitud = await prisma.solicitudAdopcion.findUnique({
    where: { id: numero },
    include: {
      adoptante: true,
      mascota: { select: { id: true, nombre: true, especie: true, raza: true, estado: true } },
    },
  });
  if (!solicitud) notFound();

  const baseToast =
    sp.actualizada === "1"
      ? sp.mensajeEnviado === "1"
        ? mensajes.mensajeEnviadoAdoptante
        : mensajes.solicitudActualizada
      : null;
  const toastMensaje =
    baseToast && Number(sp.rechazadas) > 0
      ? `${baseToast} ${mensajes.solicitudesRechazadasPorAdopcion}`
      : baseToast;

  return (
    <div className="mx-auto max-w-[980px]">
      <GhostButton href="/admin/solicitudes" icono={ArrowLeft}>
        Volver a solicitudes
      </GhostButton>

      {toastMensaje ? <Toast mensaje={toastMensaje} /> : null}

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
          {solicitud.mascota.estado === "adoptado" && solicitud.estado !== "aprobada" ? (
            <p className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-warning-50 px-3 py-2 text-xs font-medium text-warning-700">
              <AlertCircle size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              Esta mascota ya fue adoptada en otra solicitud. Solo puedes rechazar esta.
            </p>
          ) : null}
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
          <h2 className="flex items-center gap-2 font-display text-2xl leading-[1.2] text-ink">
            <MessageCircle size={20} aria-hidden="true" />
            Decisión y notificación
          </h2>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            Selecciona el nuevo estado de la solicitud y, si lo deseas, escribe un mensaje que recibirá{" "}
            <strong>{solicitud.adoptante.nombre_completo}</strong> en su correo electrónico.
          </p>
          <DecisionSolicitud
            solicitudId={solicitud.id}
            correoAdoptante={solicitud.adoptante.correo ?? null}
          />
        </DashPanel>
      </div>
    </div>
  );
}
