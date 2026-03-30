# plantilla-www

Frontend Vue 3 + Vite orientado a un frontend estatico de DataMaq.

## Documentacion

- Indice de documentacion: `docs/README.md`
- Guia principal para migracion de backend a FastAPI: `docs/fastapi-backend-migration-guide.md`
- Contrato objetivo historico de `GET /v1/site`: `docs/backend-content-brand-seo-contract.md`
- Contrato canonico de `contact` y `mail`: `docs/fastapi-contact-contract.md`

## Estado actual de contenido

- El contenido visible del frontend ya no depende de `GET /v1/site` ni de `GET /v1/pricing` en runtime.
- La fuente actual de contenido es un snapshot local congelado en `src/infrastructure/content/siteSnapshot.datamaq.ts`.
- La configuracion visible del frontend se resuelve desde `src/infrastructure/config/publicConfig.ts`, sin `runtimeProfiles.json`.
- Los endpoints `site` y `pricing` quedan como referencia de backend/documentacion historica, no como requisito de render del frontend.

## Comandos

```bash
npm install
npm run dev
npm run build -- <target>
npm run build:local
npm run typecheck
npm run test
npm run test:e2e:smoke
```

`npm run build:local` limpia solo los artefactos del frontend en `C:\AppServ\www`, compila ahi en modo `local-preview` y fuerza los endpoints backend a `http://127.0.0.1:8899/v1/...`.

## Flujo Local Recomendado

Para desarrollo interactivo:

```bash
npm run dev
```

- mantiene las llamadas API detras de `/api/v1/*` cuando Vite proxy o el entorno lo configuran asi
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
- Si necesitÃ¡s bypass excepcional: `HUSKY=0 git push`.

