"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSesion } from "@/lib/auth";
import { esquemaDonacion } from "@/lib/validaciones";

export async function registrarDonacion(_previo, formData) {
  const datos = {
    tipo_aporte: String(formData.get("tipo_aporte") ?? "").trim(),
    monto: String(formData.get("monto") ?? "").trim(),
    descripcion_insumo: String(formData.get("descripcion_insumo") ?? "").trim(),
    cantidad: String(formData.get("cantidad") ?? "").trim(),
    nombre_donante: String(formData.get("nombre_donante") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim(),
  };

  const resultado = esquemaDonacion.safeParse(datos);
  if (!resultado.success) {
    const errores = Object.fromEntries(
      resultado.error.issues.map((issue) => [String(issue.path[0]), issue.message])
    );
    return { camposFaltantes: Object.keys(errores), errores };
  }

  // usuario_id sale de la sesión: quien registró el aporte (nunca del formulario).
  const sesion = await getSesion();
  if (!sesion) {
    throw new Error("La sesión no es válida");
  }

  const { tipo_aporte } = resultado.data;
  const donacion = await prisma.donacion.create({
    data: {
      tipo_aporte,
      monto: tipo_aporte === "monetaria" ? (resultado.data.monto ?? null) : null,
      descripcion_insumo: tipo_aporte === "especie" ? (resultado.data.descripcion_insumo ?? null) : null,
      cantidad: tipo_aporte === "especie" ? (resultado.data.cantidad ?? null) : null,
      nombre_donante: resultado.data.nombre_donante,
      correo: resultado.data.correo || null,
      usuario_id: Number(sesion.id),
    },
  });

  revalidatePath("/admin/donaciones");
  redirect(`/admin/donaciones?nuevo=${donacion.id}`);
}
