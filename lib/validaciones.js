import { z } from "zod";

// Un esquema por formulario. La validación corre solo en el servidor.

export const esquemaLogin = z.object({
  correo: z.string().trim().min(1, "El correo es obligatorio").email("Escribe un correo válido"),
  contrasena: z.string().min(1, "La contraseña es obligatoria"),
});

const camposAdoptante = {
  documento: z
    .string()
    .trim()
    .regex(/^\d{6,15}$/, "Solo números, entre 6 y 15 dígitos"),
  nombre_completo: z.string().trim().min(3, "Escribe el nombre completo").max(80),
  telefono: z
    .string()
    .trim()
    .regex(/^\d{7,10}$/, "Solo números, entre 7 y 10 dígitos"),
  direccion: z.string().trim().min(5, "Escribe la dirección").max(100),
};

const correoOpcional = z.preprocess(
  (valor) => (typeof valor === "string" && !valor.trim() ? undefined : valor),
  z.string().trim().email("Escribe un correo válido").max(80).optional()
);

export const esquemaAdoptante = z.object({
  ...camposAdoptante,
  correo: correoOpcional,
});

export const esquemaSolicitud = esquemaAdoptante.extend({
  mascota_id: z.number().int().positive(),
  correo: z.string().trim().email("Escribe un correo válido").max(80),
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

export const esquemaMascota = z.object({
  nombre: z.string().trim().min(1, "Escribe el nombre").max(50),
  raza: z.string().trim().min(1, "Escribe la raza").max(50),
  edad_estimada: z.string().trim().min(1, "Escribe la edad estimada").max(30),
  especie: enumObligatorio(["perro", "gato"], "Selecciona la especie"),
  sexo: enumOpcional(["macho", "hembra"], "Selecciona el sexo"),
  tamano: enumOpcional(["pequeño", "mediano", "grande"], "Selecciona el tamaño"),
  estado: enumObligatorio(["en_adopcion", "adoptado"], "Selecciona el estado"),
  personalidad: textoOpcional(500),
  salud_resumen: textoOpcional(300),
  foto_url: z.preprocess(
    (valor) => (typeof valor === "string" && !valor.trim() ? undefined : valor),
    z.string().trim().url("Escribe una URL válida").max(255).optional()
  ),
});
