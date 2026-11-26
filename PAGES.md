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
- **Estados de la mascota (únicos del Sprint 1):** `en_adopcion` (etiqueta visible **"Disponible"**) y `adoptado`.
  "Disponible" es una etiqueta de interfaz; el valor guardado sigue siendo `en_adopcion`. No se usa "reservado".
- **No** hay historial médico (US 1.5 = Would): la salud es un solo campo `salud_resumen`.
- **No** hay gestión de voluntariado ni módulo de salud veterinaria: no existen en Confluence.
- El MVP es **concepto/demo**: sin pasarela de pago real, sin correos reales, cifras/fotos/contactos de muestra
  (banda "modo demo" del styleguide en las páginas públicas).

---

## Backlog MoSCoW y destino por sprint

> Sprint 1 tomado de Confluence; prioridades del Sprint 2 tomadas de **`sprint2US.md`** (fuente de verdad).

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
| US 2.4 | Visualizar qué animales ha adoptado un adoptante concreto (**implementado** en Sprint 2). | Could | 2 |
| US 3.4 | Recibir un comprobante o confirmación de la donación (donante). | Should | 2 |
| US 3.5 | Consultar y filtrar el historial de donaciones por tipo o fecha. | Could | 2 |
| US 1.5 | Historiales clínicos en PDF. | Would | 2 |
| US 3.2 | Informes de gasto. | Would | 2 |
| US 4.2 | Vincular el perfil del adoptante con veterinarias socias (cupones). | Would | 2 |
| US 4.4 | Reportes mensuales. | Would | 2 |
| US 4.5 | Encuestas post-adopción. | Would | 2 |

> Sprint 2 agrupa **todo** lo que no sea Must: historias Should/Could/Would y las pantallas de apoyo
> que no exige ninguna Must (ver *Fuera del alcance* al final).

---

## Mapa de rutas

| # | Ruta | Pantalla | Alcance | Origen de diseño |
|---|---|---|---|---|
| 1 | `/` | Landing pública (Inicio · Cómo ayudar · Nosotros · Ubicación) | Soporte | **refugio1** (estructura) |
| 2 | `/mascotas` | Catálogo público de mascotas (US 1.2) | **MVP** | **refugio1** (sección Adopta) |
| 3 | `/mascotas/[id]` | Ficha pública de la mascota (US 1.2 · ESC-1.2.2) | **MVP** | **integración** refugio1 (ficha editorial) + refugio2 (comportamiento) |
| 4 | `/solicitud-adopcion` | Formulario público independiente de solicitud de adopción (US 4.1) | **MVP** | **refugio2** (formularios) |
| 5 | `/login` | Acceso al panel privado (3 roles) | Soporte | **refugio2** |
| 6 | `/admin/mascotas` | Listado de fichas de animales (US 1.2 · ESC-1.2.1) | **MVP** | **refugio2** (tabla) |
| 7 | `/admin/mascotas/nueva` | Registro de ficha de animal (US 1.1) | **MVP** | **refugio2** (formularios) |
| 8 | `/admin/mascotas/[id]` | Ficha detallada del animal (staff, solo lectura) | Soporte (US 1.2) | **integración** refugio1 + refugio2 |
| 9 | `/admin/adoptantes` | Listado + búsqueda por cédula (US 2.2) y situación de adopción (US 2.4) | **MVP** + Sprint 2 | **refugio2** |
| 10 | `/admin/adoptantes/nuevo` | Registro de adoptante (US 2.1) con mascota opcional (US 2.4) | **MVP** + Sprint 2 | **refugio2** (formularios) |
| 11 | `/admin/donaciones` | Registro y consulta de donaciones (US 3.3) | **MVP** | **refugio2** (tabla + formulario) |
| 12 | *(transversal)* | `Toast`, `Spinner`, `EmptyState`, `ErrorBanner` | Soporte | **refugio2** |
| 13 | *(modal opcional)* | `AdoptionModal` — acceso rápido al mismo formulario desde la ficha | **MVP** | **refugio2** |
| 14 | `/donar` | Un adoptante registrado declara un aporte para coordinar su entrega | **Sprint 2 implementado** | **refugio2** |
| 15 | `/admin/solicitudes`, `/admin/solicitudes/[id]` | Bandeja, revisión y decisión sobre solicitudes (US 4.3) | **Sprint 2 implementado** | **refugio2** |
| 16 | `/admin/mascotas/[id]/editar` | Actualización de ficha de animal (US 1.3) | **Sprint 2 implementado** | **refugio2** |
| 17 | `/admin/adoptantes/[id]/editar` | Actualización de información de adoptante (US 2.3) | **Sprint 2 implementado** | **refugio2** |
| 18 | `/admin/donaciones/informe` | Informe en PDF de donaciones filtrable por tipo y período (US 3.1) | **Sprint 2 implementado** | **refugio2** |

**Sprint 2 pendiente:** `/admin/dashboard`,
borrado de fichas, `DonationModal`, `ConfirmDangerModal`, `AdoptanteDetailModal`, filtros
avanzados, correos.

---

## Especificación por ruta

### 1. `/` — Landing pública

- **Propósito:** Puerta de entrada del refugio: presentar la marca, mostrar mascotas en adopción,
  explicar el proceso, invitar a ayudar, contar quiénes somos y dar la ubicación. Enlaza al catálogo
  y al login. El formulario público de adopción vive en `/solicitud-adopcion`, no en esta landing.
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
     (donar, hogar temporal, difusión) en tarjetas informativas. El botón "Quiero donar" enlaza a `/donar`;
     no hay pasarela de pago.
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
  4. CTA "Llenar solicitud de adopción" → `/solicitud-adopcion`.
  5. **Grid de `PetCard`**: variante **A** en desktop (4 columnas, `gap: 24px`) y variante **B** en
     tablet/móvil (1 columna).
  6. Estados: `Spinner` ("Cargando…"), `EmptyState` (`SearchX` + "No encontramos mascotas con ese filtro"),
     `ErrorBanner` (`CircleAlert` + "Reintentar").
  7. `Pagination` (páginas circulares) cuando hay más de 12 resultados.
  8. `Footer`.
- **`PetCard` variante A** (fichas de 302px): imagen 260px + `PetStatusBadge` "Disponible" flotante;
  cuerpo con nombre (Fraunces 30px) + icono de especie (`dog`/`cat`), meta (raza · edad · sexo),
  tamaño, personalidad, línea de salud, separador y CTA de texto "Conocer a {nombre}" + `arrow-up-right`.
- **Componentes e Interacciones:** `Chip` filtran por `especie` y actualizan la query URL;
  CTA de solicitud → `/solicitud-adopcion`;
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
     badge de estado (`en_adopcion` → "Disponible"), personalidad.
  5. **Bloque "Salud"**: resumen (`salud_resumen`: vacunas/desparasitación) — sin historial clínico.
  6. **Cita/descripción corta** + bloque de disponibilidad.
  7. CTA principal: `PrimaryButton` "Quiero conocer a {nombre}" → abre `AdoptionModal`;
     enlace secundario a `/solicitud-adopcion?mascota={id}` abre el formulario independiente con la mascota preseleccionada.
  8. Mini-recordatorio del **proceso de adopción** (pasos 1–4) + `Footer`.
- **Componentes e Interacciones:** `PrimaryButton` → `AdoptionModal` solo si `estado = en_adopcion`;
  enlace secundario → formulario independiente solo si la mascota está en adopción;
  si `estado = adoptado`, `SecondaryButton` deshabilitado con "Esta mascota ya fue adoptada ❤️".
  `GhostButton` → `/mascotas`.
- **Datos y Backend:** `GET /api/mascotas/:id` (ficha completa, sin historial clínico). Mascota
  inexistente → `ErrorBanner` + link al catálogo.

### 4. `/solicitud-adopcion` — Solicitud pública de adopción

- **Propósito:** Recibir la solicitud en línea de un adoptante **sin login**, con sus datos de contacto
- **Origen de Diseño:** formularios en 2 columnas de **refugio2**, dentro de `DashPanel`, coherentes con
  `STYLEGUIDE.md`.
- **Secciones y Bloques:**
  1. Encabezado independiente y `DashPanel` con selector de mascota disponible; al venir desde una
     ficha, la mascota queda preseleccionada. El formulario puede completarse sin abrir un modal.
  2. El acceso rápido opcional `AdoptionModal` conserva su panel modal 650px, radius 26px y header:
     icono 54px (`heart-handshake`, fondo `#fce7f3`) +
     kicker `POSTULAR A ADOPCIÓN` + H2 Fraunces 29px ("Solicitud para adoptar a {mascota}").
  3. En el modal: botón de cierre circular 38px (`aria-label="Cerrar"`), cierre con `Escape` y click
     en backdrop, foco atrapado.
  4. Form en **2 columnas** (1 en móvil), compartido por la página independiente y el modal:
     - `mascota_id*` (selector de animales que siguen en adopción; se preselecciona desde la ficha).
     - `documento*` — **cédula** (texto, solo números; hint "cédula del adoptante").
     - `nombre_completo*`, `correo*`, `telefono*`, `direccion*`.
     - `tipo_vivienda*` (Select: apartamento/casa/finca), `animales_en_hogar` (checkbox),
       `descripcion_vivienda*` (textarea: condiciones de vivienda), `personas_en_hogar` (opcional).
     - Aceptación de términos*.
  5. Pie: `PrimaryButton` "Enviar solicitud" + `OutlineButton` "Cancelar".
- **Interacciones:** al enviar → validación Zod **en cliente y en servidor** con errores por campo
  (borde `#b94f35` + anillo `#f2e1d5` + mensaje bajo el campo; foco al primer inválido = ESC-4.1.1).
  Éxito → registro
  y `Toast` "¡Solicitud enviada! Te contactaremos pronto." (`CircleCheck`) en la página de origen
  (ESC-4.1.2). Mascota ya no disponible → alerta para seleccionar otra.
- **Datos y Backend:** Server Action `crearSolicitudAdopcion` con
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
- **Interacciones:** validación Zod en cliente y servidor con mensajes bajo cada campo (correo inválido
  → "Escribe un correo válido como nombre@dominio.com"; contraseña vacía → "La contraseña es
  obligatoria"); credenciales inválidas → `ErrorBanner` "Correo o contraseña incorrectos"; éxito →
  redirige a **`/admin/mascotas`** (el dashboard es Sprint 2).
- **Datos y Backend:** Server Action `iniciarSesion` → verifica credenciales (usuarios de seed), devuelve
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
  datos generales (raza, edad, especie, sexo, tamaño, estado), bloque **"Adoptado por"** cuando la
  mascota está adoptada (nombre, cédula y enlace al perfil del adoptante; aviso si no hay vínculo),
  bloque personalidad, bloque salud resumen, metadatos (id, fecha de registro, `foto_url`);
  `GhostButton` "← Volver al listado".
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
  4. **Chips de situación (US 2.4):** "Todos", "Adoptantes", "Postulados" y "Donantes", con contador
     y filtro por `?vista=adoptantes|postulados|donantes`; la búsqueda por cédula se conserva al
     cambiar de chip.
  5. **`DataTable`**: Nombre · Documento (cédula) · Situación (`StatusBadge`: Adoptante / Postulado /
     Donante / Sin actividad; badge secundario "Donante" si la persona aportó y además adoptó o
     postuló) · Mascota(s) (enlace a la ficha + badge Adoptado/En revisión) · Teléfono · Dirección ·
     Acciones.
  6. Estados: `Spinner`, `EmptyState` con orientación distinta por pestaña, `ErrorBanner`; contador.
- **Componentes e Interacciones:** búsqueda por cédula (Enter o botón) → filtra en vivo. Sin modal de
  detalle (Sprint 2); la información completa se ve en la fila/tabla. La situación principal es
  **excluyente** y sigue la prioridad: "Adoptante" (≥1 solicitud aprobada) → "Postulado" (≥1 en
  revisión y ninguna aprobada) → "Donante" (≥1 donación vinculada y ninguna adopción/postulación
  activa) → "Sin actividad". "Donantes" se filtra aparte por tener donaciones y **puede solaparse**
  con "Adoptantes"/"Postulados": donar es independiente de adoptar. La fila muestra todas sus
  mascotas aunque pertenezca a otra pestaña.
- **Datos y Backend:** Prisma directo, `adoptante` con `include: solicitudes → mascota` y
  `donaciones`; coincidencia por `documento` para la búsqueda. La situación **se deriva** de
  `solicitud_adopcion.estado` y de la existencia de donaciones vinculadas: no se guarda un campo
  nuevo. Solo se etiqueta como donante al aporte con `adoptante_id`; los aportes de staff con nombre
  libre siguen únicamente en `/admin/donaciones`. `adoptante.estado` sigue siendo `activo` (alta
  inicial) / `inactivo` y ya no se muestra como si fuera estado de adopción.

### 10. `/admin/adoptantes/nuevo` — Registro de adoptante (US 2.1)

- **Propósito:** Registrar a un adoptante (presencial o telefónico) en la base de datos y,
  opcionalmente, seleccionar una mascota disponible para iniciar su solicitud de adopción.
  Cumple **US 2.1** (ESC-2.1.1 alta exitosa; ESC-2.1.2 control de duplicados por cédula) y apoya
  **US 2.4** al permitir vincular la mascota desde el alta.
- **Origen de Diseño:** **refugio2** (formularios 2 columnas).
- **Secciones y Bloques:** `Sidebar` + header ("Nuevo adoptante" + `GhostButton` "← Volver");
  `DashPanel` con form en 2 columnas:
  - `documento*` (**cédula**, texto con hint "solo números"), `nombre_completo*`, `telefono*`,
    `direccion*`, `correo` (opcional).
  - `mascota_id` (opcional): selector de mascotas **en adopción** ("Ninguna — solo registrar los
    datos"), con helper que explica que se creará una solicitud en revisión.
  - `PrimaryButton` "Registrar Adoptante" + `OutlineButton` "Cancelar" → `/admin/adoptantes`.
- **Interacciones:** validación de obligatorios y del select (estilo rojo + foco); **ESC-2.1.2**: si
  la cédula ya existe, la acción muestra bajo `documento` el texto exacto *"El número de documento ya
  se encuentra registrado"*; ESC-2.1.1 → `Toast` "Adoptante registrado" (o "Adoptante registrado con
  una solicitud en revisión" si se eligió mascota) y redirect a `/admin/adoptantes`, mostrando el
  perfil creado con ID única y estado "Activo". El botón se deshabilita y muestra "Registrando…"
  mientras la petición está en curso.
- **Datos y Backend:** Server Action `crearAdoptante` con
  `{ documento, nombre_completo, telefono, direccion, correo, mascota_id }` → en una transacción crea
  el adoptante con `estado = "activo"` y, si hay mascota elegida, crea una
  `solicitud_adopcion` con **`estado = "en_revision"`** (sin tocar el estado de la mascota ni
  rechazar otras solicitudes). La aprobación posterior se hace desde `/admin/solicitudes/[id]`, que
  sí sincroniza la mascota y cierra las pendientes. El backend valida **unicidad de `documento`**
  (índice único en Prisma) y que la mascota siga disponible.

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
  `QuickAmounts` precarga el monto; validación Zod en cliente y servidor; **ESC-3.3.1** → si faltan campos se muestra el mensaje de alerta
  con **los campos faltantes** (rojo + foco al primero); **ESC-3.3.2** → `Toast` "Aporte registrado"
  + refresh de la tabla.
- **Datos y Backend:** `GET /api/donaciones?tipo=&pagina=` y `POST /api/donaciones` con
  `{ tipo_aporte, monto?, descripcion_insumo?, cantidad?, nombre_donante, correo? }`.
  Campos: `tipo_aporte` (`monetaria` | `especie`), `monto`, `descripcion_insumo`, `cantidad`,
  `nombre_donante`, `correo`, `fecha_donacion`, `estado` (`recibida` | `por_coordinar`),
  `usuario_id` (quien registró) y `adoptante_id` (opcional). Los aportes enviados desde `/donar`
  se asocian al adoptante y quedan `por_coordinar`; el total monetario cuenta solo los recibidos.

### 12. `/donar` — Aporte de adoptante registrado (Sprint 2)

- **Propósito:** Permitir que un adoptante existente deje constancia de un aporte monetario o en especie
  para coordinar su entrega. No hay pasarela ni cobros en línea.
- **Entrada:** botón "Quiero donar" en la sección "Cómo ayudar" de la landing.
- **Formulario:** cédula (debe existir en `adoptante`), tipo de aporte y detalle según sea dinero o insumo.
- **Backend:** la Server Action comprueba la cédula, toma nombre y correo del registro existente y crea
  `donacion` vinculada con `adoptante_id` en estado `por_coordinar`; el equipo puede marcarla recibida
  desde el panel. Las donaciones registradas por staff siguen vinculadas a `usuario_id` y cuentan como recibidas.
  "Marcar recibido" abre `ConfirmModal` (consecuencia explicada, botón deshabilitado con "Confirmando…"
  mientras se guarda) y muestra el toast "Aporte marcado como recibido"; si ya estaba recibido, el error
  se explica bajo el botón.

### 13. `/admin/solicitudes` — Revisión de solicitudes (Sprint 2)

- **Bandeja:** por defecto muestra **solo las solicitudes `en_revision`** (pendientes), más recientes
  primero, con adoptante, cédula, mascota, fecha y estado. Cada fila enlaza al detalle. Al aprobar o
  rechazar, la solicitud sale de esta vista. El chip **"Resueltas"** (`?vista=resueltas`) muestra el
  historial de aprobadas/rechazadas para poder consultar o revertir una decisión; ambas vistas tienen
  contador y `EmptyState` propio.
- **Detalle:** presenta la información de contacto del adoptante, la ficha de la mascota y las
  condiciones del hogar indicadas en la solicitud.
- **Decisión:** personal autenticado puede cambiar el estado a `en_revision`, `aprobada` o `rechazada`.
  La decisión se guarda en `solicitud_adopcion.estado`. Al **aprobar**, en la misma transacción la
  mascota pasa a `adoptado` (y desaparece del catálogo público) y se rechazan automáticamente las
  demás solicitudes `en_revision` de esa mascota; el toast lo comunica. Si la mascota ya tiene otra
  solicitud aprobada, la aprobación se bloquea con un error accionable. Aprobar, rechazar **y volver
   a en revisión** pasan por el mismo `ConfirmModal` accesible (trampa de foco) con la consecuencia
   explicada. Al revertir una aprobación,
  la mascota vuelve a `en_adopcion` si no queda otra solicitud aprobada. US 2.5 añade el mensaje
  opcional al adoptante (correo simulado por `console.log`).

### 14. Transversales — `Toast` y estados

- **`Toast`:** único patrón de éxito/error global (inferior centrado, `#374151`, icono `CircleCheck`
  mint, 3500ms). Textos en español: "Ficha guardada con éxito", "Ficha actualizada con éxito", "Adoptante registrado", "Adoptante registrado con una solicitud en revisión", "Adoptante actualizado con éxito",
  "Aporte registrado", "Aporte marcado como recibido", "¡Gracias por tu aporte! El refugio coordinará contigo la entrega.",
  "¡Solicitud enviada! Te contactaremos pronto.", "Se rechazaron automáticamente las solicitudes
  pendientes de esta mascota.".
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
| `/admin/solicitudes`, `/admin/solicitudes/[id]` | ❌ | ✅ | ✅ | ✅ |

> Los tres roles acceden al panel en el MVP; no hay permisos diferenciados porque ninguna historia
> Must los exige. La diferenciación fina (borrar fichas, verificar aportes) es Sprint 2.

---

## Fuera del alcance del Sprint 1 (Sprint 2)

| Ruta / pieza | Por qué no va en Sprint 1 |
|---|---|
| `/donar` (formulario público de donación) | Implementado: disponible para adoptantes registrados; no procesa pagos en línea. |
| `/admin/dashboard` | Pantalla de apoyo sin historia Must; tras el login se va a `/admin/mascotas`. |
| `/admin/solicitudes` (bandeja y cambio de estado) | Implementado: revisión del detalle y cambio de estado (US 4.3, Sprint 2). |
| Edición y borrado de fichas (`ConfirmDangerModal`) | US 1.3 (Should) y permisos finos. |
| `AdoptanteDetailModal` | US 2.4 (Could) resuelta sin modal: columna de mascotas y chips de situación en `/admin/adoptantes`, más el bloque "Adoptado por" en la ficha de la mascota. |
| `DonationModal` | Con el formulario en panel de `/admin/donaciones` la US 3.3 ya se cumple. |
| Filtros avanzados, historial de donaciones, PDF, comprobantes | US 1.4, 3.1, 3.4, 3.5 (Could/Should). |
| Correos o mensajes al adoptante | US 2.5 (Should, **implementado** en Sprint 2: confirmación de decisión + mensaje con simulación de correo) y US 4.2 (Would). |
| Historial clínico, informes de gasto, veterinarias socias, reportes, encuestas | US 1.5, 3.2, 4.2, 4.4, 4.5 (Would). |
| Módulo de salud veterinaria y gestión de voluntariado | **No existen en Confluence**: no forman parte del proyecto. "Voluntariado" solo aparece como texto informativo en la landing. |

---

## Relación con el modelo de datos (Prisma/PostgreSQL local)

| Tabla (snake_case) | Rutas que la usan | Campos clave derivados de las HU |
|---|---|---|
| `mascota` | `/`, `/mascotas*`, `/admin/mascotas*` | `nombre`, `raza`, `edad_estimada`, `especie`, `sexo`, `tamano`, `estado` (`en_adopcion`/`adoptado`), `personalidad`, `salud_resumen`, `foto_url`, `fecha_registro` |
| `adoptante` | `AdoptionModal`, `/admin/adoptantes*`, `/donar` | `documento` (único, cédula), `nombre_completo`, `telefono`, `direccion`, `correo`, `estado` (`activo`), `fecha_registro` |
| `solicitud_adopcion` | `AdoptionModal`, `/admin/solicitudes*` | `mascota_id`, `adoptante_id`, `tipo_vivienda`, `animales_en_hogar`, `descripcion_vivienda`, `personas_en_hogar`, `acepta_terminos`, `estado` (`en_revision`/`aprobada`/`rechazada`), `fecha_solicitud` |
| `donacion` | `/admin/donaciones`, `/donar` | `tipo_aporte`, `estado` (`recibida`/`por_coordinar`), `monto` (entero, pesos), `descripcion_insumo`, `cantidad`, `nombre_donante`, `correo`, `fecha_donacion`, `usuario_id` (opcional), `adoptante_id` (opcional) |
| `usuario` | `/login`, todo `/admin/*` | `nombre`, `correo`, `hash_contrasena`, `rol` (`administrador`/`veterinario`/`voluntario`) |

El diagrama E-R de referencia está en `Diagrama - Sprint 1 (MVP).png` (es el modelo completo del
proyecto, no sólo el Sprint 1); ante discrepancias, manda Confluence.
