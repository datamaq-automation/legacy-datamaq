---
name: skill-orchestrator
description: "Orquestador meta que audita otros skills, coordina el flujo completo de trabajo (audit→decisión→ejecución→documentación), detecta oportunidades de mejora en el ecosistema de skills, y mantiene la documentación sincronizada entre todos los skills. Actúa como 'skill de skills' para automatizar y optimizar todo el workflow de desarrollo."
---

# Skill Orchestrator - Meta-Skill de Automatización

Orquestador que coordina todos los otros skills, audita su efectividad, y automatiza el flujo completo de desarrollo desde la detección de problemas hasta la ejecución y documentación.

## Responsabilidades del Orchestrator

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  RESPONSABILIDAD 1: AUDITAR OTROS SKILLS                                   │
│  ├─→ Detectar duplicación de funcionalidad                                 │
│  ├─→ Identificar skills muy grandes para dividir                           │
│  ├─→ Encontrar skills pequeños para unificar                               │
│  ├─→ Optimizar circuitos entre skills                                      │
│  └─→ Proponer nuevos skills que falten                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  RESPONSABILIDAD 2: ORQUESTAR FLUJO COMPLETO                               │
│  ├─→ Ejecutar audits automáticamente                                       │
│  ├─→ Tomar decisiones de bajo nivel sin intervención                       │
│  ├─→ Escalar decisiones de alto nivel al usuario                           │
│  ├─→ Ejecutar cambios aprobados                                            │
│  └─→ Validar y commitear                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  RESPONSABILIDAD 3: MANTENER DOCUMENTACIÓN                                 │
│  ├─→ Sincronizar docs/todo.md entre skills                                 │
│  ├─→ Generar ADRs automáticamente                                          │
│  ├─→ Actualizar preguntas-arquitectura.md                                  │
│  ├─→ Consolidar todo.done.md                                               │
│  └─→ Generar reportes de progreso                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  RESPONSABILIDAD 4: OPTIMIZAR ECOSISTEMA                                   │
│  ├─→ Detectar gaps en cobertura de skills                                  │
│  ├─→ Proponer unificación de skills duplicados                             │
│  ├─→ Sugerir división de skills grandes                                    │
│  └─→ Recomendar mejoras en flujos entre skills                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Flujo de Trabajo Principal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  INICIO: Activación del Orchestrator                                        │
│     ↓                                                                       │
│  1. AUDITAR SKILLS EXISTENTES                                               │
│     ├─→ Leer todos los SKILL.md en .agents/skills/                         │
│     ├─→ Detectar duplicaciones de funcionalidad                            │
│     ├─→ Identificar skills grandes (>300 líneas)                           │
│     ├─→ Encontrar skills pequeños (<150 líneas)                            │
│     └─→ Analizar dependencias entre skills                                 │
│     ↓                                                                       │
│  2. AUDITAR CÓDIGO (si se solicita)                                         │
│     ├─→ Ejecutar code-audit                                                │
│     ├─→ Ejecutar frontend-best-practices-audit                             │
│     ├─→ Ejecutar ui-ux-audit (si aplica)                                   │
│     └─→ Consolidar hallazgos en docs/todo.md                               │
│     ↓                                                                       │
│  3. PROCESAR TAREAS (modo autónomo)                                         │
│     ├─→ Para cada tarea en docs/todo.md:                                   │
│     │   ├─→ ¿Certeza de bajo riesgo? → Ejecutar inmediatamente            │
│     │   ├─→ ¿Duda de bajo nivel? → Evaluar y decidir autónomamente        │
│     │   └─→ ¿Duda de alto nivel? → Escalar a usuario                      │
│     └─→ Validar cambios con typecheck/lint                                │
│     ↓                                                                       │
│  4. DOCUMENTAR Y CONSOLIDAR                                                 │
│     ├─→ Actualizar docs/todo.done.md                                       │
│     ├─→ Generar/actualizar ADRs si aplica                                  │
│     ├─→ Actualizar docs/decisions/ si aplica                               │
│     └─→ Generar reporte de actividad                                       │
│     ↓                                                                       │
│  5. OPTIMIZAR SKILLS (si se detectan mejoras)                               │
│     ├─→ Proponer unificación de skills                                     │
│     ├─→ Sugerir división de skills grandes                                 │
│     └─→ Recomendar mejoras en flujos                                       │
│     ↓                                                                       │
│  FIN: Validación final y commit                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Modos de Operación

### Modo 1: Auditoría Completa (Recomendado)
Ejecuta todos los audits, procesa tareas, y optimiza skills.

```
"Ejecuta el orchestrator en modo completo"
```

### Modo 2: Solo Procesar Tareas
Solo procesa docs/todo.md sin ejecutar audits.

```
"Ejecuta el orchestrator para procesar tareas pendientes"
```

### Modo 3: Solo Auditar Skills
Solo audita el ecosistema de skills sin tocar código.

```
"Audita los skills con el orchestrator"
```

### Modo 4: Solo Optimizar Documentación
Sincroniza y mejora docs/ sin ejecutar otros cambios.

```
"Optimiza documentación con el orchestrator"
```

## Análisis de Skills - Criterios

### Detección de Duplicación

```
⚠️ DUPLICACIÓN DETECTADA cuando:
- Dos skills auditan la misma capa del código
- Funcionalidad >70% similar entre skills
- Mismo output (docs/todo.md con mismas categorías)
- Ejemplo: code-audit + frontend-best-practices-audit (TypeScript)

✅ ACCIÓN: Proponer unificación o especialización clara
```

### Skills para Dividir

```
📦 DIVIDIR cuando:
- Skill >350 líneas
- Más de 5 pilares de análisis
- Múltiples responsabilidades no relacionadas
- Ejemplo: frontend-best-practices-audit (356 líneas, 5 pilares)

✅ ACCIÓN: Proponer división en 2+ skills especializados
```

### Skills para Unificar

```
🔗 UNIFICAR cuando:
- Skill <120 líneas
- Funcionalidad muy específica
- No justifica overhead de mantenimiento separado
- Ejemplo: docs-maintainer ya integrado en orchestrator

✅ ACCIÓN: Proponer absorción por skill más grande o unificación
```

### Detección de Gaps

```
🔍 GAP DETECTADO cuando:
- Hay docs/ sin skill que los mantenga
- Flujo tiene pasos manuales que podrían automatizarse
- No hay skill para tarea recurrente

✅ ACCIÓN: Proponer creación de nuevo skill
```

## Heurísticas de Decisión Autónoma

El Orchestrator puede decidir SIN consultar cuando:

| Tipo de Tarea | Criterio | Ejemplo |
|---------------|----------|---------|
| **Certeza** | Cambio mecánico, 1 archivo, <10 líneas | Agregar `:key` a v-for |
| **Duda Bajo Nivel** | 2-3 opciones claras, riesgo bajo, reversible | Elegir entre flex/grid |
| **Documentación** | Corrección de typos, formato | Fix markdown |

El Orchestrator DEBE consultar cuando:

| Tipo de Tarea | Criterio | Ejemplo |
|---------------|----------|---------|
| **Duda Alto Nivel** | Impacto cross-cutting, >3 archivos | Refactor arquitectura |
| **Unificación Skills** | Afecta ecosistema completo | Unificar 2 skills |
| **División Skill** | Cambia interfaz pública del skill | Dividir skill grande |
| **Nuevo Skill** | Inversión de tiempo significativa | Crear skill nuevo |

## Mantenimiento de Documentación

### Sincronización Automática

```typescript
// Ejemplo: Consolidar todos los todo.done.md
function consolidateDoneFiles(): void {
  const doneFiles = glob('docs/**/todo.done.md')
  const consolidated = mergeChronologically(doneFiles)
  writeFile('docs/todo.done.md', consolidated)
}

// Ejemplo: Generar índice de ADRs
function generateAdrIndex(): void {
  const adrs = glob('docs/decisions/ADR-*.md')
  const index = adrs.map(parseAdrMetadata)
  writeFile('docs/decisions/README.md', renderIndex(index))
}
```

### Reportes Generados

1. **Reporte de Actividad**: Qué se hizo, cuándo, por qué
2. **Reporte de Skills**: Estado del ecosistema de skills
3. **Reporte de Deuda Técnica**: TODOs, SOLID-DEBATEs, pendientes
4. **Reporte de Decisiones**: ADRs creados/modificados

## Integración con Otros Skills

### Skills que el Orchestrator Coordina

- `code-audit` → Detecta problemas de seguridad/arquitectura/SOLID
- `frontend-best-practices-audit` → Detecta problemas Vue/TS/UI/UX
- `decision-helper` → Ayuda con decisiones de alto nivel
- `todo-workflow` → Ejecuta tareas de bajo nivel
- `gh-actions-audit` → Audita CI/CD (opcional)
- `docs-maintainer` → Mantiene documentación sincronizada

### Flujo Automatizado

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Orchestrator │────▶│  code-audit  │────▶│ hallazgos   │
│  (coordina)  │     │             │     │ en todo.md  │
└─────────────┘     └─────────────┘     └──────┬──────┘
       │                                       │
       │         ┌─────────────────────────────┘
       │         │
       ▼         ▼
┌─────────────────────────┐
│  ¿Hay dudas de alto     │
│  nivel?                 │
└─────────────────────────┘
       │
       ├── SÍ ──▶ decision-helper ──▶ usuario decide ──▶ ADR
       │
       └── NO ──▶ Ejecutar cambios ──▶ Validar ──▶ Commit
```

## Estructura del Orchestrator

```
.agents/skills/skill-orchestrator/
├── SKILL.md                    # Este archivo
├── orchestrator.ts             # Lógica principal (si aplica)
├── analyzers/
│   ├── skill-analyzer.ts       # Analiza otros skills
│   ├── documentation-sync.ts   # Sincroniza docs/
│   └── workflow-optimizer.ts   # Optimiza flujos
└── templates/
    ├── skill-proposal.md       # Template para nuevos skills
    ├── unification-proposal.md # Template para unificar
    └── division-proposal.md    # Template para dividir
```

## Output del Orchestrator

### Reporte de Análisis de Skills

```markdown
## Análisis de Ecosistema de Skills

### Skills Existentes (7)
| Skill | Líneas | Estado | Recomendación |
|-------|--------|--------|---------------|
| code-audit | 306 | ✅ OK | Mantener - especialista seguridad/arquitectura |
| frontend-best-practices-audit | 361 | ⚠️ Grande | Considerar dividir si crece más |
| decision-helper | 310 | ✅ OK | Mantener - flujo decisiones arquitectura |
| todo-workflow | 348 | ✅ OK | Mantener - ejecución tareas |
| gh-actions-audit | 166 | ✅ OK | Mantener - especializado CI/CD |
| docs-maintainer | 339 | ✅ OK | Mantener - sincronización docs |
| skill-orchestrator | 356 | ✅ OK | Mantener - coordinador meta |

### Especialización Clara
- `code-audit` = Generalista: Ciberseguridad + Arquitectura Limpia + SOLID
- `frontend-best-practices-audit` = Especialista: Vue 3 + TypeScript + Naming + UI/UX
- `decision-helper` = Decisiones arquitectónicas de alto nivel
- `todo-workflow` = Ejecución de tareas certeza/duda bajo nivel
- `gh-actions-audit` = Diagnóstico CI/CD
- `docs-maintainer` = Sincronización documentación
- `skill-orchestrator` = Coordinación y optimización del ecosistema

### Gaps Detectados
- No hay skill para mantener documentación
- No hay skill para generar reportes
```

### Reporte de Ejecución

```markdown
## Actividad del Orchestrator - 2026-03-09

### Acciones Ejecutadas
1. ✅ Auditoría de skills completada
2. ✅ code-audit ejecutado (0 críticos)
3. ✅ frontend-best-practices-audit ejecutado (4 mejoras)
4. ✅ 2 tareas de bajo nivel ejecutadas
5. ✅ 3 tareas documentadas sin cambios
6. ✅ docs/todo.done.md actualizado

### Validaciones
- TypeScript: ✅ Sin errores
- Lint layers: ✅ 0 violaciones
- Tests: ✅ Pasaron (si aplica)

### Próximos Pasos Sugeridos
- Monitorizar tamaño de frontend-best-practices-audit (actual: 361 líneas)
- Evaluar si skills pequeños (<200 líneas) podrían integrarse en orchestrator
```

## Reglas de Oro

1. **Automatización > Intervención**
   - Preferir decidir autónomamente cuando sea seguro
   - Documentar decisiones para transparencia

2. **Transparencia Total**
   - Todo cambio queda registrado en docs/
   - El usuario puede revisar y revertir

3. **Mejora Continua**
   - El Orchestrator se audita a sí mismo
   - Propone mejoras a su propio funcionamiento

4. **Sin Sorpresas**
   - Cambios de alto impacto siempre consultan
   - Cambios de bajo impacto se ejecutan y documentan

## Checklist del Orchestrator

- [ ] Leer todos los skills existentes
- [ ] Detectar duplicaciones
- [ ] Identificar skills para dividir/unificar
- [ ] Ejecutar audits necesarios
- [ ] Procesar tareas de bajo nivel
- [ ] Escalar dudas de alto nivel
- [ ] Sincronizar documentación
- [ ] Generar reportes
- [ ] Validar todo el codebase
- [ ] Proponer mejoras al ecosistema

## Uso del Orchestrator

```bash
# Modo completo (recomendado)
"Ejecuta el orchestrator"

# Modos específicos
"Ejecuta el orchestrator para procesar tareas"
"Audita los skills con el orchestrator"
"Optimiza documentación con el orchestrator"
```

## Integración con Workflow General

El Orchestrator es el **punto de entrada principal** para todo el trabajo automatizado. Después de su ejecución, el estado ideal es:

- `docs/todo.md` vacío (o solo con dudas de alto nivel)
- `docs/todo.done.md` actualizado con todo el trabajo
- Código validado y funcional
- Documentación sincronizada
- Propuestas de mejora al ecosistema de skills
