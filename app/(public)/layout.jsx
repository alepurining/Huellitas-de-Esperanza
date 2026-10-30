import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <p className="bg-tint px-4 py-2 text-center text-[13px] leading-[1.5] text-ink">
        Modo demo: esta app es un proyecto de clase. Cifras, fotos y contactos son de muestra.
      </p>
      <main>{children}</main>
      <Footer />
    </>
  );
}
