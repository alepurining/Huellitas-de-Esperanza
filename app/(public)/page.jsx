import { HeartHandshake, House, MapPin, PawPrint, Sparkles, Stethoscope } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PetCard from "@/components/PetCard";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";
import GhostButton from "@/components/GhostButton";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

const valores = [
  {
    titulo: "Rescate con respeto",
    texto: "Cada animal llega con su historia. Lo acompañamos sin prisa hasta que esté listo.",
  },
  {
    titulo: "Adopción responsable",
    texto: "Conocemos a la familia antes de entregar una vida. Nada de adopciones impulsivas.",
  },
  {
    titulo: "Seguimiento real",
    texto: "Después de la adopción seguimos en contacto para acompañar la adaptación.",
  },
];

const pasos = [
  { titulo: "Conoce", texto: "Explora el catálogo y lee la ficha de quien te robó el corazón." },
  { titulo: "Postúlate", texto: "Llena la solicitud con tus datos y cómo es tu vivienda." },
  { titulo: "Conversamos", texto: "El equipo revisa la solicitud y agenda una visita al refugio." },
  { titulo: "Bienvenido a casa", texto: "Firmas el compromiso de adopción y empieza la adaptación." },
];

const ayudas = [
  {
    titulo: "Dona",
    texto: "Concentrado, medicinas o dinero para las jornadas veterinarias del mes.",
    icono: HeartHandshake,
  },
  {
    titulo: "Hogar temporal",
    texto: "Recibe a un animal por unas semanas mientras le encontramos familia.",
    icono: House,
  },
  {
    titulo: "Difunde",
    texto: "Comparte las fichas: una publicación puede encontrarle hogar a un rescatado.",
    icono: Sparkles,
  },
];

const pilares = [
  { titulo: "Salud", texto: "Vacunación, desparasitación y esterilización cuando el animal está listo.", icono: Stethoscope },
  { titulo: "Hogar temporal", texto: "Familias aliadas que cuidan mientras llega la adopción definitiva.", icono: House },
  { titulo: "Acompañamiento", texto: "Seguimiento a la familia adoptante durante la adaptación.", icono: HeartHandshake },
];

export default async function InicioPage() {
  const mascotas = await prisma.mascota.findMany({
    where: { estado: "en_adopcion" },
    orderBy: { fecha_registro: "desc" },
    take: 4,
  });

  return (
    <>
      <section id="inicio" className="bg-cream">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-4 py-14 md:min-h-[620px] md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
              Amor que deja huella
            </p>
            <h1 className="mt-4 font-display text-[46px] leading-[1.06] text-ink md:text-[76px]">
              Un hogar cambia <span className="italic text-primary-600">su historia</span>
            </h1>
            <p className="mt-5 max-w-[520px] text-lg leading-relaxed text-ink-700">
              Somos un refugio de Medellín que rescata, cuida y acompaña animales hasta encontrar la
              familia que merecen. Conoce a quienes hoy buscan hogar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/mascotas" icono={PawPrint}>
                Ver mascotas en adopción
              </PrimaryButton>
              <OutlineButton href="#ayudar" icono={HeartHandshake}>
                Cómo ayudar
              </OutlineButton>
            </div>
            <p className="mt-6 flex items-center gap-2 text-[13px] leading-[1.5] text-ink-500">
              <HeartHandshake size={18} strokeWidth={2} aria-hidden="true" className="text-primary" />
              Adoptar es un compromiso de por vida, no un regalo.
            </p>
          </div>

          <div>
            <div className="overflow-hidden rounded-[180px_180px_24px_24px] border border-border-soft bg-surface">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80"
                alt="Perro rescatado del refugio mirando a cámara"
                className="h-[320px] w-full object-cover md:h-[500px]"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-card bg-surface px-5 py-4 shadow-soft">
              <div>
                <p className="font-display text-lg text-ink">Bruno y sus amigos</p>
                <p className="text-[12px] leading-[1.5] text-ink-500">
                  Ocho historias esperando familia
                </p>
              </div>
              <PawPrint size={22} strokeWidth={2} aria-hidden="true" className="text-primary" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border-soft bg-surface">
        <div className="mx-auto grid max-w-[1180px] gap-6 px-4 py-12 md:grid-cols-3">
          {valores.map((valor) => (
            <div key={valor.titulo} className="rounded-card border border-border-soft bg-bg p-6">
              <Sparkles size={24} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
              <h2 className="mt-3 font-display text-xl leading-[1.2] text-ink">{valor.titulo}</h2>
              <p className="mt-2 text-sm leading-[1.7] text-ink-500">{valor.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="adoptar" className="bg-bg">
        <div className="mx-auto max-w-[1180px] px-4 py-16">
          <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
            Conoce a tu nuevo mejor amigo
          </p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-[34px] leading-[1.12] text-ink md:text-5xl">
                Buscan hogar
              </h2>
              <p className="mt-2 max-w-[560px] text-base leading-[1.7] text-ink-500">
                Cada ficha cuenta su historia, su salud y cómo es su carácter. Entra a la que te
                llame la atención.
              </p>
            </div>
            <GhostButton href="/mascotas">Ver el catálogo completo</GhostButton>
          </div>

          {mascotas.length === 0 ? (
            <EmptyState
              titulo="Todavía no hay mascotas publicadas"
              texto="El refugio puede registrar la primera ficha desde el panel privado."
            >
              <PrimaryButton href="/login" tamano="sm" className="mt-2">
                Entrar al panel
              </PrimaryButton>
            </EmptyState>
          ) : (
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {mascotas.map((mascota) => (
                <li key={mascota.id}>
                  <PetCard mascota={mascota} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="proceso" className="bg-cream">
        <div className="mx-auto max-w-[1180px] px-4 py-16">
          <h2 className="font-display text-[34px] leading-[1.12] text-ink md:text-5xl">
            Cómo es adoptar
          </h2>
          <p className="mt-2 max-w-[560px] text-base leading-[1.7] text-ink-500">
            Cuatro pasos, sin costos y con acompañamiento del refugio.
          </p>

          <ol className="mt-8 grid gap-5 md:grid-cols-4">
            {pasos.map((paso, indice) => (
              <li key={paso.titulo} className="rounded-card border border-border-soft bg-surface p-5">
                <span className="font-display text-2xl font-semibold text-terracota">
                  {String(indice + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-xl leading-[1.2] text-ink">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-[1.7] text-ink-500">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="ayudar" className="bg-sage-600">
        <div className="mx-auto max-w-[1180px] px-4 py-16">
          <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
            Tu ayuda cambia vidas
          </p>
          <h2 className="mt-3 font-display text-[34px] leading-[1.12] text-forest md:text-5xl">
            Cómo ayudar
          </h2>
          <p className="mt-3 max-w-[620px] text-base leading-[1.7] text-ink-700">
            No todo el mundo puede adoptar, pero todos podemos aportar. Estas son las tres formas en
            las que el refugio sostiene el día a día.
          </p>

          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {ayudas.map((ayuda) => {
              const Icono = ayuda.icono;
              return (
                <li
                  key={ayuda.titulo}
                  className="rounded-card border border-border-soft bg-surface p-6 shadow-soft"
                >
                  <Icono size={24} strokeWidth={2} aria-hidden="true" className="text-mint-ink" />
                  <h3 className="mt-3 font-display text-xl leading-[1.2] text-ink">{ayuda.titulo}</h3>
                  <p className="mt-2 text-sm leading-[1.7] text-ink-700">{ayuda.texto}</p>
                </li>
              );
            })}
          </ul>

         
          <OutlineButton href="#ubicacion" className="mt-2">
            Ver ubicación y contacto
          </OutlineButton>
        </div>
      </section>

      <section id="nosotros" className="bg-surface">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
              El refugio
            </p>
            <h2 className="mt-3 font-display text-[34px] leading-[1.12] text-ink md:text-5xl">
              Nosotros
            </h2>
            <p className="mt-4 text-base leading-[1.7] text-ink-700">
              Huellitas de Esperanza nació en Medellín con una idea simple: ningún animal debería
              quedarse sin una familia que lo cuide. Trabajamos con voluntarios, veterinarios aliados
              y hogares temporales.
            </p>
            <p className="mt-3 text-base leading-[1.7] text-ink-500">
              Nuestra misión es rescatar, rehabilitar y encontrar hogares responsables. Nuestra visión
              es una ciudad donde las adopciones reemplacen al abandono.
            </p>
          </div>

          <ul className="grid gap-4">
            {pilares.map((pilar) => {
              const Icono = pilar.icono;
              return (
                <li
                  key={pilar.titulo}
                  className="flex items-start gap-4 rounded-card border border-border-soft bg-bg p-5"
                >
                  <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-primary-50">
                    <Icono size={21} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg leading-[1.2] text-ink">{pilar.titulo}</h3>
                    <p className="mt-1 text-sm leading-[1.6] text-ink-500">{pilar.texto}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="ubicacion" className="bg-cream">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[1.7px] text-primary-600">
              Visítanos
            </p>
            <h2 className="mt-3 font-display text-[34px] leading-[1.12] text-ink md:text-5xl">
              Ubicación y contacto
            </h2>
            <p className="mt-4 flex items-center gap-2 text-base leading-[1.7] text-ink-700">
              <MapPin size={20} strokeWidth={2} aria-hidden="true" className="text-primary-600" />
              Carrera 43A # 10-25, El Poblado · Medellín
            </p>
            <p className="mt-2 text-sm leading-[1.7] text-ink-500">
              Jornadas de adopción sábados de 10:00 am a 04:00 pm. Escríbenos a
              adopcion02@huellitas.com
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/mascotas" icono={PawPrint}>
              Ver mascotas
            </PrimaryButton>
            <OutlineButton href="/login">Soy del equipo</OutlineButton>
          </div>
        </div>
      </section>
    </>
  );
}
