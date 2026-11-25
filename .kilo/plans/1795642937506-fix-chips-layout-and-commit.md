# Plan: Fix chips layout in catalog + commit changes

## Objetivo
1. Hacer commit de los cambios actuales con mensaje específico
2. Rediseñar los chips/filtros del catálogo para que queden en horizontal (side-by-side) y no oculten las mascotas
3. Investigar y arreglar el error que aparece al salir de cualquier página

## Cambios a commitear (git status actual)
- `AGENTS.md` - modificado
- `PAGES.md` - modificado
- `app/(public)/donar/page.jsx` - modificado
- `app/(public)/mascotas/page.jsx` - modificado
- `criterios_sprint1.pdf` - eliminado
- `sprint2US.md` - nuevo (untracked)

## Tarea 1: Commit con mensaje específico
**Mensaje**: `feat: actualiza documentacion y elimina pdf criterios sprint1`

## Tarea 2: Rediseño chips catálogo (/mascotas)
**Problema actual**: Los filtros (Especie, Tamaño, Sexo) se renderizan verticalmente, cada uno con su label y fila de chips. Ocupan mucho espacio vertical y empujan las tarjetas de mascotas fuera de viewport.

**Solución**: Disponer los 3 grupos de filtros en una sola fila horizontal (flex wrap), con sus labels integrados o encima pero compactos. En móvil mantener scroll horizontal.

**Archivo**: `app/(public)/mascotas/page.jsx` (líneas 82-120)

**Referencia STYLEGUIDE.md**: Sección "Chips / filtros (píldora)" - móvil: `overflow-x:auto; white-space:nowrap`

## Tarea 3: Error al navegar/salir de páginas
**Posibles causas** (revisar componentes con useEffect):
- `Navbar.jsx` - useEffect para tecla Escape (línea 18-27)
- `Sidebar.jsx` - sin useEffect aparente
- `AdoptionModal.jsx` - useEffect para Escape + focus trap (líneas 13-30, 38-56)
- `Toast.jsx` - useEffect para auto-close (líneas 9-12)
- `MascotaForm.jsx` - useEffect para focus en error (líneas 18-22)
- `SolicitudAdopcionForm.jsx` - useEffect para focus en error (líneas 35-39)
- `DonacionForm.jsx` - useEffect para focus en error (líneas 48-52)

**Verificar**:
1. Cleanup correcto de event listeners en todos los useEffect
2. No hay setState en componentes desmontados
3. No hay hydration mismatches (renderizado servidor vs cliente)

## Validación
- `npm run build` pasa sin errores
- `npm run dev` - navegar entre páginas sin errores en consola
- Catálogo muestra filtros horizontales + mascotas visibles sin scroll excesivo