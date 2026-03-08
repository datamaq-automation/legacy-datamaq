---
name: code-audit
description: "Auditoria especializada de codigo fuente enfocada en tres pilares: Ciberseguridad frontend, Arquitectura Limpia (Clean Architecture) y principios SOLID. Analiza el directorio src/ detectando vulnerabilidades de seguridad, violaciones de arquitectura de capas, y problemas de diseno orientado a objetos. Modo preventivo: solo lista hallazgos en docs/todo.md sin ejecutar fixes automaticos. Usar cuando se necesite evaluar calidad de codigo, seguridad de la aplicacion, o antes de refactorizaciones importantes."
---
# AuditorÃ­a de CÃ³digo - Ciberseguridad, Arquitectura Limpia y SOLID

Skill especializado para auditorÃ­a de cÃ³digo fuente (`src/`) en tres dimensiones crÃ­ticas.

## Alcance de la AuditorÃ­a

**Solo cÃ³digo fuente:** `src/` directory

**NO incluye:**
- Configuraciones de build (vite.config.js, etc.)
- Scripts de deploy
- Workflows de CI/CD
- Dependencias externas (node_modules)

## Tres Pilares de AnÃ¡lisis

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Pilar 1: CIBERSEGURIDAD                                        â”‚
â”‚  â”œâ”€â”€ XSS (Cross-Site Scripting)                                 â”‚
â”‚  â”œâ”€â”€ Secrets/API keys hardcodeados                              â”‚
â”‚  â”œâ”€â”€ Uso inseguro de storage (localStorage/sessionStorage)      â”‚
â”‚  â”œâ”€â”€ v-html peligroso en Vue                                    â”‚
â”‚  â””â”€â”€ ValidaciÃ³n de inputs                                       â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  Pilar 2: ARQUITECTURA LIMPIA                                   â”‚
â”‚  â”œâ”€â”€ Violaciones de capas (domain â†’ infra, etc.)                â”‚
â”‚  â”œâ”€â”€ Dependencias circulares entre mÃ³dulos                      â”‚
â”‚  â”œâ”€â”€ Acoplamiento alto entre clases/componentes                 â”‚
â”‚  â”œâ”€â”€ Falta de inversiÃ³n de dependencias                         â”‚
â”‚  â””â”€â”€ ExposiciÃ³n de detalles de implementaciÃ³n                   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  Pilar 3: PRINCIPIOS SOLID                                      â”‚
â”‚  â”œâ”€â”€ S - Single Responsibility (clases gigantes)                â”‚
â”‚  â”œâ”€â”€ O - Open/Closed (modificaciÃ³n vs extensiÃ³n)                â”‚
â”‚  â”œâ”€â”€ L - Liskov Substitution (herencias incorrectas)            â”‚
â”‚  â”œâ”€â”€ I - Interface Segregation (interfaces gordas)              â”‚
â”‚  â””â”€â”€ D - Dependency Inversion (dependencias concretas)          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## MetodologÃ­a: Preventiva

**IMPORTANTE:** Este skill opera en modo **preventivo**:
- ðŸ”´ **NO ejecuta fixes automÃ¡ticos**
- ðŸ”´ **NO modifica cÃ³digo**
- ðŸŸ¢ **Solo detecta y lista en `docs/todo.md`**

El usuario decide quÃ© fixes aplicar y cuÃ¡ndo.

## Flujo de Trabajo

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  1. DISCOVER - Identificar archivos en src/                     â”‚
â”‚     â”œâ”€â†’ Archivos TypeScript (.ts)                               â”‚
â”‚     â”œâ”€â†’ Componentes Vue (.vue)                                  â”‚
â”‚     â”œâ”€â†’ Tests (.test.ts, .spec.ts)                              â”‚
â”‚     â””â”€â†’ ConfiguraciÃ³n de imports/rutas                          â”‚
â”‚     â†“                                                           â”‚
â”‚  2. ANALYZE - Tres pasadas de anÃ¡lisis                          â”‚
â”‚     â”œâ”€â†’ Pasada 1: Ciberseguridad                                â”‚
â”‚     â”œâ”€â†’ Pasada 2: Arquitectura Limpia                           â”‚
â”‚     â””â”€â†’ Pasada 3: Principios SOLID                              â”‚
â”‚     â†“                                                           â”‚
â”‚  3. CLASSIFY - Clasificar hallazgos                             â”‚
â”‚     â”œâ”€â†’ ðŸ”´ CRÃTICO: Vulnerabilidades de seguridad activas       â”‚
â”‚     â”œâ”€â†’ ðŸŸ¡ ADVERTENCIA: Violaciones de arquitectura/SOLID       â”‚
â”‚     â””â”€â†’ ðŸŸ¢ MEJORA: Code smells, deuda tÃ©cnica                   â”‚
â”‚     â†“                                                           â”‚
â”‚  4. OUTPUT - Generar docs/todo.md                               â”‚
â”‚     â””â”€â†’ Tareas organizadas por pilar y severidad                â”‚
â”‚     â†“                                                           â”‚
â”‚  5. REPORT - Resumen al usuario                                 â”‚
â”‚     â””â”€â†’ EstadÃ­sticas, prioridades, recomendaciones              â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## CategorÃ­as de Hallazgos

### ðŸ”´ CRÃTICO - Seguridad

**XSS (Cross-Site Scripting):**
- Uso de `v-html` sin sanitizaciÃ³n
- `innerHTML` sin escape
- URLs dinÃ¡micas sin validaciÃ³n

**Secrets expuestos:**
- API keys en cÃ³digo
- Tokens hardcodeados
- Credenciales en comentarios

**Storage inseguro:**
- `localStorage` para datos sensibles
- Sin encriptaciÃ³n en storage
- Keys predecibles en storage

**Inputs no validados:**
- Formularios sin validaciÃ³n Zod
- Datos de API sin verificaciÃ³n de tipo
- Props de componentes sin tipado estricto

### ðŸŸ¡ ADVERTENCIA - Arquitectura Limpia

**Violaciones de capas:**
- `domain` importando de `application`
- `domain` importando de `infrastructure`
- `domain` importando de `ui`

**Dependencias circulares:**
- A â†’ B â†’ A
- Importaciones mutuas entre mÃ³dulos

**Acoplamiento alto:**
- Clases con >5 dependencias inyectadas
- Componentes Vue con >10 props
- Funciones con >5 parÃ¡metros

**InversiÃ³n de dependencias:**
- Dependencias concretas en lugar de abstracciones
- Falta de interfaces/ports

### ðŸŸ¢ MEJORA - SOLID

**S - Single Responsibility:**
- Clases >300 lÃ­neas
- Funciones >50 lÃ­neas
- Componentes Vue >400 lÃ­neas

**O - Open/Closed:**
- ModificaciÃ³n de cÃ³digo existente para nuevas features
- Switch statements que crecen

**L - Liskov Substitution:**
- Herencias que rompen comportamiento base
- Overrides que no respetan contrato

**I - Interface Segregation:**
- Interfaces con >5 mÃ©todos
- Props que reciben objetos completos cuando solo usan 2 campos

**D - Dependency Inversion:**
- Importaciones directas de implementaciones
- Falta de inyecciÃ³n en composables Vue

## Formato de Output en docs/todo.md

```markdown
# Agenda de Tareas de CÃ³digo (`docs/todo.md`)

## ðŸ”´ CRÃTICO - Seguridad

### XSS y SanitizaciÃ³n
- [ ] [CRÃTICO] Uso de v-html sin sanitizaciÃ³n en UserProfile.vue
  - **Archivo**: `src/ui/components/UserProfile.vue` (lÃ­nea 45)
  - **Problema**: `v-html="user.bio"` permite inyecciÃ³n de scripts
  - **Riesgo**: XSS - robo de sesiones, defacement
  - **SoluciÃ³n**: Usar librerÃ­a de sanitizaciÃ³n (DOMPurify) o mostrar como texto plano
  - **Prioridad**: Inmediata - expone a todos los usuarios

### Secrets
- [ ] [CRÃTICO] API key hardcodeada en analytics adapter
  - **Archivo**: `src/infrastructure/analytics/gtagAdapter.ts` (lÃ­nea 12)
  - **Problema**: `const API_KEY = "ga-123456789"`
  - **Riesgo**: ExposiciÃ³n de credenciales en repositorio pÃºblico
  - **SoluciÃ³n**: Mover a variables de entorno (.env)
  - **Prioridad**: Inmediata - rotar key despuÃ©s de mover

## ðŸŸ¡ ADVERTENCIA - Arquitectura Limpia

### Violaciones de Capas
- [ ] [ADVERTENCIA] Domain importando de Infrastructure
  - **Archivo**: `src/domain/contact/email.ts` (lÃ­nea 3)
  - **Problema**: `import { httpClient } from '@/infrastructure/http/client'`
  - **ViolaciÃ³n**: Domain no puede depender de Infrastructure
  - **SoluciÃ³n**: Usar Port (interface) definida en domain, implementada en infrastructure
  - **Prioridad**: Alta - refactorizaciÃ³n estructural

### Dependencias Circulares
- [ ] [ADVERTENCIA] Ciclo entre contact y quote modules
  - **Archivo**: `src/features/contact/ui/useContact.ts` â†’ `src/features/quote/ui/useQuote.ts` â†’ ciclo
  - **Problema**: Importaciones mutuas dificultan testing y mantenimiento
  - **SoluciÃ³n**: Extraer lÃ³gica comÃºn a tercer mÃ³dulo o usar eventos
  - **Prioridad**: Media - complejidad creciente

## ðŸŸ¢ MEJORA - Principios SOLID

### Single Responsibility
- [ ] [MEJORA] ContactFormSection.vue excede lÃ­neas recomendadas
  - **Archivo**: `src/ui/features/contact/ContactFormSection.vue`
  - **Problema**: 694 lÃ­neas (recomendado <400)
  - **Sugerencia**: Extraer composable `useContactForm` y sub-componentes
  - **Prioridad**: Baja - mejora de mantenibilidad
```

## HeurÃ­sticas de DetecciÃ³n

### Ciberseguridad

```typescript
// ðŸ”´ CRÃTICO: v-html sin sanitizaciÃ³n
<div v-html="userInput"></div>

// ðŸ”´ CRÃTICO: innerHTML
element.innerHTML = dynamicContent;

// ðŸ”´ CRÃTICO: API key en cÃ³digo
const API_KEY = "hardcoded-key";

// ðŸŸ¡ ADVERTENCIA: localStorage para datos sensibles
localStorage.setItem("token", authToken);

// ðŸŸ¡ ADVERTENCIA: eval o Function constructor
const result = eval(userCode);
```

### Arquitectura Limpia

```typescript
// ðŸ”´ VIOLACIÃ“N: Domain importando de Infrastructure
// src/domain/entidad.ts
import { httpClient } from '@/infrastructure/http/client'; // âŒ

// âœ… CORRECTO: Domain define Port (interface)
// src/domain/ports/httpPort.ts
export interface HttpPort { ... }

// src/infrastructure/http/client.ts
import type { HttpPort } from '@/domain/ports/httpPort';
export const httpClient: HttpPort = { ... };
```

### SOLID - Single Responsibility

```typescript
// ðŸŸ¢ MEJORA: Clase/F funciÃ³n con mÃºltiples responsabilidades
class UserManager {
  createUser() { }
  validateEmail() { }
  sendWelcomeEmail() { }
  logActivity() { }
  updateAnalytics() { }
}
// 5 responsabilidades - sugerir separar en servicios
```

## Checklist de AuditorÃ­a Completa

### Ciberseguridad
- [ ] Revisar todos los usos de `v-html` en componentes Vue
- [ ] Buscar `innerHTML`, `outerHTML` assignments
- [ ] Buscar patrones de API keys, tokens, secrets
- [ ] Revisar uso de localStorage/sessionStorage
- [ ] Validar sanitizaciÃ³n de inputs de usuario
- [ ] Verificar validaciÃ³n de datos de API externas

### Arquitectura Limpia
- [ ] Ejecutar `npm run lint:layers` y revisar violaciones
- [ ] Analizar imports de `domain/` (no debe importar de app/infra/ui)
- [ ] Detectar importaciones circulares (A â†’ B â†’ A)
- [ ] Contar dependencias por clase/componente (>5 es advertencia)
- [ ] Verificar uso de Ports/Interfaces vs implementaciones concretas

### SOLID
- [ ] Medir lÃ­neas por clase (>300 es advertencia)
- [ ] Medir lÃ­neas por funciÃ³n (>50 es advertencia)
- [ ] Contar props de componentes Vue (>10 es advertencia)
- [ ] Detectar switch statements extensos (violaciÃ³n de OCP)
- [ ] Revisar herencias que modifican comportamiento base (LSP)
- [ ] Detectar interfaces gordas (>5 mÃ©todos)

### DocumentaciÃ³n
- [ ] Generar `docs/todo.md` con hallazgos
- [ ] Clasificar por severidad (ðŸ”´ðŸŸ¡ðŸŸ¢)
- [ ] Incluir archivo, lÃ­nea, problema, soluciÃ³n, prioridad
- [ ] Presentar resumen al usuario con estadÃ­sticas

## Modo Preventivo - IMPORTANTE

**Este skill NUNCA:**
- âŒ Modifica cÃ³digo automÃ¡ticamente
- âŒ Ejecuta fixes sin confirmaciÃ³n del usuario
- âŒ Refactoriza estructuras
- âŒ Mueve archivos entre carpetas

**Este skill SIEMPRE:**
- âœ… Detecta y lista problemas
- âœ… Sugiere soluciones especÃ­ficas
- âœ… Prioriza por riesgo e impacto
- âœ… Respeta la decisiÃ³n final del usuario

## Uso del Skill

El usuario activa este skill manualmente cuando necesita:

1. **Antes de un release importante**: "Audita el cÃ³digo antes del deploy"
2. **Al onboarding de nuevos desarrolladores**: "Muestra el estado de la arquitectura"
3. **Antes de una refactorizaciÃ³n**: "QuÃ© deberÃ­a mejorar antes de cambiar X"
4. **PeriÃ³dicamente**: "Audita la seguridad del cÃ³digo"

**IntegraciÃ³n:** Skill independiente. No se activa automÃ¡ticamente.

