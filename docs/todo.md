# TODO - Backlog activo

## Leyenda de estado

- `[x]` tarea finalizada
- `[>]` tarea en proceso
- `[ ]` tarea pendiente

## Referencia

- Tareas finalizadas: `docs/todo.done.md`

## Estado

- [x] Bloques completados migrados a `docs/todo.done.md`.

## Backlog

## P1 (arquitectura limpia + SOLID)

- [ ] **Definir puertos/interfaces explícitos entre capas**
  - [ ] Prohibir dependencia de `use_cases` hacia framework/Laravel en reglas de arquitectura.

- [ ] **Formalizar capa de contratos de API (Request/Response DTO)**
  - [ ] Definir DTOs de request por endpoint (`contact`, `mail`, `quote/diagnostic`) con validación declarativa.
  - [ ] Definir Resources de respuesta tipados por endpoint (incluyendo `quote/pdf` metadata) para eliminar arrays ad-hoc.

- [ ] **Eliminar dependencias implícitas globales tipo `$_SERVER` en servicios**
  - [ ] Inyectar contexto HTTP explícito en servicios/middleware para facilitar port a Laravel middleware/request lifecycle.

## P1 (`/api/v1/content` - calidad de contrato y mantenibilidad)

- [ ] **Separar construcción de contenido por responsabilidades (SRP)**
  - [ ] Dividir `content_provider.php` en builders por bloque (`hero`, `services`, `about`, `contact`, `decisionFlow`, `thanks`).
  - [ ] Extraer configuración por marca a estructura dedicada para evitar duplicación y condicionales dispersos.
  - [ ] Mantener `_content_impl.php` como adaptador HTTP delgado (sin lógica de negocio/armado de payload).

- [ ] **Formalizar contrato de salida de `content`**
  - [ ] Definir un Resource/DTO de salida para `content` (con `request_id`, `brand_id`, `version`, `data`).
  - [ ] Incorporar validación de shape server-side previa a responder para evitar publicar payload inválido.

- [ ] **Alinear arquitectura `content` al patrón clean (como `contact`)**
  - [ ] Introducir `use_case` de lectura de contenido con puertos explícitos (input/output boundary).
  - [ ] Mover acceso a fuente de contenido a gateway y mantener controller/presenter como adaptadores.
  - [ ] Evitar dependencia directa de `_content_impl.php` hacia builder concreto.

## P2 (`/api/v1/content` - resiliencia y DevOps)

- [ ] **Observabilidad del endpoint `content`**
  - [ ] Agregar alerta operativa básica sobre errores 5xx y respuestas inválidas de contrato en `content`.

- [ ] **Fortalecer cobertura de contratos de `content`**
  - [ ] Agregar pruebas de consistencia del contrato por marca (`datamaq`, `upp`, `example`).
  - [ ] Agregar prueba negativa para payload incompleto/no válido antes de exponer respuesta.

- [ ] **Clarificar estado de fallback en cliente (`DynamicContentService`)**
  - [ ] Separar señal de “contenido no disponible” vs “contenido degradado (solo `hero.title`)”.
  - [ ] Ajustar telemetría frontend para distinguir fallback local, snapshot completo y fallback parcial.

## P1 (`/api/v1/contact` + Chatwoot)

- [x] Integrar despacho a Chatwoot desde backend (`Application API`) preservando contrato `POST /api/v1/contact` actual.
- [x] Agregar gateway de salida de Chatwoot en `use_cases` de `contact`.
- [x] Externalizar configuración sensible (`CHATWOOT_BASE_URL`, `CHATWOOT_ACCOUNT_ID`, `CHATWOOT_INBOX_ID`, `CHATWOOT_API_ACCESS_TOKEN`).
- [ ] Cubrir contrato y errores (`auth`, `timeout/network`) con tests.

## Análisis aplicado (`contact` + Chatwoot)

- [x] **Certezas de buenas prácticas**
  - [x] Backend-only para integración Chatwoot (evita exponer secretos en frontend).
  - [x] Mantener contrato HTTP actual de `POST /api/v1/contact` para no romper frontend/E2E.
  - [x] Aislar Chatwoot detrás de gateway/puerto (facilita migración a Laravel y pruebas).

- [x] **Certezas de DevOps**
  - [x] Configuración por entorno vía variables (`CHATWOOT_*`) sin hardcode en repo.
  - [x] Logs estructurados con `request_id` y resultado de despacho a Chatwoot.
  - [x] Pruebas de contrato + mocks para CI (sin dependencia dura de Chatwoot externo).

- [ ] **Duda de diseño operativo**
  - [x] Definir estrategia de inbox: por marca (`datamaq`/`upp`/`example`) o inbox único con segmentación por `custom_attributes`.
  - [x] Definir tenancy Chatwoot por marca: **cuentas distintas** (account_id y token por marca).

## Buenas prácticas: inbox por marca vs inbox único

- [x] **Certezas (inbox por marca)**
  - [x] Mejor separación de dominios de negocio y menor riesgo de mezcla de leads entre marcas.
  - [x] Permisos/roles más simples de auditar por equipo o unidad comercial.
  - [x] Reportería más limpia por marca sin depender de filtros manuales.
  - [x] Menor impacto de error de configuración cruzada entre marcas.

- [x] **Desventajas (inbox por marca)**
  - [x] Mayor sobrecarga operativa (más inboxes, reglas y monitoreo).
  - [x] Configuración inicial más extensa en entornos múltiples.

- [x] **Certezas (inbox único + segmentación)**
  - [x] Menor costo de operación inicial y onboarding más rápido.
  - [x] Centraliza automatizaciones en un solo punto.

- [x] **Desventajas (inbox único + segmentación)**
  - [x] Mayor riesgo de errores humanos en etiquetado/ruteo.
  - [x] Riesgo de fuga de contexto entre marcas si fallan reglas de segmentación.
  - [x] Auditoría y cumplimiento más frágiles al depender de disciplina operativa.

## Implementación objetivo confirmada (inbox por marca)

- [x] **Archivos involucrados identificados**
  - [x] Frontend DI/config y gateway:
    - `src/di/container.ts`
    - `src/infrastructure/contact/contactApiGateway.ts`
    - `src/application/contact/contactEndpointPolicy.ts`
    - `src/infrastructure/content/runtimeProfiles.json`
  - [x] Backend `contact` (clean architecture in-place):
    - `public/api/_contact_impl.php`
    - `public/api/interface_adapters/controllers/contact_controller.php`
    - `public/api/use_cases/submit_contact.php`
    - `public/api/interface_adapters/gateways/contact_rate_limit_gateway.php`
    - `public/api/interface_adapters/gateways/contact_validation_gateway.php`

- [x] **Evaluación de arquitectura limpia + SOLID (certezas)**
  - [x] `_contact_impl.php` ya es adaptador HTTP delgado (alineado).
  - [x] `DmqSubmitContactInteractor` cumple SRP para validación/rate-limit, pero aún no modela salida a proveedor externo.
  - [x] Para integrar Chatwoot correctamente falta puerto de salida (DIP): `use_case` no debe conocer HTTP/SDK Chatwoot.
  - [x] `contact_controller.php` instancia dependencias concretas; conviene mover wiring a composition root/factory para mejorar OCP y testabilidad.
  - [x] `chatwootPublicContactChannel.ts` en frontend no es ruta objetivo productiva; mantener integración Chatwoot en backend evita exposición de secretos.

- [ ] **Refactor recomendado antes de integrar Chatwoot (alta certeza)**
  - [x] Crear puerto de salida `contact_dispatch_gateway_port` para envío de contacto.
  - [x] Inyectar gateway de despacho en `DmqSubmitContactInteractor` y ejecutar envío tras validación.
  - [x] Implementar adaptador de infraestructura `chatwoot_application_api_gateway` (HTTP + token).
  - [x] Resolver `account_id`, `inbox_id` y `api_access_token` por `brand_id` en backend (tenancy por cuenta separada).
  - [x] Mantener respuesta externa de `POST /api/v1/contact` sin cambios (`202` + `request_id`).
  - [ ] Agregar tests de contrato y de unidad para:
    - éxito de despacho,
    - fallo `401/403` Chatwoot,
    - timeout/reintento controlado.
