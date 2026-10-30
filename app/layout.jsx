import "./globals.css";

export const metadata = {
  title: {
    default: "Huellitas de Esperanza · Refugio de adopciones",
    template: "%s · Huellitas de Esperanza",
  },
  description:
    "Refugio de animales en Medellín. Conoce las mascotas que buscan hogar y postula a la adopción.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
