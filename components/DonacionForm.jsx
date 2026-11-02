"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { registrarDonacion } from "@/lib/actions/donaciones";
import FormField from "@/components/FormField";
import MintButton from "@/components/MintButton";

// Clases de input de FormField, reutilizadas para el campo con prefijo "$".
const clasesMonto = (error) =>
  [
    "w-full rounded-input border bg-surface py-3 pl-10 pr-3",
    "font-sans text-[15px] font-normal text-ink outline-none transition duration-200",
    "placeholder:text-ink-300 focus:shadow-[0_0_0_3px_#fce7f3]",
    error ? "border-danger" : "border-border focus:border-primary",
  ].join(" ");

// Segmented (tipo de aporte) de STYLEGUIDE.md: contenedor #f7f7f5, opción activa mint.
const opcionSegmento = (activo) =>
  activo
    ? "rounded-[10px] bg-[#d9f8e9] font-extrabold text-[#347c60]"
    : "rounded-[10px] font-bold text-ink-500 hover:text-[#347c60]";

const montosRapidos = [
  { etiqueta: "20.000", valor: "20000" },
  { etiqueta: "50.000", valor: "50000" },
  { etiqueta: "100.000", valor: "100000" },
];

export default function DonacionForm() {
  const [estado, accion, enviando] = useActionState(registrarDonacion, null);
  const [tipo, setTipo] = useState("monetaria");
  const [monto, setMonto] = useState("");
  const formularioRef = useRef(null);
  const montoRef = useRef(null);

  useEffect(() => {
    if (estado?.camposFaltantes?.length) {
      formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [estado]);

  const errorDe = (campo) => estado?.errores?.[campo];

  const elegirMontoRapido = (valor) => {
    setMonto(valor);
    montoRef.current?.focus();
  };

  return (
    <form ref={formularioRef} action={accion} noValidate>
      {estado?.camposFaltantes?.length ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-[12px] bg-danger-50 p-4 text-[13px] font-bold leading-[1.5] text-danger-700"
        >
          <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
          {estado.mensaje ?? "Revisa los campos marcados antes de continuar."}
        </p>
      ) : null}

      <input type="hidden" name="tipo_aporte" value={tipo} />

      <div
        role="group"
        aria-label="Tipo de aporte"
        className="grid grid-cols-2 gap-1 rounded-[14px] bg-[#f7f7f5] p-[5px]"
      >
        <button
          type="button"
          onClick={() => setTipo("monetaria")}
          aria-pressed={tipo === "monetaria"}
          className={`h-11 px-4 font-sans text-[13px] transition duration-200 ${opcionSegmento(tipo === "monetaria")}`}
        >
          Monetaria
        </button>
        <button
          type="button"
          onClick={() => setTipo("especie")}
          aria-pressed={tipo === "especie"}
          className={`h-11 px-4 font-sans text-[13px] transition duration-200 ${opcionSegmento(tipo === "especie")}`}
        >
          Especie
        </button>
      </div>

      <div className="mt-5 grid gap-x-[15px] md:grid-cols-2">
        {tipo === "monetaria" ? (
          <div>
            <label
              htmlFor="monto"
              className="mb-[7px] block font-sans text-[13px] font-extrabold leading-[1.4] text-ink"
            >
              Monto
              <span className="ml-1 text-danger" aria-hidden="true">
                *
              </span>
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-sans text-[15px] font-extrabold text-mint-ink"
              >
                $
              </span>
              <input
                ref={montoRef}
                id="monto"
                name="monto"
                inputMode="numeric"
                autoComplete="off"
                maxLength={12}
                placeholder="50.000"
                value={monto}
                onChange={(evento) => setMonto(evento.target.value)}
                aria-invalid={errorDe("monto") ? "true" : undefined}
                className={clasesMonto(estado?.errores?.monto)}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {montosRapidos.map((rapido) => (
                <button
                  key={rapido.valor}
                  type="button"
                  onClick={() => elegirMontoRapido(rapido.valor)}
                  className="rounded-pill border border-border-soft bg-surface px-3 py-1.5 text-[12px] font-bold text-ink-500 transition duration-200 hover:bg-primary-50 hover:text-[#b74581]"
                >
                  {rapido.etiqueta}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMonto("");
                  montoRef.current?.focus();
                }}
                className="rounded-pill border border-border-soft bg-surface px-3 py-1.5 text-[12px] font-bold text-ink-500 transition duration-200 hover:bg-primary-50 hover:text-[#b74581]"
              >
                Otro
              </button>
            </div>
            {errorDe("monto") ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold leading-[1.5] text-danger-700">
                <CircleAlert size={14} strokeWidth={2} aria-hidden="true" />
                {errorDe("monto")}
              </p>
            ) : null}
          </div>
        ) : null}

        {tipo === "especie" ? (
          <>
            <FormField
              etiqueta="Descripción del insumo"
              nombre="descripcion_insumo"
              autoComplete="off"
              maxLength={300}
              placeholder="Saco de croquetas 20 kg"
              ayuda="Alimentos, mantas, medicamentos…"
              error={errorDe("descripcion_insumo")}
            />
            <FormField
              etiqueta="Cantidad"
              nombre="cantidad"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              placeholder="2"
              error={errorDe("cantidad")}
            />
          </>
        ) : null}

        <FormField
          etiqueta="Nombre del donante"
          nombre="nombre_donante"
          autoComplete="name"
          maxLength={80}
          placeholder="María Fernanda Gómez"
          required
          error={errorDe("nombre_donante")}
        />
        <FormField
          etiqueta="Correo electrónico"
          nombre="correo"
          tipo="email"
          autoComplete="email"
          maxLength={80}
          placeholder="tucorreo@example.com"
          ayuda="Opcional."
          error={errorDe("correo")}
        />
      </div>

      <div className="mt-6">
        <MintButton type="submit" tamano="full" disabled={enviando}>
          {enviando ? "Registrando…" : "Registrar aporte"}
        </MintButton>
      </div>
    </form>
  );
}
