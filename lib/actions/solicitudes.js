"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { esquemaSolicitud } from "@/lib/validaciones";

export async function crearSolicitudAdopcion(_previo, formData) {
  const personas = String(formData.get("personas_en_hogar") ?? "").trim();

  const datos = {
    mascota_id: Number(formData.get("mascota_id")),
    documento: String(formData.get("documento") ?? "").trim(),
    nombre_completo: String(formData.get("nombre_completo") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    direccion: String(formData.get("direccion") ?? "").trim(),
    tipo_vivienda: String(formData.get("tipo_vivienda") ?? ""),
    personas_en_hogar: personas ? Number(personas) : undefined,
    animales_en_hogar: formData.get("animales_en_hogar") === "on",
    descripcion_vivienda: String(formData.get("descripcion_vivienda") ?? "").trim(),
    acepta_terminos: formData.get("acepta_terminos") === "on",
  };

  const resultado = esquemaSolicitud.safeParse(datos);
  if (!resultado.success) {
    const errores = Object.fromEntries(
      resultado.error.issues.map((issue) => [String(issue.path[0]), issue.message])
    );
    return { camposFaltantes: Object.keys(errores), errores };
  }

  const { mascota_id, documento, nombre_completo, correo, telefono, direccion, ...solicitud } =
    resultado.data;

  // US 4.1: si el adoptante no existe se crea en el momento; todo en una sola transacción.
  const registrada = await prisma.$transaction(async (tx) => {
    const mascotaDisponible = await tx.mascota.findFirst({
      where: { id: mascota_id, estado: "en_adopcion" },
      select: { id: true },
    });

    if (!mascotaDisponible) return false;

    const existente = await tx.adoptante.findUnique({ where: { documento } });
    const adoptante =
      existente ??
      (await tx.adoptante.create({
        data: { documento, nombre_completo, correo, telefono, direccion, estado: "activo" },
      }));

    await tx.solicitudAdopcion.create({
      data: {
        mascota_id,
        adoptante_id: adoptante.id,
        tipo_vivienda: solicitud.tipo_vivienda,
        animales_en_hogar: solicitud.animales_en_hogar,
        descripcion_vivienda: solicitud.descripcion_vivienda,
        personas_en_hogar: solicitud.personas_en_hogar,
        acepta_terminos: solicitud.acepta_terminos,
        estado: "en_revision",
      },
    });

    return true;
  });

  if (!registrada) {
    return {
      camposFaltantes: ["mascota_id"],
      errores: { mascota_id: "Selecciona una mascota que siga disponible para adopción." },
      mensaje: "La mascota seleccionada ya no está disponible. Elige otra para continuar.",
    };
  }

  revalidatePath(`/mascotas/${mascota_id}`);
  revalidatePath("/solicitud-adopcion");
  redirect(
    formData.get("origen") === "independiente"
      ? "/solicitud-adopcion?ok=solicitud"
      : `/mascotas/${mascota_id}?ok=solicitud`
  );
}
