# Decisiones Arquitectónicas Pendientes

*Este archivo contiene solo preguntas activas. Las resueltas se mueven a ADRs y se eliminan de aquí.*

---

### [2026-03-08] Refactorización de Inyección de Dependencias en ContentRepository
- **Contexto**: ContentRepository inicializa implementaciones concretas (NoopLogger, FetchHttpClient) en el constructor con valores por defecto
- **Pregunta**: ¿Cómo refactorizar para eliminar dependencias concretas del constructor y usar inyección pura vía DI container?
- **Opciones consideradas**: 
  - A) Eliminar defaults y forzar inyección completa
  - B) Usar factory pattern con container
  - C) Mantener como está (documentar decisión consciente)
- **Impacto**: Cross-cutting (afecta infraestructura y container DI)
- **Decisión**: (pendiente)
- **ADR resultante**: (pendiente)

---

### [2026-03-08] Refactorización de Componentes Vue Grandes - HomePage.vue
- **Contexto**: HomePage.vue tiene 1124 líneas (~50 script, ~390 template, ~680 estilos)
- **Pregunta**: ¿Extraer sub-componentes (HomeHero, HomeProfile, HomeServices, HomeFaq) o mantener monolito por simplicidad?
- **Opciones consideradas**:
  - A) Extraer 4 sub-componentes con sus propios estilos
  - B) Mantener monolito, extraer solo composables
  - C) Extraer solo la parte de estilos a SCSS separado
- **Impacto**: UI/UX, mantenibilidad, bundle size
- **Decisión**: (pendiente)
- **ADR resultante**: (pendiente)

---

### [2026-03-08] Refactorización de ContactFormSection.vue
- **Contexto**: ContactFormSection.vue tiene 641 líneas con formulario multi-paso
- **Pregunta**: ¿Cómo dividir el componente manteniendo la lógica de pasos intacta?
- **Opciones consideradas**:
  - A) Extraer ContactStepper.vue + ContactFormStep[n].vue
  - B) Extraer solo el stepper, mantener pasos inline
  - C) Mantener monolito, mejorar organización interna
- **Impacto**: UI/UX, testeabilidad
- **Decisión**: (pendiente)
- **ADR resultante**: (pendiente)

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
