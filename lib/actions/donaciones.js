"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSesion } from "@/lib/auth";
import { esquemaDocumentoDonante, esquemaDonacion, erroresDe } from "@/lib/validaciones";

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
    return { ...erroresDe(resultado), valores: datos };
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

export async function registrarDonacionAdoptante(_previo, formData) {
  const datos = {
    tipo_aporte: String(formData.get("tipo_aporte") ?? "").trim(),
    monto: String(formData.get("monto") ?? "").trim(),
    descripcion_insumo: String(formData.get("descripcion_insumo") ?? "").trim(),
    cantidad: String(formData.get("cantidad") ?? "").trim(),
  };
  // Lo escrito por el donante público, para no perderlo si la validación falla.
  const valores = { documento: String(formData.get("documento") ?? "").trim(), ...datos };

  const documentoResultado = esquemaDocumentoDonante.safeParse(valores.documento);
  if (!documentoResultado.success) {
    return {
      camposFaltantes: ["documento"],
      errores: { documento: documentoResultado.error.issues[0].message },
      valores,
    };
  }

  const resultado = esquemaDonacion.safeParse({
    ...datos,
    nombre_donante: "Adoptante registrado",
  });
  if (!resultado.success) {
    return { ...erroresDe(resultado), valores };
  }

  const adoptante = await prisma.adoptante.findUnique({
    where: { documento: documentoResultado.data },
  });
  if (!adoptante) {
    return {
      camposFaltantes: ["documento"],
      errores: { documento: "No encontramos un adoptante registrado con esa cédula." },
      valores,
    };
  }

  const { tipo_aporte } = resultado.data;
  const donacion = await prisma.donacion.create({
    data: {
      tipo_aporte,
      estado: "por_coordinar",
      monto: tipo_aporte === "monetaria" ? (resultado.data.monto ?? null) : null,
      descripcion_insumo: tipo_aporte === "especie" ? (resultado.data.descripcion_insumo ?? null) : null,
      cantidad: tipo_aporte === "especie" ? (resultado.data.cantidad ?? null) : null,
      nombre_donante: adoptante.nombre_completo,
      correo: adoptante.correo,
      usuario_id: null,
      adoptante_id: adoptante.id,
    },
  });

  revalidatePath("/admin/donaciones");
  redirect(`/donar?nuevo=${donacion.id}`);
}

export async function confirmarRecepcionDonacion(formData) {
  const sesion = await getSesion();
  if (!sesion) {
    throw new Error("La sesión no es válida");
  }

  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("El id de la donación no es válido");
  }

  const resultado = await prisma.donacion.updateMany({
    where: { id, estado: "por_coordinar" },
    data: { estado: "recibida" },
  });
  if (resultado.count !== 1) {
    throw new Error("La donación no existe o ya fue confirmada");
  }

  revalidatePath("/admin/donaciones");
}

export async function registrarDonacionPorAdoptante(_previo, formData) {
  const sesion = await getSesion();
  if (!sesion) {
    throw new Error("La sesión no es válida");
  }

  const datos = {
    tipo_aporte: String(formData.get("tipo_aporte") ?? "").trim(),
    monto: String(formData.get("monto") ?? "").trim(),
    descripcion_insumo: String(formData.get("descripcion_insumo") ?? "").trim(),
    cantidad: String(formData.get("cantidad") ?? "").trim(),
  };
  const valores = { documento: String(formData.get("documento") ?? "").trim(), ...datos };

  const documentoResultado = esquemaDocumentoDonante.safeParse(valores.documento);
  if (!documentoResultado.success) {
    return {
      camposFaltantes: ["documento"],
      errores: { documento: documentoResultado.error.issues[0].message },
      valores,
    };
  }

  const resultado = esquemaDonacion.safeParse({
    ...datos,
    nombre_donante: "Adoptante registrado",
  });
  if (!resultado.success) {
    return { ...erroresDe(resultado), valores };
  }

  const adoptante = await prisma.adoptante.findUnique({
    where: { documento: documentoResultado.data },
  });
  if (!adoptante) {
    return {
      camposFaltantes: ["documento"],
      errores: { documento: "No encontramos un adoptante registrado con esa cédula." },
      valores,
    };
  }

  const { tipo_aporte } = resultado.data;
  const donacion = await prisma.donacion.create({
    data: {
      tipo_aporte,
      estado: "recibida",
      monto: tipo_aporte === "monetaria" ? (resultado.data.monto ?? null) : null,
      descripcion_insumo: tipo_aporte === "especie" ? (resultado.data.descripcion_insumo ?? null) : null,
      cantidad: tipo_aporte === "especie" ? (resultado.data.cantidad ?? null) : null,
      nombre_donante: adoptante.nombre_completo,
      correo: adoptante.correo,
      usuario_id: Number(sesion.id),
      adoptante_id: adoptante.id,
    },
  });

  revalidatePath("/admin/donaciones");
  redirect(`/admin/donaciones?nuevo=${donacion.id}&adoptante=1`);
}
