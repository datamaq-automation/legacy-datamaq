# Decisiones Arquitectónicas Pendientes

*Este archivo contiene solo preguntas activas. Las resueltas se mueven a ADRs y se eliminan de aquí.*

---

### [2026-03-09] Refactor: Reducir complejidad de HomePage.ts
- **Contexto**: `src/ui/pages/HomePage.ts` tiene 267 líneas con la función `useHomePage` que maneja múltiples responsabilidades (mapeo de navegación, variantes de página, handlers de eventos, etc.)
- **Pregunta**: ¿Extraer helpers de mapeo a archivo separado (`src/ui/pages/homePageMappers.ts`) o mantener cohesión en un solo archivo?
- **Opciones consideradas**:
  - A) Extraer mapeadores a archivo separado
  - B) Mantener en archivo actual por cohesión funcional
  - C) Extraer a composables especializados (useHomeNavigation, useHomeVariant, etc.)
- **Impacto**: Alto - afecta la estructura del composable principal de la home
- **Bloquea otras tareas**: No
- **Decisión**: (pendiente)
- **ADR resultante**: (pendiente)

---

### [2026-03-09] Consolidación: Tipos SEO dispersos en múltiples archivos
- **Contexto**: Tipos y funciones SEO están distribuidas en 4 archivos: `src/domain/seo/types.ts`, `src/application/seo/defaultSeo.ts`, `src/ui/seo/appSeo.ts`, `src/ui/seo/defaultSeo.ts`
- **Pregunta**: ¿Consolidar en menos archivos o mantener separación por capas?
- **Opciones consideradas**:
  - A) Consolidar tipos en domain y funciones en application (eliminar duplicados en ui/)
  - B) Mantener separación actual por capas
  - C) Crear módulo SEO unificado con sub-módulos por capa
- **Impacto**: Alto - cross-cutting, afecta SEO de toda la aplicación
- **Bloquea otras tareas**: No
- **Decisión**: (pendiente)
- **ADR resultante**: (pendiente)

---

*Ver ADRs en `docs/decisions/` para historial de decisiones resueltas.*
