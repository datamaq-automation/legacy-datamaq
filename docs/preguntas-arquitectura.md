# Decisiones Arquitectónicas Pendientes

*Este archivo contiene solo preguntas activas. Las resueltas se mueven a ADRs y se eliminan de aquí.*

---

### [2026-03-08] División de ContentRepository (15+ interfaces)
- **Contexto**: ContentRepository implementa 15+ interfaces (ContentPort, SiteSnapshotPort, NavbarContentPort, etc.)
- **Pregunta**: ¿Dividir en repositorios especializados o mantener mega-repository?
- **Opciones consideradas**:
  - A) Dividir: ContentRepository, SiteRepository, BrandRepository, etc.
  - B) Usar composición: Repository delega a servicios especializados
  - C) Mantener mega-repository (documentar que es intencional)
- **Impacto**: Arquitectura, mantenibilidad, complejidad
- **Decisión**: (pendiente)
- **ADR resultante**: (pendiente)

---

### [2026-03-08] Reducción de Archivos TypeScript Grandes
- **Contexto**: quoteApiGateway.ts (349 líneas), contactHooks.ts (254 líneas)
- **Pregunta**: ¿Refactorizar estos archivos extrayendo funciones o mantener por cohesión?
- **Opciones consideradas**:
  - A) Extraer helpers/utilidades a archivos separados
  - B) Mantener cohesión, dividir solo si crecen más
  - C) Reorganizar por feature/funcionalidad
- **Impacto**: Mantenibilidad, legibilidad
- **Decisión**: (pendiente)
- **ADR resultante**: (pendiente)
