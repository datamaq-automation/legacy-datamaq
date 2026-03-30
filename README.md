# plantilla-www

Frontend Vue 3 + Vite con configuracion multi-target desde un solo repositorio.

## Targets

- `datamaq`
- `upp`
- `example`
- `e2e`

Configuracion runtime centralizada en `src/infrastructure/content/runtimeProfiles.json`.

## Documentacion

- Indice de documentacion: `docs/README.md`
- Guia principal para migracion de backend a FastAPI: `docs/fastapi-backend-migration-guide.md`
- Contrato objetivo de `GET /v1/site`: `docs/backend-content-brand-seo-contract.md`
- Contrato canonico de `contact` y `mail`: `docs/fastapi-contact-contract.md`

## Comandos

```bash
npm install
npm run dev
npm run build -- <target>
npm run build:local
npm run typecheck
npm run test
npm run test:contracts:fastapi
npm run test:e2e:smoke
```

`npm run build:local` limpia solo los artefactos del frontend en `C:\AppServ\www`, compila ahi en modo `local-preview` y fuerza los endpoints backend a `http://127.0.0.1:8899/v1/...`.

## Flujo Local Recomendado

Para desarrollo interactivo:

```bash
npm run dev
```

- usa el perfil local de integracion
- mantiene las llamadas API detras de `/api/v1/*`
- deja el proxy de Vite resolver el backend local

Para preview local compilado sobre Apache/AppServ:

```bash
npm run build:local
```

- limpia solo los artefactos del frontend en `C:\AppServ\www`
- genera el bundle directamente en `C:\AppServ\www`
- aplica politica `local-preview`
- permite `https://` y solo `http://localhost...` o `http://127.0.0.1...`
- por defecto apunta al backend `http://127.0.0.1:8899`

Overrides disponibles:

```powershell
$env:LOCAL_BUILD_OUT_DIR='C:\AppServ\www\mi-sitio'
$env:LOCAL_BACKEND_BASE_URL='http://127.0.0.1:8899'
```

Ejemplos:

```bash
npm run build:local
npm run build:local -- upp
```

`npm run build -- <target>` sigue reservado para el build estandar del proyecto. No usa la politica `local-preview`.

## CI/CD

- CI: `.github/workflows/ci-quality.yml`
- CD FTPS: `.github/workflows/ci-cd-ftps.yml`

## Git Hooks Locales

- Se usa `husky` con hook `pre-push` para bloquear `git push` si falla el gate local.
- Gate actual: `npm run gate:push` (`lint:security` + `typecheck`).
- Si necesitás bypass excepcional: `HUSKY=0 git push`.
