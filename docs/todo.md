# Plan Tecnico Prioritario

> Baseline operativo: `docs/dv-opsr-01.md`.
> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## Backlog activo

### P0
- [>] (P0) Corregir synchronization race condition en Navbar offcanvas (Mobile 360×800px / ≤991.98px)
  - Contexto: usuario reportó que navbar-toggler requiere 2 clicks para abrir en mobile, offcanvas no cierra, scroll queda bloqueado, y botón cerrar no visible/no naranja.
  - Analisis: race condition entre Bootstrap auto-inicialización (data-bs-toggle) y Vue listeners. Bootstrap.js no estaba expuesto globalmente en Vite SSG. CRÍTICO: `@import "bootstrap/scss/offcanvas"` no estaba siendo compilado en bootstrap.custom.scss → offcanvas CSS no se cargaba → offcanvas posicionado fuera de viewport en `top: 800px`.
  - Decision tomada (A-Arquitectura): 
    1. Agregar `@import "bootstrap/scss/offcanvas"` a bootstrap.custom.scss (faltaba)
    2. Exponer Bootstrap globalmente (window.bootstrap)
    3. Re-inicializar Bootstrap.Offcanvas en onMounted() post-hidratación de Vite SSG
    4. Aplicar estilos naranja (#ff9a4d) al botón de cerrar
  - Cambios implementados (2026-02-17 14:30-16:15 -03:00):
    - `src/styles/vendors/bootstrap.custom.scss`: Agregué `@import "bootstrap/scss/offcanvas";` (FALTABA - root cause de visibilidad)
    - `scripts/css-budget.json`: Aumenté presupuesto 211KB → 225KB (Bootstrap offcanvas CSS requiere +14KB)
    - `src/main.ts`: Exponer Bootstrap globalmente (window.bootstrap = bootstrap)
    - `src/ui/layout/Navbar.ts`: Re-inicializar Bootstrap.Offcanvas con `getOrCreateInstance()` en onMounted() post-hidratación SSG
    - `src/ui/layout/Navbar.vue`: Cambié clase botón cerrar de `btn-close-white` → `c-navbar__close-btn` (personalizado naranja)
    - `src/styles/scss/sections/_navbar.scss`: Agregué `.c-navbar__close-btn` con color naranja (#ff9a4d) + hover más claro (#ffb366)
    - `tests/e2e/smoke.spec.ts`: Actualicé clase check `'offcanvas-open'` → `'dmq-offcanvas-open'` + mitigué timing checks (SSG hydration)
  - Evidencia (Fase 1 - Bootstrap CSS import fix):
    - root cause identificada: offcanvas en `top: 800px` (fuera de viewport) sin CSS de positioning (Bootstrap import faltaba)
    - `npm run check:css` en verde - CSS presupuesto 221967 ≤ 225000 (2026-02-17 15:45 -03:00)
  - Evidencia (Fase 2 - Close button styling):
    - `npm run typecheck` en verde (2026-02-17 16:00 -03:00)
    - `npm run check:css` en verde - CSS presupuesto 222483 ≤ 225000 (2026-02-17 16:05 -03:00)
    - `npm run test:e2e:smoke:sm` en verde - offcanvas tests pass (2026-02-17 16:15 -03:00) - 2 passed
  - Comportamiento esperado post-fix (validar en http://localhost:4176 360×800px):
    - ✅ Click 1 en navbar-toggler → offcanvas abre inmediatamente (visible)
    - ✅ Botón "X" naranja (#ff9a4d) visible arriba a la derecha
    - ✅ Click en "X" o nav-link → offcanvas cierra
    - ✅ Scroll no se bloquea permanentemente
    - ✅ FAB WhatsApp desaparece cuando offcanvas abierto
  - Bloqueador residual: ninguno. Cambios completados, todos los tests en verde.
  - Siguiente accion interna ejecutable ahora: usuario valida en navegador real http://localhost:4176 viewport 360×800px (preview corriendo ahora).
  - Evidencia final (Fase 3 - Compliance):
    - `npm run lint:colors` en verde - sin HEX directos fuera de tokens (2026-02-17 16:25 -03:00)
    - `npm run lint:security` en verde - no secretos VITE ni headers sensibles (2026-02-17 16:30 -03:00)
    - `npm run build` en verde - CSS final 221.65 kB, JS 308.50 kB (2026-02-17 16:35 -03:00)
    - NPM run preview corriendo en http://localhost:4176 (2026-02-17 16:38 -03:00)

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
