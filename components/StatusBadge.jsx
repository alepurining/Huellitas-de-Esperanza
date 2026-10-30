// Badges de STYLEGUIDE.md. La clave puede ser el `estado` del modelo o una variante explícita.
const variantes = {
  // Disponibilidad de mascota: píldora rosa "Busco hogar"
  en_adopcion: "rounded-pill bg-primary-50 px-3 py-[7px] text-[#b74581]",
  adoptado: "rounded-[10px] bg-success-50 px-2.5 py-1.5 text-success-700",
  // Estados de fila
  activo: "rounded-[10px] bg-success-50 px-2.5 py-1.5 text-success-700",
  aprobado: "rounded-[10px] bg-success-50 px-2.5 py-1.5 text-success-700",
  pendiente: "rounded-[10px] bg-warning-50 px-2.5 py-1.5 text-warning-700",
  en_revision: "rounded-[10px] bg-warning-50 px-2.5 py-1.5 text-warning-700",
  especie: "rounded-[10px] bg-warning-50 px-2.5 py-1.5 text-warning-700",
  rechazado: "rounded-[10px] bg-danger-50 px-2.5 py-1.5 text-danger-700",
  inactivo: "rounded-[10px] bg-[#f3f4f6] px-2.5 py-1.5 text-ink-700",
  neutro: "rounded-[10px] bg-[#f3f4f6] px-2.5 py-1.5 text-ink-700",
  info: "rounded-[10px] bg-info-50 px-2.5 py-1.5 text-info-700",
  monetaria: "rounded-[10px] bg-info-50 px-2.5 py-1.5 text-info-700",
  // Etiqueta sobre la foto de la tarjeta (pet-status)
  accent: "rounded-[12px] bg-accent px-[11px] py-1.5 text-accent-ink",
};

const etiquetas = {
  en_adopcion: "Busco hogar",
  adoptado: "Adoptado",
  activo: "Activo",
  inactivo: "Inactivo",
  aprobado: "Aprobado",
  pendiente: "Pendiente",
  en_revision: "En revisión",
  rechazado: "Rechazado",
  monetaria: "Monetaria",
  especie: "En especie",
};

export default function StatusBadge({ estado, texto, variante, className = "" }) {
  const clave = variante ?? estado ?? "neutro";
  const estilos = variantes[clave] ?? variantes.neutro;
  const peso = clave === "accent" ? "font-extrabold" : "font-bold";
  const contenido = texto ?? etiquetas[clave] ?? clave;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${peso} text-[11px] leading-[1.3] ${estilos} ${className}`}
    >
      {contenido}
    </span>
  );
}
