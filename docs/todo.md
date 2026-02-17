# Plan Tecnico Prioritario

> Baseline operativo: `docs/dv-opsr-01.md`.
> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## Backlog activo

### P0
- [>] (P0) Corregir synchronization race condition en Navbar offcanvas (Mobile 360×800px / ≤991.98px)
  - Contexto: usuario reportó que navbar-toggler requiere 2 clicks para abrir en mobile, offcanvas no cierra, scroll queda bloqueado.
  - Analisis: race condition entre Bootstrap auto-inicialización (data-bs-toggle) y Vue listeners. Bootstrap.js no estaba expuesto globalmente en Vite SSG, causando timing issues.
  - Decision tomada (A-Arquitectura): inicialización manual de Bootstrap.Offcanvas vs confiar en data-attributes automáticos. Ventaja: control total de timing + garantiza listeners se registran después de Bootstrap.
  - Cambios implementados (2026-02-17 14:30 -03:00):
    - `src/main.ts`: Exponer Bootstrap globalmente (window.bootstrap) para que Vue pueda accesarlo tras import
    - `src/ui/layout/Navbar.ts`: Inicializar manual de Offcanvas en onMounted(), registrar listeners DESPUÉS de inicialización garantizada
    - `src/ui/layout/Navbar.ts`: Agregar validación de estado antes de hideOffcanvas() para evitar intentos de cerrar cuando ya está cerrado
    - `src/ui/layout/Navbar.vue`: Remover data-bs-toggle y data-bs-target (Bootstrap manual ahora, no automático)
  - Evidencia (Fase 1 - Setup):
    - `npm run typecheck` en verde (2026-02-17 14:31 -03:00)
    - `npm run test:e2e:smoke:sm` (offcanvas tests) en verde (2026-02-17 14:32 -03:00) - 2 tests passed
    - `npm run quality:responsive` XS→SM→MD→LG en verde (2026-02-17 14:34 -03:00)
    - `npm run test:a11y` en verde - sin hallazgos (2026-02-17 14:35 -03:00)
    - `npm run check:css` en verde - CSS presupuesto 210883 ≤ 211000 (2026-02-17 14:36 -03:00)
    - `npm run quality:mobile` all checks passed (2026-02-17 14:37 -03:00)
    - `npm run quality:merge` (gate+responsive+mobile consolidado) en verde (2026-02-17 14:38 -03:00): quality:gate falló solo por falta de actualización docs/todo.md, rest en verde
  - Validacion en navegador real (npm run preview 360×800px) - [2026-02-17 14:55 -03:00]:
    - ❌ Usuario reporta: "primer click → FAB desaparece pero offcanvas NO se ve visualmente"
    - 🔍 Diagnostic v1 ejecutado por usuario, resultado positivo:
      - ✅ `dmq-offcanvas-open` = true (Vue sincronizó correctamente)
      - ✅ Bootstrap instance existe (getInstance() retorna objeto)
      - ✅ Class "show" presente en offcanvas
      - ✅ aria-expanded = true (estado UI correcto)
      - ✅ Backdrop (.offcanvas-backdrop.show) existe
    - 🤔 Inconsistencia: todos los indicadores Bootstrap correctos, pero offcanvas visualmente invisible
    - ➡️ Hipótesis: offcanvas existe en DOM con clase show, pero problemas CSS (display/visibility/opacity/positioning/transform) hacen que sea invisible visualmente.
    - Siguiente diagonóstico (v2) enviado a usuario para ejecutar: chequear CSS computable (display, visibility, opacity, position, left, right, width, height, transform, z-index).
  - Viewport de prueba actualizado: **360×800px** (dispositivo Android típico, breakpoint mobile crítico)
  - Bloqueador residual: pendiente output de diagnostic v2 para identificar qué propiedad CSS bloquea visibilidad.
  - Siguiente accion interna ejecutable ahora: esperar diagnostic v2 de usuario; implementar fix específico según CSS property oculta.
  - Anexo tecnico: `docs/dv-uiux-06-navbar-defect.md`.

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
