"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { firmarSesion, NOMBRE_COOKIE } from "@/lib/auth";
import { esquemaLogin } from "@/lib/validaciones";
import { mensajes } from "@/lib/mensajes";

export async function iniciarSesion(_previo, formData) {
  const datos = {
    correo: String(formData.get("correo") ?? "").trim().toLowerCase(),
    contrasena: String(formData.get("contrasena") ?? ""),
  };

  const resultado = esquemaLogin.safeParse(datos);
  if (!resultado.success) {
    const camposFaltantes = resultado.error.issues.map((issue) => String(issue.path[0]));
    return { error: mensajes.credencialesInvalidas, camposFaltantes };
  }

  const usuario = await prisma.usuario.findUnique({ where: { correo: resultado.data.correo } });
  if (!usuario) {
    return { error: mensajes.credencialesInvalidas, camposFaltantes: ["correo", "contrasena"] };
  }

  const coincide = await bcrypt.compare(resultado.data.contrasena, usuario.hash_contrasena);
  if (!coincide) {
    return { error: mensajes.credencialesInvalidas, camposFaltantes: ["correo", "contrasena"] };
  }

  const token = await firmarSesion({
    id: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol,
  });

  const almacen = await cookies();
  almacen.set(NOMBRE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin/mascotas");
}

export async function cerrarSesion() {
  const almacen = await cookies();
  almacen.delete(NOMBRE_COOKIE);
  redirect("/login");
}
