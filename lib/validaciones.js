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
