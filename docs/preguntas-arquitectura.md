# Decisiones Arquitectonicas Pendientes

*Este archivo contiene solo preguntas activas. Las resueltas se mueven a ADRs y se eliminan de aqui.*

---

### [2026-03-14] Politica de almacenamiento de drafts con PII en contacto
- **Contexto**: el borrador del formulario de contacto persiste `firstName`, `lastName`, `company`, `email` y `phone` en `localStorage`.
- **Pregunta**: ¿se prioriza UX (persistencia larga) o privacy-by-default (sesion/TTL corto y minimizacion)?
- **Opciones consideradas**:
  1. Mantener `localStorage` actual.
  2. Migrar a `sessionStorage`.
  3. Mantener `localStorage` con TTL + minimizacion de campos.
- **Decision**: pendiente (escalado desde `docs/todo.md` por impacto de politica de datos).
- **ADR resultante**: pendiente.

### [2026-03-14] Estrategia de refactor para componentes de gran tamano
- **Contexto**: `HomePage.vue` (~1274 lineas) y `ContactFormSection.vue` (~695 lineas) concentran mucha logica/estructura.
- **Pregunta**: ¿se adopta un plan de modularizacion por secciones/composables en iteraciones o se mantiene cohesion actual hasta gatillar umbral?
- **Opciones consideradas**:
  1. Refactor incremental inmediato por secciones.
  2. Mantener como esta con limites de reconsideracion (umbral de lineas/complejidad).
  3. Refactor completo en una rama dedicada.
- **Decision**: pendiente (escalado por impacto transversal en multiples vistas/tests).
- **ADR resultante**: pendiente.

### [2026-03-14] Reestructuracion de dependencias en SubmitContactUseCase
- **Contexto**: `SubmitContactUseCase` inyecta 8 dependencias (servicio, gateway, monitor, location, navigator, bus, tracking, clock).
- **Pregunta**: ¿conviene agrupar dependencias transversales en facade/policy object o mantener inyeccion explicita actual?
- **Opciones consideradas**:
  1. Mantener firma actual por explicitud.
  2. Introducir facade de contexto runtime/telemetria.
  3. Dividir caso de uso en subcasos con responsabilidades mas acotadas.
- **Decision**: pendiente (escalado por impacto en arquitectura de aplicacion y testing).
- **ADR resultante**: pendiente.
