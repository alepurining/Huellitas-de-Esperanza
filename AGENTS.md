# AGENTS.md

## Qué es este repo
Proyecto **universitario** (no producción): sistema web de gestión para el refugio de animales
**"Huellitas de Esperanza"**. Es un directorio de **documentación y diseño**; el código todavía no
existe. No intentar "correr" nada hasta que se cree el proyecto.

**Equipo**: Andres Arroyo, Yudy Mayorga, Thomas Naranjo, Elian Blandon.

**Qué hace la app (Sprint 1 — solo las 6 Must de Confluence)**:
- **US 1.1 / 1.2** — Registro y consulta de animales en fichas digitales (listado y ficha detallada).
- **US 2.1 / 2.2** — Registro y consulta de adoptantes (con búsqueda por cédula).
- **US 3.3** — Registro interno de donaciones monetarias o en especie (staff).
- **US 4.1** — Formulario público de solicitud de adopción (adoptante, sin login).
- Panel privado con login para 3 roles (`administrador`, `veterinario`, `voluntario`).
- La salud se limita a un resumen (`salud_resumen`); el historial clínico es **US 1.5 (Won't Have)**.

**Sprint 2 (todo lo demás)**: historias Should/Could/Won't y pantallas de apoyo no exigidas
(formulario público de donación, dashboard, bandeja de solicitudes, edición/borrado de fichas,
filtros, correos y PDF).

Restricciones explícitas del usuario (honrar siempre):
- Es un proyecto de clase, **no se despliega**, no tiene que ser perfecto.
- MVP = solo las **6 historias "Must Have"** del Sprint 1 (US 1.1, 1.2, 2.1, 2.2, 3.3, 4.1); todo lo demás va directo a **Sprint 2**.
- Todo el texto/contenido del proyecto está en **español** (tablas, columnas y comentarios en snake_case español).

**Calendario**: Sprint 1 = 23 oct – 4 nov 2026; entrega **4 nov 2026, 11:59 pm** (Classroom).

## Diseño de la aplicación web
**Todo lo relacionado con el diseño visual/UX de la app web vive en `STYLEGUIDE.md`**: paleta de
colores, tipografía, layout y espaciado, componentes base, iconografía, estados/mensajes y
accesibilidad. Antes de decidir algo de diseño, consultar ese archivo; si no está definido ahí,
proponerlo primero y registrarlo allí. Los mockups están en Figma: **refugio1** (Design) y
**refugio2** (Make).

## Fuentes de verdad (están fuera del repo)
- **Confluence** (vía MCP `atlassian`, sitio `pascualbravoeeeee.atlassian.net`, cloudId `486b8826-ca99-448b-ac4a-6bbbc6de384b`):
  - Espacio personal `ELIAN ALEJANDRO BLANDON LEGARDA`, key `~7120204b5fd5a250b645228fcc8d426b56f094`, spaceId `4259843`.
  - Carpeta `refugio` (id `46661637`) con las 2 páginas que mandan: **Refugio User Story Mapping** (`46858241`) y **Plantilla Sprint 1** (`46858277`).
  - El acceso es **solo lectura**: no intentar escribir en Confluence.
- **Si los docs locales difieren de Confluence, manda Confluence.**

## Archivos locales
- `Diagrama - Sprint 1 (MVP).png` — diagrama E-R original (aunque diga "Sprint 1", es el modelo completo).
- `AGENTS.md` — este archivo: contexto del repo para agentes.
- `STYLEGUIDE.md` — fuente única del diseño de la app web (ver sección anterior).
- `PAGES.md` — mapa de pantallas, rutas y reglas del MVP (Sprint 1) y lo diferido a Sprint 2.
- `ARCHITECTURE.md` — cómo se construye: estructura de carpetas, `schema.prisma`, autenticación y reglas
  de código (simplicidad primero: Prisma directo, Server Actions, sin capas intermedias).
- `opencode.json` — solo declara MCP (`context7`, `atlassian`, `miro`, `figma`); contiene comentarios JSONC y un token,
  por eso falla con parsers JSON estrictos.

## Decisiones de stack ya tomadas
**Next.js en JavaScript** (`.jsx` si el archivo devuelve etiquetas, `.js` para lógica) + Prisma +
PostgreSQL **local**, Tailwind **v4** (tokens en `globals.css`, sin `tailwind.config`),
JWT simple con 3 roles (`administrador`, `veterinario`, `voluntario`), adoptantes/donantes **sin login**
(formularios públicos).

**Sin TypeScript**: no se crea `tsconfig.json` ni se usan `.ts`/`.tsx`. Los errores se detectan en
runtime y los formularios los valida **Zod** (la única red de seguridad). Sin deploy, sin CI, sin tests
automatizados: los casos de prueba se documentan a mano en la plantilla.
