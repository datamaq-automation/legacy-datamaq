# Decisiones Arquitectonicas Pendientes

*Este archivo contiene solo preguntas activas. Las resueltas se mueven a ADRs y se eliminan de aqui.*

---

### [2026-03-14] Reestructuracion de dependencias en SubmitContactUseCase
- **Contexto**: `SubmitContactUseCase` inyecta 8 dependencias (servicio, gateway, monitor, location, navigator, bus, tracking, clock).
- **Pregunta**: ¿conviene agrupar dependencias transversales en facade/policy object o mantener inyeccion explicita actual?
- **Opciones consideradas**:
  1. Mantener firma actual por explicitud.
  2. Introducir facade de contexto runtime/telemetria.
  3. Dividir caso de uso en subcasos con responsabilidades mas acotadas.
- **Decision**: pendiente (escalado por impacto en arquitectura de aplicacion y testing).
- **ADR resultante**: pendiente.
