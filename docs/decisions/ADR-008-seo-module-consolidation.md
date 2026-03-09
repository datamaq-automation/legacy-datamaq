# ADR-008: Consolidación de Módulo SEO - Eliminar Barrel File

## Estado
- **Fecha**: 2026-03-09
- **Estado**: Aceptada
- **Decisores**: Usuario + Agente

## Contexto

El módulo SEO está distribuido en 4 archivos:
- `src/domain/seo/types.ts` - Tipos TypeScript (31 líneas)
- `src/application/seo/defaultSeo.ts` - Lógica de negocio (111 líneas)
- `src/ui/seo/defaultSeo.ts` - Barrel file de re-exportaciones (12 líneas)
- `src/ui/seo/appSeo.ts` - Construcción de meta tags (178 líneas)

El archivo `ui/seo/defaultSeo.ts` es un barrel file que solo re-exporta desde domain y application, añadiendo indirección innecesaria y dificultando la navegación del código.

## Decisión

**Opción seleccionada**: **A - Consolidar tipos en domain y funciones en application (eliminar duplicados en ui/)**

Eliminar el barrel file `src/ui/seo/defaultSeo.ts` y actualizar imports para usar referencias directas.

### Justificación

1. **Elimina indirección innecesaria**
   - El barrel file no añade valor, solo oculta el origen real de los exports
   - Los desarrolladores deben navegar 2 archivos para encontrar la definición

2. **Imports más claros**
   - Antes: `import { X } from '@/ui/seo/defaultSeo'` → re-exportado de domain/application
   - Después: `import { X } from '@/domain/seo/types'` o `@/application/seo/defaultSeo` - directo y explícito

3. **Mantiene integridad de capas**
   - `appSeo.ts` permanece en UI (usa `@vueuse/head`)
   - Pero importa directamente de las capas correspondientes

4. **Reduce de 4 a 3 archivos**
   - Sin pérdida de funcionalidad
   - Código más fácil de navegar

5. **Riesgo manejable**
   - Solo cambios de imports, no lógica de negocio
   - Fácilmente detectable por TypeScript

## Consecuencias

### Positivas
- Imports directos y explícitos
- Menos archivos para navegar
- Origen de tipos/funciones es claro
- Sin barrel file que mantener

### Negativas / Trade-offs
- Consumidores deben actualizar sus imports (solo 1 archivo: `appSeo.ts`)
- Múltiples imports en lugar de uno solo (explícito vs conveniente)

## Implementación

### Plan de Acción

1. **Verificar dependencias del barrel file**
   - Buscar todos los archivos que importen desde `ui/seo/defaultSeo.ts`

2. **Actualizar imports en `appSeo.ts`**
   - Cambiar: `import { X } from '@/ui/seo/defaultSeo'`
   - A: `import { X } from '@/domain/seo/types'` o `@/application/seo/defaultSeo`

3. **Eliminar barrel file**
   - Borrar `src/ui/seo/defaultSeo.ts`

4. **Validar**
   - `npm run typecheck` debe pasar
   - `npm run lint:layers` debe pasar (0 violaciones)
   - Build debe completarse sin errores

### Archivos Modificados
- `src/ui/seo/appSeo.ts` - actualizar imports
- `src/ui/seo/defaultSeo.ts` - eliminar

## Alternativas Rechazadas

### Opción B: Mantener separación actual
**Por qué se rechazó**: El barrel file añade complejidad sin valor. La "separación" es artificial cuando solo re-exporta.

### Opción C: Módulo SEO unificado cross-cutting
**Por qué se rechazó**: Rompe la estructura de capas existente. El cambio es más invasivo de lo necesario. Clean Architecture prioriza capas sobre módulos temáticos.

## Notas

- El barrel file en `infrastructure/analytics/index.ts` tiene justificación: contiene lógica de inicialización
- El barrel file `ui/seo/defaultSeo.ts` no tiene justificación similar
- Esta decisión es consistente con el principio de imports explícitos sobre convenientes
