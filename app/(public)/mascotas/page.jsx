import Link from "next/link";
import { HeartHandshake, ArrowLeft, SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PetCard from "@/components/PetCard";
import Chip from "@/components/Chip";
import EmptyState from "@/components/EmptyState";
import PrimaryButton from "@/components/PrimaryButton";
import GhostButton from "@/components/GhostButton";

export const metadata = { title: "Mascotas en adopción" };

// US 1.4: filtros del catálogo por la información de la mascota.
const grupos = {
  especie: {
    titulo: "Especie",
    opciones: { perro: "Perros", gato: "Gatos" },
  },
  tamano: {
    titulo: "Tamaño",
    opciones: { pequeño: "Pequeño", mediano: "Mediano", grande: "Grande" },
  },
  sexo: {
    titulo: "Sexo",
    opciones: { macho: "Macho", hembra: "Hembra" },
  },
};

// Conserva los filtros activos y cambia (o quita) uno solo.
function urlCon(activos, cambios) {
  const nuevos = { ...activos, ...cambios };
  const busqueda = new URLSearchParams(
    Object.entries(nuevos).filter(([, valor]) => valor)
  ).toString();
  return busqueda ? `/mascotas?${busqueda}` : "/mascotas";
}

export default async function MascotasPage({ searchParams }) {
  const params = await searchParams;

  const activos = Object.fromEntries(
    Object.entries(grupos).map(([clave, grupo]) => [
      clave,
      Object.hasOwn(grupo.opciones, params[clave]) ? params[clave] : null,
    ])
  );

  const mascotas = await prisma.mascota.findMany({
    where: {
      estado: "en_adopcion",
      ...(activos.especie ? { especie: activos.especie } : {}),
      ...(activos.tamano ? { tamano: activos.tamano } : {}),
      ...(activos.sexo ? { sexo: activos.sexo } : {}),
    },
    orderBy: { fecha_registro: "desc" },
  });

  const hayFiltros = Object.values(activos).some(Boolean);

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
        className="mt-6 flex flex-wrap items-center gap-6 overflow-x-auto pb-1"
      >
        {Object.entries(grupos).map(([clave, grupo]) => (
          <div key={clave} className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            <p className="text-[11px] font-bold uppercase tracking-[1.7px] text-ink-400">
              {grupo.titulo}
            </p>
            <div className="flex gap-2">
              <Chip
                href={urlCon(activos, { [clave]: null })}
                activo={!activos[clave]}
                tono="oscuro"
              >
                Todos
              </Chip>
              {Object.entries(grupo.opciones).map(([valor, etiqueta]) => (
                <Chip
                  key={valor}
                  href={urlCon(activos, { [clave]: valor })}
                  activo={activos[clave] === valor}
                >
                  {etiqueta}
                </Chip>
              ))}
            </div>
          </div>
        ))}
        {hayFiltros ? (
          <Link
            href="/mascotas"
            className="shrink-0 whitespace-nowrap text-[13px] font-extrabold text-primary-600 underline-offset-2 hover:underline"
          >
            Limpiar filtros
          </Link>
        ) : null}
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
