# TODO - Escalado a 2 marcas / 2 FTPS / Backend PHP colocalizado

## Leyenda de estado

- `[x]` tarea finalizada
- `[>]` tarea en proceso
- `[ ]` tarea pendiente

## Referencia

- Tareas finalizadas: `docs/todo.done.md`

## P0 (bloqueantes para backend co-locado en produccion)

- [>] **Migrar backend operativo a `public/api/*.php` manteniendo contrato del frontend**
  - [ ] Crear `public/api/contact.php` (POST) con payload y codigos HTTP actuales.
  - [ ] Crear `public/api/mail.php` (POST) con payload y codigos HTTP actuales.
  - [ ] Crear `public/api/pricing.php` (GET) con `visita_diagnostico_hasta_2h_ars`.
  - [ ] Crear `public/api/quote/diagnostic.php` (POST) para generar cotizacion.
  - [ ] Crear `public/api/quote/pdf.php` (GET) para descargar PDF por `quote_id`.
  - [ ] Estandarizar respuestas de error (`request_id`, `error_code`, `detail`) en todos los endpoints.
  - [ ] Verificar que el pipeline de build/deploy publique correctamente los `.php` en FTPS.

## P1 (calidad y riesgo de regresion)

- [ ] **Cobertura E2E por target en CI**
  - Ejecutar smoke E2E para `datamaq` y `upp` en CI (job/matrix por target).

- [ ] **Pruebas de configuracion runtime de endpoints**
  - Agregar tests unitarios de `ViteConfig` para:
  - endpoints relativos (`/api/*.php`)
  - endpoints absolutos `https://...`
  - fallback legacy por `backendBaseUrl`.

- [ ] **Pruebas de contrato frontend <-> PHP**
  - Validar en tests los contratos de `contact`, `mail`, `pricing`, `quote/diagnostic`, `quote/pdf`.

## P2 (deuda tecnica)

- [ ] **Reducir responsabilidades de `ContentRepository`**
  - Separar parse/cache de contenido, pricing dinamico y normalizacion de navbar.
