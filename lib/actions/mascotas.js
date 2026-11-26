"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSesion } from "@/lib/auth";
import { esquemaMascota, erroresDe } from "@/lib/validaciones";

function extraerDatosMascota(formData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    raza: String(formData.get("raza") ?? "").trim(),
    edad_estimada: String(formData.get("edad_estimada") ?? "").trim(),
    especie: String(formData.get("especie") ?? "").trim(),
    sexo: String(formData.get("sexo") ?? "").trim(),
    tamano: String(formData.get("tamano") ?? "").trim(),
    estado: String(formData.get("estado") ?? "").trim(),
    personalidad: String(formData.get("personalidad") ?? "").trim(),
    salud_resumen: String(formData.get("salud_resumen") ?? "").trim(),
    foto_url: String(formData.get("foto_url") ?? "").trim(),
  };
}

function normalizarDatosMascota(datos) {
  return {
    ...datos,
    sexo: datos.sexo || null,
    tamano: datos.tamano || null,
    personalidad: datos.personalidad || null,
    salud_resumen: datos.salud_resumen || null,
    foto_url: datos.foto_url || null,
  };
}

export async function crearMascota(_previo, formData) {
  const sesion = await getSesion();
  if (!sesion) {
    throw new Error("La sesión no es válida");
  }

  const datos = extraerDatosMascota(formData);

  const resultado = esquemaMascota.safeParse(datos);
  if (!resultado.success) {
    return { ...erroresDe(resultado), valores: datos };
  }

  const mascota = await prisma.mascota.create({
    data: normalizarDatosMascota(resultado.data),
  });

  revalidatePath("/admin/mascotas");
  revalidatePath("/mascotas");
  revalidatePath("/");
  redirect(`/admin/mascotas?nueva=${mascota.id}`);
}

export async function actualizarMascota(_previo, formData) {
  const sesion = await getSesion();
  if (!sesion) {
    throw new Error("La sesión no es válida");
  }

  const id = Number(formData.get("id"));
  const datos = extraerDatosMascota(formData);

  if (!Number.isSafeInteger(id) || id < 1) {
    return {
      camposFaltantes: ["id"],
      errores: {},
      mensaje: "No pudimos identificar la ficha que intentas actualizar.",
      valores: datos,
    };
  }

  const resultado = esquemaMascota.safeParse(datos);
  if (!resultado.success) {
    return { ...erroresDe(resultado), valores: datos };
  }

  const existente = await prisma.mascota.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existente) {
    return {
      camposFaltantes: ["id"],
      errores: {},
      mensaje: "La ficha de esta mascota ya no existe en la base de datos.",
      valores: datos,
    };
  }

  await prisma.mascota.update({
    where: { id },
    data: normalizarDatosMascota(resultado.data),
  });

  revalidatePath("/admin/mascotas");
  revalidatePath(`/admin/mascotas/${id}`);
  revalidatePath("/mascotas");
  revalidatePath(`/mascotas/${id}`);
  revalidatePath("/");
  redirect(`/admin/mascotas/${id}?actualizada=1`);
}
