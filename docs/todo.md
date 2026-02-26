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

- [>] Hardening backend PHP posterior a auditoria (ciberseguridad + arquitectura + SOLID).

## P0 (seguridad y operacion)

- [ ] **Corregir exposicion de codigo fuente PHP en entorno dev/proxy**
  - Evidencia observada: `pricing.php` retornando `<?php ...` en vez de JSON cuando no pasa por handler PHP.
  - Accion: asegurar que todos los endpoints `/api/*.php` se ejecuten via PHP (en dev y despliegue).

- [ ] **Agregar rate limit basico por IP/request-id en `contact.php`, `mail.php`, `quote/diagnostic.php`**
  - Riesgo: abuso/spam y denegacion de servicio de bajo costo.
  - Accion: umbral por ventana (ej. token bucket simple) + respuesta `429`.

- [ ] **Definir politica de CORS explicita y consistente**
  - Estado actual: `OPTIONS` responde 204 pero sin cabeceras CORS centralizadas.
  - Accion: helper en `_bootstrap.php` para `Access-Control-Allow-Origin`, `Methods`, `Headers`.

- [ ] **Unificar `request_id` en todos los endpoints**
  - Estado actual: `contact.php` y `mail.php` devuelven `test-contact-*`/`test-mail-*` en lugar de `dmq_request_id()`.
  - Accion: estandarizar para trazabilidad y correlacion en logs.

## P1 (arquitectura limpia, SOLID, mantenibilidad)

- [ ] **Separar contenido de `content.php` en proveedor/repositorio dedicado**
  - Estado actual: payload extenso embebido en una sola funcion (`dmq_build_app_content`).
  - Accion: mover a `ContentProvider` por marca (SRP), mantener endpoint como adaptador HTTP.

- [ ] **Extraer validacion de input a funciones reutilizables**
  - Estado actual: validaciones repetidas en `contact.php`, `mail.php`, `quote/diagnostic.php`.
  - Accion: helpers comunes (`read_json_body`, `require_fields`, `validate_email`) en `_bootstrap.php`.

- [ ] **Centralizar headers de seguridad HTTP**
  - Accion: agregar en respuesta JSON/PDF headers base (`X-Content-Type-Options: nosniff`, `Referrer-Policy`, etc.).

## P2 (calidad de dominio y contratos)

- [ ] **Validar formato de email y limites de longitud en entradas**
  - Estado actual: solo presencia (`email` y `message` no vacios).
  - Accion: `filter_var(..., FILTER_VALIDATE_EMAIL)` + limites (`mb_strlen`) + normalizacion.

- [ ] **Versionar contrato de `pricing.php` con esquema explicito**
  - Estado actual: payload minimo con un unico campo.
  - Accion: incluir `version`, `currency`, y estructura preparada para mas tarifas sin romper clientes.

- [ ] **Agregar pruebas de contrato negativas y de seguridad**
  - Casos: method mismatch, JSON invalido, campos largos, caracteres de control, `quote_id` malicioso.

## P0 (backend como fuente unica de textos UI)

- [x] **Extender contrato de contenido remoto para cubrir textos de toda la UI**
  - [x] Alcance confirmado: incluir tambien textos de `ThanksView` y `DecisionFlowSection`.
  - [x] Estado actual confirmado: `AppContent` principal ya viene desde `GET /api/content.php` (v2) con fallback tecnico minimo.
  - [x] Definir contrato extendido para bloques UI adicionales (ej: `thanks`, `decisionFlow`) por target.
  - [x] Implementar payload extendido en `public/api/content.php` para `datamaq`, `upp`, `example`.
  - [x] Adaptar `src/ui/views/ThanksView.vue` para consumir textos desde repositorio/contenido remoto.
  - [x] Adaptar `src/ui/sections/DecisionFlowSection.vue` para consumir pasos y copy desde repositorio/contenido remoto.
  - [x] Eliminar hardcodes residuales de textos en esas vistas/sections.
  - [x] Agregar tests unitarios de contrato/consumo para `thanks` y `decisionFlow`.
