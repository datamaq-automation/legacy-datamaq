# Laravel Migration Target (Clean Architecture)

Fecha: 2026-02-27

## Decisión de naming (certeza)

- Usar **solo** `interface_adapters/` (plural).
- Evitar mezcla `interface_adapter` vs `interface_adapters`.

## Estructura objetivo (certeza)

```text
entities/
use_cases/
interface_adapters/
  controllers/
  presenters/
  gateways/
infrastructure/
```

## Responsabilidad por capa (certeza)

- `entities/`
  - Reglas de negocio puras.
  - Sin framework, sin I/O, sin DB/HTTP.
- `use_cases/`
  - Orquesta casos de uso.
  - Depende de abstracciones (puertos), no de implementaciones.
- `interface_adapters/controllers/`
  - Traduce request HTTP -> input del caso de uso.
  - Sin lógica de dominio.
- `interface_adapters/presenters/`
  - Traduce output del caso de uso -> respuesta (JSON/DTO de salida).
- `interface_adapters/gateways/`
  - Implementaciones de puertos de salida (repositorios/APIs).
- `infrastructure/`
  - Detalles técnicos (framework, ORM, cliente HTTP, cache, logging).

## Reglas de dependencia (certeza)

- Dirección permitida:
  - `controllers -> use_cases`
  - `use_cases -> entities`
  - `use_cases -> ports (abstracciones)`
  - `gateways/infrastructure -> ports`
- Prohibido:
  - `use_cases` depende de Laravel/framework.
  - `entities` depende de cualquier adapter/infrastructure.

## Puertos mínimos recomendados (certeza de diseño)

- `use_cases/ports/input/`
  - contratos de entrada por caso de uso (input boundary)
- `use_cases/ports/output/`
  - contratos de salida por caso de uso (output boundary)
- `use_cases/ports/gateways/`
  - contratos de acceso a persistencia/servicios externos

## Criterio de migración incremental (certeza)

- Mantener endpoints actuales como adaptadores.
- Mover lógica de negocio a `use_cases` + `entities`.
- Reemplazar gradualmente implementaciones actuales con `gateways` e `infrastructure`.
- Mantener contrato HTTP estable durante la transición.
