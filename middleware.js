import { NextResponse } from "next/server";

// Solo comprueba que exista la cookie; la firma se valida en app/(admin)/layout.jsx.
export function middleware(request) {
  const sesion = request.cookies.get("sesion");
  if (!sesion) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
