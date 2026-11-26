"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSesion } from "@/lib/auth";
import { esquemaSolicitud, erroresDe } from "@/lib/validaciones";

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
    return { ...erroresDe(resultado), valores: datos };
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
      valores: datos,
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

export async function actualizarEstadoSolicitud(_previo, formData) {
  const sesion = await getSesion();
  if (!sesion) {
    return { error: "La sesión no es válida. Vuelve a iniciar sesión." };
  }

  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) {
    return { error: "El identificador de la solicitud no es válido." };
  }

  const estado = String(formData.get("estado") ?? "");
  if (!["en_revision", "aprobada", "rechazada"].includes(estado)) {
    return { error: "Selecciona un estado válido para la solicitud." };
  }

  const mensaje = String(formData.get("mensaje") ?? "").trim().slice(0, 500);

  // US 2.4: la solicitud aprobada es el vínculo real adoptante ↔ mascota.
  // Todo pasa en una transacción para que ficha y estado de la mascota nunca queden
  // desincronizados de la decisión.
  const resultado = await prisma.$transaction(async (tx) => {
    const solicitud = await tx.solicitudAdopcion.findUnique({
      where: { id },
      include: {
        mascota: { select: { id: true } },
        adoptante: { select: { correo: true, nombre_completo: true } },
      },
    });
    if (!solicitud) {
      return { error: "La solicitud ya no existe. Vuelve a la bandeja y elige otra." };
    }

    const otraAprobada = await tx.solicitudAdopcion.findFirst({
      where: { mascota_id: solicitud.mascota_id, estado: "aprobada", id: { not: id } },
      select: { id: true },
    });
    if (estado === "aprobada" && otraAprobada) {
      return {
        error: `Esta mascota ya fue adoptada en la solicitud #${otraAprobada.id}. Revisa esa solicitud antes de aprobar esta.`,
      };
    }

    await tx.solicitudAdopcion.update({ where: { id }, data: { estado } });

    let rechazadas = 0;
    if (estado === "aprobada") {
      await tx.mascota.update({
        where: { id: solicitud.mascota_id },
        data: { estado: "adoptado" },
      });
      // La mascota ya no está disponible: cerramos las demás solicitudes pendientes.
      const otrasPendientes = await tx.solicitudAdopcion.updateMany({
        where: { mascota_id: solicitud.mascota_id, estado: "en_revision", id: { not: id } },
        data: { estado: "rechazada" },
      });
      rechazadas = otrasPendientes.count;
    } else if (solicitud.estado === "aprobada") {
      const sigueAdoptada = await tx.solicitudAdopcion.count({
        where: { mascota_id: solicitud.mascota_id, estado: "aprobada", id: { not: id } },
      });
      if (sigueAdoptada === 0) {
        await tx.mascota.update({
          where: { id: solicitud.mascota_id },
          data: { estado: "en_adopcion" },
        });
      }
    }

    return {
      mascotaId: solicitud.mascota_id,
      adoptante: solicitud.adoptante,
      rechazadas,
    };
  });

  if (resultado.error) return { error: resultado.error };

  // Simulación de envío de correo (proyecto demo sin servidor de correos real).
  if (mensaje) {
    const correo = resultado.adoptante.correo;
    const asunto = `Respuesta a tu solicitud de adopción #${id}`;
    console.log(
      correo
        ? `[US 2.5] Simulación de correo\nPara: ${correo}\nAsunto: ${asunto}\n\n${mensaje}`
        : `[US 2.5] Solicitud #${id}: adoptante sin correo registrado, mensaje no enviado.\n${mensaje}`
    );
  }

  revalidatePath("/admin/solicitudes");
  revalidatePath(`/admin/solicitudes/${id}`);
  revalidatePath("/admin/adoptantes");
  revalidatePath("/admin/mascotas");
  revalidatePath(`/admin/mascotas/${resultado.mascotaId}`);
  revalidatePath("/mascotas");
  revalidatePath(`/mascotas/${resultado.mascotaId}`);
  revalidatePath("/");

  const params = new URLSearchParams({ actualizada: "1" });
  if (mensaje) params.set("mensajeEnviado", "1");
  if (resultado.rechazadas > 0) params.set("rechazadas", String(resultado.rechazadas));
  redirect(`/admin/solicitudes/${id}?${params.toString()}`);
}
