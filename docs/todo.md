# Tablero activo

- [>] (P0) Auditoria de arquitectura limpia + SOLID + TS con mejoras de bajo riesgo
  - Decision tomada (B-Arquitectura): Se removio dependencia no utilizada (`LoggerPort`) del caso de uso `SubmitContactUseCase` para reducir acoplamiento y responsabilidades ajenas al caso de uso.
  - Decision tomada (B-Testing): Ante fallo de `lint:test-coverage` por aserciones desalineadas en pricing visible, se priorizo correccion funcional minima en `src/infrastructure/content/Appcontent.ts` para mantener politica publica de "Consultar al WhatsApp" sin tocar logs de consola.
  - Avance: `SubmitContactUseCase` ahora depende solo de puertos funcionales necesarios; se actualizo composicion en `src/di/container.ts` y test unitario asociado.
  - Avance: Se mantuvo el dato dinamico `visitaDiagnosticoHasta2hARS` en memoria/config pero se elimino su render de copy publico en `Appcontent` (sin montos visibles en texto comercial).
  - Evidencia: cambios en `src/application/use-cases/submitContact.ts`, `src/di/container.ts`, `src/infrastructure/content/Appcontent.ts`, `tests/unit/application/submitContact.test.ts`.
  - Decision tomada (B-Vue): Para reducir ruido en F12 sin cambiar contrato funcional, se aplico logging de backend con criterio: `info` solo en `DEV`, warnings deduplicados por endpoint/causa y 404 de probe tratado como `unavailable`.
  - Avance: Se ajusto `ContactBackendMonitor` para no reportar 404 como "conexion OK"; ahora marca `unavailable` y emite warning accionable deduplicado.
  - Avance: Se ajusto `ContentRepository` para evitar spam de logs repetidos y mover `conexion OK` de pricing a modo `DEV`.
  - Evidencia: cambios en `src/application/contact/contactBackendStatus.ts`, `src/infrastructure/content/contentRepository.ts`, `tests/unit/application/contactBackendStatus.test.ts`.
  - Evidencia: `npx vitest run tests/unit/application/contactBackendStatus.test.ts` (OK), `npx vitest run tests/unit/infrastructure/contentRepository.test.ts` (OK).
  - Evidencia: `npm run lint:security` (OK), `npm run lint:test-coverage` (OK), `npm run quality:merge` (OK, incluye `quality:gate` + `quality:responsive` + `quality:mobile`).
  - Evidencia: `npm run typecheck` (OK), `npm run lint:layers` (OK), `npm run lint:security` (OK), `npm run lint:test-coverage` (FAIL inicial -> mitigado), `npx vitest run tests/unit/infrastructure/contentRepository.test.ts` (OK), `npm run lint:test-coverage` (OK), `npm run build` (OK), `npm run quality:merge` (FAIL inicial por `docs/todo.md` desactualizado; mitigacion aplicada), `npm run quality:merge` (OK), `npm run lint:todo-sync:merge-ready` (OK).
  - Siguiente paso: Correr gate completo (`quality:merge`) con los ajustes de consola ya aplicados y consolidar dudas residuales para decision de producto.
  - Siguiente accion interna ejecutable ahora: Ejecutar validacion merge-ready final y preparar resumen de certezas/dudas sobre estrategia de probe (`OPTIONS` vs `/v1/health`).

- [>] (P0) Verificar contrato de backend y diagnostico fail-fast FTPS
  - Decision tomada (B-Deploy): Se priorizo confirmar primero estado real del workflow para no introducir cambios redundantes ni riesgo operativo en deploy.
  - Avance: Se verifico que `VITE_ALLOW_INSECURE_BACKEND` ya esta documentado en `docs/dv-api-01.contrato-pricing-health.md` con alcance exacto (solo loopback HTTP fuera de DEV cuando vale `true`; en cualquier otro caso se exige `https://`).
  - Avance: Se verifico que `.github/workflows/ci-cd-ftps.yml` ya opera en modo 1 intento con diagnostico extendido (preflight con `cls -1`, timeout de upload 120s, clasificacion por `max-retries` y bloque `FTPS diagnostic matches`).
  - Evidencia: `rg -n "VITE_ALLOW_INSECURE_BACKEND|Bypass local controlado" docs/dv-api-01.contrato-pricing-health.md -S` (OK), `python` + `yaml.safe_load` sobre `.github/workflows/ci-cd-ftps.yml` (OK), `rg -n "cls -1|timeout 120|FTPS diagnostic matches|max-retries" .github/workflows/ci-cd-ftps.yml -S` (OK).
  - Evidencia: `npx --yes actionlint` (no disponible en este entorno npm: "could not determine executable to run"); mitigado con parseo YAML local.
  - Siguiente paso: Re-ejecutar pipeline `CI/CD FTPS` en `main` y verificar si el fallo queda clasificado por causa (auth/DNS/TLS/path/data-channel) con el nuevo bloque de diagnostico.
  - Siguiente accion interna ejecutable ahora: Esperar el nuevo log del run de GitHub Actions para cerrar la causa raiz o ajustar parametros FTPS adicionales.
