import { redirect } from "next/navigation";
import { getSesion } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({ children }) {
  const sesion = await getSesion();
  if (!sesion) redirect("/login");

  return (
    <div className="min-h-screen bg-surface-alt md:grid md:grid-cols-[245px_1fr]">
      <Sidebar sesion={{ nombre: sesion.nombre, rol: sesion.rol }} />
      <div className="px-4 py-8 md:px-[4vw]">{children}</div>
    </div>
  );
}
