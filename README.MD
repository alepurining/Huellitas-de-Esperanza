# 🐾 Huellitas de Esperanza

Aplicacion web de gestión para el refugio de animales **Huellitas de Esperanza** (Medellín, Colombia):
fichas digitales de mascotas, registro de adoptantes, donaciones y solicitudes de adopción
en línea con un panel privado para el equipo del refugio.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)

## Funcionalidades (MVP — Sprint 1)

| Módulo | Qué hace |
|---|---|
| **Mascotas** | Registro de fichas digitales (nombre, raza, edad, estado, salud) y consulta del listado con vista detallada (US 1.1 / 1.2) |
| **Adoptantes** | Registro de adoptantes con validación de cédula única y consulta con búsqueda por número de cédula (US 2.1 / 2.2) |
| **Donaciones** | Registro interno de aportes monetarios (con montos rápidos) o en especie (insumo + cantidad) (US 3.3) |
| **Solicitudes de adopción** | Formulario público sin registro: datos de contacto y condiciones de vivienda, con selector de mascota (US 4.1) |
| **Acceso** | Login con JWT para 3 roles: `administrador`, `veterinario` y `voluntario` |

**Sitio público:** landing, catálogo de mascotas en adopción con filtros (Perros/Gatos),
ficha detallada con proceso de adopción y formulario de solicitud — todo en español.

## Stack

- **Next.js 15** (App Router, JavaScript — `.jsx`).
- **Tailwind CSS 4** con tokens de diseño definidos en `globals.css`.
- **Prisma + PostgreSQL** (base de datos local).
- **Autenticación JWT** con `jose` + `bcryptjs`, cookie `httpOnly` y middleware para proteger `/admin/*`.
- **Zod** para validación de formularios (lado servidor, Server Actions).

##  Para ejecutar

### 1. Requisitos
- Node.js 18+
- PostgreSQL corriendo localmente

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/huellitas?schema=public"
JWT_SECRETO="cambia-esta-clave"
```

### 4. Base de datos (migración + seed)

```bash
npx prisma migrate dev
npx prisma db seed
```

El seed crea 3 usuarios del staff, 8 mascotas en adopción y algunos adoptantes de ejemplo.

### 5. Correr la app

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Credenciales de acceso (panel privado)

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@huellitas.co` | `Huellitas2026` |
| Veterinario | `veterinario@huellitas.co` | `Huellitas2026` |
| Voluntario | `voluntario@huellitas.co` | `Huellitas2026` |

## Estructura del proyecto

```
app/
  (public)/                 # Sitio público (landing, mascotas, solicitud, login)
  (admin)/admin/            # Panel privado (mascotas, adoptantes, donaciones)
components/                 # UI reutilizable (PetCard, DashPanel, FormField, Modal…)
lib/                        # Prisma, auth, validaciones (Zod), acciones de servidor
prisma/                     # schema.prisma + seed.js
```

- Las **lecturas** se hacen con Prisma directo en Server Components.
- Las **escrituras** en Server Actions (`lib/actions/*`).


## Equipo

- Andres Arroyo
- Yudy Mayorga
- Thomas Naranjo
- Elian  Alejandro Blandon
