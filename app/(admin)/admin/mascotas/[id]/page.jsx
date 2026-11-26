import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PawPrint, Pencil, Sparkles, Stethoscope, UserRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { mensajes } from "@/lib/mensajes";
import DashPanel from "@/components/DashPanel";
import GhostButton from "@/components/GhostButton";
import PrimaryButton from "@/components/PrimaryButton";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";

export const metadata = { title: "Ficha de mascota" };

const sexos = { macho: "Macho", hembra: "Hembra" };
const tamanos = { pequeño: "Pequeño", mediano: "Mediano", grande: "Grande" };
const especies = { perro: "Perro", gato: "Gato" };
const estados = { en_adopcion: "Disponible", adoptado: "Adoptado" };

const fecha = new Intl.DateTimeFormat("es-CO", { dateStyle: "short" });

function Dato({ etiqueta, valor }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">{etiqueta}</p>
      <p className="mt-1 text-[15px] font-bold leading-[1.4] text-ink">{valor || "Sin registrar"}</p>
    </div>
  );
}

export default async function FichaStaffPage({ params, searchParams }) {
  const [{ id }, { actualizada }] = await Promise.all([params, searchParams]);

  const numero = Number(id);
  if (!Number.isInteger(numero)) notFound();

  const [mascota, adopcion] = await Promise.all([
    prisma.mascota.findUnique({ where: { id: numero } }),
    prisma.solicitudAdopcion.findFirst({
      where: { mascota_id: numero, estado: "aprobada" },
      include: {
        adoptante: { select: { id: true, nombre_completo: true, documento: true } },
      },
      orderBy: { fecha_solicitud: "desc" },
    }),
  ]);
  if (!mascota) notFound();

  return (
    <div className="mx-auto max-w-[900px]">
      <GhostButton href="/admin/mascotas" icono={ArrowLeft}>
        Volver al listado
      </GhostButton>

      {actualizada === "1" ? <Toast mensaje={mensajes.fichaActualizada} /> : null}

      <header className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[34px] leading-[1.1] text-ink md:text-[42px]">
            {mascota.nombre}
          </h1>
          <StatusBadge estado={mascota.estado} className="translate-y-1.5" />
        </div>
        <PrimaryButton
          href={`/admin/mascotas/${mascota.id}/editar`}
          icono={Pencil}
          tamano="sm"
        >
          Editar ficha
        </PrimaryButton>
      </header>

      <div className="mt-6 grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="relative overflow-hidden rounded-[140px_20px_20px_20px] border border-border-soft bg-surface">
          {mascota.foto_url ? (
            <img
              src={mascota.foto_url}
              alt={`${mascota.nombre}, ${especies[mascota.especie] ?? mascota.especie} del refugio`}
              className="h-[260px] w-full object-cover md:h-[340px]"
            />
          ) : (
            <div className="flex h-[260px] w-full items-center justify-center bg-primary-50 md:h-[340px]">
              <PawPrint size={54} strokeWidth={2} aria-hidden="true" className="text-primary-200" />
            </div>
          )}
          <div className="absolute right-3 top-3 md:hidden">
            <StatusBadge estado={mascota.estado} />
          </div>
        </div>

        <div className="grid gap-6">
          <DashPanel>
            <h2 className="font-display text-2xl leading-[1.2] text-ink">Datos generales</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <Dato etiqueta="Especie" valor={especies[mascota.especie] ?? mascota.especie} />
              <Dato etiqueta="Raza" valor={mascota.raza} />
              <Dato etiqueta="Edad estimada" valor={mascota.edad_estimada} />
              <Dato etiqueta="Sexo" valor={sexos[mascota.sexo]} />
              <Dato etiqueta="Tamaño" valor={tamanos[mascota.tamano]} />
              <Dato etiqueta="Estado" valor={estados[mascota.estado] ?? mascota.estado} />
            </div>
          </DashPanel>

          {mascota.estado === "adoptado" ? (
            <DashPanel>
              <h2 className="flex items-center gap-2 font-display text-2xl leading-[1.2] text-ink">
                <UserRound size={20} strokeWidth={2} aria-hidden="true" />
                Adoptado por
              </h2>
              {adopcion ? (
                <div className="mt-4">
                  <p className="text-[15px] font-extrabold text-ink">
                    {adopcion.adoptante.nombre_completo}
                  </p>
                  <p className="mt-1 text-[13px] text-ink-500">
                    Cédula {adopcion.adoptante.documento}
                  </p>
                  <Link
                    href={`/admin/adoptantes/${adopcion.adoptante.id}/editar`}
                    className="mt-3 inline-block text-[13px] font-extrabold text-primary-600 underline-offset-2 hover:underline"
                  >
                    Ver perfil del adoptante
                  </Link>
                </div>
              ) : (
                <p className="mt-3 text-[14px] leading-[1.7] text-ink-500">
                  Esta mascota se marcó como adoptada manualmente y no tiene adoptante vinculado.
                </p>
              )}
            </DashPanel>
          ) : null}

          <DashPanel>
            <h2 className="flex items-center gap-2 font-display text-2xl leading-[1.2] text-ink">
              <Sparkles size={20} strokeWidth={2} aria-hidden="true" />
              Personalidad
            </h2>
            <p className="mt-3 text-[14px] leading-[1.7] text-ink-700">
              {mascota.personalidad || "Sin registrar."}
            </p>
          </DashPanel>

          <DashPanel>
            <h2 className="flex items-center gap-2 font-display text-2xl leading-[1.2] text-ink">
              <Stethoscope size={20} strokeWidth={2} aria-hidden="true" />
              Salud
            </h2>
            <p className="mt-3 text-[14px] leading-[1.7] text-ink-700">
              {mascota.salud_resumen || "Sin registrar."}
            </p>
          </DashPanel>

          <DashPanel>
            <h2 className="font-display text-2xl leading-[1.2] text-ink">Metadatos</h2>
            <dl className="mt-4 grid gap-5 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">
                  Id
                </dt>
                <dd className="mt-1 text-[15px] font-bold text-ink">#{mascota.id}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">
                  Fecha de registro
                </dt>
                <dd className="mt-1 text-[15px] font-bold text-ink">
                  {fecha.format(mascota.fecha_registro)}
                </dd>
              </div>
              <div className="sm:col-span-3">
                <dt className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">
                  Foto (URL)
                </dt>
                <dd className="mt-1 break-all text-[13px] text-ink-500">
                  {mascota.foto_url || "Sin registrar."}
                </dd>
              </div>
            </dl>
          </DashPanel>
        </div>
      </div>
    </div>
  );
}
