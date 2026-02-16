# Plan Tecnico Prioritario

> Baseline operativo: `docs/dv-00-operating-baseline.md`.
> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## Backlog activo

### P0
- [>] (P0) Hardening operativo de build local y diagnostico de canal de formulario
  - Contexto: se requiere que `npm run build` publique por defecto en `C:/AppServ/www` en Windows y mejorar diagnostico cuando el formulario quede deshabilitado en produccion.
  - Accion: mantener salida de build compatible con entorno local sin romper CI y exponer causa operativa cuando `backend-status` sea `unavailable`.
  - DoD (criterio de aceptacion): build por defecto apunta a `C:/AppServ/www` (Windows), fallback no-Windows a `dist`, y diagnostico de disponibilidad del formulario visible con `console.error`.
  - Decision tomada (B-Deploy): se elige `defaultOutDir` condicional por plataforma (`win32 -> C:/AppServ/www`, resto -> `dist`) preservando override `BUILD_OUT_DIR`.
  - Avance: `vite.config.js` actualizado para usar `C:/AppServ/www` como salida por defecto local en Windows.
  - Evidencia: `vite.config.js`.
  - Decision tomada (B): para diagnostico de canal en produccion se elige log persistente (`console.error`) al finalizar `ensureContactBackendStatus` con estado `unavailable`.
  - Avance: `contactHooks` reporta `inquiryApiUrl`, `hasContactEmail` y hint operativo cuando backend queda no disponible.
  - Evidencia: `src/ui/features/contact/contactHooks.ts`.
  - Evidencia: `npm run test -- tests/unit/ui/contactFormSection.test.ts tests/unit/ui/contactSubmitThanksFlow.test.ts` en verde (2026-02-16 19:37 -03:00), `2 files / 3 tests`.
  - Evidencia: `npm run typecheck` en verde (2026-02-16 19:37 -03:00).
  - Evidencia: `npm run lint:security` en verde (2026-02-16 19:37 -03:00).
  - Evidencia: `npm run lint:test-coverage` en verde (2026-02-16 19:37 -03:00), cobertura global `lines=81.36`, `statements=80.65`, `functions=83.47`, `branches=69.49`.
  - Decision tomada (B-Deploy): al cambiar `outDir` por defecto surgio desalineacion en scripts CSS (`dist/assets` hardcoded); se elige alinear `check-css-size` y `report-css-size` al `outDir` efectivo (`BUILD_OUT_DIR` o default por plataforma) para mantener gate consistente.
  - Avance: scripts de CSS ajustados para resolver `assetsDir` dinamico sin asumir `dist/`.
  - Evidencia: `scripts/check-css-size.mjs`, `scripts/report-css-size.mjs`.
  - Evidencia: `npm run quality:merge` en verde (2026-02-16 19:41 -03:00), incluyendo `quality:gate` + `test:e2e:smoke` tras corregir deteccion de `assets`.
  - Bloqueador residual: ninguno interno para estos ajustes.
  - Siguiente paso: confirmar en despliegue real que el mensaje de mantenimiento solo aparezca cuando corresponda y que el endpoint operativo mantenga respuestas correctas.
  - Siguiente accion interna ejecutable ahora: ejecutar `npm run lint:todo-sync:merge-ready` para cerrar este turno con evidencia de merge local.
