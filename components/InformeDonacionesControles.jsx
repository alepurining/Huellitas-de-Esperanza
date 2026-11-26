"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Filter, Loader2, Printer } from "lucide-react";
import { esquemaFiltroInformeDonaciones, erroresDe } from "@/lib/validaciones";
import DashPanel from "@/components/DashPanel";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";

export default function InformeDonacionesControles({
  filtrosIniciales,
  totalResultados,
}) {
  const router = useRouter();
  const [aplicando, startTransition] = useTransition();
  const [tipo, setTipo] = useState(filtrosIniciales.tipo);
  const [periodo, setPeriodo] = useState(filtrosIniciales.periodo);
  const [desde, setDesde] = useState(filtrosIniciales.desde);
  const [hasta, setHasta] = useState(filtrosIniciales.hasta);
  const [validacion, setValidacion] = useState(null);
  const formularioRef = useRef(null);

  useEffect(() => {
    if (validacion?.camposFaltantes?.length) {
      formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [validacion]);

  const manejarAplicar = (evento) => {
    evento.preventDefault();
    if (aplicando) return;

    const datos = {
      tipo,
      periodo,
      desde: periodo === "personalizado" ? desde : "",
      hasta: periodo === "personalizado" ? hasta : "",
    };

    const resultado = esquemaFiltroInformeDonaciones.safeParse(datos);
    if (!resultado.success) {
      setValidacion({
        ...erroresDe(resultado),
        mensaje: "Revisa las fechas del rango personalizado antes de generar el informe.",
      });
      return;
    }

    setValidacion(null);
    const params = new URLSearchParams();
    if (resultado.data.tipo !== "todas") params.set("tipo", resultado.data.tipo);
    if (resultado.data.periodo !== "todo") params.set("periodo", resultado.data.periodo);
    if (resultado.data.periodo === "personalizado") {
      if (resultado.data.desde) params.set("desde", resultado.data.desde);
      if (resultado.data.hasta) params.set("hasta", resultado.data.hasta);
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/admin/donaciones/informe?${query}` : "/admin/donaciones/informe");
    });
  };

  const limpiarFiltros = () => {
    if (aplicando) return;
    setTipo("todas");
    setPeriodo("todo");
    setDesde("");
    setHasta("");
    setValidacion(null);
    startTransition(() => {
      router.push("/admin/donaciones/informe");
    });
  };

  return (
    <DashPanel className="mb-6 print:hidden">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-display text-2xl leading-[1.2] text-ink">
            Configurar informe
          </h2>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-500">
            Filtra por tipo de aporte o período antes de exportar el PDF para toma de decisiones.
          </p>
        </div>

        <div className="flex flex-col items-start gap-1.5 md:items-end">
          <PrimaryButton
            type="button"
            onClick={() => window.print()}
            disabled={totalResultados === 0 || aplicando}
            icono={Printer}
          >
            Imprimir / Guardar PDF
          </PrimaryButton>
          <p className="text-[11px] text-ink-500">
            {totalResultados === 0
              ? "Ajusta los filtros para tener datos que exportar."
              : "En el diálogo de impresión, elige «Guardar como PDF» como destino."}
          </p>
        </div>
      </div>

      <form ref={formularioRef} onSubmit={manejarAplicar} noValidate className="mt-4">
        {validacion?.camposFaltantes?.length ? (
          <p
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-[12px] bg-danger-50 p-4 text-[13px] font-bold leading-[1.5] text-danger-700"
          >
            <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
            {validacion.mensaje}
          </p>
        ) : null}

        <div className="grid gap-x-[15px] md:grid-cols-2">
          <FormField
            etiqueta="Tipo de aporte"
            nombre="tipo"
            tipo="select"
            value={tipo}
            onChange={(evento) => setTipo(evento.target.value)}
            opciones={[
              { valor: "todas", etiqueta: "Todas (Monetarias y en especie)" },
              { valor: "monetaria", etiqueta: "Solo monetarias" },
              { valor: "especie", etiqueta: "Solo en especie" },
            ]}
            ayuda="Elige si deseas ver ambos tipos o uno en particular."
          />

          <FormField
            etiqueta="Período"
            nombre="periodo"
            tipo="select"
            value={periodo}
            onChange={(evento) => {
              setPeriodo(evento.target.value);
              setValidacion(null);
            }}
            opciones={[
              { valor: "todo", etiqueta: "Todo el historial" },
              { valor: "semana", etiqueta: "Última semana (7 días)" },
              { valor: "mes", etiqueta: "Último mes (30 días)" },
              { valor: "personalizado", etiqueta: "Rango personalizado" },
            ]}
            ayuda="Selecciona un período rápido o define fechas exactas."
          />

          {periodo === "personalizado" ? (
            <>
              <FormField
                etiqueta="Fecha inicial"
                nombre="desde"
                tipo="date"
                value={desde}
                onChange={(evento) => {
                  setDesde(evento.target.value);
                  setValidacion(null);
                }}
                ayuda="Opcional si solo defines fecha final. No puede ser futura."
                error={validacion?.errores?.desde}
              />
              <FormField
                etiqueta="Fecha final"
                nombre="hasta"
                tipo="date"
                value={hasta}
                onChange={(evento) => {
                  setHasta(evento.target.value);
                  setValidacion(null);
                }}
                ayuda="Debe ser igual o posterior a la fecha inicial."
                error={validacion?.errores?.hasta}
              />
            </>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <OutlineButton type="button" onClick={limpiarFiltros} disabled={aplicando}>
            Ver todo
          </OutlineButton>
          <PrimaryButton type="submit" disabled={aplicando}>
            {aplicando ? (
              <>
                <Loader2 size={18} strokeWidth={2} aria-hidden="true" className="animate-spin" />
                Aplicando filtros…
              </>
            ) : (
              <>
                <Filter size={18} strokeWidth={2} aria-hidden="true" />
                Aplicar filtros
              </>
            )}
          </PrimaryButton>
        </div>
      </form>
    </DashPanel>
  );
}
