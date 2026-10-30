import { notFound } from "next/navigation";
import { HeartHandshake, PawPrint, Stethoscope } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import GhostButton from "@/components/GhostButton";
import SecondaryButton from "@/components/SecondaryButton";
import AdoptionModal from "@/components/AdoptionModal";
import Toast from "@/components/Toast";
import { mensajes } from "@/lib/mensajes";

const sexos = { macho: "Macho", hembra: "Hembra" };
const tamanos = { pequeño: "Pequeño", mediano: "Mediano", grande: "Grande" };

export default async function FichaPage({ params, searchParams }) {
  const { id } = await params;
  const { ok } = await searchParams;

  const numero = Number(id);
  if (!Number.isInteger(numero)) notFound();

  const mascota = await prisma.mascota.findUnique({ where: { id: numero } });
  if (!mascota) notFound();

  const disponible = mascota.estado === "en_adopcion";
  const meta = [mascota.raza, mascota.edad_estimada, sexos[mascota.sexo], tamanos[mascota.tamano]]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8">
      <GhostButton href="/mascotas">← Volver al catálogo</GhostButton>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-[140px_20px_20px_20px] border border-border-soft bg-surface">
          {mascota.foto_url ? (
            <img
              src={mascota.foto_url}
              alt={`${mascota.nombre}, ${mascota.especie} en adopción`}
              className="h-[320px] w-full object-cover md:h-[520px]"
            />
          ) : (
            <div className="flex h-[320px] w-full items-center justify-center bg-primary-50 md:h-[520px]">
              <PawPrint size={64} strokeWidth={2} aria-hidden="true" className="text-primary-200" />
            </div>
          )}
          <div className="absolute left-4 top-4">
            <StatusBadge estado={mascota.estado} />
          </div>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
            Ficha #{mascota.id}
          </p>
          <h1 className="mt-2 font-display text-[42px] leading-[1.08] text-ink md:text-6xl">
            {mascota.nombre}
          </h1>
          <p className="mt-3 text-base leading-[1.7] text-ink-700">{meta}</p>

          {mascota.personalidad ? (
            <p className="mt-4 text-base leading-[1.7] text-ink-500">{mascota.personalidad}</p>
          ) : null}

          <section className="mt-6 rounded-card border border-border-soft bg-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-xl leading-[1.2] text-ink">
              <Stethoscope size={20} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
              Salud
            </h2>
            <p className="mt-2 text-sm leading-[1.7] text-ink-500">
              {mascota.salud_resumen ?? "Sin resumen de salud registrado."}
            </p>
            <p className="mt-2 text-[11px] leading-[1.4] text-ink-400">
              El refugio no publica historial clínico en esta versión.
            </p>
          </section>

          <div className="mt-6">
            {disponible ? (
              <AdoptionModal mascota={{ id: mascota.id, nombre: mascota.nombre }} />
            ) : (
              <SecondaryButton disabled>Esta mascota ya fue adoptada ❤️</SecondaryButton>
            )}
          </div>

          <p className="mt-4 flex items-center gap-2 text-[13px] leading-[1.5] text-ink-500">
            <HeartHandshake size={18} strokeWidth={2} aria-hidden="true" className="text-primary" />
            La adopción no tiene costo. Incluye seguimiento del refugio.
          </p>
        </div>
      </div>

      <section className="mt-12 rounded-card bg-cream p-6">
        <h2 className="font-display text-2xl leading-[1.2] text-ink">Cómo sigue el proceso</h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-4">
          {[
            "Envías la solicitud desde esta ficha.",
            "El equipo revisa tus datos y tu vivienda.",
            "Agendamos una visita al refugio.",
            "Firmas el compromiso y empieza la adaptación.",
          ].map((texto, indice) => (
            <li key={texto} className="text-sm leading-[1.7] text-ink-700">
              <span className="font-display text-xl font-semibold text-terracota">
                {String(indice + 1).padStart(2, "0")}
              </span>
              <p className="mt-1">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {ok === "solicitud" ? <Toast mensaje={mensajes.solicitudEnviada} /> : null}
    </div>
  );
}
