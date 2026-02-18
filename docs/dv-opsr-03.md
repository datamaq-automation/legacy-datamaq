# Registro de cambios - 2026-02-17

## Simplificado mensaje WhatsApp CTA (17:10-17:45)
- Cambio: Reemplazadas constantes complejas (`WHATSAPP_BASE`, `WHATSAPP_TRIAGE`, `WHATSAPP_INSTALL_MESSAGE`, `WHATSAPP_DIAG_MESSAGE`, `WHATSAPP_URG_MESSAGE`) por mensaje unico simplificado.
- Referencias: hero primaryCta, servicios-instalacion, servicios-diagnostico, servicios-urgencias.
- Evidencia: OK `npm run build` (CSS 221.64 KB <= 225 KB), OK `npm run test:e2e:smoke:sm` (2/2 PASSED), OK `npm run lint:security` (OK), OK `npm run lint:test-coverage` (lines 81.33%, statements 80.59%).

## CTAs WhatsApp en nueva pestaña (17:45)
- Cambio: removido `@click.prevent` de links WhatsApp (mantenidos `target="_blank"` y `rel="noopener noreferrer"`).
- Rationale: permitir apertura en nueva pestaña; el listener de analytics se mantiene.
- Archivos: ServiceCard.vue (linea 41), HeroSection.vue (linea 30).
- Evidencia: OK `npm run build` (CSS 221.64 KB), OK `npm run test:e2e:smoke:sm` (2/2 PASSED), OK `npm run lint:security` (OK), OK `npm run lint:test-coverage` (lines 81.33%, statements 80.59%), OK `npm run quality:merge` (CSS budget OK, a11y OK, all checks passed).

## Redireccion simultanea en CTAs WhatsApp (18:00)
- Root cause: `target="_blank"` sin `.prevent` causaba redireccion en ambas pestanas.
- Cambio: handlers `handleWhatsAppClick()` usan `window.open()` con `.prevent` para emitir tracking y abrir nueva pestana sin redirigir la actual.
- Archivos: ServiceCard.vue (funcion en linea 70-73), HeroSection.vue (funcion en linea 96-99).
- Evidencia: OK `npm run build` (CSS 221.64 KB), OK `npm run test:e2e:smoke:sm` (2/2 PASSED), OK `npm run lint:security` (OK), OK `npm run lint:test-coverage` (lines 81.18%, statements 80.45%), OK `npm run quality:merge` (all checks passed).

## Doble apertura por emit() en handlers (18:30)
- Root cause: `emit('contact')` disparaba `openWhatsApp()` con fallback a `window.location.href`.
- Cambios: remover `emit()` de handlers, cambiar `<a>` a `<button>`, actualizar test `heroSection` (getByRole('link') -> getByRole('button')).
- Archivos: ServiceCard.vue (linea 36, funcion linea 68-70), HeroSection.vue (linea 26, funcion linea 97-99), heroSection.test.ts (linea 50).
- Evidencia: OK `npm run build` (CSS 221.64 KB), OK `npm run test:e2e:smoke:sm` (2/2 PASSED), OK `npm run lint:test-coverage` (lines 81.25%, statements 80.52%), OK `npm run quality:merge` (all checks passed).

## Usuario reporta: "sigue sin funcionar" (20:15)
- Problema: click en "Pedi coordinacion" / "Cotizar por WhatsApp" abre nueva pestana OK + redirige pagina actual FAIL.
- Decision tomada (C): cambiar enfoque a auditoria arquitectonica metodologica (FASE 1-4).
- Tipo C: C1.
- FASE 1 completada (20:45): creado `docs/01-archivos-involucrados.md` con mapeo de archivos, flujo del bug, certezas, dudas y proximos pasos.
- Evidencia: OK `docs/01-archivos-involucrados.md` creado (9 secciones, 293 lineas).

## Auditoria de codigo fuente y cache (21:00)
- Decision tomada (B): grep global para descartar listeners/interceptores antes de FASE 2.
- Comandos (PowerShell):
  1. `grep -r "addEventListener.*click" src/` -> 0 matches.
  2. `grep -r "window\.location" src/` -> 16 matches, unico setter en contactController.ts.
  3. `grep -r "window\.open" src/` -> 3 matches.
  4. `grep -r "openWhatsApp" src/` -> 11 matches.
- Archivos auditados: main.ts, router/routes.ts, infrastructure/analytics/index.ts, ui/pages/HomePage.ts, ui/sections/ServiceCard.vue, ui/sections/HeroSection.vue, vite.config.js.
- Conclusion: codigo correcto; hipotesis de cache del browser.
- Evidencia: OK `docs/01-archivos-involucrados.md` actualizado con "CONCLUSION CRITICA" + checklist browser-side (21:05).

## Usuario confirma: no era cache (21:20)
- Decision tomada (C): proceder a FASE 2 (auditoria SOLID).
- Tipo C: C1.
- FASE 2 completada (21:45): creado `docs/02-auditoria-arquitectura-solid.md` con 9 violaciones SOLID, 6 entradas a `openWhatsApp()` y root cause en fallback `window.location.href`.
- Evidencia: OK `docs/02-auditoria-arquitectura-solid.md` creado (~600 lineas).

## Quick fix validado (21:50-22:05)
- Cambios implementados:
  1. Eliminado fallback redirect de `openWhatsApp()` en `src/ui/controllers/contactController.ts`.
  2. Refactorizado WhatsAppFab a `window.open()` directo en `src/ui/features/contact/WhatsAppFab.vue`.
  3. Actualizado test en `tests/unit/ui/whatsappFab.test.ts`.
- Validacion: OK `npm run typecheck`, OK `npm run test`, OK `npm run build`, OK `npm run test:e2e:smoke:sm`, OK `npm run lint:test-coverage`, OK `npm run lint:todo-sync`, OK `npm run lint:todo-sync:merge-ready`.
- Resultado: usuario confirma solucion en `npm run dev`.
- Root cause final: fallback `window.location.href` disparado desde Navbar/Footer/WhatsAppFab.
- Solucion: eliminar fallback + WhatsAppFab consistente con `window.open()`.

## Modulo "Tecnico a cargo" (20:20)
- Avance: componente reusable con avatar, CTA WhatsApp y acento naranja.
- Archivos creados: `src/components/TecnicoACargo.vue`.
- Archivos modificados: `src/ui/pages/HomePage.vue`, `src/ui/features/contact/ContactFormSection.vue`.
- Layout: tarjeta con borde naranja, avatar circular, responsive (col-lg-6 col-md-8).
- Avatar: `src/assets/tecnico-a-cargo.webp`.
- Texto: "Tecnico a cargo" + "Agustin Bustos".
- Boton: "Coordinar por WhatsApp" usando `getWhatsAppHref()` centralizado; tracking `tecnico-a-cargo`.
- Accesibilidad: alt descriptivo, heading h2, foco visible en boton.
- Evidencia: OK `npm run test:a11y`, OK `npm run check:css`, OK `npm run quality:merge`, OK `npm run lint:todo-sync:merge-ready`.
- Avances adicionales: tipo TS para assets WebP, tests unitarios de contacto con mock de `getHeroContent()`, test unitario `tecnicoACargo`.
- Siguiente paso: optimizar imagen a 200x200 si se confirma (actual: WebP 1024x1024).
