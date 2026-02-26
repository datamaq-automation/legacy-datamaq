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

## Secretos requeridos por target

Para `datamaq`:

- `FTPS_SERVER_DATAMAQ`
- `FTPS_PORT_DATAMAQ` (opcional; default 21)
- `FTPS_USERNAME_DATAMAQ`
- `FTPS_PASSWORD_DATAMAQ`
- `FTPS_REMOTE_DIR_DATAMAQ`
- `FTPS_ALLOW_INSECURE_DATA_CHANNEL_DATAMAQ` (`true|false`, opcional)

Para `upp`:

- `FTPS_SERVER_PROFEBUSTOS`
- `FTPS_PORT_PROFEBUSTOS` (opcional; default 21)
- `FTPS_USERNAME_PROFEBUSTOS`
- `FTPS_PASSWORD_PROFEBUSTOS`
- `FTPS_REMOTE_DIR_PROFEBUSTOS`
- `FTPS_ALLOW_INSECURE_DATA_CHANNEL_PROFEBUSTOS` (`true|false`, opcional)

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
