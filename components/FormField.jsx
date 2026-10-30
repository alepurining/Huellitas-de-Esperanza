import { CircleAlert } from "lucide-react";

// Campo de formulario de STYLEGUIDE.md: label 800 13px, input radio 12px, foco rosa y error terracota.
const clasesBase = [
  "w-full rounded-input border bg-surface px-3 py-3",
  "font-sans text-[15px] font-normal text-ink",
  "outline-none transition duration-200",
  "placeholder:text-ink-300",
  "focus:border-primary focus:shadow-[0_0_0_3px_#fce7f3]",
  "disabled:bg-[#f3f4f6] disabled:text-ink-300",
].join(" ");

const clasesError = "border-danger shadow-[0_0_0_3px_#f2e1d5]";
const clasesNormal = "border-border";

export default function FormField({
  etiqueta,
  nombre,
  tipo = "text",
  error,
  ayuda,
  opciones = [],
  filas = 4,
  placeholder,
  className = "",
  ...resto
}) {
  const idAyuda = `${nombre}-ayuda`;
  const idError = `${nombre}-error`;
  const descrito = [ayuda ? idAyuda : null, error ? idError : null].filter(Boolean).join(" ");

  const propsCampo = {
    id: nombre,
    name: nombre,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": descrito || undefined,
    className: `${clasesBase} ${error ? clasesError : clasesNormal} ${className}`,
    ...resto,
  };

  return (
    <div>
      <label
        htmlFor={nombre}
        className="mb-[7px] mt-3.5 block font-sans text-[13px] font-extrabold leading-[1.4] text-ink"
      >
        {etiqueta}
        {resto.required ? (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {tipo === "textarea" ? (
        <textarea rows={filas} placeholder={placeholder} {...propsCampo} />
      ) : tipo === "select" ? (
        <select {...propsCampo}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {opciones.map((opcion) => {
            const valor = typeof opcion === "string" ? opcion : opcion.valor;
            const etiquetaOpcion = typeof opcion === "string" ? opcion : opcion.etiqueta;
            return (
              <option key={valor} value={valor}>
                {etiquetaOpcion}
              </option>
            );
          })}
        </select>
      ) : (
        <input type={tipo} placeholder={placeholder} {...propsCampo} />
      )}

      {error ? (
        <p
          id={idError}
          className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold leading-[1.5] text-danger-700"
        >
          <CircleAlert size={14} strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {ayuda ? (
        <p id={idAyuda} className="mt-1.5 text-xs leading-[1.5] text-ink-500">
          {ayuda}
        </p>
      ) : null}
    </div>
  );
}
