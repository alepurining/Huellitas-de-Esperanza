"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSesion } from "@/lib/auth";
import {
  esquemaAltaAdoptante,
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
  } else {
    datos.mascota_id = String(formData.get("mascota_id") ?? "").trim();
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

  const resultado = esquemaAltaAdoptante.safeParse(datos);
  if (!resultado.success) {
    return { ...erroresDe(resultado), valores: datos };
  }

  const { mascota_id, ...datosAdoptante } = resultado.data;

  try {
    // Todo en una transacción: perfil, solicitud aprobada y mascota nunca quedan desincronizados.
    const creado = await prisma.$transaction(async (tx) => {
      if (mascota_id) {
        const disponible = await tx.mascota.findFirst({
          where: { id: mascota_id, estado: "en_adopcion" },
          select: { id: true },
        });
        if (!disponible) {
          return {
            error: {
              camposFaltantes: ["mascota_id"],
              errores: {
                mascota_id: "Esa mascota ya no está disponible. Elige otra de la lista.",
              },
              mensaje: "La mascota seleccionada ya fue adoptada. Elige otra para continuar.",
              valores: datos,
            },
          };
        }
      }

      const adoptante = await tx.adoptante.create({
        data: {
          ...datosAdoptante,
          correo: datosAdoptante.correo || null,
          estado: "activo",
        },
      });

      if (mascota_id) {
        // La solicitud queda en revisión: la aprobación (y con ella el cambio de estado
        // de la mascota) se hace desde la bandeja, con su confirmación y rechazos automáticos.
        // El alta es directa: no hay cuestionario público de vivienda, por eso se deja
        // constancia en la descripción y no se inventa aceptación de términos.
        await tx.solicitudAdopcion.create({
          data: {
            mascota_id,
            adoptante_id: adoptante.id,
            tipo_vivienda: "casa",
            descripcion_vivienda:
              "Solicitud registrada directamente por el personal del refugio; sin cuestionario de vivienda.",
            acepta_terminos: false,
            estado: "en_revision",
          },
        });
      }

      return { adoptante };
    });

    if (creado.error) return creado.error;

    const params = new URLSearchParams({ nuevo: String(creado.adoptante.id) });
    if (mascota_id) params.set("solicitud", String(mascota_id));

    revalidatePath("/admin/adoptantes");
    revalidatePath("/admin/mascotas");
    revalidatePath("/admin/solicitudes");
    redirect(`/admin/adoptantes?${params}`);
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
