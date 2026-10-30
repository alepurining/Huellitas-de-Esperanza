# PAGES.md — Mapa de pantallas, rutas y reglas del Sprint 1 (MVP)

## Propósito

Especificación de **todas las vistas, rutas, modales y componentes** del MVP del refugio
**"Huellitas de Esperanza"**, alineada con las **6 historias "Must Have"** de Confluence
(US 1.1, 1.2, 2.1, 2.2, 3.3, 4.1) y con los nombres/variantes definidos en `STYLEGUIDE.md`.

Este documento es el **puente entre el backlog y el código**: para cada ruta se indica qué resuelve,
de dónde viene su diseño, cómo se compone (layout), qué interacciones tiene y con qué reglas/API
dialoga. Si algo de diseño no está en `STYLEGUIDE.md`, se propone allí primero.

> **Regla de oro:** si este documento y Confluence difieren, **manda Confluence**. Todo lo que no sea
> una de las 6 Must queda **explícitamente en Sprint 2** (sección final).

---

## Fuentes consultadas

| Fuente | Referencia | Aporte |
|---|---|---|
| **Confluence** — *Refugio User Story Mapping* (pageId `46858241`) | Espacio `ELIAN ALEJANDRO BLANDON LEGARDA` (solo lectura) | Épicas, historias, Product Backlog MoSCoW y definición del MVP. **Única fuente del backlog.** |
| **Confluence** — *Plantilla Sprint 1* (pageId `46858277`) | Ídem | Especificación de las 6 HU "Must Have" con criterios de aceptación (ESC-x.x.x), validaciones y mensajes exactos. |
| **Figma** — *refugio1* (Design, `xlmdcDvIV8shrJUJ3rtK9D`) | Frame "Patio de Huellas · Refugio en Medellín" (1440×4210) | **Base de la landing pública**: Inicio (hero + valores), Adopta (catálogo + fichas + proceso), El refugio (comunidad + pilares → sección "Nosotros"), Donaciones, Ubicación y contacto, pie. |
| **Figma** — *refugio2* (Make, `yWDLYERWySBWO8KuPJ8VsT`) | Referencia estructural del panel privado: sidebar 245px, tablas, formularios en 2 columnas, búsqueda por cédula, modales, toasts y estados semánticos. | Su estructura ya está volcada en `STYLEGUIDE.md`, que es lo que se usa aquí. |
| **`STYLEGUIDE.md`** (repo) | Fuente única de diseño | Paleta, tipografía, layout, componentes, iconos, estados y tokens. |

---

## Stack (decisiones ya tomadas — `AGENTS.md`)

- **Next.js en JavaScript** (App Router; `.jsx` para páginas/componentes y `.js` para lógica),
  **Tailwind v4**, **lucide-react** (iconos oficiales). **Sin TypeScript.**
- **Prisma + PostgreSQL local** (sin deploy, sin CI, sin tests automatizados).
- **JWT simple con 3 roles**: `administrador`, `veterinario`, `voluntario`.
- **Adoptantes y donantes sin login** (formularios públicos).
- Contenido y textos en **español**; columnas de tablas y campos de BD en `snake_case` español.

> **Nota de implementación (ver `ARCHITECTURE.md`):** las lecturas se hacen con Prisma directo en
> Server Components y las escrituras en Server Actions; los endpoints `GET/POST /api/*` de este
> documento describen el **contrato de datos** y no se implementan como archivos `route.js`.
> La tabla de equivalencia está en `ARCHITECTURE.md` §6.

### Convención de nombres de componentes (de `STYLEGUIDE.md`)

| Componente | Variante / notas |
|---|---|
| `PrimaryButton` | Píldora `#be4e89`, texto blanco (tamaño `sm`/`md`/`full`). |
| `SecondaryButton` | Azul staff `#93c5fd` / `#264661` ("Iniciar sesión", "Volver al sitio"). |
| `MintButton` | Mint `#a7f3d0` / `#276650` (donar, registrar aporte). |
| `OutlineButton` / `GhostButton` / `DangerButton` | Secundario con borde / texto / error `#b94f35`. |
| `Chip` | Filtro píldora (reposo / activo `#fce7f3` / variante oscura "Todos"). |
| `PetCard` | **Variante A** editorial 4-col (landing/catálogo en desktop), **B** compacta (tablet/móvil). **Variante C** (fila de tabla) queda para las tablas del Sprint 2. |
| `StatusBadge` / `PetStatusBadge` | Semánticos: pendiente `warning`, aprobado `success`, rechazado `danger`, neutro; etiqueta sobre foto `accent`. |
| `DashPanel` + `PanelHeading` + `DataTable` | Paneles y tablas del panel privado. |
| `FormField` (+ `Input`, `Select`, `Segmented`, `MoneyInput`, `QuickAmounts`, `ConsentCheckbox`) | Campos de formulario con label, foco y error del styleguide. |
| `Modal` (`AdoptionModal`) | Backdrop blur, panel 650px radius 26px, header icono 54px + kicker + H2, cierre circular + `Escape` + focus trap. |
| `Toast` | Inferior centrado `#374151`, icono `CircleCheck`, auto-cierre 3500ms. |
| `Navbar`, `Sidebar`, `Pagination`, `EmptyState`, `ErrorBanner`, `Spinner` | Según secciones correspondientes del styleguide. |

---

## Alcance del Sprint 1 (solo las 6 Must)

**MVP = 6 historias "Must Have"** de Confluence (épicas 1, 2, 3 y 4 del User Story Mapping):

| HU | Historia | Criterios de aceptación (validaciones) |
|---|---|---|
| **US 1.1** | Registrar datos de animales en fichas digitales (trabajador autenticado). | **ESC-1.1.1**: diligenciar nombre, raza, edad estimada y estado → "Guardar" inserta el registro y muestra *"Ficha guardada con éxito"*. **ESC-1.1.2**: si falta un obligatorio → bloquear envío y **resaltar en rojo** los campos pendientes. |
| **US 1.2** | Ver el listado de animales con su información (trabajador y adoptante). | **ESC-1.2.1**: panel con todos los animales mostrando **nombre, raza, edad e id**. **ESC-1.2.2**: clic en un animal → **ficha detallada** con toda su información. |
| **US 2.1** | Registrar información personal del adoptante (trabajador). | **ESC-2.1.1**: cédula, nombre, teléfono y dirección → "Registrar Adoptante" → perfil con **ID única** y estado **"Activo"**. **ESC-2.1.2**: cédula ya existente → rechazar con *"El número de documento ya se encuentra registrado"*. |
| **US 2.2** | Consultar información de un adoptante (trabajador). | **ESC-2.2.1**: listado con información de todos los adoptantes (nombre, documento, etc.). **ESC-2.2.2**: **buscar por cédula** y ver al adoptante coincidente. |
| **US 3.3** | Registrar donaciones monetarias o en especie (trabajador). | **ESC-3.3.1**: datos incompletos → **mensaje de alerta** con los campos faltantes. **ESC-3.3.2**: todos los campos → registrar la donación en la base de datos. |
| **US 4.1** | Formulario **público** de solicitud de adopción con datos de contacto y condiciones de vivienda (adoptante, sin login). | **ESC-4.1.1**: campos incompletos → alerta de datos faltantes al enviar. **ESC-4.1.2**: campos completos → **registrar la solicitud** en el sistema. |

### Reglas transversales

- El panel privado (`/admin/*`) **requiere login JWT** con rol `administrador` | `veterinario` | `voluntario`.
- Adoptantes y donantes **nunca tienen login**: sus formularios son públicos.
- **Estados de la mascota (únicos del Sprint 1):** `en_adopcion` (etiqueta visible **"Busco hogar"**) y `adoptado`.
  No se usan "disponible" ni "reservado".
- **No** hay historial médico (US 1.5 = Won't Have): la salud es un solo campo `salud_resumen`.
- **No** hay gestión de voluntariado ni módulo de salud veterinaria: no existen en Confluence.
- El MVP es **concepto/demo**: sin pasarela de pago real, sin correos reales, cifras/fotos/contactos de muestra
  (banda "modo demo" del styleguide en las páginas públicas).

---

## Backlog MoSCoW (Confluence) y destino por sprint

| US | Historia | Prioridad | Sprint |
|---|---|---|---|
| US 1.1 | Registrar los datos de los animales en fichas digitales. | **Must** | **1** |
| US 1.2 | Consultar en un panel la información general del animal (nombre, raza, edad, id). | **Must** | **1** |
| US 2.1 | Registrar la información personal de un adoptante (nombre, identificación, contacto). | **Must** | **1** |
| US 2.2 | Consultar la información de un adoptante para decidir si es apto. | **Must** | **1** |
| US 3.3 | Registrar las donaciones monetarias o en insumos entregadas por donantes. | **Must** | **1** |
| US 4.1 | Llenar un formulario de solicitud de adopción en línea (contacto + condiciones de vivienda). | **Must** | **1** |
| US 1.3 | Actualizar o cambiar la información del animal. | Should | 2 |
| US 2.3 | Actualizar la información de un adoptante. | Should | 2 |
| US 2.5 | Enviar un correo o mensaje de respuesta al adoptante sobre su solicitud. | Should | 2 |
| US 3.1 | Generar un informe en PDF de las donaciones. | Should | 2 |
| US 4.3 | Cambiar el estado de las solicitudes de adopción (en revisión, aprobada, rechazada). | Should | 2 |
| US 1.4 | Filtrar la visualización de los animales por su información (adoptante). | Could | 2 |
| US 2.4 | Visualizar qué animales ha adoptado un adoptante concreto. | Could | 2 |
| US 3.4 | Recibir un comprobante o confirmación de la donación (donante). | Could | 2 |
| US 3.5 | Consultar y filtrar el historial de donaciones por tipo o fecha. | Could | 2 |
| US 1.5 | Historiales clínicos en PDF. | Won't | 2 |
| US 3.2 | Informes de gasto. | Won't | 2 |
| US 4.2 | Vincular el perfil del adoptante con veterinarias socias (cupones). | Won't | 2 |
| US 4.4 | Reportes mensuales. | Won't | 2 |
| US 4.5 | Encuestas post-adopción. | Won't | 2 |

> Sprint 2 agrupa **todo** lo que no sea Must: historias Should/Could/Won't y las pantallas de apoyo
> que no exige ninguna Must (ver *Fuera del alcance* al final).

---

## Mapa de rutas

| # | Ruta | Pantalla | Alcance | Origen de diseño |
|---|---|---|---|---|
| 1 | `/` | Landing pública (Inicio · Cómo ayudar · Nosotros · Ubicación) | Soporte | **refugio1** (estructura) |
| 2 | `/mascotas` | Catálogo público de mascotas (US 1.2) | **MVP** | **refugio1** (sección Adopta) |
| 3 | `/mascotas/[id]` | Ficha pública de la mascota (US 1.2 · ESC-1.2.2) | **MVP** | **integración** refugio1 (ficha editorial) + refugio2 (comportamiento) |
| 4 | *(modal)* | `AdoptionModal` — Solicitud pública de adopción (US 4.1) | **MVP** | **refugio2** (modal + formularios) |
| 5 | `/login` | Acceso al panel privado (3 roles) | Soporte | **refugio2** |
| 6 | `/admin/mascotas` | Listado de fichas de animales (US 1.2 · ESC-1.2.1) | **MVP** | **refugio2** (tabla) |
| 7 | `/admin/mascotas/nueva` | Registro de ficha de animal (US 1.1) | **MVP** | **refugio2** (formularios) |
| 8 | `/admin/mascotas/[id]` | Ficha detallada del animal (staff, solo lectura) | Soporte (US 1.2) | **integración** refugio1 + refugio2 |
| 9 | `/admin/adoptantes` | Listado + búsqueda por cédula (US 2.2) | **MVP** | **refugio2** |
| 10 | `/admin/adoptantes/nuevo` | Registro de adoptante (US 2.1) | **MVP** | **refugio2** (formularios) |
| 11 | `/admin/donaciones` | Registro y consulta de donaciones (US 3.3) | **MVP** | **refugio2** (tabla + formulario) |
| 12 | *(transversal)* | `Toast`, `Spinner`, `EmptyState`, `ErrorBanner` | Soporte | **refugio2** |

**Sprint 2 (no implementar ahora):** `/donar`, `/admin/dashboard`, `/admin/solicitudes`,
edición/borrado de fichas, `DonationModal`, `ConfirmDangerModal`, `AdoptanteDetailModal`, filtros
avanzados, correos y PDF.

---

## Especificación por ruta

### 1. `/` — Landing pública

- **Propósito:** Puerta de entrada del refugio: presentar la marca, mostrar mascotas en adopción,
  explicar el proceso, invitar a ayudar, contar quiénes somos y dar la ubicación. Enlaza al catálogo
  y al login. **No** contiene formularios funcionales (los formularios públicos del MVP son el
  `AdoptionModal` del catálogo y la gestión interna).
- **Origen de Diseño:** **refugio1** (estructura y secciones del frame "Patio de Huellas"), aplicando
  la paleta/tipografía de `STYLEGUIDE.md` (Fraunces + Nunito, paleta refugio2).
- **Secciones y Bloques (de arriba a abajo):**
  1. **Banda de aviso de concepto** (`modo demo`, 13px, fondo `bg-tint`): nota de que es un proyecto de clase.
  2. **`Navbar` sticky** (100px desktop / 70px móvil, blur + borde `#fce7f3`): marca (emblema circular
     44px `paw-print` + "Huellitas" Fraunces + descriptor `REFUGIO · MEDELLÍN`), enlaces
     **Inicio · Cómo ayudar · Nosotros · Ubicación** y acción `SecondaryButton` **"Iniciar sesión"** → `/login`.
     Móvil: hamburguesa + panel con `--shadow-menu`.
  3. **Hero "Bienvenida"** (min-height 620px): eyebrow `AMOR QUE DEJA HUELLA`, H1 Fraunces 76px,
     introducción, `PrimaryButton` "Ver mascotas en adopción" → `/mascotas` + `OutlineButton`
     "Cómo ayudar" (ancla `#ayudar`); mensaje de cuidado (`heart-handshake`); retrato protagonista con
     `--radius-hero-arch` y pie de retrato (nombre + detalle + icono `heart`).
  4. **Banda "Valores compartidos"**: 3 valores con icono `sparkles`.
  5. **Catálogo destacado** (id `#adoptar`): eyebrow `CONOCE A TU NUEVO MEJOR AMIGO`, H2 + presentación,
     `Chip` de filtros (Todos / Perros / Gatos) y **4 `PetCard` variante A** con mascotas `en_adopcion`.
     CTA de sección → `/mascotas`.
  6. **Proceso de adopción** (id `#proceso`): introducción + pasos numerados (numeración terracota `#b94f35`).
  7. **Cómo ayudar** (id `#ayudar`, banda salvia oscura `#cfe0c4`): mensaje + descripción + **3 formas de ayudar**
     (donar, hogar temporal, difusión) en tarjetas informativas. **Sin formulario ni pasarela**:
     los botones son informativos y remiten a la sección de ubicación/contacto (el formulario público de
     donación es Sprint 2).
  8. **Nosotros** (id `#nosotros`, de la sección "El refugio" de refugio1): quiénes somos (misión y
     visión del refugio), la comunidad (voluntarios y aliados, en texto) y **pilares de cuidado**
     (iconos `heart-handshake`, `house`, `stethoscope`… a elección del styleguide) en 3 tarjetas.
  9. **Ubicación y contacto** (id `#ubicacion`): "Visítanos" (dirección de muestra), "Medellín como
     referencia" y cierre de comunidad con CTA.
  10. **Footer** (`bg #454c58`, texto `text-on-dark`): marca y navegación + nota legal (cifras y
      contactos de muestra).
- **Componentes e Interacciones:** `Navbar` con scroll suave a anclas (`#adoptar`, `#proceso`, `#ayudar`,
  `#nosotros`, `#ubicacion`); `PrimaryButton` → `/mascotas`; `SecondaryButton` → `/login`;
  `PetCard` A → `/mascotas/[id]`. Móvil: `Escape` cierra el menú hamburguesa.
- **Datos y Backend:** `GET /api/mascotas?estado=en_adopcion&limite=4` para el catálogo destacado
  (US 1.2). Sin datos → `EmptyState` con CTA a `/admin/mascotas/nueva`.

### 2. `/mascotas` — Catálogo público de mascotas

- **Propósito:** Consultar el listado de animales del refugio con su información básica
  (nombre, raza, edad, estado) y entrar a su ficha. Cumple **US 1.2** en su vista pública (ESC-1.2.1
  y ESC-1.2.2).
- **Origen de Diseño:** **refugio1** (sección "Adopta"), con estados vacío/error/carga de `STYLEGUIDE.md`.
- **Secciones y Bloques:**
  1. `Navbar` + hero compacto del catálogo (eyebrow + H1 + presentación).
  2. **Grupo de filtros** `role="group" aria-label="Filtrar mascotas"`: `Chip`s "Todos" (variante oscura
     `#283e35`), "Perros", "Gatos" con `aria-pressed`; scroll horizontal en móvil. *(Filtro por especie
     como apoyo de lectura; el filtrado avanzado es US 1.4 = Sprint 2.)*
  3. Nota del catálogo (contador de resultados, p. ej. "8 amigos buscando hogar").
  4. **Grid de `PetCard`**: variante **A** en desktop (4 columnas, `gap: 24px`) y variante **B** en
     tablet/móvil (1 columna).
  5. Estados: `Spinner` ("Cargando…"), `EmptyState` (`SearchX` + "No encontramos mascotas con ese filtro"),
     `ErrorBanner` (`CircleAlert` + "Reintentar").
  6. `Pagination` (páginas circulares) cuando hay más de 12 resultados.
  7. `Footer`.
- **`PetCard` variante A** (fichas de 302px): imagen 260px + `PetStatusBadge` "Busco hogar" flotante;
  cuerpo con nombre (Fraunces 30px) + icono de especie (`dog`/`cat`), meta (raza · edad · sexo),
  tamaño, personalidad, línea de salud, separador y CTA de texto "Conocer a {nombre}" + `arrow-up-right`.
- **Componentes e Interacciones:** `Chip` filtran por `especie` y actualizan la query URL;
  `PetCard` → `/mascotas/[id]`; `Pagination` pagina el `GET`; `ErrorBanner.Reintentar` → re-fetch.
- **Datos y Backend:** `GET /api/mascotas?estado=en_adopcion&especie={perro|gato}&pagina=` — solo
  mascotas **en adopción** (nunca `adoptado`). Cada tarjeta muestra `nombre`, `raza`, `edad_estimada`,
  `especie`, `tamano`, `personalidad`, `estado`.

### 3. `/mascotas/[id]` — Ficha pública de la mascota

- **Propósito:** Ver la información **detallada** de una mascota antes de postularse
  (ESC-1.2.2) y dar entrada al formulario de adopción.
- **Origen de Diseño:** **integración** — contenido y anatomía editorial de refugio1 (retrato, identidad,
  meta) con el patrón de panel/comportamiento de refugio2.
- **Secciones y Bloques:**
  1. `Navbar`.
  2. Barra superior: `GhostButton` "← Volver al catálogo".
  3. **Retrato** grande (`--radius-feature` 140/20/20/20) con `PetStatusBadge` sobre la foto y `alt`
     descriptivo ("Bruno, perro en adopción").
  4. **Panel de identidad:** nombre (Fraunces), icono de especie, meta (raza · edad · sexo · tamaño),
     badge de estado (`en_adopcion` → "Busco hogar"), personalidad.
  5. **Bloque "Salud"**: resumen (`salud_resumen`: vacunas/desparasitación) — sin historial clínico.
  6. **Cita/descripción corta** + bloque de disponibilidad.
  7. CTA principal: `PrimaryButton` "Quiero conocer a {nombre}" → abre `AdoptionModal`.
  8. Mini-recordatorio del **proceso de adopción** (pasos 1–4) + `Footer`.
- **Componentes e Interacciones:** `PrimaryButton` → `AdoptionModal` solo si `estado = en_adopcion`;
  si `estado = adoptado`, `SecondaryButton` deshabilitado con "Esta mascota ya fue adoptada ❤️".
  `GhostButton` → `/mascotas`.
- **Datos y Backend:** `GET /api/mascotas/:id` (ficha completa, sin historial clínico). Mascota
  inexistente → `ErrorBanner` + link al catálogo.

### 4. `AdoptionModal` — Solicitud pública de adopción (modal)

- **Propósito:** Recibir la solicitud en línea de un adoptante **sin login**, con sus datos de contacto
  y condiciones de vivienda. Cumple **US 4.1** (ESC-4.1.1 validación; ESC-4.1.2 registro).
- **Origen de Diseño:** **refugio2** (patrón Modal + formularios en 2 columnas), coherente con `STYLEGUIDE.md`.
- **Secciones y Bloques:** (panel modal 650px, radius 26px, backdrop `rgba(50,41,47,.55)` + blur 8px)
  1. Header: icono 54px (`heart-handshake`, fondo `#fce7f3`) + kicker `POSTULAR A ADOPCIÓN` +
     H2 Fraunces 29px ("Solicitud para adoptar a {mascota}").
  2. Botón de cierre circular 38px (`aria-label="Cerrar"`), cierre con `Escape` y click en backdrop,
     foco atrapado.
  3. Form en **2 columnas** (1 en móvil):
     - `documento*` — **cédula** (texto, solo números; hint "cédula del adoptante").
     - `nombre_completo*`, `correo*`, `telefono*`, `direccion*`.
     - `tipo_vivienda*` (Select: apartamento/casa/finca), `animales_en_hogar` (Segmented: Sí/No),
       `descripcion_vivienda*` (textarea: condiciones de vivienda), `personas_en_hogar` (opcional).
     - `ConsentCheckbox` de tratamiento de datos*.
  4. Pie: `PrimaryButton` "Enviar solicitud" + `OutlineButton` "Cancelar".
- **Interacciones:** al enviar → validación lado cliente (borde `#b94f35` + anillo `#f2e1d5` + mensaje
  bajo el campo; foco al primer inválido = ESC-4.1.1). Éxito → `Toast` "¡Solicitud enviada! Te
  contactaremos pronto." (`CircleCheck`) + cierre del modal (ESC-4.1.2). Error de red → `ErrorBanner`
  dentro del modal.
- **Datos y Backend:** `POST /api/solicitudes-adopcion` con
  `{ mascota_id, documento, nombre_completo, correo, telefono, direccion, tipo_vivienda, animales_en_hogar, descripcion_vivienda, personas_en_hogar }`.
  - Busca al adoptante por **`documento` (cédula)**: si existe, **asocia** la solicitud a ese adoptante;
    si no existe, **crea** el adoptante con los datos del formulario y `estado = "activo"`.
  - Crea la solicitud con `estado = "en_revision"` y `fecha_solicitud`.
  - El adoptante **no** obtiene cuenta ni login.

### 5. `/login` — Acceso al panel privado

- **Propósito:** Autenticar a los 3 roles staff (`administrador`, `veterinario`, `voluntario`) con JWT
  simple. Adoptantes/donantes **no** pasan por aquí.
- **Origen de Diseño:** **refugio2** (formulario), coherente con `STYLEGUIDE.md`.
- **Secciones y Bloques:** card centrada sobre fondo `bg` (max 420px): emblema + marca, H1 Nunito 34px
  "Panel del refugio", `FormField` `correo*`, `FormField` `contrasena*` (tipo password con toggle
  `Eye`/`EyeOff`), `PrimaryButton` "Ingresar" (full), `SecondaryButton` "Volver al sitio" → `/`,
  nota de modo demo.
- **Interacciones:** validación de faltantes; credenciales inválidas → `ErrorBanner` "Correo o
  contraseña incorrectos"; éxito → redirige a **`/admin/mascotas`** (el dashboard es Sprint 2).
- **Datos y Backend:** `POST /api/auth/login` → verifica credenciales (usuarios de seed), devuelve
  **JWT simple** firmado con `{ id, nombre, rol }` en cookie `httpOnly`. Middleware de Next.js protege
  `/admin/*`: sin token válido → redirect a `/login`.

### 6. `/admin/mascotas` — Listado de fichas de animales (US 1.2)

- **Propósito:** Ver y administrar el listado completo de fichas — núcleo de **US 1.2**
  (ESC-1.2.1: nombre, raza, edad e id).
- **Origen de Diseño:** **refugio2** (`DashPanel` + tabla + búsqueda).
- **Secciones y Bloques:**
  1. `Sidebar` (Mascotas · Adoptantes · Donaciones) + header ("Mascotas registradas" + subtítulo con total).
  2. `PanelHeading`: título, contador y **`PrimaryButton` "Nueva ficha"** → `/admin/mascotas/nueva`.
  3. Barra de controles: `Input` búsqueda por nombre + `Chip` de estado (Todas · En adopción · Adoptado).
  4. **`DataTable`** (filas separador `1px #f1edef`): miniatura 46px · Nombre (raza · edad) · Id ·
     `StatusBadge` de estado. En móvil se oculta la columna de badge.
  5. Estados: `Spinner`, `EmptyState` ("No hay mascotas registradas" + CTA "Registrar ficha"), `ErrorBanner`.
  6. `Pagination` (15 filas por página).
- **Componentes e Interacciones:** fila clickeable → `/admin/mascotas/[id]`; búsqueda/filtros actualizan
  la query string. **No hay** menú de acciones ni borrado (Sprint 2).
- **Datos y Backend:** `GET /api/mascotas?estado=&q=&pagina=` (staff, **todos** los estados).
  La edición de fichas es US 1.3 (Should) → Sprint 2.

### 7. `/admin/mascotas/nueva` — Registro de ficha de animal (US 1.1)

- **Propósito:** Dar de alta una mascota en fichas digitales autenticado. Cumple **US 1.1**
  (ESC-1.1.1 registro exitoso; ESC-1.1.2 validación de obligatorios).
- **Origen de Diseño:** **refugio2** (formularios en 2 columnas, validación y toasts).
- **Secciones y Bloques:**
  1. `Sidebar` + header ("Nueva ficha" + `GhostButton` "← Volver" a `/admin/mascotas`).
  2. `DashPanel` con form en **2 columnas** (1 en móvil):
     - `nombre*` (texto), `raza*` (texto), `edad_estimada*` (texto p. ej. "2 años", hint "edad aproximada").
     - `especie` (Select: perro | gato), `sexo` (Select: macho | hembra),
       `tamano` (Select: pequeño | mediano | grande).
     - `estado*` (Select: **en adopción** | adoptado).
     - `personalidad` (textarea corta), `salud_resumen` (texto: vacunas/desparasitación),
       `foto_url` (URL, con preview).
     - Campos `snake_case` en español, todos con label + placeholder guía.
  3. Pie del form: `PrimaryButton` "Guardar Ficha" + `OutlineButton` "Cancelar" → `/admin/mascotas`.
- **Interacciones:** ESC-1.1.2 → al pulsar "Guardar" con faltantes, se **resaltan en rojo**
  (`#b94f35` + anillo `#f2e1d5` + mensaje bajo campo) y el foco salta al primero; ESC-1.1.1 →
  `Toast` **"Ficha guardada con éxito"** y redirect a `/admin/mascotas`. Botón en estado *Loading*
  (`Loader2`) durante el POST.
- **Datos y Backend:** `POST /api/mascotas` con
  `{ nombre, raza, edad_estimada, especie, sexo, tamano, estado, personalidad, salud_resumen, foto_url }`
  → inserta en la tabla `mascota` (Prisma, columnas `snake_case`). Si `foto_url` falta, se usa una
  imagen placeholder del sistema.

### 8. `/admin/mascotas/[id]` — Ficha detallada (staff)

- **Propósito:** Ver **toda** la información de una mascota desde el panel (ESC-1.2.2). Es de
  **solo lectura** (la edición US 1.3 queda para Sprint 2).
- **Origen de Diseño:** **integración** — contenido completo de la ficha (estilo editorial refugio1)
  dentro del patrón `DashPanel` de refugio2.
- **Secciones y Bloques:** `Sidebar` + header con nombre y `StatusBadge`; `DashPanel` con foto +
  datos generales (raza, edad, especie, sexo, tamaño, estado), bloque personalidad, bloque salud
  resumen, metadatos (id, fecha de registro, `foto_url`); `GhostButton` "← Volver al listado".
- **Interacciones:** solo lectura. Sin "Editar" ni "Eliminar" (Sprint 2).
- **Datos y Backend:** `GET /api/mascotas/:id` (staff completo). **Sin** historial clínico:
  `salud_resumen` es un solo campo.

### 9. `/admin/adoptantes` — Listado y búsqueda por cédula (US 2.2)

- **Propósito:** Consultar la información de los adoptantes para decidir su idoneidad, con
  **búsqueda por cédula**. Cumple **US 2.2** (ESC-2.2.1 listado; ESC-2.2.2 búsqueda).
- **Origen de Diseño:** **refugio2** (búsqueda por cédula es un patrón propio del mockup).
- **Secciones y Bloques:**
  1. `Sidebar` + header ("Adoptantes").
  2. `PanelHeading` + **`PrimaryButton` "Nuevo adoptante"** → `/admin/adoptantes/nuevo`.
  3. Barra de búsqueda destacada: `Input` con icono `Search` **"Buscar por número de cédula…"** (ESC-2.2.2).
  4. **`DataTable`**: Nombre · Documento (cédula) · Teléfono · Dirección · `StatusBadge` ("Activo").
  5. Estados: `Spinner`, `EmptyState`, `ErrorBanner`; contador de resultados.
- **Componentes e Interacciones:** búsqueda por cédula (Enter o botón) → filtra en vivo. Sin modal de
  detalle (Sprint 2); la información completa se ve en la fila/tabla.
- **Datos y Backend:** `GET /api/adoptantes?q={cedula}&pagina=` (coincidencia por `documento`).
  Estados del adoptante: `activo` (por defecto) / `inactivo` — el alta inicial siempre es "Activo"
  (ESC-2.1.1).

### 10. `/admin/adoptantes/nuevo` — Registro de adoptante (US 2.1)

- **Propósito:** Registrar a un adoptante (presencial o telefónico) en la base de datos.
  Cumple **US 2.1** (ESC-2.1.1 alta exitosa; ESC-2.1.2 control de duplicados por cédula).
- **Origen de Diseño:** **refugio2** (formularios 2 columnas).
- **Secciones y Bloques:** `Sidebar` + header ("Nuevo adoptante" + `GhostButton` "← Volver");
  `DashPanel` con form en 2 columnas:
  - `documento*` (**cédula**, texto con hint "solo números"), `nombre_completo*`, `telefono*`,
    `direccion*`, `correo` (opcional).
  - `PrimaryButton` "Registrar Adoptante" + `OutlineButton` "Cancelar" → `/admin/adoptantes`.
- **Interacciones:** validación de obligatorios (estilo rojo + foco); **ESC-2.1.2**: si la cédula ya
  existe, el backend responde 409 y la UI muestra `ErrorBanner` (o mensaje bajo `documento`) con el
  texto exacto *"El número de documento ya se encuentra registrado"*; ESC-2.1.1 → `Toast`
  "Adoptante registrado" y redirect a `/admin/adoptantes`.
- **Datos y Backend:** `POST /api/adoptantes` con
  `{ documento, nombre_completo, telefono, direccion, correo }` → crea el registro con
  `estado = "activo"`; el backend valida **unicidad de `documento`** (índice único en Prisma).

### 11. `/admin/donaciones` — Registro y consulta de donaciones (US 3.3)

- **Propósito:** Mantener el registro de donaciones monetarias y en especie que llegan al refugio.
  Cumple **US 3.3** (ESC-3.3.1 alerta de faltantes; ESC-3.3.2 registro exitoso). Es la **única**
  vía de donaciones del Sprint 1 (el formulario público `/donar` es Sprint 2).
- **Origen de Diseño:** **refugio2** (tabla + formulario en panel).
- **Secciones y Bloques:**
  1. `Sidebar` + header ("Donaciones").
  2. **`DashPanel` "Registrar aporte"** con `Segmented` **tipo_aporte\*** (Monetaria | Especie):
     - Monetaria → `MoneyInput` **monto\*** (prefijo `$` mint) + `QuickAmounts` (20.000 / 50.000 / 100.000 / Otro).
     - Especie → `descripcion_insumo*` (alimentos, mantas, medicamentos…) + `cantidad*`.
     - `nombre_donante*`, `correo` (opcional), `MintButton` "Registrar aporte" (full).
  3. `PanelHeading` + `Chip` de filtro por tipo (Todas · Monetaria · Especie).
  4. **`DataTable`**: Fecha · Donante · Tipo (`StatusBadge`: monetaria info / especie warning) ·
     Monto o Insumo (cantidad + descripción).
  5. Bloque **Info**: "Demo académica: sin pasarela de pago".
  6. Estados vacíos/carga/error + `Pagination`.
- **Componentes e Interacciones:** cambiar el segmento alterna los grupos de campos (transición `.2s`);
  `QuickAmounts` precarga el monto; **ESC-3.3.1** → si faltan campos se muestra el mensaje de alerta
  con **los campos faltantes** (rojo + foco al primero); **ESC-3.3.2** → `Toast` "Aporte registrado"
  + refresh de la tabla.
- **Datos y Backend:** `GET /api/donaciones?tipo=&pagina=` y `POST /api/donaciones` con
  `{ tipo_aporte, monto?, descripcion_insumo?, cantidad?, nombre_donante, correo? }`.
  Campos: `tipo_aporte` (`monetaria` | `especie`), `monto`, `descripcion_insumo`, `cantidad`,
  `nombre_donante`, `correo`, `fecha_donacion`, `usuario_id` (quien registró). **Sin** pasarela de pago.

### 12. Transversales — `Toast` y estados

- **`Toast`:** único patrón de éxito/error global (inferior centrado, `#374151`, icono `CircleCheck`
  mint, 3500ms). Textos en español: "Ficha guardada con éxito", "Adoptante registrado",
  "Aporte registrado", "¡Solicitud enviada! Te contactaremos pronto.".
- **Estados globales (de `STYLEGUIDE.md`):** `Spinner` (`Loader2`), `EmptyState` (icono + H3 Fraunces + CTA),
  `ErrorBanner` (`CircleAlert` + "Reintentar"), bloque Info (azul) para avisos de demo y banda
  "modo demo" en las páginas públicas.
- **Accesibilidad (aplica a todas las rutas):** foco visible `#be4e89`, targets ≥44px, un `<h1>` por
  página, landmarks `<header>/<nav>/<main>/<footer>`, `Escape` cierra modales/menú, filtros como
  `<button aria-pressed>`, `prefers-reduced-motion` respetado.

---

## Matriz de acceso (Sprint 1)

| Ruta | Público (sin login) | `administrador` | `veterinario` | `voluntario` |
|---|---|---|---|---|
| `/`, `/mascotas`, `/mascotas/[id]`, `/login` | ✅ | ✅ | ✅ | ✅ |
| `/admin/mascotas`, `/admin/mascotas/[id]` (lectura) | ❌ | ✅ | ✅ | ✅ |
| `/admin/mascotas/nueva`, `/admin/adoptantes/nuevo` (altas) | ❌ | ✅ | ✅ | ✅ |
| `/admin/adoptantes`, `/admin/donaciones` | ❌ | ✅ | ✅ | ✅ |

> Los tres roles acceden al panel en el MVP; no hay permisos diferenciados porque ninguna historia
> Must los exige. La diferenciación fina (borrar fichas, verificar aportes) es Sprint 2.

---

## Fuera del alcance del Sprint 1 (Sprint 2)

| Ruta / pieza | Por qué no va en Sprint 1 |
|---|---|
| `/donar` (formulario público de donación) | No es una Must: US 3.3 es el registro **interno** por staff. El panel de aportes de la landing queda solo informativo. |
| `/admin/dashboard` | Pantalla de apoyo sin historia Must; tras el login se va a `/admin/mascotas`. |
| `/admin/solicitudes` (bandeja y cambio de estado) | La solicitud se **registra** con US 4.1, pero gestionarla es US 4.3 (Should). |
| Edición y borrado de fichas (`ConfirmDangerModal`) | US 1.3 (Should) y permisos finos. |
| Edición de adoptantes, `AdoptanteDetailModal` | US 2.3 (Should) y US 2.4 (Could). |
| `DonationModal` | Con el formulario en panel de `/admin/donaciones` la US 3.3 ya se cumple. |
| Filtros avanzados, historial de donaciones, PDF, comprobantes | US 1.4, 3.1, 3.4, 3.5 (Could/Should). |
| Correos o mensajes al adoptante | US 2.5 (Should) y US 4.2 (Won't). |
| Historial clínico, informes de gasto, veterinarias socias, reportes, encuestas | US 1.5, 3.2, 4.2, 4.4, 4.5 (Won't). |
| Módulo de salud veterinaria y gestión de voluntariado | **No existen en Confluence**: no forman parte del proyecto. "Voluntariado" solo aparece como texto informativo en la landing. |

---

## Relación con el modelo de datos (Prisma/PostgreSQL local)

| Tabla (snake_case) | Rutas que la usan | Campos clave derivados de las HU |
|---|---|---|
| `mascota` | `/`, `/mascotas*`, `/admin/mascotas*` | `nombre`, `raza`, `edad_estimada`, `especie`, `sexo`, `tamano`, `estado` (`en_adopcion`/`adoptado`), `personalidad`, `salud_resumen`, `foto_url`, `fecha_registro` |
| `adoptante` | `AdoptionModal`, `/admin/adoptantes*` | `documento` (único, cédula), `nombre_completo`, `telefono`, `direccion`, `correo`, `estado` (`activo`), `fecha_registro` |
| `solicitud_adopcion` | `AdoptionModal` | `mascota_id`, `adoptante_id`, `tipo_vivienda`, `animales_en_hogar`, `descripcion_vivienda`, `personas_en_hogar`, `acepta_terminos`, `estado` (`en_revision`), `fecha_solicitud` |
| `donacion` | `/admin/donaciones` | `tipo_aporte`, `monto` (entero, pesos), `descripcion_insumo`, `cantidad`, `nombre_donante`, `correo`, `fecha_donacion`, `usuario_id` |
| `usuario` | `/login`, todo `/admin/*` | `nombre`, `correo`, `hash_contrasena`, `rol` (`administrador`/`veterinario`/`voluntario`) |

El diagrama E-R de referencia está en `Diagrama - Sprint 1 (MVP).png` (es el modelo completo del
proyecto, no sólo el Sprint 1); ante discrepancias, manda Confluence.
