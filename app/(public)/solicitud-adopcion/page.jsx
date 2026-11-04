import { HeartHandshake } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import SolicitudAdopcionForm from "@/components/SolicitudAdopcionForm";
import Toast from "@/components/Toast";
import { mensajes } from "@/lib/mensajes";

export const metadata = { title: "Solicitud de adopción" };

export default async function SolicitudAdopcionPage({ searchParams }) {
  const { mascota: mascotaQuery, ok } = await searchParams;
  const idSolicitado = typeof mascotaQuery === "string" ? Number(mascotaQuery) : 0;

  const mascotas = await prisma.mascota.findMany({
    where: { estado: "en_adopcion" },
    select: { id: true, nombre: true, especie: true },
    orderBy: { nombre: "asc" },
  });

  const mascotaInicial =
    Number.isSafeInteger(idSolicitado) && idSolicitado > 0
      ? mascotas.find((mascota) => mascota.id === idSolicitado) ?? null
      : null;

  if (ok === "solicitud") {
    return (
      <div className="mx-auto max-w-[820px] px-4 py-8 md:py-12">
        <GhostButton href="/mascotas">← Volver a mascotas</GhostButton>

        <Toast mensaje={mensajes.solicitudEnviada} />

        <section className="mt-6 rounded-panel bg-surface p-6 shadow-soft">
          <h2 className="font-display text-2xl leading-[1.2] text-ink">
            ¡Solicitud recibida!
          </h2>
          <p className="mt-2 max-w-[620px] text-sm leading-[1.7] text-ink-500">
            Gracias por escribirnos. El equipo del refugio revisará tu solicitud y se pondrá en
            contacto contigo para coordinar la visita.
          </p>
          <p className="mt-4 text-sm leading-[1.7] text-ink-500">
            ¿Te interesa conocer a otra mascota?{" "}
            <a href="/mascotas" className="font-bold text-primary-600 underline-offset-2 hover:underline">
              Vuelve al catálogo
            </a>
            .
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[820px] px-4 py-8 md:py-12">
      <GhostButton href="/mascotas">← Volver a mascotas</GhostButton>

      <header className="mt-6">
        <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
          Postular a una adopción
        </p>
        <h1 className="mt-2 font-display text-[36px] leading-[1.1] text-ink md:text-5xl">
          Solicitud de adopción
        </h1>
        <p className="mt-3 max-w-[620px] text-base leading-[1.7] text-ink-500">
          Cuéntanos sobre ti y tu hogar. El equipo del refugio revisará la solicitud y se pondrá en
          contacto contigo.
        </p>
      </header>

      {ok === "solicitud" ? <Toast mensaje={mensajes.solicitudEnviada} /> : null}

      {mascotas.length === 0 ? (
        <section className="mt-6 rounded-panel bg-surface p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">No hay mascotas disponibles por ahora</h2>
          <p className="mt-2 text-sm leading-[1.7] text-ink-500">
            Vuelve a consultar el catálogo más adelante para postularte a una adopción.
          </p>
        </section>
      ) : (
        <DashPanel className="mt-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-primary-50">
              <HeartHandshake
                size={22}
                strokeWidth={2}
                aria-hidden="true"
                className="text-primary-600"
              />
            </span>
            <div>
              <h2 className="font-display text-2xl leading-[1.2] text-ink">
                Cuéntanos sobre tu hogar
              </h2>
              <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
                Los campos marcados con * son obligatorios.
              </p>
            </div>
          </div>
          <SolicitudAdopcionForm
            mascotas={mascotas}
            mascotaInicial={mascotaInicial}
            origen="independiente"
          />
        </DashPanel>
      )}
    </div>
  );
}
