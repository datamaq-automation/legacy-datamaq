# Runbook - Deploy multi-target FTPS

## Objetivo

Desplegar dos marcas desde el mismo repositorio, compartiendo rutas (`/`, `/cotizador`, `/gracias`) y usando perfiles por target sin `.env`.

## Fuente de configuracion

- Archivo: `src/infrastructure/content/runtimeProfiles.json`
- Targets: `datamaq`, `upp`, `e2e`
- Campos minimos por target para produccion:
  - `backendBaseUrl`
  - `siteUrl`
  - `siteName`
  - `whatsappUrl`
  - `contactFormActive` / `emailFormActive`

## Workflow de deploy

- Archivo: `.github/workflows/ci-cd-ftps.yml`
- Trigger: `push` a `main`
- Matrix: `datamaq`, `upp`
- Build ejecutado por target:
  - `npm run build -- datamaq`
  - `npm run build -- upp`

## Secrets y Variables por target

Para `datamaq`:

Secrets:
- `FTPS__DATAMAQ_SERVER`
- `FTPS__DATAMAQ_USERNAME`
- `FTPS__DATAMAQ_PASSWORD`

Variables:
- `FTPS__DATAMAQ_PORT` (opcional; default 21)
- `FTPS__DATAMAQ_REMOTE_DIR`
- `FTPS__DATAMAQ_ALLOW_INSECURE_DATA_CHANNEL` (`true|false`, opcional)

Para `upp`:

Secrets:
- `FTPS__UPP_SERVER`
- `FTPS__UPP_USERNAME`
- `FTPS__UPP_PASSWORD`

Variables:
- `FTPS__UPP_PORT` (opcional; default 21)
- `FTPS__UPP_REMOTE_DIR`
- `FTPS__UPP_ALLOW_INSECURE_DATA_CHANNEL` (`true|false`, opcional)

## Validacion local recomendada

```bash
npm run lint:brand-hardcodes
npm run typecheck
npm run test
npm run build -- datamaq
npm run build -- upp
```

## Rollback

1. Re-deploy del commit estable anterior en `main`.
2. Verificar FTPS (`host/port/credenciales/directorio remoto`).
3. Si falla un solo target, deshabilitar temporalmente su job o secretos `FTPS_*` hasta corregir.
