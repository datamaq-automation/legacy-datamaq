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

- [ ] **Estructura objetivo clean architecture para migración a Laravel**
  - [ ] Estandarizar naming de carpeta en plural: `interface_adapters/` (evitar mezcla `interface_adapter` vs `interface_adapters`).
  - [ ] Definir estructura base objetivo:
  - [ ] `entities/`
  - [ ] `use_cases/`
  - [ ] `interface_adapters/controllers/`
  - [ ] `interface_adapters/presenters/`
  - [ ] `interface_adapters/gateways/`
  - [ ] `infrastructure/`

- [ ] **Definir puertos/interfaces explícitos entre capas**
  - [ ] Crear contratos de entrada/salida de `use_cases` (input/output boundaries).
  - [ ] Definir contratos de gateway consumidos por `use_cases` e implementados en `interface_adapters/gateways` o `infrastructure`.
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
