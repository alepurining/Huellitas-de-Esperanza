# ARCHITECTURE.md — Arquitectura del MVP (Sprint 1)

## Propósito

Definir **cómo se construye** la aplicación web "Huellitas de Esperanza" con el mínimo de piezas
posible: estructura de carpetas, modelo de datos, autenticación y reglas de código para el agente.

**Regla que manda sobre todo lo demás:** el código debe ser **lo más simple, directo y fácil de
entender posible**. Es un proyecto universitario, no producción. La meta es cumplir las 6 historias
"Must Have" del Sprint 1 (US 1.1, 1.2, 2.1, 2.2, 3.3, 4.1), nada más.

**Lenguaje: JavaScript.** Sin TypeScript, sin `tsconfig.json`, sin archivos `.ts`/`.tsx`. Se usa
`.jsx` cuando el archivo devuelve JSX y `.js` para la lógica. La validación de datos es 100% **Zod en
runtime**.

**Insumos de este documento:**

| Archivo | Qué aporta | Manda en |
|---|---|---|
| `AGENTS.md` | Contexto del repo, stack y restricciones del proyecto. | Alcance y stack |
| `PAGES.md` | Rutas, pantallas, textos exactos y validaciones de cada HU. | Rutas y mensajes |
| `STYLEGUIDE.md` | Paleta, tipografía, componentes y estados visuales. | Diseño |
| `Diagrama - Sprint 1 (MVP).png` | Modelo E-R completo del proyecto. | Referencia de campos |
| **Confluence** | Backlog y criterios de aceptación. | **Todo** (si hay conflicto, manda Confluence) |

---

## 1. Principio de simplicidad (pragmatismo académico)

- **Sin capas intermedias.** No hay servicios, repositorios, DTOs, mappers, factories ni inyección
  de dependencias. La página (Server Component) consulta con Prisma directo; la Server Action
  escribe con Prisma directo.
- **Un archivo por pantalla.** Cada ruta es un `page.jsx` que resuelve su propia lectura. Si una
  consulta se repite en 2 pantallas, se copia o se extrae una función normal en `lib/`; no se crea
  una capa de abstracción.
- **JavaScript puro, sin tipos.** Nada de interfaces, genéricos, `any`, `as` ni `z.infer`. Los
  valores de `formData` se convierten explícitamente (`String`, `Number`, `Boolean`) antes de
  pasarlos a Zod.
- **Formularios:** `zod` básico + una Server Action por formulario. La validación corre **solo en el
  servidor**; el navegador únicamente pinta los errores que devuelve la acción (sin duplicar reglas
  en el cliente).
- **Lecturas sin API.** Las páginas se renderizan en el servidor con Prisma (`await prisma.mascota.findMany()`).
  No se crean `GET /api/*` redundantes ni se usa `fetch` interno.
- **Sin estado global.** Nada de Redux, Zustand, React Query, SWR, react-hook-form ni librerías de
  tablas. Estado local con `useState` cuando haga falta (menú móvil, modal, toggle de contraseña).
- **Sin sobre-ingeniería diferida.** Si algo no lo exige una de las 6 Must, **no se escribe**: va a
  Sprint 2 (ver sección 6).

> Criterio de revisión: si un compañero de clase no entiende un archivo en 2 minutos, está mal escrito.

---

## 2. Estructura de carpetas minimalista

```
veterinaria/
├── app/
│   ├── layout.jsx                      # <html>, fuentes Fraunces/Nunito, <body class="bg-bg">
│   ├── globals.css                     # @import "tailwindcss" + tokens de STYLEGUIDE.md (@theme)
│   │
│   ├── (public)/                       # Rutas sin login
│   │   ├── layout.jsx                  # Navbar + banda "modo demo" + Footer
│   │   ├── page.jsx                    # /            → landing (US 1.2 destacado)
│   │   ├── mascotas/
│   │   │   ├── page.jsx                # /mascotas    → catálogo (US 1.2)
│   │   │   └── [id]/
│   │   │       └── page.jsx            # /mascotas/[id] → ficha + AdoptionModal (US 1.2 / 4.1)
│   │   └── login/
│   │       └── page.jsx                # /login       → acceso al panel
│   │
│   └── (admin)/                        # Rutas privadas (JWT)
│       ├── layout.jsx                  # Sidebar + guardia de sesión (verifica el JWT)
│       └── admin/
│           ├── mascotas/
│           │   ├── page.jsx            # /admin/mascotas        → listado (US 1.2)
│           │   ├── nueva/
│           │   │   └── page.jsx        # /admin/mascotas/nueva  → alta (US 1.1)
│           │   └── [id]/
│           │       └── page.jsx        # /admin/mascotas/[id]   → ficha staff (solo lectura)
│           ├── adoptantes/
│           │   ├── page.jsx            # /admin/adoptantes      → listado + búsqueda (US 2.2)
│           │   └── nuevo/
│           │       └── page.jsx        # /admin/adoptantes/nuevo → alta (US 2.1)
│           └── donaciones/
│               └── page.jsx            # /admin/donaciones      → registro + tabla (US 3.3)
│
├── components/                         # Un archivo por componente de STYLEGUIDE.md
│   ├── PrimaryButton.jsx
│   ├── SecondaryButton.jsx
│   ├── MintButton.jsx
│   ├── OutlineButton.jsx
│   ├── GhostButton.jsx
│   ├── Chip.jsx
│   ├── PetCard.jsx
│   ├── StatusBadge.jsx
│   ├── DashPanel.jsx
│   ├── PanelHeading.jsx
│   ├── DataTable.jsx
│   ├── FormField.jsx                   # label + input/select/textarea + mensaje de error
│   ├── AdoptionModal.jsx
│   ├── Toast.jsx
│   ├── EmptyState.jsx
│   ├── ErrorBanner.jsx
│   ├── Spinner.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── Pagination.jsx
│
├── lib/
│   ├── prisma.js                       # singleton de PrismaClient
│   ├── auth.js                         # firmar/leer el JWT + getSesion()
│   ├── validaciones.js                 # un esquema Zod por formulario
│   ├── mensajes.js                     # textos exactos de PAGES.md
│   └── actions/                        # "use server": una acción por formulario
│       ├── auth.js                     # iniciarSesion / cerrarSesion
│       ├── mascotas.js                 # crearMascota
│       ├── adoptantes.js               # crearAdoptante
│       ├── donaciones.js               # registrarDonacion
│       └── solicitudes.js              # crearSolicitudAdopcion
│
├── prisma/
│   ├── schema.prisma
│   └── seed.js                         # 3 usuarios (uno por rol) + mascotas y adoptantes de muestra
│
├── middleware.js                       # /admin/* → exige cookie de sesión
├── jsconfig.json                       # solo el alias "@/*" → raíz del proyecto
├── postcss.config.mjs                  # plugin @tailwindcss/postcss (Tailwind v4)
├── package.json
└── .env.example
```

**Notas de la estructura**

- Los grupos `(public)` y `(admin)` **no cambian la URL**: `(admin)/admin/mascotas/page.jsx` sigue
  siendo `/admin/mascotas`.
- No hay carpeta `src/`: el proyecto vive en la raíz para acortar rutas.
- No hay `/api/`: la lógica está en Server Actions (ver la tabla de equivalencia en la sección 6).
- `components/` es plano (sin subcarpetas `ui/`, `forms/`, `layout/`): con ~20 archivos no hace falta.
- **No existe `types/` ni `tsconfig.json`**: JavaScript puro. Los datos que devuelve Prisma se usan
  tal cual y Zod valida lo que llega de los formularios.
- **Regla de extensión:** si el archivo devuelve etiquetas → `.jsx`; si es lógica (Prisma, auth,
  acciones, middleware, seed) → `.js`. No se mezcla.
- **`jsconfig.json`** solo contiene el alias de imports:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": { "@/*": ["./*"] }
    }
  }
  ```
  Así se escribe `import PetCard from "@/components/PetCard"` en vez de `../../../components/...`.
- **No hay `next.config`**: el proyecto usa los valores por defecto de Next. Las fotos se muestran
  con `<img>` normal (`foto_url` es una URL de texto).
- **`postcss.config.mjs`** es el único archivo que exige Tailwind v4:
  ```js
  export default { plugins: { "@tailwindcss/postcss": {} } };
  ```

### Puesta en marcha local

```bash
npm install
npx prisma migrate dev --name inicio
npx prisma db seed
npm run dev
```

El seed se ejecuta con Node directo porque es JavaScript (no hace falta `tsx` ni `ts-node`):

```json
"scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
"prisma": { "seed": "node prisma/seed.js" }
```

---

## 3. Modelo de datos (Prisma Schema completo)

Cinco tablas planas: `usuario`, `mascota`, `adoptante`, `solicitud_adopcion` y `donacion`.
Tablas y columnas en `snake_case` español mediante `@map` / `@@map`.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id              Int        @id @default(autoincrement()) @map("id_usuario")
  nombre          String     @db.VarChar(80)
  correo          String     @unique @db.VarChar(80)
  hash_contrasena String     @db.VarChar(255) @map("hash_contrasena")
  rol             String     @db.VarChar(20) // administrador | veterinario | voluntario
  donaciones      Donacion[]

  @@map("usuario")
}

model Mascota {
  id             Int      @id @default(autoincrement()) @map("id_mascota")
  nombre         String   @db.VarChar(50)
  raza           String   @db.VarChar(50)
  edad_estimada  String   @db.VarChar(30) @map("edad_estimada") // texto: "2 años", "8 meses"
  especie        String   @db.VarChar(10)                        // perro | gato
  sexo           String?  @db.VarChar(10)                        // macho | hembra
  tamano         String?  @db.VarChar(10)                        // pequeño | mediano | grande
  estado         String   @default("en_adopcion") @db.VarChar(20) // en_adopcion | adoptado
  personalidad   String?  @db.Text
  salud_resumen  String?  @db.Text @map("salud_resumen")          // sin historial clínico (US 1.5 = Won't)
  foto_url       String?  @db.VarChar(255) @map("foto_url")
  fecha_registro DateTime @default(now()) @map("fecha_registro")
  solicitudes    SolicitudAdopcion[]

  @@map("mascota")
}

model Adoptante {
  id              Int      @id @default(autoincrement()) @map("id_adoptante")
  documento       String   @unique @db.VarChar(20) // cédula → base del 409 de US 2.1
  nombre_completo String   @db.VarChar(80) @map("nombre_completo")
  telefono        String   @db.VarChar(20)
  direccion       String   @db.VarChar(100)
  correo          String?  @db.VarChar(80)
  estado          String   @default("activo") @db.VarChar(20) // activo | inactivo
  fecha_registro  DateTime @default(now()) @map("fecha_registro")
  solicitudes     SolicitudAdopcion[]

  @@map("adoptante")
}

model SolicitudAdopcion {
  id                   Int      @id @default(autoincrement()) @map("id_solicitud")
  mascota_id           Int      @map("mascota_id")
  adoptante_id         Int      @map("adoptante_id")
  tipo_vivienda        String   @db.VarChar(20) // apartamento | casa | finca
  animales_en_hogar    Boolean  @default(false) @map("animales_en_hogar")
  descripcion_vivienda String   @db.Text @map("descripcion_vivienda")
  personas_en_hogar    Int?     @map("personas_en_hogar")
  acepta_terminos      Boolean  @default(false) @map("acepta_terminos")
  estado               String   @default("en_revision") @db.VarChar(20) // en_revision
  fecha_solicitud      DateTime @default(now()) @map("fecha_solicitud")

  mascota   Mascota   @relation(fields: [mascota_id], references: [id])
  adoptante Adoptante @relation(fields: [adoptante_id], references: [id])

  @@map("solicitud_adopcion")
}

model Donacion {
  id                 Int      @id @default(autoincrement()) @map("id_donacion")
  tipo_aporte        String   @db.VarChar(20) @map("tipo_aporte") // monetaria | especie
  monto              Int?     // pesos COP, sin decimales (demo)
  descripcion_insumo String?  @db.Text @map("descripcion_insumo")
  cantidad           Int?
  nombre_donante     String   @db.VarChar(80) @map("nombre_donante")
  correo             String?  @db.VarChar(80)
  fecha_donacion     DateTime @default(now()) @map("fecha_donacion")
  usuario_id         Int      @map("usuario_id") // quién registró el aporte

  usuario Usuario @relation(fields: [usuario_id], references: [id])

  @@map("donacion")
}
```

### Decisiones del modelo

| Decisión | Por qué |
|---|---|
| `adoptante.documento` con `@unique` | ESC-2.1.2: el índice único es la garantía real contra duplicados. El código captura `P2002` y responde con el mensaje exacto *"El número de documento ya se encuentra registrado"*. |
| Estados como `String` (no `enum`) | Los valores válidos se validan con Zod (`z.enum([...])`); se evita el `@map` por valor de los enums de Prisma y se lee mejor en la BD. Cada columna documenta sus valores en un comentario. |
| `monto` como `Int` (pesos COP) | Evita el tipo `Decimal` de Prisma en formularios y tablas. Una donación demo no necesita centavos. |
| `edad_estimada` como texto | `PAGES.md` lo pide como texto libre ("2 años"); el diagrama propone `edad_valor` + `edad_unidad`, que se descarta por simplicidad. |
| `acepta_terminos` y `cantidad` | Campos del diagrama que sí exige la UI (checkbox de consentimiento de US 4.1 y cantidad de insumos de US 3.3). |
| 5 tablas, sin catálogos | Las tablas `especie`, `raza`, `estado_salud`, `disponibilidad`, `ciudad` y `donante` del diagrama E-R **no se implementan** en Sprint 1: son tablas de referencia que no exige ninguna Must. Quedan para Sprint 2. |
| Sin `donante` como tabla | US 3.3 registra el aporte con `nombre_donante` + `correo` en la propia donación. El donante no tiene cuenta ni historial (US 3.4/3.5 = Sprint 2). |
| Sin historial clínico | US 1.5 es Won't Have: la salud es un único `salud_resumen`. |

---

## 4. Autenticación y control de acceso sencillo

### Flujo

1. `/login` envía el formulario a la Server Action `iniciarSesion` (`lib/actions/auth.js`).
2. La acción valida con Zod, busca el `usuario` por `correo` y compara con `bcryptjs.compare`.
3. Si es válido, firma un **JWT HS256 con `jose`**, payload `{ id, nombre, rol }`, expiración 8 h, y lo
   guarda en la cookie **`sesion`** con `httpOnly`, `sameSite: "lax"`, `path: "/"` y `secure` solo en
   producción.
4. Redirige a `/admin/mascotas` (el dashboard es Sprint 2).
5. Si las credenciales fallan, devuelve `{ error: "Correo o contraseña incorrectos" }` y la página lo
   pinta con `ErrorBanner`.

```js
// lib/auth.js — el único lugar donde se firma y se lee el token
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const clave = new TextEncoder().encode(process.env.JWT_SECRETO);

export async function firmarSesion(sesion) {
  return new SignJWT(sesion)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(clave);
}

export async function leerSesion(token) {
  try {
    const { payload } = await jwtVerify(token, clave);
    return payload;
  } catch {
    return null;
  }
}

// Para usar en Server Components y Server Actions
export async function getSesion() {
  const token = (await cookies()).get("sesion")?.value;
  return token ? leerSesion(token) : null;
}
```

### Middleware (solo presencia de cookie)

```js
// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const sesion = request.cookies.get("sesion");
  if (!sesion) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

### Guardia real de la sesión

El middleware solo comprueba que la cookie exista; la **validez de la firma** se verifica en
`app/(admin)/layout.jsx`, que es un Server Component:

```jsx
// app/(admin)/layout.jsx
const sesion = await getSesion();
if (!sesion) redirect("/login");
```

El layout pasa `sesion` al `Sidebar` (nombre y rol del usuario) y envuelve todas las pantallas
`/admin/*`. `cerrarSesion` borra la cookie y redirige a `/login`.

> El payload del JWT es un objeto normal `{ id, nombre, rol }`; no existe el tipo `Sesion` que
> tendría una versión en TypeScript.

### Roles

- Los tres roles (`administrador`, `veterinario`, `voluntario`) ven **todo** el panel: ninguna Must
  exige permisos diferenciados (ver la matriz de acceso de `PAGES.md`).
- El rol vive en el payload del JWT y se muestra en el header del panel. **No** se crean guards por
  rol ni verificaciones adicionales.
- Adoptantes y donantes **nunca** inician sesión: sus formularios son públicos.

### Variables de entorno (`.env`)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/huellitas"
JWT_SECRETO="clave-larga-de-ejemplo-para-el-proyecto-de-clase"
```

`.env` va en `.gitignore`; se versiona `.env.example` con los mismos nombres.

---

## 5. Reglas de código para el agente (Dev Rules)

### Dependencias permitidas

Solo estas. Cualquier otra requiere justificación explícita.

`next` · `react` · `react-dom` · `tailwindcss` · `@tailwindcss/postcss` · `postcss` ·
`prisma` · `@prisma/client` · `zod` · `jose` · `bcryptjs` · `lucide-react`

- **No** se instala `typescript` ni ningún `@types/*`.
- `jose` en lugar de `jsonwebtoken` porque el middleware de Next corre en runtime Edge.
- `bcryptjs` en lugar de `bcrypt` porque no necesita compilación nativa.

### Reglas

1. **Todo en español:** textos de interfaz, nombres de variables de negocio, columnas y comentarios.
   El código de infraestructura (`page.jsx`, `layout.jsx`, `middleware.js`) conserva el nombre que
   exige Next.
2. **Prisma directo.** Se importa `prisma` desde `lib/prisma.js` y se consulta en la página o en la
   acción. Prohibido crear `services/`, `repositories/` o `use-cases/`.
3. **Una Server Action por formulario**, en `lib/actions/<entidad>.js` con `"use server"` arriba.
   Firma común en JavaScript:

   ```js
   // lib/actions/mascotas.js
   "use server";

   export async function crearMascota(_previo, formData) {
     const nombre = String(formData.get("nombre") ?? "").trim();
     // validar con Zod → escribir con Prisma → redirect
     return { camposFaltantes: ["nombre"] };
   }
   ```

   El primer parámetro es el estado previo de `useActionState`; no se usa, pero React lo exige.
   Se consume con `useActionState` de React en el componente cliente del formulario. Éxito →
   `revalidatePath(...)` + `redirect("/admin/...?ok=<mensaje>")`; la página destino lee `searchParams`
   y muestra el `Toast`.
4. **Validación con Zod** en `lib/validaciones.js`, un esquema por formulario. El resultado se
   traduce a `camposFaltantes` (nombres de campo en español) para que la UI resalte en rojo
   (`#b94f35` + anillo `#f2e1d5`) y lleve el foco al primero, como exigen ESC-1.1.2, ESC-3.3.1 y
   ESC-4.1.1. Como no hay tipos, **cada valor de `formData` se convierte antes de validar**
   (`String(...)`, `Number(...)`, `Boolean(...)`).
5. **Mensajes exactos** de `PAGES.md` centralizados en `lib/mensajes.js`:
   *"Ficha guardada con éxito"*, *"Adoptante registrado"*, *"Aporte registrado"*,
   *"¡Solicitud enviada! Te contactaremos pronto."*, *"El número de documento ya se encuentra registrado"*,
   *"Correo o contraseña incorrectos"*.
6. **Diseño solo con `STYLEGUIDE.md`.** Usar los componentes con los nombres de `PAGES.md`
   (`PrimaryButton`, `SecondaryButton`, `MintButton`, `OutlineButton`, `Chip`, `PetCard`,
   `StatusBadge`, `DashPanel`, `PanelHeading`, `DataTable`, `FormField`, `AdoptionModal`, `Toast`,
   `EmptyState`, `ErrorBanner`, `Spinner`, `Navbar`, `Sidebar`, `Pagination`) y las clases de los
   tokens. **Prohibido** inventar colores, tamaños o sombras; si falta algo, se propone primero y se
   registra en `STYLEGUIDE.md`.
7. **Iconos:** solo `lucide-react`, `stroke-width={2}`, decorativos con `aria-hidden="true"` y
   botones de solo icono con `aria-label`.
8. **Accesibilidad mínima por pantalla:** un `<h1>`, landmarks `header/nav/main/footer`,
   `<label htmlFor>`, foco visible `#be4e89`, `Escape` cierra modal y menú, targets ≥44 px.
9. **Prohibido en este sprint:** pasarelas de pago, envío de correos, PDF, uploads de archivos
   (`foto_url` es una URL de texto), deploy, CI y tests automatizados. Los casos de prueba se
   documentan a mano en la plantilla de Confluence.
10. **Prohibido adelantar Sprint 2:** edición/borrado de fichas, `/admin/solicitudes`,
    `/admin/dashboard`, `/donar`, filtros avanzados, correos al adoptante, `DonationModal`,
    `AdoptanteDetailModal`, `ConfirmDangerModal`.
11. **Sin tipos.** Nada de `any`, interfaces, genéricos, `as` ni `z.infer`. La única red de
    seguridad es **Zod** validando en runtime antes de escribir en la base de datos; un campo mal
    escrito en Prisma falla en ejecución, así que se copian los nombres exactos del `schema.prisma`.
12. **Comentarios escasos y útiles:** solo donde la regla de negocio no es obvia (por qué el
    `@unique` del documento, por qué `monto` es entero). No comentar lo evidente.

---

## 6. Consistencia con los otros documentos

### Trazabilidad HU → ruta → tabla → archivos

| HU | Ruta(s) | Tabla(s) | Archivos principales |
|---|---|---|---|
| **US 1.1** Registrar ficha | `/admin/mascotas/nueva` | `mascota` | `app/(admin)/admin/mascotas/nueva/page.jsx` · `lib/actions/mascotas.js` |
| **US 1.2** Consultar animales | `/mascotas` · `/mascotas/[id]` · `/admin/mascotas` · `/admin/mascotas/[id]` | `mascota` | las 4 `page.jsx` + `components/PetCard.jsx` |
| **US 2.1** Registrar adoptante | `/admin/adoptantes/nuevo` | `adoptante` | `app/(admin)/admin/adoptantes/nuevo/page.jsx` · `lib/actions/adoptantes.js` |
| **US 2.2** Consultar adoptante | `/admin/adoptantes` | `adoptante` | `app/(admin)/admin/adoptantes/page.jsx` (búsqueda por `documento`) |
| **US 3.3** Registrar donación | `/admin/donaciones` | `donacion` + `usuario` | `app/(admin)/admin/donaciones/page.jsx` · `lib/actions/donaciones.js` |
| **US 4.1** Solicitud de adopción | modal en `/mascotas/[id]` | `solicitud_adopcion` + `adoptante` + `mascota` | `components/AdoptionModal.jsx` · `lib/actions/solicitudes.js` |

Reglas de negocio que viven en esas acciones y en ningún otro sitio:

- **US 2.1:** antes de crear, `findUnique({ where: { documento } })`; si existe → `{ error }` con el
  texto exacto. El `@unique` es la red de seguridad ante condiciones de carrera.
- **US 4.1:** busca al adoptante por `documento`; si no existe, lo crea con `estado = "activo"` y
  luego crea la solicitud con `estado = "en_revision"`. Todo en un `prisma.$transaction`.
- **US 3.3:** `usuario_id` sale de la sesión (`getSesion()`), nunca del formulario.

### Equivalencia con los endpoints de `PAGES.md`

`PAGES.md` describe la capa de datos como endpoints REST; la implementación usa Server Components y
Server Actions para no duplicar código. Mismo contrato de datos, sin archivos `route.js`:

| Endpoint en `PAGES.md` | Implementación real |
|---|---|
| `GET /api/mascotas?estado=&especie=&q=&pagina=` | `prisma.mascota.findMany()` en la `page.jsx` (Server Component) |
| `GET /api/mascotas/:id` | `prisma.mascota.findUnique()` en la `page.jsx` |
| `POST /api/mascotas` | `crearMascota()` en `lib/actions/mascotas.js` |
| `GET /api/adoptantes?q=` | `prisma.adoptante.findMany()` con `contains` sobre `documento` |
| `POST /api/adoptantes` | `crearAdoptante()` en `lib/actions/adoptantes.js` |
| `GET /api/donaciones?tipo=&pagina=` | `prisma.donacion.findMany()` en la `page.jsx` |
| `POST /api/donaciones` | `registrarDonacion()` en `lib/actions/donaciones.js` |
| `POST /api/solicitudes-adopcion` | `crearSolicitudAdopcion()` en `lib/actions/solicitudes.js` |
| `POST /api/auth/login` | `iniciarSesion()` en `lib/actions/auth.js` |

### Reparto de responsabilidades entre documentos

| Pregunta | Documento |
|---|---|
| ¿Qué hace la app y cuál es el alcance del sprint? | `AGENTS.md` |
| ¿Qué pantalla, qué ruta, qué texto y qué validación? | `PAGES.md` |
| ¿Cómo se ve (color, tipografía, componente, estado)? | `STYLEGUIDE.md` |
| ¿Cómo se construye (carpetas, BD, auth, reglas)? | **`ARCHITECTURE.md`** |

Ningún documento duplica el contenido de otro: si hay que cambiar un mensaje se cambia en `PAGES.md`
y en `lib/mensajes.js`; si hay que cambiar un color, solo en `STYLEGUIDE.md`.

### Fuera del alcance (Sprint 2) — no implementar

`/donar` · `/admin/dashboard` · `/admin/solicitudes` · edición y borrado de fichas · edición de
adoptantes · `DonationModal` · `AdoptanteDetailModal` · `ConfirmDangerModal` · filtros avanzados ·
historial de donaciones · PDF · comprobantes · correos al adoptante · historial clínico ·
tablas catálogo del diagrama E-R (`especie`, `raza`, `estado_salud`, `disponibilidad`, `ciudad`,
`donante`) · módulo veterinario · gestión de voluntariado · deploy · CI · tests automatizados.
