# TODO Done - Escalado a 2 marcas / 2 FTPS

## Convencion

- `[x]` tarea finalizada

## Decisiones confirmadas

- [x] Ambas marcas comparten las mismas rutas/paginas: `/`, `/cotizador`, `/gracias`.

## P0 finalizado

- [x] Restablecer build reproducible.
  - Evidencia: `npm run build` funcional con generacion de `sitemap`, `robots` y `/w`.

- [x] Separar configuracion por target de marca en build-time.
  - Evidencia: perfiles en `src/infrastructure/content/runtimeProfiles.json`.

- [x] Actualizar workflow FTPS a despliegue automatico dual.
  - Evidencia: matrix `datamaq` + `upp` en `.github/workflows/ci-cd-ftps.yml`.

- [x] Aislar backend por target.
  - Evidencia: cada target consume su propio `backendBaseUrl`.

- [x] Eliminar `.env` versionados y migrar configuracion publica a perfiles en codigo.
  - Evidencia: `runtimeProfiles.json` + workflow FTPS sin `VITE_ENV_FILE_*`.

## P1 finalizado

- [x] Eliminar hardcodes de branding en UI y estaticos.
- [x] Desacoplar analytics de `publicConfig` concreto.

## P2 finalizado

- [x] Estandarizar nomenclatura neutral de marca en storage keys.
- [x] Documentar runbook multi-target (`docs/multi-target-deploy-runbook.md`).
- [x] Agregar validacion automatica de hardcodes de marca (`npm run lint:brand-hardcodes`).
