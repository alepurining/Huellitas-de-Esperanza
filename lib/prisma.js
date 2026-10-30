import { PrismaClient } from "@prisma/client";

// En desarrollo Next recarga los módulos en cada cambio: se reutiliza la instancia
// guardada en globalThis para no abrir una conexión nueva por recarga.
const globalParaPrisma = globalThis;

export const prisma = globalParaPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}

export default prisma;
