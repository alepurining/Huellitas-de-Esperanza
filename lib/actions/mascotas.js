"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { esquemaMascota } from "@/lib/validaciones";

export async function crearMascota(_previo, formData) {
  const datos = {
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

  const resultado = esquemaMascota.safeParse(datos);
  if (!resultado.success) {
    const errores = Object.fromEntries(
      resultado.error.issues.map((issue) => [String(issue.path[0]), issue.message])
    );
    return { camposFaltantes: Object.keys(errores), errores };
  }

  const mascota = await prisma.mascota.create({
    data: {
      ...resultado.data,
      sexo: resultado.data.sexo || null,
      tamano: resultado.data.tamano || null,
      personalidad: resultado.data.personalidad || null,
      salud_resumen: resultado.data.salud_resumen || null,
      foto_url: resultado.data.foto_url || null,
    },
  });

  revalidatePath("/admin/mascotas");
  redirect(`/admin/mascotas?nueva=${mascota.id}`);
}
