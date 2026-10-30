# STYLEGUIDE.md

## Propósito
**Fuente única de las indicaciones de diseño de la aplicación web** "Huellitas de Esperanza".
Todo lo relacionado con diseño visual y UX (colores, tipografía, componentes, layout, iconografía,
estados y accesibilidad) se define aquí y se basa en los mockups de Figma. Si algo de diseño no está
en este archivo, se propone primero y se registra acá antes de implementarlo.

Referencia: ver `AGENTS.md` (sección "Diseño de la aplicación web").

**Mockups de origen** (solo **refugio1** se inspeccionó con el MCP de Figma; de **refugio2** se tomó
su estructura ya documentada en este archivo):

| Mockup | URL | Aporte al styleguide |
|---|---|---|
| **refugio1** (Figma Design) | `figma.com/design/xlmdcDvIV8shrJUJ3rtK9D/refugio1` | Anatomía píldora de los botones, grilla de 1440/80px, tipografía de títulos, secciones editoriales, iconos Lucide, espaciado y ritmo vertical. **Inspeccionado con MCP de Figma** (frame "Patio de Huellas"). |
| **refugio2** (Figma Make) | `figma.com/make/yWDLYERWySBWO8KuPJ8VsT/refugio2` | **Paleta de colores completa**, panel privado (sidebar/stats/tablas), modales, toasts, formularios, estados semánticos, foco, sombras y responsive. Referencia estructural: sus valores están volcados en este documento. |

Síntesis acordada: **paleta de refugio2** + **anatomía píldora y grilla de refugio1** + **tipografía Fraunces (títulos) y Nunito (UI/cuerpo)** + **sombras suaves de refugio2**.

---

## Identidad y tono

- **Nombre visual:** Huellitas de Esperanza (refugio de adopciones; "Huellitas" en rosa, "de Esperanza" en el segundo peso de la marca).
- **Descriptor:** `REFUGIO · MEDELLÍN` (mayúsculas, 10px, tracking amplio) bajo el logotipo.
- **Personalidad:** cálido, cercano, juguetón sin ser infantil; cuidado y responsable cuando habla de adopción, salud y donaciones.
- **Tono de los textos de la UI:**
  - Tuteo y frases cortas: "Postular a adopción", "Registrar aporte", "Quiero conocer a Bruno".
  - Antetítulos (eyebrow) en MAYÚSCULAS con tracking: `AMOR QUE DEJA HUELLA`, `CONOCE A TU NUEVO MEJOR AMIGO`, `TU AYUDA CAMBIA VIDAS`.
  - Nunca prometer adopciones ni cobros reales: toda cifra, foto y contacto es de muestra → nota aclaratoria en secciones sensibles (donación, ubicación).
- **Nomenclatura de secciones (navbar público):** **Inicio · Cómo ayudar · Nosotros · Ubicación · Iniciar sesión**.
  El catálogo (`/mascotas`) se alcanza desde los CTA del hero y de la sección de adopción, no desde el
  navbar. Panel privado: `Sidebar` propio con **Mascotas · Adoptantes · Donaciones**.
- **Idioma:** todo el contenido de la app en español; columnas de tablas y campos en `snake_case` español.

---

## Paleta de colores

Sistema base: **refugio2**. Los verdes/terracota de refugio1 se conservan sólo como *acentos heredados* (ver tabla final).

### Primarios y acentos

| Rol | HEX | Variable CSS | Clase Tailwind | Uso |
|---|---|---|---|---|
| Primary (marca) | `#f472b6` | `--color-primary` | `bg-primary` / `text-primary` | Logotipo, iconos, acentos grandes, fondos de tinte, focus ring |
| Primary texto/botón | `#be4e89` | `--color-primary-600` | `bg-primary-600` `text-primary-600` | **Fondo de botones con texto blanco** y enlaces sobre fondo claro (AA 4.53:1) |
| Primary hover | `#ad3f79` | `--color-primary-700` | `bg-primary-700` | Hover/active del botón primario |
| Primary tinte | `#fce7f3` | `--color-primary-50` | `bg-primary-50` | Fondo de badges, filtros activos, sidebar activo, anillo de foco secundario |
| Primary borde | `#f9a8d4` | `--color-primary-200` | `border-primary-200` | Bordes de tinte, líneas decorativas |
| Secondary (azul) | `#93c5fd` | `--color-secondary` | `bg-secondary` | Botón "staff/login", avatar de perfil, acento info |
| Secondary texto | `#264661` | `--color-secondary-ink` | `text-secondary-ink` | Texto sobre azul (5.46:1) |
| Accent peach | `#fdba74` | `--color-accent` | `bg-accent` | Badges de estado, botones de acción cálidos |
| Accent peach texto | `#74471d` | `--color-accent-ink` | `text-accent-ink` | Texto sobre peach (4.68:1) |
| Mint (éxito claro) | `#a7f3d0` | `--color-mint` | `bg-mint` | Botón secundario "Donar/Registrar", indicadores positivos |
| Mint texto | `#276650` | `--color-mint-ink` | `text-mint-ink` | Texto sobre mint (5.28:1) |

### Fondos

| Rol | HEX | Variable CSS | Clase Tailwind | Uso |
|---|---|---|---|---|
| Fondo app | `#fffafa` | `--color-bg` | `bg-bg` | Fondo global `<body>`, modales |
| Fondo crema | `#fdfbf7` | `--color-cream` | `bg-cream` | Hero, superficies cálidas |
| Fondo panel privado | `#f8f7f4` | `--color-surface-alt` | `bg-surface-alt` | Fondo del panel privado |
| Superficie tarjeta | `#ffffff` | `--color-surface` | `bg-surface` | Tarjetas, paneles, inputs |
| Tinte rosa fuerte | `#fff0f7` | `--color-tint` | `bg-tint` | Bandas/banners destacados |
| Tinte azul | `#eff6ff` | `--color-blue-50` | `bg-blue-50` | Bloques de icono, estados info |

### Neutros y texto

| Rol | HEX | Variable CSS | Clase Tailwind | Uso |
|---|---|---|---|---|
| Texto principal (ink) | `#374151` | `--color-ink` | `text-gray-800` | Títulos, texto de cuerpo importante |
| Texto secundario | `#4b5563` | `--color-ink-700` | `text-gray-700` | Enlaces de nav, labels, cuerpo hero |
| Texto terciario | `#6b7280` | `--color-ink-500` | `text-gray-500` | Descripciones, subtítulos (4.67:1 sobre `#fffafa`) |
| Texto apagado | `#858d99` | `--color-ink-400` | `text-gray-400` | Metadatos, placeholders (**sólo ≥16px bold o texto no esencial**) |
| Texto deshabilitado | `#9ca3af` | `--color-ink-300` | `text-gray-300` | Botones/inputs disabled (contraste no aplicable) |
| Borde suave | `#eadde4` | `--color-border` | `border-border` | Inputs, select, modal |
| Borde tarjeta | `#f1e6e6` | `--color-border-soft` | `border-border-soft` | Tarjetas de mascota, filas de tabla |
| Borde rosa | `#fce7f3` | `--color-border-pink` | `border-primary-50` | Navbar sticky, menú móvil |
| Texto sobre oscuro | `#e5e7eb` | `--color-on-dark` | `text-on-dark` | Footer `#454c58` |

### Semánticos (éxito, error, advertencia, info)

| Estado | Fondo | Texto | Icono | Contraste | Clases Tailwind |
|---|---|---|---|---|---|
| Éxito / aprobado | `#d9f8e9` | `#2f6d55` | `#347c60` | 5.39:1 | `bg-success-50 text-success-700` |
| Advertencia / pendiente | `#fff2dc` | `#8a5a22` | `#a26d2f` | 5.32:1 | `bg-warning-50 text-warning-700` |
| Información | `#eff6ff` | `#416589` | `#4d769f` | 5.60:1 | `bg-info-50 text-info-700` |
| Error / danger | `#f2e1d5` | `#a8452e` | `#b94f35` | 4.64:1 | `bg-danger-50 text-danger-700` |
| Neutro / borrador | `#f3f4f6` | `#4b5563` | `#6b7280` | 7.31:1 | `bg-neutral-50 text-neutral-700` |

> `#b94f35` (terracota) es el único color heredado de refugio1 usado en el sistema: como **color de error/Danger** y como acento puntual.

### Acentos heredados de refugio1 (uso puntual)

| HEX | Uso permitido |
|---|---|
| `#283e35` | Títulos editoriales sobre fondos claros cuando se requiera un verde tinta (11.09:1 sobre `#fffafa`); frases de marca. |
| `#b94f35` | Estados *Danger*, CTA de énfasis en secciones editoriales, numeración de pasos. |
| `#243d33` | Bandas oscuras de contenido (disponible para secciones editoriales de Sprint 2), texto blanco/`#f0f2e8` encima (11.73:1 / 10.37:1). |
| `#eacb78` | Enlaces y microtexto sobre bandas oscuras (7.44:1). |
| `#e6ebdf` / `#faf7f0` / `#dcddd2` | Paneles salvia, fondo crema y separadores de la landing editorial. |
| `#cfe0c4` | **Salvia oscura** (`--color-sage-600`): fondo de la banda **"Cómo ayudar"** de la landing. Un paso más oscura que `#e6ebdf` para separar la banda del `bg-cream` vecino sin volver al verde tinta. |

### Pares de contraste verificados (WCAG 2.1)

| Par | Ratio | Cumple |
|---|---|---|
| `#374151` sobre `#fffafa` | 9.97:1 | AAA |
| `#4b5563` sobre `#fffafa` | 7.31:1 | AAA |
| `#6b7280` sobre `#fffafa` | 4.67:1 | AA |
| Blanco sobre `#be4e89` (botón primario) | 4.53:1 | AA |
| Blanco sobre `#ad3f79` (hover) | 5.58:1 | AA |
| `#b74581` sobre `#fffafa` (enlaces) | 4.86:1 | AA |
| `#374151` sobre `#fce7f3` (badge activo) | 8.77:1 | AAA |
| Blanco sobre `#374151` (toast) | 10.31:1 | AAA |
| `#264661` sobre `#93c5fd` (botón staff) | 5.46:1 | AA |
| Blanco sobre `#b94f35` (danger sólido) | 4.96:1 | AA |
| `#f472b6` sobre blanco | 2.65:1 | ✗ — **sólo ≥24px bold o decorativo** |
| `#283e35` sobre `#cfe0c4` (título de la banda salvia) | 8.26:1 | AAA |
| `#374151` sobre `#cfe0c4` | 7.42:1 | AAA |
| `#4b5563` sobre `#cfe0c4` (cuerpo en la banda salvia) | 5.44:1 | AA |
| `#276650` sobre `#cfe0c4` (iconos mint de la banda salvia) | 4.87:1 | AA |
| `#6b7280` sobre `#cfe0c4` | 3.48:1 | ✗ — no usar texto terciario sobre salvia (usar `#4b5563`) |

---

## Tipografía

### Familias

| Rol | Familia | Pesos usados | Notas |
|---|---|---|---|
| Display / títulos | **Fraunces** (Google Fonts) | 400 (Regular), 600 (SemiBold), 400 *Italic* | Serif variable. Usar `font-variation-settings: "SOFT" 0, "WONK" 1;` como en el mockup. Sólo H1–H4, nombres de mascota, cifras destacadas y lemas. |
| UI / cuerpo | **Nunito** (Google Fonts) | 400, 600, 700, 800 | Sans redondeada. Todo lo demás: párrafos, botones, labels, tablas, formularios. |

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Nunito:wght@400;600;700;800&display=swap');
```

> Familias de mockups: refugio1 = Fraunces + Inter; refugio2 = Baloo 2 + Nunito.
> Síntesis aprobada: **Fraunces + Nunito** (títulos de refugio1, cuerpo de refugio2).

### Escala tipográfica

| Rol | Familia | Desktop | Mobile (≤800px) | Weight | Line-height | Tailwind |
|---|---|---|---|---|---|---|
| Display H1 (hero) | Fraunces | 76px (4.75rem) | 46px (2.875rem) | 400 | 1.06 | `text-7xl/8xl` |
| H1 panel privado | Nunito | 34px (2.125rem) | 28px | 800 | 1.2 | `text-4xl font-extrabold` |
| H2 sección | Fraunces | 48px (3rem) | 34px (2.125rem) | 400 | 1.12 | `text-5xl` |
| H3 tarjeta / cita | Fraunces | 30px (1.875rem) | 25px (1.5625rem) | 400 | 1.15 | `text-3xl` |
| H4 panel / monto | Fraunces | 27px (1.6875rem) | 23px | 400 | 1.2 | `text-2xl` |
| Título de banda | Fraunces | 36px (2.25rem) | 27px | 400 | 1.2 | `text-4xl` |
| Cifra (stat) | Fraunces | 30–54px | 30px | 600 | 1 | `text-3xl/6xl font-semibold` |
| Body large (intro) | Nunito | 18px (1.125rem) | 17px | 400 | 1.65 | `text-lg leading-relaxed` |
| Body | Nunito | 15–16px | 15px | 400 | 1.7 | `text-base` |
| Body small | Nunito | 13px (0.8125rem) | 13px | 400/600 | 1.5 | `text-sm` |
| Caption / meta | Nunito | 12px (0.75rem) | 12px | 400 | 1.5 | `text-xs` |
| Micro / legal | Nunito | 11px (0.6875rem) | 11px | 400 | 1.4 | `text-[11px]` |
| Eyebrow (antetítulo) | Nunito | 12px | 12px | 800, `letter-spacing: 1.7px`, uppercase | 1.3 | `text-xs font-extrabold tracking-[1.7px] uppercase` |
| Badge / chip | Nunito | 11–13px | 11–13px | 600–800 | 1.3 | `text-[11px] font-bold` |
| Botón | Nunito | 15px | 15px | 800 | 1.2 | `text-[15px] font-extrabold` |
| Label de formulario | Nunito | 13px | 13px | 800 | 1.4 | `text-sm font-extrabold` |

**Reglas**
- Fraunces **nunca** en botones, labels, tablas ni párrafos largos.
- Nunito **nunca** en H1/H2 de marketing (usa Fraunces).
- Peso 800 = acciones y labels; 700 = navegación y énfasis; 400 = cuerpo.
- Texto centrado sólo en hero, bandas y estados vacíos.

---

## Layout y espaciado

### Retícula / contenedor

| Contexto | Regla | Origen |
|---|---|---|
| Desktop ancho (≥1280px) | Contenedor `1280px` centrado, márgenes laterales `80px` (frame de 1440px) | refugio1 |
| Desktop general | `width: min(1180px, calc(100% - 48px)); margin: auto` | refugio2 |
| Móvil (≤800px) | `width: min(100% - 30px, 600px)` | refugio2 |
| Columnas de tarjetas | Landing: 4 columnas (`gap: 24px`) · Grid refugio2: `repeat(3, 1fr)` en desktop, 1 columna en móvil | ambos |
| Formularios | 2 columnas (`grid-template-columns: 1fr 1fr; gap: 0 15px`) → 1 columna en móvil | refugio2 |
| Panel privado | `grid-template-columns: 245px 1fr` → 1 columna en móvil | refugio2 |
| Stats | `repeat(3, 1fr)` → 1 columna en móvil | refugio2 |

### Breakpoints

| Token | Valor | Comportamiento |
|---|---|---|
| Móvil | ≤ 640px | 1 columna, tipografía mobile, menú hamburguesa |
| Tablet | 641–800px | Grid intermedio, filtros con scroll horizontal |
| Desktop | ≥ 801px | Nav horizontal, grids de 3–4 columnas |
| Ancho | ≥ 1280px | Contenedor 1280px con gutters de 80px |

### Escala de espaciado

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 36 · 40 · 48 · 56 · 64 · 72 · 80 · 90 · 100` px
(gaps frecuentes: 8 chips · 10 icono-texto · 12 tarjeta interna · 16–20 bloques · 24 tarjetas · 32–40 secciones internas · 72–90 padding de sección).

### Radios de borde

| Token | Valor | Uso |
|---|---|---|
| `--radius-pill` | `100px` / `9999px` | Botones, chips/filtros, badges, emblema del logo |
| `--radius-card` | `20px` (refugio1) / `25px` (refugio2) → **oficial `20px`** | Tarjetas de mascota, paneles |
| `--radius-panel` | `21px` | Panel del panel privado / stats |
| `--radius-modal` | `26px` | Modal, `.about` bandas (`28px`) |
| `--radius-input` | `12px` | Inputs, select, avisos, filas |
| `--radius-badge` | `10–14px` | Badges de fila, botones pequeños |
| `--radius-img` | `14–19px` | Imagen interior de tarjeta |
| `--radius-hero-arch` | `180px 180px 24px 24px` | Retrato hero (refugio1) |
| `--radius-feature` | `140px 20px 20px 20px` | Imagen destacada de sección (refugio1) |

### Sombras

| Token | Valor | Uso |
|---|---|---|
| `--shadow-card` | `0 10px 35px rgba(81, 55, 55, .06)` | Tarjetas en reposo |
| `--shadow-card-hover` | `0 18px 40px rgba(81, 55, 55, .11)` | Tarjeta en hover (+ `translateY(-6px)`) |
| `--shadow-soft` | `0 7px 25px rgba(73, 53, 60, .05)` | Stats y paneles del panel privado |
| `--shadow-menu` | `0 18px 45px rgba(87, 57, 71, .15)` | Menú móvil desplegado |
| `--shadow-modal` | `0 30px 80px rgba(60, 48, 56, .55)` | Modal + `backdrop-filter: blur(8px)` y fondo `rgba(50,41,47,.55)` |
| `--shadow-toast` | `0 10px 25px rgba(0, 0, 0, .2)` | Toast inferior |
| `--shadow-donation` | `0 18px 50px rgba(51, 103, 82, .1)` | Tarjeta de formulario destacada |

> Las tarjetas de refugio1 son **planas con borde**; la síntesis usa **borde + sombra suave** (sombra de refugio2). No usar las sombras duras `0 6px 0` de refugio2 (se descartan junto con los botones chunky).

### Z-index

`nav sticky: 40` · `dropdown/menú: 50` · `modal: 80` · `toast: 100`.

---

## Componentes base

### Botones

**Anatomía (píldora plana, síntesis de ambos mockups):**
`height: 52px` · `padding: 0 24px` · `border-radius: 100px` · `font: 800 15px/1.2 Nunito` · `gap: 16px` entre label e icono (icono Lucide 20px) · `display: inline-flex; align-items: center; justify-content: center` · `transition: .2s ease`.

| Variante | Fondo | Texto/icono | Borde | Estado hover |
|---|---|---|---|---|
| **Primary** | `#be4e89` | `#ffffff` | — | `#ad3f79` + `translateY(2px)` |
| **Secondary (azul/staff)** | `#93c5fd` | `#264661` | — | `#7fb0ea` + `translateY(2px)` |
| **Mint (donar/registrar)** | `#a7f3d0` | `#276650` | — | `#8be6c0` + `translateY(2px)` |
| **Outline (secundario)** | transparente | `#374151` | `1px solid #eadde4` | fondo `#fce7f3` |
| **Ghost / Link** | transparente | `#b74581` | — | subrayado + fondo `#fce7f3` |
| **Danger** | `#b94f35` | `#ffffff` | — | `#a8452e` + `translateY(2px)` |
| **Disabled (todas)** | `#f3f4f6` | `#9ca3af` | — | sin transición, `cursor: not-allowed` |

**Estados (aplican a todas las variantes):**

| Estado | Tratamiento |
|---|---|
| Default | valores de la tabla |
| Hover | fondo al tono hover + `transform: translateY(2px)` (la "sombra dura" de refugio2 se sustituye por el `--shadow-soft` reducido) |
| Active | `transform: translateY(3px)` + `filter: brightness(.95)` |
| Focus-visible | `outline: 2px solid #be4e89; outline-offset: 2px; box-shadow: 0 0 0 3px #fce7f3` |
| Disabled | fila "Disabled"; sin hover, `opacity: .7` |
| Loading (opcional) | label se sustituye por `Loader2` girando 360° en 600ms, ancho del botón fijo |

**Tamaños:** `sm` h40 / px18 / 13px · `md` h52 / px24 / 15px (default) · `full` `width: 100%`.

### Chips / filtros (píldora)

- Reposo: `background: #ffffff; border: 1px solid #f1e6e6; padding: 11px 20px; border-radius: 100px; font: 700 13px Nunito; color: #6b7280`.
- Activo: `background: #fce7f3; border-color: #f9a8d4; color: #b74581; box-shadow: 0 3px 0 #f9a8d4` (variante oscura de refugio1: `background: #283e35; color: #faf7f0` para "Todos").
- Focus: mismo anillo `0 0 0 3px #fce7f3`.
- Móvil: `overflow-x:auto; white-space:nowrap` (scroll horizontal).

### Insignias / badges

| Tipo | Fondo | Texto | Radio | Padding | Tamaño |
|---|---|---|---|---|---|
| Disponibilidad ("Busco hogar" = `en_adopcion`) | `#fce7f3` | `#b74581` | 100px | 7px 12px | 11px/700 |
| Estado de fila (pendiente) | `#fff2dc` | `#8a5a22` | 10px | 6px 10px | 11px/700 |
| Estado aprobado | `#d9f8e9` | `#2f6d55` | 10px | 6px 10px | 11px/700 |
| Neutro / borrador | `#f3f4f6` | `#4b5563` | 10px | 6px 10px | 11px/700 |
| Info | `#eff6ff` | `#416589` | 10px | 6px 10px | 11px/700 |
| Etiqueta sobre foto (`pet-status`) | `#fdba74` | `#74471d` | 12px | 6px 11px | 11px/800 |

> **Vocabulario de estados:** el badge **"Busco hogar"** corresponde al estado `en_adopcion` del modelo.
> Los únicos estados del Sprint 1 son **`en_adopcion`** y **`adoptado`**: no se usan "disponible" ni
> "reservado".

### Tarjeta de mascota (público)

**Variante A — Ficha editorial (refugio1), para el catálogo 4-col:**

- Contenedor: `background: #fff; border: 1px solid #dcddd2; border-radius: 20px; overflow: hidden`.
- Imagen: altura `260px`, `object-fit: cover`.
- Badge de disponibilidad flotante: `top: 16px; left: 16px`, fondo `#fce7f3`, píldora.
- Botón corazón flotante (opcional): `34px`, circular, `#fff`, icono `#f472b6`.
- Cuerpo: `padding: 22px; gap: 12px` → nombre (Fraunces 30px) + icono de especie (22px) a la derecha; meta `13px #6b7280`; tamaño `12px`; personalidad `13px/700 #374151`; salud `11px #6b7280`; separador `1px #dcddd2`; CTA de texto `13px/800 #b74581` + `arrow-up-right` 17px, alineado a la derecha.
- Hover: `transform: translateY(-6px); box-shadow: var(--shadow-card-hover)`; el CTA subraya.

**Variante B — Grid compacta (refugio2), para tablet/móvil:**

- Contenedor `background: #fff; border: 1px solid #f1e6e6; padding: 12px; border-radius: 20px; box-shadow: var(--shadow-card)`.
- Imagen `240px` con `border-radius: 14px`; badge `pet-status` abajo-izquierda; corazón arriba-derecha (`34px`).
- Info: `padding: 14px 7px 12px` → nombre Fraunces 25px, meta 13px, badge de género circular `30px` fondo `#eff6ff` texto `#5c92c9`.
- Acción full-width: píldora `background: #fce7f3; color: #b74581; padding: 12px; border-radius: 15px; font-weight: 800` → hover `background: #f472b6; color: #fff` (sólo si el texto resulta ≥16px bold; si no, usar `#be4e89`).

**Variante C — Fila de tabla (panel privado, Sprint 2):** `grid-template-columns: 50px 1fr 150px 35px; gap: 12px; padding: 12px 0; border-top: 1px solid #f1edef`; miniatura `46px` `border-radius: 14px`; badge de estado a la derecha; botón `•••` transparente.

### Tarjeta de estadística (KPI)

`background: #fff; padding: 22px; border-radius: 20px; box-shadow: var(--shadow-soft); display: grid; grid-template-columns: auto 1fr; gap: 15px`.
Ícono: `46px`, `border-radius: 15px`, fondo `#fce7f3`, glifo 21px. Valor: Fraunces 30px/700. Label: 13px `#6b7280`. Variación: 11px `#347c60` (positivo) o `#a26d2f` (negativo).

### Campos de formulario

| Pieza | Especificación |
|---|---|
| Label | `display: block; font: 800 13px Nunito; color: #374151; margin: 14px 0 7px` |
| Input / Select | `width: 100%; border: 1px solid #eadde4; background: #fff; border-radius: 12px; padding: 12px; font: 400 15px Nunito; color: #374151; outline: 0` (altura ≈44–46px) |
| Placeholder | `#9ca3af` (sólo guía, no sustituye al label) |
| Focus | `border-color: #f472b6; box-shadow: 0 0 0 3px #fce7f3` |
| Error | `border-color: #b94f35; box-shadow: 0 0 0 3px #f2e1d5` + mensaje `11–12px #a8452e` bajo el campo |
| Disabled | `background: #f3f4f6; color: #9ca3af` |
| Radio/Checkbox | `accent-color: #f472b6`; en grupo usar tarjeta-label con `:has(input:checked)` → `background: #d9f8e9; color: #347c60` |
| Segmented (tipo de aporte) | `display: grid; grid-template-columns: 1fr 1fr; background: #f7f7f5; padding: 5px; border-radius: 14px`; opción activa `background: #d9f8e9; color: #347c60; border-radius: 10px` |
| Monto con prefijo | `.money-input: flex; border: 1px solid #eadde4; border-radius: 13px` — `$` en `#347c60` bold con `padding: 0 14px` |
| Montos rápidos | `grid repeat(4,1fr); gap: 8px` — botones `border: 1px solid #dce8e1; border-radius: 10px; padding: 8px; font-weight: 700; color: #5f6f68` |
| Checkbox de consentimiento | fila con `gap: 9px`, texto 13px/600, `margin: 18px 0` |

### Tablas (panel privado)

- Contenedor: `.dash-panel` → `background: #fff; border-radius: 21px; padding: 25px; box-shadow: var(--shadow-soft)`.
- Encabezado: `.panel-heading` → título (Fraunces/Nunito 700) + subtítulo 13px `#6b7280` + acción (píldora rosa a la derecha).
- Filas: separador `1px #f1edef`, sin bordes verticales; columnas alineadas a izquierda; badge de estado centrado.
- Responsive: ocultar columna de badge en móvil (`display:none`) y pasar a `45px 1fr 35px`.

### Navbar (público)

- Altura `100px` (desktop) / `70px` (móvil), `padding: 0 80px`, `display: flex; justify-content: space-between`.
- Fondo `rgba(255,250,250,.94)` + `backdrop-filter: blur(12px)` + `border-bottom: 1px solid #fce7f3`, `position: sticky; top: 0; z-index: 40`.
- Marca: emblema circular `44px` fondo `#fce7f3` con `paw-print` 26px `#f472b6` + nombre (Fraunces SemiBold 23px `#374151`) y descriptor (10px `#6b7280`).
- Enlaces: `14px/700 #4b5563` → hover `#f472b6`; `gap: 34px`.
- Acción: `SecondaryButton` (píldora `#93c5fd` con `#264661`) **"Iniciar sesión"** → `/login`.
- Enlaces del navbar: **Inicio · Cómo ayudar · Nosotros · Ubicación** (anclas de la landing); el catálogo
  se alcanza por los CTA, no por el navbar.
- Móvil: botón hamburguesa `40px` fondo `#fce7f3` icono `#be4e89`; menú desplegado `position: absolute` con `border-radius: 20px` y `--shadow-menu`.

### Sidebar del panel privado

- `width: 245px; background: #fff; padding: 30px 20px; border-right: 1px solid #eee5e8`.
- Items: `display: flex; gap: 12px; padding: 12px 14px; border-radius: 13px; font: 700 14px Nunito; color: #4b5563; text-align: left` → hover `background: #f9f9f9` → activo `background: #fce7f3; color: #b74581`.
- Botón "Volver al sitio": `margin-top: auto; background: #eff6ff; color: #416589; border-radius: 12px; padding: 11px`.
- Header del área principal: `padding: 35px 4vw`; perfil con avatar `42px` `border-radius: 14px` fondo `#93c5fd` texto `#264661`.

### Modal

- Backdrop: `position: fixed; inset: 0; background: rgba(50,41,47,.55); backdrop-filter: blur(8px); z-index: 80`.
- Panel: `width: min(650px, 100%); max-height: 92vh; overflow: auto; background: #fffafa; border-radius: 26px; padding: 33px` (`27px 21px` en móvil); `box-shadow: var(--shadow-modal)`.
- Encabezado: ícono `54px` `border-radius: 18px` fondo `#fce7f3` + kicker `12px/800 uppercase #be4e89` + H2 Fraunces 29px.
- Cierre: botón circular `38px`, fondo `#fce7f3`, icono `#be4e89`, `top: 20px; right: 20px`, `aria-label="Cerrar"`.
- Cierre también con `Escape` y click en el backdrop; foco atrapado dentro del modal.

### Toast

- `position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); background: #374151; color: #fff; padding: 13px 20px; border-radius: 14px; font: 700 14px Nunito; box-shadow: var(--shadow-toast); z-index: 100`.
- Duración `3500ms`, animación de entrada `translateY(8px) + fade 200ms`.

### Paginación

- Páginas circulares `36px`, `border-radius: 100px`, `13px/700 #4b5563`; activa `background: #fce7f3; color: #b74581`; hover `background: #f9f9f9`; deshabilitada `#9ca3af`.

---

## Iconografía

- **Librería oficial: [Lucide](https://lucide.dev)** — detectada en refugio1 (`paw-print`, `arrow-up-right`, `heart-handshake`, `heart`, `sparkles`, `dog`, `cat`, `circle-check`, `package-open`, `hand-heart`, `house`, `map-pin`, `navigation`) y coincidente con el SVG inline de refugio2 (mismo trazo `24×24`, `stroke-width: 2`).
- Instalación: `lucide-react` (ya previsto por el stack Next.js + JavaScript).
- **Tamaños:** 17px (icono en CTA de tarjeta) · 20px (default, dentro de botones y junto a texto) · 22px (especie en tarjeta) · 24px (pilares/features) · 26–27px (emblema y features grandes).
- **Estilo:** `stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; color: currentColor; fill: none`. Nunca rellenarlos.
- **Reglas:** iconos decorativos → `aria-hidden="true"`; iconos como único contenido de un botón → `aria-label` obligatorio. Los **emoji no son iconos funcionales**: sólo decorativos dentro de texto (🐾 ♥ en badges ilustrativos), nunca para acciones, estados ni navegación.

---

## Estados y mensajes

| Estado | Visual |
|---|---|
| **Cargando** | Spinner Lucide `Loader2` girando 600ms lineal + texto "Cargando…" 13px `#6b7280`; en botones reemplaza el label manteniendo el ancho. |
| **Vacío (sin resultados)** | Contenedor centrado: icono `SearchX`/`PawPrint` 40px `#f9a8d4`, título Fraunces 24px, texto 14px `#6b7280`, acción píldora secundaria. |
| **Error de carga / servidor** | Bloque `background: #f2e1d5; color: #a8452e; border-radius: 12px; padding: 16px` con icono `CircleAlert` y botón "Reintentar". |
| **Éxito (formulario)** | Toast `#374151` con icono `CircleCheck` en `#a7f3d0`, texto en español: "¡Solicitud enviada!", auto-cierre 3.5s. |
| **Error de validación** | Borde `#b94f35` + anillo `#f2e1d5` + mensaje `12px #a8452e` bajo el campo + icono `CircleAlert`; el foco pasa al primer campo inválido. |
| **Advertencia / pendiente** | Badge `#fff2dc`/`#8a5a22` + icono `TriangleAlert` 14px. |
| **Info** | Bloque `#eff6ff`/`#416589` con `Info` 18px (ej.: "Este concepto no recibe dinero ni tiene pasarela de pago"). |
| **Offline / modo demo** | Banda `background: #fff0f7; color: #374151; font-size: 13px` con nota de concepto. |

---

## Accesibilidad

- **Contraste mínimo:** 4.5:1 para texto normal, 3:1 para texto ≥24px bold e indicadores gráficos. Todos los pares del sistema están verificados en la sección *Paleta de colores*; el rosa puro `#f472b6` está restringido a texto grande/decoración → para botones usar `#be4e89`.
- **Foco visible (`focus-visible`):**
  ```css
  :focus-visible {
    outline: 2px solid #be4e89;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px #fce7f3;
  }
  ```
  Nunca usar `outline: none` sin reemplazo. En fondos oscuros (`#243d33`, `#374151`) usar `outline-color: #f9a8d4`.
- **Targets:** mínimo `44×44px` para cualquier control interactivo (botones 52px; chips de 38px → ampliar el área táctil a 44px en móvil con padding).
- **Imágenes de mascotas:** siempre `alt` descriptivo ("Bruno, perro en adopción"); imágenes decorativas → `alt=""`.
- **Teclado:** navegación completa por Tab/Shift+Tab; `Escape` cierra modal y menú móvil; el modal atrapa el foco y lo devuelve al disparador al cerrar; los filtros son `<button>` con `aria-pressed`.
- **Semántica:** un solo `<h1>` por página; landmarks `<header> <nav> <main> <footer>`; formularios con `<label for>`; grupo de filtros con `role="group" aria-label="Filtrar mascotas"`.
- **Movimiento:** respetar `@media (prefers-reduced-motion: reduce)` → desactivar `float`, `translateY` de hover y transiciones (mantener sólo cambios de color ≤100ms).
- **Zoom/reflow:** contenido usable al 200% de zoom sin scroll horizontal (breakpoints de la sección *Responsive*).

---

## Tokens de diseño

Bloque listo para `app/globals.css` con Tailwind v4 (`@theme`) o CSS plano:

```css
:root {
  /* Primarios (refugio2) */
  --color-primary: #f472b6;
  --color-primary-600: #be4e89;
  --color-primary-700: #ad3f79;
  --color-primary-50: #fce7f3;
  --color-primary-200: #f9a8d4;
  --color-secondary: #93c5fd;
  --color-secondary-ink: #264661;
  --color-accent: #fdba74;
  --color-accent-ink: #74471d;
  --color-mint: #a7f3d0;
  --color-mint-ink: #276650;

  /* Fondos y superficies */
  --color-bg: #fffafa;
  --color-cream: #fdfbf7;
  --color-surface: #ffffff;
  --color-surface-alt: #f8f7f4;
  --color-tint: #fff0f7;

  /* Texto y bordes */
  --color-ink: #374151;
  --color-ink-700: #4b5563;
  --color-ink-500: #6b7280;
  --color-ink-400: #858d99;
  --color-ink-300: #9ca3af;
  --color-border: #eadde4;
  --color-border-soft: #f1e6e6;
  --color-border-pink: #fce7f3;

  /* Semánticos */
  --color-success-50: #d9f8e9;  --color-success-700: #2f6d55;
  --color-warning-50: #fff2dc;  --color-warning-700: #8a5a22;
  --color-info-50: #eff6ff;     --color-info-700: #416589;
  --color-danger-50: #f2e1d5;   --color-danger-700: #a8452e;   --color-danger: #b94f35;

  /* Acentos heredados (refugio1) */
  --color-forest: #283e35;
  --color-terracota: #b94f35;
  --color-forest-deep: #243d33;
  --color-gold: #eacb78;
  --color-sage: #e6ebdf;
  --color-sage-600: #cfe0c4;
  --color-cream-r1: #faf7f0;
  --color-line-r1: #dcddd2;

  /* Radios */
  --radius-pill: 100px;
  --radius-card: 20px;
  --radius-panel: 21px;
  --radius-modal: 26px;
  --radius-input: 12px;

  /* Sombras */
  --shadow-card: 0 10px 35px rgba(81, 55, 55, .06);
  --shadow-card-hover: 0 18px 40px rgba(81, 55, 55, .11);
  --shadow-soft: 0 7px 25px rgba(73, 53, 60, .05);
  --shadow-menu: 0 18px 45px rgba(87, 57, 71, .15);
  --shadow-modal: 0 30px 80px rgba(60, 48, 56, .55);
  --shadow-toast: 0 10px 25px rgba(0, 0, 0, .2);

  /* Tipografía */
  --font-display: "Fraunces", Georgia, serif;
  --font-sans: "Nunito", system-ui, sans-serif;

  /* Focus */
  --focus-ring: 0 0 0 3px #fce7f3;
  --focus-outline: 2px solid #be4e89;
}

@theme inline {
  --color-primary: var(--color-primary);
  --color-primary-600: var(--color-primary-600);
  --color-primary-700: var(--color-primary-700);
  --color-primary-50: var(--color-primary-50);
  --color-secondary: var(--color-secondary);
  --color-accent: var(--color-accent);
  --color-mint: var(--color-mint);
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-ink: var(--color-ink);
  --color-border: var(--color-border);
  --color-success-50: var(--color-success-50);
  --color-success-700: var(--color-success-700);
  --color-warning-50: var(--color-warning-50);
  --color-warning-700: var(--color-warning-700);
  --color-info-50: var(--color-info-50);
  --color-info-700: var(--color-info-700);
  --color-danger-50: var(--color-danger-50);
  --color-danger-700: var(--color-danger-700);
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --radius-card: var(--radius-card);
  --shadow-card: var(--shadow-card);
}
```

> Con Tailwind v4 **no hay archivo de configuración**: este bloque va en `app/globals.css` (tras
> `@import "tailwindcss";`) y el único archivo extra es `postcss.config.mjs`.

---

## Responsive

| Componente | Desktop (>800px) | Móvil (≤800px) |
|---|---|---|
| Contenedor | `min(1180px, 100% - 48px)` / 1280px con gutter 80px | `min(100% - 30px, 600px)` |
| Navbar | 100px, links horizontales | 70px, hamburguesa + panel absoluto `border-radius: 20px` |
| Hero | `min-height: 620px`, H1 67–76px, grid 3 columnas | `min-height: 710px`, H1 46px, botones apilados `flex-direction: column` |
| Grid de mascotas | 4 columnas (ficha editorial) o `repeat(3,1fr)` | 1 columna, tarjeta `max-width: 430px` centrada |
| Filtros | fila con `gap: 10px` | `overflow-x: auto` con scroll horizontal |
| Sección ayuda | `grid-template-columns: 1fr 480px; gap: 100px` | 1 columna, `gap: 40px` |
| Formularios | 2 columnas | 1 columna (`form-grid: 1fr`) |
| Modal | 650px centrado, padding 33px | `100%`, padding `27px 21px`, H2 23px |
| Panel privado | `245px 1fr` | 1 columna, nav horizontal con scroll, stats 1 columna |
| Tabla/filas | 4 columnas | 3 columnas (se oculta badge) |
| Footer | fila `space-between` | columna centrada, `gap: 20px` |

---

## Movimiento y transiciones

| Elemento | Transición | Detalle |
|---|---|---|
| Global | `transition: .2s ease` en `button` y `a` | color, fondo, transform |
| Tarjeta de mascota | `.25s ease` | `translateY(-6px)` + `--shadow-card-hover` |
| Botones | `.2s ease` | `translateY(2px)` al hover, `3px` al active |
| Filtros | `.2s ease` | cambio de fondo/borde |
| Modal | `200ms` fade + `translateY(10px)` | backdrop `blur(8px)` |
| Toast | `200ms` fade + `translateY(8px)` | cierre a los 3500ms |
| Decorativo (hero) | `float 3.5s ease-in-out infinite` | sólo ilustración/imagen, `prefers-reduced-motion` la desactiva |

---

## Decisiones de fusión (refugio1 ↔ refugio2)

| Dimensión | Fuente elegida | Razón |
|---|---|---|
| Paleta de colores | **refugio2** | Decisión del equipo: rosa/peach/blue/mint como sistema; terracota `#b94f35` se conserva sólo como Danger y verde `#283e35` como acento editorial. |
| Tipografía | **Híbrido: Fraunces (refugio1) + Nunito (refugio2)** | Títulos con carácter editorial y cuerpo redondeado y legible en formularios/tablas. |
| Botones | **Píldora plana de refugio1** (h52, radius 100px) | Mejor legibilidad y coherencia con chips/badges; se descarta la sombra dura chunky de refugio2. |
| Tarjetas | **Radio 20px + sombra suave de refugio2** | Sombra difusa y hover lift dan profundidad sin bordes duros. |
| Layout | **Grilla 1440/80px de refugio1** + contenedor `min(1180px, 100%-48px)` de refugio2 | Ritmo editorial en desktop, comportamiento responsive práctico en el resto. |
| Landing pública | **Estructura de refugio1** (hero, catálogo, proceso, donaciones, ubicación, footer) | Mockup más completo y pulido para marca. |
| Panel privado | **100% refugio2** (sidebar, stats, tablas, formularios, búsqueda por cédula) | refugio1 no tiene panel; refugio2 cubre las historias de usuario internas. |
| Modales, toasts, foco, semánticos | **refugio2** | Ya resuelve estados con contraste AA verificado. |
| Iconos | **Lucide** (refugio1) | Set estándar del ecosistema React; refugio2 usa SVG inline compatible. |
| Responsive | **Breakpoint 800px de refugio2** | Único mockup con estrategia móvil definida. |
