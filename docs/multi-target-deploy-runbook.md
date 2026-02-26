# Runbook - Deploy multi-target FTPS

## Objetivo

Desplegar dos marcas desde el mismo repositorio, compartiendo rutas (`/`, `/cotizador`, `/gracias`) y usando perfiles por target sin `.env`.

## Fuente de configuracion

- Archivo: `src/infrastructure/content/runtimeProfiles.json`
- Targets: `datamaq`, `upp`, `e2e`
- Campos minimos por target para produccion:
  - `inquiryApiUrl`
  - `mailApiUrl`
  - `pricingApiUrl`
  - `quoteDiagnosticApiUrl`
  - `quotePdfApiUrl`
  - `siteUrl`
  - `siteName`
  - `whatsappUrl`
  - `contactFormActive` / `emailFormActive`

## Workflow de deploy

- Archivo CI (quality): `.github/workflows/ci-quality.yml`
- Archivo CD (deploy): `.github/workflows/ci-cd-ftps.yml`
- Trigger CD: `workflow_run` del workflow `CI / Quality` cuando termina `success` en `main`
- Matrix: `datamaq`, `upp`
- Orden del job:
  - Preflight FTPS primero (validacion de inputs, DNS y login FTPS)
  - Build despues (checkout, `npm ci`, `npm run build -- <target>`)
  - Upload FTPS al final
- Build ejecutado por target:
  - `npm run build -- datamaq`
  - `npm run build -- upp`

## Secrets y Variables por target

Para `datamaq`:

Secrets:
- `FTPS_DATAMAQ_SERVER`
- `FTPS_DATAMAQ_USERNAME`
- `FTPS_DATAMAQ_PASSWORD`

Variables:
- `FTPS_DATAMAQ_PORT` (opcional; default 21)
- `FTPS_DATAMAQ_REMOTE_DIR`
- `FTPS_DATAMAQ_ALLOW_INSECURE_DATA_CHANNEL` (`true|false`, opcional)
- Formato recomendado para `FTPS_DATAMAQ_SERVER`: `ftp.example.com` o `ftps://ftp.example.com` (evitar valores incompletos como `https://`).

Para `upp`:

Secrets:
- `FTPS_UPP_SERVER`
- `FTPS_UPP_USERNAME`
- `FTPS_UPP_PASSWORD`

Variables:
- `FTPS_UPP_PORT` (opcional; default 21)
- `FTPS_UPP_REMOTE_DIR`
- `FTPS_UPP_ALLOW_INSECURE_DATA_CHANNEL` (`true|false`, opcional)
- Formato recomendado para `FTPS_UPP_SERVER`: `ftp.example.com` o `ftps://ftp.example.com` (evitar valores incompletos como `https://`).

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
