"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { esquemaAdoptante, erroresDe } from "@/lib/validaciones";
import { mensajes } from "@/lib/mensajes";

export async function crearAdoptante(_previo, formData) {
  const datos = {
    documento: String(formData.get("documento") ?? "").trim(),
    nombre_completo: String(formData.get("nombre_completo") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    direccion: String(formData.get("direccion") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim(),
  };

  const resultado = esquemaAdoptante.safeParse(datos);
  if (!resultado.success) {
    return { ...erroresDe(resultado), valores: datos };
  }

  let adoptante;
  try {
    adoptante = await prisma.adoptante.create({
      data: {
        ...resultado.data,
        correo: resultado.data.correo || null,
        estado: "activo",
      },
    });
  } catch (error) {
    const destino = error instanceof Prisma.PrismaClientKnownRequestError ? error.meta?.target : null;
    const documentoDuplicado =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      (Array.isArray(destino)
        ? destino.includes("documento")
        : typeof destino === "string" && destino.includes("documento"));

    if (documentoDuplicado) {
      return {
        camposFaltantes: ["documento"],
        errores: { documento: mensajes.documentoDuplicado },
        mensaje: mensajes.documentoDuplicado,
        valores: datos,
      };
    }

    throw error;
  }

  revalidatePath("/admin/adoptantes");
  redirect(`/admin/adoptantes?nuevo=${adoptante.id}`);
}
