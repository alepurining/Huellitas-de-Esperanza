// prisma/seed.js — datos de muestra del MVP.
// Se ejecuta con `node prisma/seed.js` (JavaScript nativo, sin tsx/ts-node).
// Es idempotente: se puede correr varias veces sin duplicar registros.

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Una sola contraseña para los 3 usuarios de prueba (proyecto de clase).
const CONTRASENA_DEMO = "Huellitas2026";

const usuarios = [
  { nombre: "Administrador del refugio", correo: "admin@huellitas.co", rol: "administrador" },
  { nombre: "Veterinario del refugio", correo: "veterinario@huellitas.co", rol: "veterinario" },
  { nombre: "Voluntario del refugio", correo: "voluntario@huellitas.co", rol: "voluntario" },
];

const mascotas = [
  {
    nombre: "Bruno",
    raza: "Labrador mestizo",
    edad_estimada: "2 años",
    especie: "perro",
    sexo: "macho",
    tamano: "grande",
    estado: "en_adopcion",
    personalidad: "Juguetón y muy sociable. Le encanta correr detrás de la pelota y se lleva bien con niños.",
    salud_resumen: "Vacunas al día y desparasitado. Pendiente de esterilizar.",
    foto_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
  },
  {
    nombre: "Luna",
    raza: "Criolla",
    edad_estimada: "8 meses",
    especie: "gato",
    sexo: "hembra",
    tamano: "pequeño",
    estado: "en_adopcion",
    personalidad: "Tranquila y curiosa. Duerme todo el día cerca de la ventana y ronronea al primer cariño.",
    salud_resumen: "Vacunas al día y desparasitada.",
    foto_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
  },
  {
    nombre: "Max",
    raza: "Beagle",
    edad_estimada: "4 años",
    especie: "perro",
    sexo: "macho",
    tamano: "mediano",
    estado: "en_adopcion",
    personalidad: "Obediente y tranquilo. Camina bien con correa y le gusta olfatear todo el parque.",
    salud_resumen: "Vacunas al día, desparasitado y esterilizado.",
    foto_url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80",
  },
  {
    nombre: "Nala",
    raza: "Siamés mestiza",
    edad_estimada: "1 año",
    especie: "gato",
    sexo: "hembra",
    tamano: "mediano",
    estado: "en_adopcion",
    personalidad: "Habladora y cariñosa. Pide comida con maullidos largos y le gusta dormir en la cama.",
    salud_resumen: "Vacunas al día y desparasitada. Esterilizada.",
    foto_url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
  },
  {
    nombre: "Rocky",
    raza: "Criollo",
    edad_estimada: "3 años",
    especie: "perro",
    sexo: "macho",
    tamano: "grande",
    estado: "en_adopcion",
    personalidad: "Protector y leal. Necesita un hogar con patio y una familia que lo saque a caminar.",
    salud_resumen: "Vacunas al día y desparasitado.",
    foto_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
  },
  {
    nombre: "Milo",
    raza: "Naranja criollo",
    edad_estimada: "2 años",
    especie: "gato",
    sexo: "macho",
    tamano: "mediano",
    estado: "en_adopcion",
    personalidad: "Comelón y perezoso. Se lleva bien con otros gatos y pasa horas mirando por la ventana.",
    salud_resumen: "Vacunas al día, desparasitado y esterilizado.",
    foto_url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
  },
  {
    nombre: "Canela",
    raza: "Criolla",
    edad_estimada: "5 años",
    especie: "perro",
    sexo: "hembra",
    tamano: "mediano",
    estado: "en_adopcion",
    personalidad: "Muy tranquila y agradecida. Ideal para departamento y para personas mayores.",
    salud_resumen: "Vacunas al día y desparasitada. Esterilizada.",
    foto_url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
  },
  {
    nombre: "Simba",
    raza: "Atigrado",
    edad_estimada: "6 meses",
    especie: "gato",
    sexo: "macho",
    tamano: "pequeño",
    estado: "en_adopcion",
    personalidad: "Travieso y juguetón. Corre por toda la casa y se esconde dentro de las cajas.",
    salud_resumen: "Vacunas al día y desparasitado. Pendiente de esterilizar.",
    foto_url: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
  },
];

const adoptantes = [
  {
    documento: "1020304050",
    nombre_completo: "María Fernanda Gómez",
    telefono: "3001234567",
    direccion: "Calle 45 # 12-30, Medellín",
    correo: "maria.gomez@example.com",
    estado: "activo",
  },
  {
    documento: "1015203040",
    nombre_completo: "Carlos Andrés Ramírez",
    telefono: "3109876543",
    direccion: "Carrera 70 # 5-12, Bello",
    correo: "carlos.ramirez@example.com",
    estado: "activo",
  },
];

async function main() {
  const hash_contrasena = await bcrypt.hash(CONTRASENA_DEMO, 10);

  for (const usuario of usuarios) {
    await prisma.usuario.upsert({
      where: { correo: usuario.correo },
      update: { nombre: usuario.nombre, rol: usuario.rol, hash_contrasena },
      create: { ...usuario, hash_contrasena },
    });
  }

  // `mascota.nombre` no es único: se busca antes de crear para no duplicar.
  for (const mascota of mascotas) {
    const existente = await prisma.mascota.findFirst({ where: { nombre: mascota.nombre } });
    if (existente) {
      await prisma.mascota.update({ where: { id: existente.id }, data: mascota });
    } else {
      await prisma.mascota.create({ data: mascota });
    }
  }

  for (const adoptante of adoptantes) {
    await prisma.adoptante.upsert({
      where: { documento: adoptante.documento },
      update: adoptante,
      create: adoptante,
    });
  }

  // Dos aportes de muestra para que la tabla de donaciones no salga vacía.
  const administrador = await prisma.usuario.findUnique({ where: { correo: usuarios[0].correo } });
  const totalDonaciones = await prisma.donacion.count();

  if (administrador && totalDonaciones === 0) {
    await prisma.donacion.createMany({
      data: [
        {
          tipo_aporte: "monetaria",
          monto: 50000,
          nombre_donante: "Laura Pérez",
          correo: "laura.perez@example.com",
          usuario_id: administrador.id,
        },
        {
          tipo_aporte: "especie",
          descripcion_insumo: "Bulto de concentrado para perro adulto",
          cantidad: 10,
          nombre_donante: "Juan David Ospina",
          correo: "juan.ospina@example.com",
          usuario_id: administrador.id,
        },
      ],
    });
  }

  console.log("Seed listo:");
  console.log(`  ${usuarios.length} usuarios (contraseña demo: ${CONTRASENA_DEMO})`);
  console.log(`  ${mascotas.length} mascotas en adopción`);
  console.log(`  ${adoptantes.length} adoptantes`);
}

main()
  .catch((error) => {
    console.error("Error al ejecutar el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
