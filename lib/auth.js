import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const clave = new TextEncoder().encode(process.env.JWT_SECRETO);

export const NOMBRE_COOKIE = "sesion";

export async function firmarSesion(sesion) {
  return new SignJWT(sesion)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(clave);
}

export async function leerSesion(token) {
  try {
    const { payload } = await jwtVerify(token, clave);
    return payload;
  } catch {
    return null;
  }
}

// Para usar en Server Components y Server Actions
export async function getSesion() {
  const token = (await cookies()).get(NOMBRE_COOKIE)?.value;
  return token ? leerSesion(token) : null;
}
