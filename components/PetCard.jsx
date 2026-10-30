import Link from "next/link";
import { ArrowUpRight, Cat, Dog, PawPrint } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const sexos = { macho: "Macho", hembra: "Hembra" };
const tamanos = { pequeño: "Pequeño", mediano: "Mediano", grande: "Grande" };

function IconoEspecie({ especie }) {
  const Icono = especie === "gato" ? Cat : Dog;
  return (
    <Icono size={22} strokeWidth={2} aria-hidden="true" className="mt-1 shrink-0 text-primary" />
  );
}

function Foto({ mascota, clases }) {
  if (!mascota.foto_url) {
    return (
      <div className={`flex items-center justify-center bg-primary-50 ${clases}`}>
        <PawPrint size={48} strokeWidth={2} aria-hidden="true" className="text-primary-200" />
      </div>
    );
  }

  return (
    <img
      src={mascota.foto_url}
      alt={`${mascota.nombre}, ${mascota.especie} en adopción`}
      className={`object-cover ${clases}`}
    />
  );
}

export default function PetCard({ mascota, variante = "a" }) {
  const meta = [mascota.raza, mascota.edad_estimada, sexos[mascota.sexo]].filter(Boolean).join(" · ");

  if (variante === "b") {
    // Variante B (refugio2): grid compacta para tablet/móvil.
    return (
      <Link
        href={`/mascotas/${mascota.id}`}
        className="group flex h-full flex-col rounded-card border border-border-soft bg-surface p-3 shadow-card transition duration-[250ms] ease-out hover:-translate-y-1.5 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 motion-reduce:transform-none"
      >
        <div className="relative h-[240px] w-full overflow-hidden rounded-[14px]">
          <Foto mascota={mascota} clases="h-full w-full" />
          <div className="absolute bottom-3 left-3">
            <StatusBadge estado={mascota.estado} variante="accent" />
          </div>
        </div>

        <div className="px-[7px] pb-3 pt-3.5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-[25px] leading-[1.15] text-ink">{mascota.nombre}</h3>
            {mascota.sexo ? (
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#5c92c9]">
                {mascota.sexo === "macho" ? "M" : "H"}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">{meta}</p>
        </div>

        <span className="mt-auto rounded-[15px] bg-primary-50 px-3 py-3 text-center text-[13px] font-extrabold leading-[1.2] text-[#b74581] transition duration-200 group-hover:bg-primary-600 group-hover:text-white">
          Conocer a {mascota.nombre}
        </span>
      </Link>
    );
  }

  // Variante A (refugio1): ficha editorial para el catálogo de 4 columnas.
  return (
    <Link
      href={`/mascotas/${mascota.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line-r1 bg-surface transition duration-[250ms] ease-out hover:-translate-y-1.5 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 motion-reduce:transform-none"
    >
      <div className="relative h-[260px] w-full overflow-hidden">
        <Foto mascota={mascota} clases="h-full w-full" />
        <div className="absolute left-4 top-4">
          <StatusBadge estado={mascota.estado} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-[22px]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-3xl leading-[1.15] text-ink">{mascota.nombre}</h3>
          <IconoEspecie especie={mascota.especie} />
        </div>

        <p className="text-[13px] leading-[1.5] text-ink-500">{meta}</p>

        {mascota.tamano ? (
          <p className="text-xs leading-[1.5] text-ink-500">Tamaño {tamanos[mascota.tamano] ?? mascota.tamano}</p>
        ) : null}

        {mascota.personalidad ? (
          <p className="line-clamp-2 text-[13px] font-bold leading-[1.5] text-ink">{mascota.personalidad}</p>
        ) : null}

        {mascota.salud_resumen ? (
          <p className="line-clamp-1 text-[11px] leading-[1.4] text-ink-500">{mascota.salud_resumen}</p>
        ) : null}

        <div className="mt-auto flex items-center justify-end gap-1 border-t border-line-r1 pt-3">
          <span className="text-[13px] font-extrabold leading-[1.2] text-[#b74581] group-hover:underline">
            Conocer a {mascota.nombre}
          </span>
          <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" className="text-[#b74581]" />
        </div>
      </div>
    </Link>
  );
}
