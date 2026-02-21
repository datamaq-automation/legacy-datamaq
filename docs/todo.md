# Tablero activo

- [>] (P0) Verificar contrato de backend y diagnostico fail-fast FTPS
  - Decision tomada (B-Deploy): Se priorizo confirmar primero estado real del workflow para no introducir cambios redundantes ni riesgo operativo en deploy.
  - Avance: Se verifico que `VITE_ALLOW_INSECURE_BACKEND` ya esta documentado en `docs/dv-api-01.contrato-pricing-health.md` con alcance exacto (solo loopback HTTP fuera de DEV cuando vale `true`; en cualquier otro caso se exige `https://`).
  - Avance: Se verifico que `.github/workflows/ci-cd-ftps.yml` ya opera en modo 1 intento con diagnostico extendido (preflight con `cls -1`, timeout de upload 120s, clasificacion por `max-retries` y bloque `FTPS diagnostic matches`).
  - Evidencia: `rg -n "VITE_ALLOW_INSECURE_BACKEND|Bypass local controlado" docs/dv-api-01.contrato-pricing-health.md -S` (OK), `python` + `yaml.safe_load` sobre `.github/workflows/ci-cd-ftps.yml` (OK), `rg -n "cls -1|timeout 120|FTPS diagnostic matches|max-retries" .github/workflows/ci-cd-ftps.yml -S` (OK).
  - Evidencia: `npx --yes actionlint` (no disponible en este entorno npm: "could not determine executable to run"); mitigado con parseo YAML local.
  - Siguiente paso: Re-ejecutar pipeline `CI/CD FTPS` en `main` y verificar si el fallo queda clasificado por causa (auth/DNS/TLS/path/data-channel) con el nuevo bloque de diagnostico.
  - Siguiente accion interna ejecutable ahora: Esperar el nuevo log del run de GitHub Actions para cerrar la causa raiz o ajustar parametros FTPS adicionales.
