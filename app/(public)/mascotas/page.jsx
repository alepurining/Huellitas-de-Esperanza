import { SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PetCard from "@/components/PetCard";
import Chip from "@/components/Chip";
import EmptyState from "@/components/EmptyState";
import PrimaryButton from "@/components/PrimaryButton";
import { HeartHandshake, ArrowLeft } from "lucide-react";
import GhostButton from "@/components/GhostButton";

export const metadata = { title: "Mascotas en adopción" };

export default async function MascotasPage({ searchParams }) {
  const { especie } = await searchParams;
  const filtro = especie === "perro" || especie === "gato" ? especie : null;

  const mascotas = await prisma.mascota.findMany({
    where: { estado: "en_adopcion", ...(filtro ? { especie: filtro } : {}) },
    orderBy: { fecha_registro: "desc" },
  });

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-12">
      <div>
        <GhostButton href="/" icono={ArrowLeft}>
          Volver al inicio
        </GhostButton>
      </div>
      <p className="mt-5 text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
        Conoce a tu nuevo mejor amigo
      </p>
      <h1 className="mt-3 font-display text-[38px] leading-[1.1] text-ink md:text-5xl">
        Mascotas en adopción
      </h1>
      <p className="mt-3 max-w-[620px] text-base leading-[1.7] text-ink-500">
        Todos están vacunados y desparasitados. Entra a la ficha para conocer su carácter, su salud y
        postularte para adoptarlo.
      </p>
      <div className="mt-5">
        <PrimaryButton href="/solicitud-adopcion" icono={HeartHandshake} tamano="sm">
          Llenar solicitud de adopción
        </PrimaryButton>
      </div>

      <div
        role="group"
        aria-label="Filtrar mascotas"
        className="mt-6 flex gap-2.5 overflow-x-auto pb-1"
      >
        <Chip href="/mascotas" activo={!filtro} tono="oscuro">
          Todos
        </Chip>
        <Chip href="/mascotas?especie=perro" activo={filtro === "perro"}>
          Perros
        </Chip>
        <Chip href="/mascotas?especie=gato" activo={filtro === "gato"}>
          Gatos
        </Chip>
      </div>

      <p className="mt-4 text-[13px] leading-[1.5] text-ink-500">
        {mascotas.length} {mascotas.length === 1 ? "amigo buscando hogar" : "amigos buscando hogar"}
      </p>

      {mascotas.length === 0 ? (
        <EmptyState
          icono={SearchX}
          titulo="No encontramos mascotas con ese filtro"
          texto="Prueba con otro filtro o revisa el catálogo completo."
        >
          <Chip href="/mascotas" className="mt-2">
            Ver todas
          </Chip>
        </EmptyState>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {mascotas.map((mascota) => (
            <li key={mascota.id}>
              <PetCard mascota={mascota} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
