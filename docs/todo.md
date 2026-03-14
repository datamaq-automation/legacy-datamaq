# Agenda de Tareas de Codigo (`docs/todo.md`)

Auditoria `code-audit` sobre `src/` (2026-03-14, segunda pasada).

## Resumen Ejecutivo

- Hallazgos criticos: **0**
- Hallazgos de advertencia: **0** (+1 resuelta)
- Hallazgos de mejora: **0** (+1 resuelta)
- `npm run lint:layers`: **0 violaciones**
- `npm run lint:component-size`: **OK**
- `npm run lint:usecase-deps`: **OK**

## ADVERTENCIA - Calidad y Arquitectura

### 1) Literales de UI con mojibake (encoding inconsistente)
- [x] [ADVERTENCIA] Corregir textos con codificacion corrupta en formulario de contacto
- **Archivo**: `src/ui/features/contact/ContactFormSection.vue`
- **Problema**: textos visibles con encoding corrupto (`DescripciÃ³n`, `ElegÃ­`, `ContÃ¡ctanos`).
- **Estado**: resuelto (2026-03-14).
- **Evidencia**:
  - literales normalizados usando entidades HTML (`&oacute;`, `&iacute;`, `&eacute;`, `&aacute;`).
  - verificacion de residuos de mojibake: `rg -n "Ã|â|�" src/ui/features/contact/ContactFormSection.vue` (sin resultados).
  - validacion ejecutada: `npm run test -- tests/unit/ui/contactFormSection.test.ts` y `npm run typecheck`.
- **Prioridad**: Alta

## MEJORA - SOLID / Mantenibilidad

### 2) HomePage.vue mantiene alto tamano (dentro de umbral)
- [x] [MEJORA] Ejecutar primera etapa del plan incremental de modularizacion
- **Archivo**: `src/ui/pages/HomePage.vue` (1277 lineas, umbral 1300)
- **Contexto**: existe plan en `docs/homepage-modularization-plan.md`, aun sin aplicar Etapa 1.
- **Recomendacion**: extraer un bloque presentacional de bajo riesgo (FAQ o quick links) con validacion por slice.
- **Prioridad**: Media
- **Estado**: resuelto (2026-03-14).
- **Evidencia**:
  - bloque FAQ extraido a `src/ui/pages/home/HomeFaqList.vue`.
  - `HomePage.vue` ahora delega FAQ a componente presentacional y removio estilos FAQ embebidos.
  - `npm run typecheck`: OK.
  - `npm run lint:component-size`: OK (`HomePage.vue` en 1219 lineas).

## Notas de Auditoria

- No se detectaron hallazgos criticos de seguridad activos (sin `v-html`, `eval`, ni violaciones de capas).
- Hardening de WhatsApp URL y controles de fan-in/tamano siguen vigentes y pasando checks.
