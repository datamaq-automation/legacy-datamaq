# TODO Done - Resumen

Este archivo registra hitos cerrados sin detalle operativo redundante.
La evidencia tecnica puntual vive en commits, tests y pull requests.

## Hitos completados

- [x] Build reproducible y despliegue FTPS multi-target (`datamaq`, `upp`).
- [x] Configuracion por target centralizada en `runtimeProfiles.json`.
- [x] Endpoints API versionados consolidados en `/api/v1/*` con compatibilidad transitoria legacy.
- [x] Hardening backend base: CORS, `request_id`, headers de seguridad, validaciones y rate limit.
- [x] Contrato canónico de API documentado (`content`, `pricing`, `health`, `contact`, `mail`).
- [x] Cobertura de pruebas de contrato frontend-backend y smoke E2E en CI.
- [x] Integracion Chatwoot backend-only con tenancy por marca.
- [x] Refactors de frontend para desacoplar transporte HTTP y normalizar mapeos de datos.

## Historial detallado

Si se necesita trazabilidad fina (fechas, archivos, comandos y evidencia puntual), usar:

- historial Git (`git log -- docs/todo.done.md`)
- workflows CI/CD
- suites de tests en `tests/unit` y `tests/e2e`
