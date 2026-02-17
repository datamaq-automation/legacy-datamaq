# DV-06 - Optimizacion UI/UX secuencial por breakpoints (mobile-first)

## Objetivo
Conservar detalle tecnico e historial de la tarea P0 de optimizacion UI/UX por breakpoints, dejando `docs/todo.md` con informacion minima operativa.

## Resumen ejecutivo
- La estrategia activa es flujo bloqueante por viewport: `XS -> SM -> MD -> LG`.
- `XS`, `SM` y `MD` se completaron con validaciones en verde.
- Queda pendiente el lote `LG` para jerarquia visual desktop y ajustes de conversion.

## Decisiones tecnicas clave
- `B-Testing`: se elige flujo bloqueante por viewport sobre lotes mixtos para reducir regresiones cruzadas.
- `B-Vue` (XS): bajar prominencia de CTA secundaria en hero para priorizar accion principal above-the-fold.
- `B-Vue` (SM): compactar cards/form manteniendo semantica y contraste para reducir friccion tactil.
- `B-Vue` (MD): ajuste incremental con control de budget CSS en lugar de paquete amplio de reglas nuevas.

## Evidencia interna relevante
- Pipeline y runners:
  - `package.json`
  - `scripts/run-responsive-stages.mjs`
  - `scripts/run-mobile-first-checks.mjs`
  - `scripts/run-quality-merge.mjs`
- Cambios UI destacados:
  - `src/styles/scss/sections/_hero.scss`
  - `src/styles/scss/sections/_navbar.scss`
  - `src/styles/scss/sections/_services.scss`
  - `src/styles/scss/sections/_contact.scss`
  - `src/ui/sections/ServiceCard.vue`
  - `src/ui/features/contact/ContactFormSection.vue`
- Validaciones historicas:
  - `npm run test:e2e:smoke:xs` (2026-02-17 00:22 -03:00)
  - `npm run test:e2e:smoke:sm` (2026-02-17 00:32 -03:00)
  - `npm run test:e2e:smoke:md` (2026-02-17 00:35 -03:00)
  - `npm run test:e2e:smoke:lg` (2026-02-17 00:35 -03:00)
  - `npm run quality:mobile` (2026-02-17 00:43 -03:00)
  - `npm run quality:merge` (2026-02-17 00:45 -03:00)
  - `npm run lint:todo-sync:merge-ready` (2026-02-17 00:45 -03:00)

## Incidente y mitigacion
- Incidente: `check:css` fallo puntual por budget (`211549 > 211000`) durante iteracion `MD`.
- Mitigacion: recorte de reglas `MD` no esenciales hasta recuperar margen (`210996 <= 211000`).
- Evidencia: `npm run check:css` fallo controlado (2026-02-17 00:37 -03:00) y revalidacion en verde (2026-02-17 00:40 -03:00).

## Proximo paso operativo
- Ejecutar lote `LG` en `>=992px` sobre hero/services/navbar.
- Revalidar en orden: `quality:responsive` (secuencial) -> `quality:mobile` -> `quality:merge`.
