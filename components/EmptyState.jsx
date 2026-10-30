import { PawPrint } from "lucide-react";

export default function EmptyState({ titulo, texto, children, icono: Icono = PawPrint }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <Icono size={40} strokeWidth={2} aria-hidden="true" className="text-primary-200" />
      <h2 className="font-display text-2xl leading-[1.15] text-ink">{titulo}</h2>
      {texto ? <p className="max-w-[420px] text-sm leading-[1.7] text-ink-500">{texto}</p> : null}
      {children}
    </div>
  );
}
