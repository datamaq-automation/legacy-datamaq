# Tablero activo

- [>] (P0) Ocultar montos en web publica y mantener pricing tecnico minimo por backend
  - Decision tomada (B-Arquitectura): Como el repo no tenia servicio FastAPI operativo versionado, se agrego implementacion minima en `backend/fastapi/main.py` con los endpoints existentes del contrato (`/v1/public/pricing`, `/v1/health`) sin introducir rutas nuevas.
  - Avance: El frontend paso a mostrar `Consultar al WhatsApp` en todos los textos de precio y el parser runtime ahora acepta solo `visita_diagnostico_hasta_2h_ars` (con aliases), ignorando tarifa base, traslado y hora adicional.
  - Avance: Se actualizo contrato (`docs/dv-api-01.contrato-pricing-health.md`), se agrego `docs/pricing-public.md` y se restauraron alias legacy (`mock.php`, `v1/public/pricing/index.php`, `v1/health/index.php`).
  - Evidencia: cambios en `src/infrastructure/content/Appcontent.ts`, `src/infrastructure/content/contentRepository.ts`, `tests/unit/infrastructure/contentRepository.test.ts`, `backend/fastapi/main.py`, `docs/pricing-public.md`; comandos `npm run typecheck` (OK), `npm run lint:security` (OK), `npm run lint:test-coverage` (OK), `npm run build` (OK), `npm run quality:merge` (OK), `npm run lint:todo-sync:merge-ready` (OK).
  - Siguiente paso: Validacion manual final en entorno local para confirmar que no aparece ningun monto ARS en Home/Servicios.
  - Siguiente accion interna ejecutable ahora: Esperar validacion manual del usuario y feedback de QA visual (360x800 y desktop).

- [ ] (P0) Habilitar bypass local seguro para backend HTTP en preview/build
  - Decision tomada (B-Seguridad): Se evaluaron 3 opciones para el bypass (`permitir cualquier http`, `permitir red local privada`, `permitir solo loopback`). Se eligio `permitir solo loopback` por menor superficie de ataque y menor riesgo de filtrar trafico no TLS fuera de la maquina local.
  - Decision tomada (B-Testing): Ante fallo de `lint:test-coverage` por string mojibake en asercion (`mÃ­nimo`), se reemplazo por matcher tolerante (`/m[ií]nimo/i`) para mantener senal y reducir fragilidad de encoding.
  - Avance: Se agrego bypass controlado por `VITE_ALLOW_INSECURE_BACKEND=true` en `src/infrastructure/config/viteConfig.ts`, limitado a `localhost`, `127.0.0.1` y `::1`. Se refactorizo la validacion para no introducir funciones sin cobertura y recuperar umbral global.
  - Evidencia: cambios en `src/infrastructure/config/viteConfig.ts`, `src/env.d.ts`, `.env.example`, `tests/unit/infrastructure/contentRepository.test.ts`; comandos `npm run typecheck` (OK), `npm run lint:security` (OK), `npm run lint:test-coverage` (OK: functions 80.29%), `npm run build` (OK), `npm run quality:merge` (OK).
  - Siguiente paso: Validacion manual del usuario en entorno local no-DEV con variable `VITE_ALLOW_INSECURE_BACKEND=true`.
  - Siguiente accion interna ejecutable ahora: Esperar validacion manual del usuario en su entorno local no-DEV con `VITE_ALLOW_INSECURE_BACKEND=true`.

- [ ] (P0) Separar contratos API por dominio funcional (pricing/health y contact/mail)
  - Clasificacion A aplicada en: `docs/dv-api-01.contrato-pricing-health.md`, `docs/dv-api-02.contrato-contact-mail.md`
  - Avance: Se dividio el contrato unico en dos documentos separados y se dejo un indice de transicion en `docs/dv-api-01.contrato-frontend-backend.md`.
  - Evidencia: `Get-Content -Raw docs/dv-api-01.contrato-pricing-health.md`; `Get-Content -Raw docs/dv-api-02.contrato-contact-mail.md`
  - Siguiente paso: Esperar confirmacion del usuario sobre mantener o eliminar el indice de transicion.
  - Siguiente accion interna ejecutable ahora: Remover `docs/dv-api-01.contrato-frontend-backend.md` si se confirma que se requieren solo dos archivos fisicos.
