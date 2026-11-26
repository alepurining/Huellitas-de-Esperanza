"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSesion } from "@/lib/auth";
import {
  esquemaAdoptante,
  esquemaActualizarAdoptante,
  erroresDe,
} from "@/lib/validaciones";
import { mensajes } from "@/lib/mensajes";

function extraerDatosAdoptante(formData, incluirEstado = false) {
  const datos = {
    documento: String(formData.get("documento") ?? "").trim(),
    nombre_completo: String(formData.get("nombre_completo") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    direccion: String(formData.get("direccion") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim(),
  };

  if (incluirEstado) {
    datos.estado = String(formData.get("estado") ?? "").trim();
  }

  return datos;
}

function esErrorDocumentoDuplicado(error) {
  const destino = error instanceof Prisma.PrismaClientKnownRequestError ? error.meta?.target : null;
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    (Array.isArray(destino)
      ? destino.includes("documento")
      : typeof destino === "string" && destino.includes("documento"))
  );
}

export async function crearAdoptante(_previo, formData) {
  const sesion = await getSesion();
  if (!sesion) {
    throw new Error("La sesión no es válida");
  }

  const datos = extraerDatosAdoptante(formData);

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
    if (esErrorDocumentoDuplicado(error)) {
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

export async function actualizarAdoptante(_previo, formData) {
  const sesion = await getSesion();
  if (!sesion) {
    throw new Error("La sesión no es válida");
  }

  const id = Number(formData.get("id"));
  const datos = extraerDatosAdoptante(formData, true);

  if (!Number.isSafeInteger(id) || id < 1) {
    return {
      camposFaltantes: ["id"],
      errores: {},
      mensaje: "No pudimos identificar el perfil del adoptante que intentas actualizar.",
      valores: datos,
    };
  }

  const resultado = esquemaActualizarAdoptante.safeParse(datos);
  if (!resultado.success) {
    return { ...erroresDe(resultado), valores: datos };
  }

  const existente = await prisma.adoptante.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existente) {
    return {
      camposFaltantes: ["id"],
      errores: {},
      mensaje: "El adoptante ya no existe en la base de datos.",
      valores: datos,
    };
  }

  try {
    await prisma.adoptante.update({
      where: { id },
      data: {
        ...resultado.data,
        correo: resultado.data.correo || null,
      },
    });
  } catch (error) {
    if (esErrorDocumentoDuplicado(error)) {
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
  revalidatePath(`/admin/adoptantes/${id}/editar`);
  revalidatePath("/admin/solicitudes");
  revalidatePath("/admin/donaciones");
  redirect(`/admin/adoptantes?actualizado=${id}`);
}
