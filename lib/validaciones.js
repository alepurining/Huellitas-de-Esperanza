import { z } from "zod";

// Un esquema por formulario. La validación corre solo en el servidor.

export const esquemaLogin = z.object({
  correo: z.email("Escribe un correo válido").max(80),
  contrasena: z.string().min(1, "La contraseña es obligatoria"),
});

const camposAdoptante = {
  documento: z
    .string()
    .trim()
    .regex(
      /^\d{6,15}$/,
      "Ingresa la cédula solo con números, entre 6 y 15 dígitos (ejemplo: 1037654321)"
    ),
  nombre_completo: z
    .string()
    .trim()
    .min(3, "Ingresa el nombre completo (mínimo 3 caracteres, ejemplo: María Fernanda Gómez)")
    .max(80, "El nombre completo no puede superar 80 caracteres"),
  telefono: z
    .string()
    .trim()
    .regex(
      /^\d{7,10}$/,
      "Ingresa un teléfono solo con dígitos, entre 7 y 10 números (ejemplo: 3001234567)"
    ),
  direccion: z
    .string()
    .trim()
    .min(5, "Ingresa la dirección completa (mínimo 5 caracteres, ejemplo: Calle 45 # 12-30)")
    .max(100, "La dirección no puede superar 100 caracteres"),
};

const correoOpcional = z.preprocess(
  (valor) => (typeof valor === "string" && !valor.trim() ? undefined : valor.trim()),
  z.email("Ingresa un correo válido como nombre@dominio.com").max(80, "El correo no puede superar 80 caracteres").optional()
);

export const esquemaAdoptante = z.object({
  ...camposAdoptante,
  correo: correoOpcional,
});

export const esquemaSolicitud = esquemaAdoptante.extend({
  mascota_id: z.number().int().positive(),
  correo: z.email("Escribe un correo válido").max(80),
  tipo_vivienda: z.enum(["apartamento", "casa", "finca"]),
  personas_en_hogar: z.number().int().min(1, "Mínimo 1 persona").max(20, "Máximo 20 personas").optional(),
  animales_en_hogar: z.boolean(),
  descripcion_vivienda: z.string().trim().min(10, "Cuéntanos cómo es tu vivienda").max(1000),
  acepta_terminos: z.boolean().refine((valor) => valor === true, {
    message: "Debes aceptar los términos para enviar la solicitud",
  }),
});

// Texto opcional: "" o espacios → undefined (columna String? sin datos)
const textoOpcional = (maximo) =>
  z.preprocess(
    (valor) => (typeof valor === "string" && !valor.trim() ? undefined : valor),
    z.string().trim().max(maximo).optional()
  );

// Select opcional: opción vacía → undefined; los valores llegan "macho " → trim
const enumOpcional = (valores, mensaje) =>
  z.preprocess(
    (valor) => (typeof valor === "string" && !valor.trim() ? undefined : valor.trim()),
    z.enum(valores, { error: mensaje }).optional()
  );

// Los selects obligatorios llegan con la opción vacía del placeholder ("")
const enumObligatorio = (valores, mensaje) => z.enum(valores, { error: mensaje });

export const esquemaActualizarAdoptante = esquemaAdoptante.extend({
  estado: enumObligatorio(["activo", "inactivo"], "Selecciona el estado del adoptante (Activo o Inactivo)"),
});

export const esquemaMascota = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresa el nombre de la mascota (entre 1 y 50 caracteres)")
    .max(50, "El nombre no puede superar 50 caracteres"),
  raza: z
    .string()
    .trim()
    .min(1, "Ingresa la raza de la mascota (por ejemplo: Labrador mestizo)")
    .max(50, "La raza no puede superar 50 caracteres"),
  edad_estimada: z
    .string()
    .trim()
    .min(1, "Ingresa la edad estimada (por ejemplo: 2 años o 6 meses)")
    .max(30, "La edad estimada no puede superar 30 caracteres"),
  especie: enumObligatorio(["perro", "gato"], "Selecciona si la mascota es Perro o Gato"),
  sexo: enumOpcional(["macho", "hembra"], "Selecciona Macho, Hembra o Sin registrar"),
  tamano: enumOpcional(["pequeño", "mediano", "grande"], "Selecciona Pequeño, Mediano, Grande o Sin registrar"),
  estado: enumObligatorio(["en_adopcion", "adoptado"], "Selecciona el estado: Disponible o Adoptado"),
  personalidad: textoOpcional(500),
  salud_resumen: textoOpcional(300),
  foto_url: z.preprocess(
    (valor) => (typeof valor === "string" && !valor.trim() ? undefined : valor.trim()),
    z
      .url("Ingresa una URL válida que empiece por https:// (ejemplo: https://ejemplo.com/foto.jpg)")
      .refine(
        (url) => url.startsWith("https://") || url.startsWith("http://"),
        "La foto debe ser un enlace web (http:// o https://); las vistas previas locales no se guardan"
      )
      .max(255, "La URL de la foto no puede superar 255 caracteres")
      .optional()
  ),
});

// Número entero opcional que tolera "20.000" (COP): quita lo que no sea dígito.
const enteroOpcional = (maximo, mensaje) =>
  z.preprocess(
    (valor) => {
      if (typeof valor !== "string" || !valor.trim()) return undefined;
      const soloDigitos = valor.replace(/\D/g, "");
      return soloDigitos ? Number(soloDigitos) : NaN;
    },
    z.number({ error: mensaje }).int(mensaje).min(1, mensaje).max(maximo, mensaje).optional()
  );

export const esquemaDonacion = z
  .object({
    tipo_aporte: enumObligatorio(["monetaria", "especie"], "Selecciona el tipo de aporte"),
    monto: enteroOpcional(999999999, "Escribe el monto en pesos COP"),
    descripcion_insumo: textoOpcional(300),
    cantidad: enteroOpcional(9999, "Escribe la cantidad"),
    nombre_donante: z.string().trim().min(1, "Escribe el nombre del donante").max(80),
    correo: correoOpcional,
  })
  .superRefine((datos, ctx) => {
    // Campos obligatorios según el tipo de aporte (US 3.3).
    if (datos.tipo_aporte === "monetaria" && (datos.monto === undefined || datos.monto < 1)) {
      ctx.addIssue({ code: "custom", path: ["monto"], message: "Escribe el monto en pesos COP" });
    }
    if (datos.tipo_aporte === "especie") {
      if (!datos.descripcion_insumo) {
        ctx.addIssue({ code: "custom", path: ["descripcion_insumo"], message: "Describe el insumo" });
      }
      if (datos.cantidad === undefined || datos.cantidad < 1) {
        ctx.addIssue({ code: "custom", path: ["cantidad"], message: "Escribe la cantidad" });
      }
    }
  });

// Convierte los issues de Zod en { campo: mensaje } + lista de campos afectados.
export const erroresDe = (resultado) => {
  const errores = Object.fromEntries(
    resultado.error.issues.map((issue) => [String(issue.path[0]), issue.message])
  );
  return { camposFaltantes: Object.keys(errores), errores };
};

export const esquemaDocumentoDonante = z
  .string()
  .trim()
  .regex(/^\d{6,15}$/, "Escribe la cédula registrada, solo números");

const fechaIsoOpcional = z.preprocess(
  (valor) => (typeof valor === "string" && !valor.trim() ? undefined : valor.trim()),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida (AAAA-MM-DD)")
    .optional()
);

export const esquemaFiltroInformeDonaciones = z
  .object({
    tipo: z.enum(["todas", "monetaria", "especie"]).default("todas"),
    periodo: z.enum(["todo", "semana", "mes", "personalizado"]).default("todo"),
    desde: fechaIsoOpcional,
    hasta: fechaIsoOpcional,
  })
  .superRefine((datos, ctx) => {
    if (datos.periodo !== "personalizado") return;

    if (!datos.desde && !datos.hasta) {
      ctx.addIssue({
        code: "custom",
        path: ["desde"],
        message: "Ingresa al menos la fecha inicial o la fecha final para el rango personalizado",
      });
      return;
    }

    const hoy = new Date();
    const hoyIso = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

    if (datos.desde && datos.desde > hoyIso) {
      ctx.addIssue({
        code: "custom",
        path: ["desde"],
        message: "La fecha inicial no puede ser futura",
      });
    }
    if (datos.hasta && datos.hasta > hoyIso) {
      ctx.addIssue({
        code: "custom",
        path: ["hasta"],
        message: "La fecha final no puede ser futura",
      });
    }
    if (datos.desde && datos.hasta && datos.desde > datos.hasta) {
      ctx.addIssue({
        code: "custom",
        path: ["desde"],
        message: "La fecha inicial no puede ser mayor que la fecha final",
      });
    }
  });
