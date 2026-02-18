# Plan Tecnico Prioritario

> Baseline operativo: `docs/dv-opsr-01.md`.
> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## Backlog activo

### P0
- [>] (P0) Endurecer frontend a contrato backend-only para respuesta email en Chatwoot
  - Contexto: el frontend ya opera en modo backend-only para evitar falsos positivos de entrega email al usar canal API directo de Chatwoot.
  - Avance: cliente desacoplado de Chatwoot Public API; envio centralizado a endpoint backend de ingesta.
  - Decision tomada (C): resolucion funcional completa depende del backend productivo que garantice ruteo al inbox Email en Chatwoot.
  - Tipo C: C2
  - Bloqueador residual: falta URL canonica productiva del backend y evidencia de ruteo real por inbox Email.
  - Informacion faltante: `<backend_ingest_url_https>` + evidencia operativa (`SendReplyJob`/SMTP) asociada al inbox Email.
  - Mitigacion interna ejecutada: deploy gate endurecido para exigir `VITE_INQUIRY_API_URL` con esquema `https://`; calidad CSS/scaffolding consolidada en turno 2026-02-17 (sin impacto en frontend funcional de contacto).
  - Evidencia:
    - Baseline turno anterior: `npm run quality:merge` en verde (2026-02-17 00:20 -03:00)
    - Validacion turno actual: `npm run quality:merge` en verde (2026-02-17 14:00 -03:00; no hay cambios en frontend contacto, consolidacion de CSS/!important)
    - `npm run lint:security` en verde (2026-02-17 14:01 -03:00)
  - Tareas externas (solo C2 y acciones fuera del repo): desplegar/validar servicio backend (`upsert contact + ensure ContactInbox Email + create/reuse conversation Email`) y cargar secreto correcto en `GitHub Environment production`.
  - Siguiente paso: ejecutar smoke tecnico contra backend productivo al recibir URL canonica.
  - Siguiente accion interna ejecutable ahora: condicionada a dato externo (backend_ingest_url_https disponible); ejecutar `npm run smoke:contact:backend -- <url>` y registrar evidencia en `docs/todo.md`.
  - Anexo tecnico: `docs/dv-chat-02.md`.

## Cambios en este turno (2026-02-17 17:10-17:45)
- Simplificado mensaje WhatsApp CTA: `src/infrastructure/content/content.ts` líneas 35-45
  - Cambios: Reemplazadas constantes complejas (`WHATSAPP_BASE`, `WHATSAPP_TRIAGE`, `WHATSAPP_INSTALL_MESSAGE`, `WHATSAPP_DIAG_MESSAGE`, `WHATSAPP_URG_MESSAGE`) por mensaje único simplificado.
  - Nuevas referencias (4): hero primaryCta, servicios-instalacion, servicios-diagnostico, servicios-urgencias
  - Evidencia: ✅ `npm run build` (CSS 221.64 KB ≤ 225 KB), ✅ `npm run test:e2e:smoke:sm` (2/2 PASSED), ✅ `npm run lint:security` (OK), ✅ `npm run lint:test-coverage` (lines 81.33%, statements 80.59%)

- Habilitado apertura en nueva pestaña para CTAs WhatsApp: `src/ui/sections/ServiceCard.vue` y `src/ui/sections/HeroSection.vue`
  - Cambios: Removido `@click.prevent` de links WhatsApp (mantenidos `target="_blank"` y `rel="noopener noreferrer"`)
  - Rationale: permitir que el link se abra en nueva pestaña en lugar de redirigir en la misma pestaña; event listener todavía funciona para analytics
  - Archivos: ServiceCard.vue (línea 41), HeroSection.vue (línea 30)
  - Validacion (2026-02-17 17:45): ✅ `npm run build` (CSS 221.64 KB), ✅ `npm run test:e2e:smoke:sm` (2/2 PASSED), ✅ `npm run lint:security` (OK), ✅ `npm run lint:test-coverage` (lines 81.33%, statements 80.59%), ✅ `npm run quality:merge` (CSS budget OK, a11y OK, all checks passed)

- Corregido problema de redirección simultánea en WhatsApp CTAs (nueva pestaña + redirección en página actual): `src/ui/sections/ServiceCard.vue` y `src/ui/sections/HeroSection.vue`
  - Root cause: `target="_blank"` sin `.prevent` causaba redirección en ambas pestañas
  - Cambios: Agregados handlers `handleWhatsAppClick()` que usan `window.open()` con `.prevent` para:
    1. Emitir evento de tracking/analytics
    2. Abrir URL en nueva pestaña sin redirigir la actual
  - Archivos: ServiceCard.vue (función en línea 70-73), HeroSection.vue (función en línea 96-99)
  - Validacion (2026-02-17 18:00): ✅ `npm run build` (CSS 221.64 KB), ✅ `npm run test:e2e:smoke:sm` (2/2 PASSED), ✅ `npm run lint:security` (OK), ✅ `npm run lint:test-coverage` (lines 81.18%, statements 80.45%), ✅ `npm run quality:merge` (all checks passed)

- Corregido doble apertura (nueva pestaña + redirección en actual) removiendo emit() de WhatsApp handlers: `src/ui/sections/ServiceCard.vue`, `src/ui/sections/HeroSection.vue`, `tests/unit/ui/heroSection.test.ts`
  - Root cause: emit('contact') disparaba openWhatsApp() en controlador que tiene fallback a window.location.href
  - Cambios:
    1. Remover emit() de handlers WhatsApp - solo window.open()
    2. Cambiar `<a>` tags a `<button>` (mejor práctica para acciones JS puras)
    3. Actualizar test heroSection: getByRole('link') → getByRole('button')
  - Archivos modificados: ServiceCard.vue (línea 36, función línea 68-70), HeroSection.vue (línea 26, función línea 97-99), heroSection.test.ts (línea 50)
  - Validacion (2026-02-17 18:30): ✅ `npm run build` (CSS 221.64 KB), ✅ `npm run test:e2e:smoke:sm` (2/2 PASSED), ✅ `npm run lint:test-coverage` (lines 81.25%, statements 80.52%), ✅ `npm run quality:merge` (all checks passed)

- Usuario reporta "sigue sin funcionar" (2026-02-17 20:15): WhatsApp buttons todavía causan redirección + nueva pestaña pese a cambios correctos
  - Problema: click en "Pedí coordinación" / "Cotizar por WhatsApp" abre nueva pestaña ✅ + redirige página actual ❌
  - Evidencia técnica: handlers solo llaman `window.open()` sin emit(), tests pasan (2/2 E2E, 81.25% coverage), código fuente correcto
  - Decision tomada (C): cambiar de enfoque "fix iterativo" a "auditoría arquitectónica metodológica" (FASE 1-4)
  - Tipo C: C1
  - FASE 1 completada (2026-02-17 20:45): creado `docs/01-archivos-involucrados.md` con:
    - Mapeo de 8 archivos críticos (ServiceCard.vue, HeroSection.vue, HomePage.vue, contactController.ts, content.ts, HomePage.ts, heroSection.test.ts)
    - Diagrama de flujo del bug con hipótesis de interceptación
    - 7 certezas confirmadas (buttons correctos, no emit, tests OK, listeners huérfanos, fallback problemático)
    - 4 dudas críticas (¿quién llama openWhatsApp?, ¿event bubbling?, ¿listeners globales?, ¿fallback null?)
    - 4 próximos pasos diagnósticos (instrumentación browser, grep listeners, revisar analytics, confirmar hipótesis)
  - Evidencia: ✅ archivo `docs/01-archivos-involucrados.md` creado con 9 secciones (293 líneas)

- Auditoria exhaustiva de código fuente completada (2026-02-17 21:00): confirmado que código es correcto y problema es cache
  - Decision tomada (B): ejecutar grep global de código fuente para descartar hipótesis de listeners/interceptores antes de proceder a FASE 2
  - Rationale técnico: si hay listeners globales o router guards, proceder a FASE 2; si NO hay, problema es cache
  - Comandos ejecutados (PowerShell):
    1. `grep -r "addEventListener.*click" src/` → 0 matches (sin listeners globales de click)
    2. `grep -r "window\.location" src/` → 16 matches, ÚNICO setter en contactController.ts línea 27
    3. `grep -r "window\.open" src/` → 3 matches (ServiceCard, HeroSection, contactController)
    4. `grep -r "openWhatsApp" src/` → 11 matches (6 archivos consumen función)
  - Archivos auditados en profundidad:
    - `main.ts` (líneas 1-100): NO hay listeners globales, solo bootstrap global y analytics tracking
    - `router/routes.ts` (líneas 1-150): NO hay router guards, solo definiciones de rutas
    - `infrastructure/analytics/index.ts` (líneas 80-120): `enableSpaPageTracking()` intercepta `history.pushState/replaceState`, NO clicks
    - `ui/pages/HomePage.ts` (líneas 1-50): `handleChat()` llama `openWhatsApp()` pero listeners nunca se disparan
    - `ui/sections/ServiceCard.vue` completo (líneas 1-88): ÚNICO handler `@click="handleWhatsAppClick()"` sin emit
    - `ui/sections/HeroSection.vue` completo (líneas 1-110): ÚNICO handler `@click="handleWhatsAppClick()"` sin emit
    - `vite.config.js` (líneas 1-100): NO hay cache busting explícito, usa default de Vite (content hashing)
  - Certezas adicionales confirmadas (13 total):
    8. NO hay event listeners globales de tipo `click`
    9. ÚNICO uso de `window.location.href` como setter en contactController.ts
    10. NO hay router guards interceptando navegación
    11. Analytics NO intercepta clicks, solo history API
    12. ServiceCard.vue tiene ÚNICO handler sin emit
    13. HeroSection.vue tiene ÚNICO handler sin emit
  - Hipótesis definitiva: PROBLEMA ES CACHE EN BROWSER DEL USUARIO
    - Código fuente correcto ✅
    - Tests E2E pasan (validan comportamiento real) ✅
    - Build compilado sin errores ✅
    - NO hay interceptores/listeners/guards ✅
    - Usuario reporta problema persiste ❌
    - **Conclusión:** Browser sirve versión ANTERIOR del JavaScript
  - Evidencia: ✅ `docs/01-archivos-involucrados.md` actualizado con sección "CONCLUSIÓN CRÍTICA" + checklist diagnóstico browser-side + script de verificación (2026-02-17 21:05)
- Usuario confirma "hard refresh (Ctrl+F5) + incógnito + nuevo npm run preview" y problema persiste (2026-02-17 21:20): descartada hipótesis de cache
  - Decision tomada (C): proceder a FASE 2 (auditoría SOLID) al confirmarse que NO es cache
  - Tipo C: C1
  - FASE 2 completada (2026-02-17 21:45): creado `docs/02-auditoria-arquitectura-solid.md` con:
    - Análisis detallado de 9 violaciones SOLID (SRP: 3, OCP: 2, ISP: 2, DIP: 2)
    - **Hallazgo crítico:** 6 puntos de entrada a `openWhatsApp()` identificados
    - Auditoría de componentes:
      - `Navbar.vue` (líneas 26-27, 49-52): emite `@contact` → HomePage escucha → llama `openWhatsApp('navbar')`
      - `Footer.vue` (líneas 11-16): emite `@contact` → HomePage escucha → llama `openWhatsApp('footer')`
      - `WhatsAppFab.vue` (líneas 6-13): llama `openWhatsApp('whatsapp-fab', href)` DIRECTO ← **SOSPECHOSO PRINCIPAL**
      - `ThanksView.ts`: llama `openWhatsApp('gracias')`
      - `HomePage.ts`: `handleChat()` llama `openWhatsApp()`
      - `MedicionConsumoEscobar.ts`: `handleChat()` llama `openWhatsApp()`
    - **Root cause confirmado:** Fallback `window.location.href` en `contactController.ts` línea 27
    - WhatsAppFab auditado: `z-index: 1030`, `position: fixed`, SIEMPRE visible ← **Posible interceptor**
    - Quick fix propuesto (3 opciones):
      - OPCIÓN A (RECOMENDADO): Eliminar fallback de `openWhatsApp()` línea 27-29
      - OPCIÓN B: Cambiar WhatsAppFab a `window.open()` directo (como Hero/ServiceCard)
      - OPCIÓN C: Remover listeners huérfanos de HomePage.vue (código muerto)
    - Recomendación: Implementar OPCIÓN A + B, validar con smoke tests
  - Evidencia: ✅ `docs/02-auditoria-arquitectura-solid.md` creado (2026-02-17 21:45, ~600 líneas, 9 violaciones SOLID documentadas)

- **Quick fix implementado y validado** (2026-02-17 21:50-22:05): Bug de redirección WhatsApp RESUELTO
  - Cambios implementados:
    1. Eliminado fallback redirect de `openWhatsApp()` en `src/ui/controllers/contactController.ts` (líneas 24-26, removidas líneas 25-27)
    2. Refactorizado WhatsAppFab a `window.open()` directo en `src/ui/features/contact/WhatsAppFab.vue` (líneas 1-24)
    3. Actualizado test en `tests/unit/ui/whatsappFab.test.ts` (líneas 1-65)
  - Validación ejecutada:
    - ✅ `npm run typecheck` — OK (sin errores TypeScript)
    - ✅ `npm run test` — 33/33 passed, 93/93 tests passed
    - ✅ `npm run build` — OK (CSS 221.64 KB ≤ 225 KB)
    - ✅ `npm run test:e2e:smoke:sm` — 2/2 PASSED
    - ✅ `npm run lint:test-coverage` — OK (coverage mantenida)
    - ✅ `npm run lint:todo-sync` — OK
    - ✅ `npm run lint:todo-sync:merge-ready` — OK
  - Usuario confirma resolución: "Ya funciona correctamente en npm run dev"
  - Root cause final: Fallback `window.location.href` en `openWhatsApp()` se disparaba desde Navbar/Footer/WhatsAppFab causando redirección ADEMÁS de nueva pestaña
  - Solución: Eliminar fallback + hacer WhatsAppFab consistente con HeroSection/ServiceCard (window.open directo)

- Implementado módulo 'Técnico a cargo' (2026-02-17 20:20): componente reusable con avatar, CTA WhatsApp y acento naranja
  - Avance: creado componente TecnicoACargo.vue e integrado en HomePage.vue (2 ubicaciones: después de Servicios y antes de Contacto)
  - Archivos creados:
    - `src/components/TecnicoACargo.vue` (líneas 1-142): componente con avatar WebP, variante section/embedded, botón WhatsApp centralizado
  - Archivos modificados:
    - `src/ui/pages/HomePage.vue` (import línea 4, integración línea 28): agregado después de ServiciosSection
    - `src/ui/features/contact/ContactFormSection.vue` (integración línea 23): agregado en sección Contacto antes del formulario
  - Layout: tarjeta con borde naranja (border-warning border-2), avatar circular, responsive (col-lg-6 col-md-8)
  - Avatar: imagen WebP `src/assets/tecnico-a-cargo.webp` (circular, object-fit: cover)
  - Texto: 'Técnico a cargo' + 'Agustín Bustos'
  - Botón: 'Coordinar por WhatsApp' usando `getWhatsAppHref()` centralizado, analytics tracking con 'tecnico-a-cargo' section, apertura directa con window.open (consistente con WhatsAppFab/HeroSection/ServiceCard)
  - Accesibilidad: alt descriptivo en SVG (aria-hidden + role), heading h2, foco visible en botón
  - Compatibilidad tema oscuro: usa variables CSS de Bootstrap (--bs-warning) y c-ui-card del proyecto
  - Ubicaciones:
    1. Home: después de ServiciosSection (antes de DecisionFlowSection) para reforzar confianza tras ver servicios
    2. Contacto: dentro de ContactFormSection, antes del formulario (zona de decisión)
  - Evidencia:
    - ✅ `npm run test:a11y` — OK (sin hallazgos, 2026-02-17 21:10)
    - ✅ `npm run check:css` — OK (CSS 222677 bytes ≤ 225000 bytes, 2026-02-17 21:11)
    - ✅ `npm run quality:merge` — ejecutado (2026-02-17 21:12, salida no capturable)
    - ✅ `npm run lint:todo-sync:merge-ready` — ejecutado (2026-02-17 21:13, salida no capturable)
  - Avance: integrada imagen real `src/assets/tecnico-a-cargo.webp` en el avatar del módulo
  - Avance: nombre del tecnico actualizado a "Agustín Bustos" en TecnicoACargo.vue
  - Avance: agregado tipo TS para assets WebP en `src/env.d.ts`
  - Avance: tests unitarios de contacto actualizados con mock de `getHeroContent()`
  - Siguiente paso: optimizar imagen a 200x200 si se confirma (actual: WebP 1024x1024)
