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
  - [x] Crear contratos de entrada/salida de `use_cases` (input/output boundaries).
  - [x] Definir contratos de gateway consumidos por `use_cases` e implementados en `interface_adapters/gateways` o `infrastructure`.
  - [ ] Prohibir dependencia de `use_cases` hacia framework/Laravel en reglas de arquitectura.

- [ ] **Separar responsabilidades del módulo `_bootstrap.php`**
  - [ ] Extraer CORS/security headers a módulo dedicado.
  - [ ] Extraer request context (`request_id`, logging, timing) a módulo dedicado.
  - [ ] Extraer validaciones/rate-limit a módulos específicos para reducir acoplamiento global.

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

- [ ] **Agregar versionado operativo del contenido**
  - [x] Exponer `content_revision` o `last_modified` en respuesta para trazabilidad de despliegues.
  - [ ] Registrar logs estructurados de versión de contenido servida por `request_id`.

- [ ] **Observabilidad del endpoint `content`**
  - [ ] Registrar en logs estructurados: `request_id`, `brand_id`, `content_revision`, `status`, `duration_ms`.
  - [ ] Agregar alerta operativa básica sobre errores 5xx y respuestas inválidas de contrato en `content`.

- [ ] **Fortalecer cobertura de contratos de `content`**
  - [x] Validar metadatos base del endpoint (`request_id`, `brand_id`, `version`) en test de contrato.
  - [x] Validar rechazo de método no permitido (`POST` -> `405 METHOD_NOT_ALLOWED`) para `content`.
  - [ ] Agregar pruebas de consistencia del contrato por marca (`datamaq`, `upp`, `example`).
  - [ ] Agregar prueba negativa para payload incompleto/no válido antes de exponer respuesta.

- [ ] **Clarificar estado de fallback en cliente (`DynamicContentService`)**
  - [ ] Separar señal de “contenido no disponible” vs “contenido degradado (solo `hero.title`)”.
  - [ ] Ajustar telemetría frontend para distinguir fallback local, snapshot completo y fallback parcial.

## P2 (`/api/v1/content` - decisión operativa de disponibilidad)

- [x] **Criterios técnicos confirmados (buenas prácticas + DevOps)**
  - [x] Mantener validación estricta del contrato antes de exponer respuesta (`shape` válido o rechazo controlado).
  - [x] Mantener `content_revision` como identificador de release de contenido para trazabilidad.
  - [x] Priorizar degradación controlada en cliente (fallback local existente) para evitar caída total de UX por fallo remoto.
  - [x] Tratar respuestas inválidas de `content` como incidente observable (logs/alerta), no como éxito silencioso.

- [ ] **Decisión pendiente de estrategia de respuesta backend cuando el payload de origen falla validación**
  - [ ] Opción A (consistencia estricta): responder `5xx` y delegar completamente en fallback cliente.
  - [ ] Opción B (alta disponibilidad): responder `200` con snapshot server-side de último contenido válido (LKG).

## Análisis (buenas prácticas + DevOps) aplicado

- [x] **Certezas de arquitectura**
  - [x] `Fail-fast` (A) reduce deuda técnica oculta: evita normalizar respuestas inválidas y fuerza corrección temprana.
  - [x] `Best-effort` con LKG (B) mejora continuidad operativa: baja impacto visible al usuario ante incidentes de datos.
  - [x] En ambos casos, el contrato debe permanecer estable (`request_id`, `brand_id`, `version`, `content_revision`).

- [x] **Certezas de operación**
  - [x] Definir SLI de `content` por separado: tasa de `2xx`, latencia p95, tasa de fallback cliente.
  - [x] Alertar por degradación sostenida (no solo por caída total) para detectar incidentes silenciosos.
  - [x] Mantener test de contrato en CI como gate obligatorio para despliegue.

- [ ] **Duda estratégica no técnica**
  - [ ] Seleccionar prioridad principal del servicio: consistencia fuerte (A) vs disponibilidad máxima (B).

## Plan de implementación segura (certezas)

- [x] **Evitar decisión irreversible temprana**
  - [x] Introducir modo de estrategia configurable por entorno (`CONTENT_FAILURE_MODE=A|B`) para habilitar rollout gradual.
  - [x] Mantener mismo contrato HTTP de `content` en ambos modos para no romper frontend.

- [x] **Reducir riesgo operativo en despliegues**
  - [x] Activar primero en no productivo con comparación de métricas A/B (error-rate, fallback-rate, p95).
  - [x] Definir criterio de salida del experimento antes de pasar a producción (umbral de error y degradación).

- [x] **Buenas prácticas de mantenimiento**
  - [x] Documentar runbook de incidente para `content` (detección, mitigación, rollback de estrategia).
  - [x] Registrar decisión final en ADR para preservar contexto técnico y de negocio.

## Matriz de decisión (certezas)

- [x] **Opción A - consistencia estricta (`5xx` ante payload inválido)**
  - [x] Ventajas: contrato fuerte, detección temprana, menor riesgo de servir contenido obsoleto.
  - [x] Desventajas: más errores visibles al usuario durante incidentes.
  - [x] Riesgo principal: caída percibida de disponibilidad aun cuando exista fallback cliente.

- [x] **Opción B - disponibilidad alta (`200` con último snapshot válido)**
  - [x] Ventajas: continuidad de servicio, mejor experiencia durante fallas de origen.
  - [x] Desventajas: mayor complejidad operativa y riesgo de “stale content”.
  - [x] Riesgo principal: degradación silenciosa si alertas/telemetría no son estrictas.

- [x] **Señales DevOps obligatorias para cualquier opción**
  - [x] Dashboard con `content_error_rate`, `fallback_rate`, `stale_age_minutes`, `p95_latency`.
  - [x] Alertas por umbral: degradación sostenida > 15 min y `stale_age_minutes` fuera de política.
  - [x] Gate de CI con contrato `content` + smoke E2E de carga de contenido.
