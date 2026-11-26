"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Filter, Loader2 } from "lucide-react";
import { esquemaFiltroInformeDonaciones, erroresDe } from "@/lib/validaciones";
import FormField from "@/components/FormField";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";

export default function HistorialDonacionesFiltros({ filtrosIniciales }) {
  const router = useRouter();
  const [aplicando, startTransition] = useTransition();
  const [tipo, setTipo] = useState(filtrosIniciales.tipo);
  const [estado, setEstado] = useState(filtrosIniciales.estado);
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
        mensaje: "Revisa las fechas del rango personalizado antes de filtrar.",
      });
      return;
    }

    setValidacion(null);
    const params = new URLSearchParams();
    if (resultado.data.tipo !== "todas") params.set("tipo", resultado.data.tipo);
    if (estado !== "todas") params.set("estado", estado);
    if (resultado.data.periodo !== "todo") params.set("periodo", resultado.data.periodo);
    if (resultado.data.periodo === "personalizado") {
      if (resultado.data.desde) params.set("desde", resultado.data.desde);
      if (resultado.data.hasta) params.set("hasta", resultado.data.hasta);
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/admin/donaciones?${query}` : "/admin/donaciones");
    });
  };

  const limpiarFiltros = () => {
    if (aplicando) return;
    setTipo("todas");
    setEstado("todas");
    setPeriodo("todo");
    setDesde("");
    setHasta("");
    setValidacion(null);
    startTransition(() => {
      router.push("/admin/donaciones");
    });
  };

  return (
    <form
      ref={formularioRef}
      onSubmit={manejarAplicar}
      noValidate
      className="mb-5 rounded-card border border-border-soft bg-[#fdfbf7] p-4"
    >
      {validacion?.camposFaltantes?.length ? (
        <p
          role="alert"
          className="mb-3 flex items-start gap-2 rounded-[12px] bg-danger-50 p-3.5 text-[13px] font-bold leading-[1.5] text-danger-700"
        >
          <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
          {validacion.mensaje}
        </p>
      ) : null}

      <div className="grid gap-x-[15px] md:grid-cols-3">
        <FormField
          etiqueta="Tipo de aporte"
          nombre="filtro_tipo"
          tipo="select"
          value={tipo}
          onChange={(evento) => setTipo(evento.target.value)}
          opciones={[
            { valor: "todas", etiqueta: "Todas" },
            { valor: "monetaria", etiqueta: "Monetaria" },
            { valor: "especie", etiqueta: "En especie" },
          ]}
          ayuda="Filtra por dinero o insumos."
        />

        <FormField
          etiqueta="Estado"
          nombre="filtro_estado"
          tipo="select"
          value={estado}
          onChange={(evento) => setEstado(evento.target.value)}
          opciones={[
            { valor: "todas", etiqueta: "Todos los estados" },
            { valor: "recibida", etiqueta: "Solo recibidas (disponibles)" },
            { valor: "por_coordinar", etiqueta: "Por coordinar" },
          ]}
          ayuda="Elige recibidas para verificar recursos disponibles."
        />

        <FormField
          etiqueta="Período"
          nombre="filtro_periodo"
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
          ayuda="Filtra por fecha de donación."
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

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <OutlineButton type="button" tamano="sm" onClick={limpiarFiltros} disabled={aplicando}>
          Limpiar filtros
        </OutlineButton>
        <PrimaryButton type="submit" tamano="sm" disabled={aplicando}>
          {aplicando ? (
            <>
              <Loader2 size={16} strokeWidth={2} aria-hidden="true" className="animate-spin" />
              Filtrando…
            </>
          ) : (
            <>
              <Filter size={16} strokeWidth={2} aria-hidden="true" />
              Filtrar historial
            </>
          )}
        </PrimaryButton>
      </div>
    </form>
  );
}
