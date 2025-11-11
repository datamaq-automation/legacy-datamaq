# Plan de escalamiento a multipágina y guía de arquitectura

_Última actualización: 11 feb 2025_

## Contexto

El sitio actual es una landing de una sola página construida con Vue 3 y Vite. Los requisitos FR-003 y BR-002 establecen que, al superar el umbral de 5 secciones con contenido evergreen, debe adoptarse una estructura multipágina que permita experiencias personalizadas por industria y preservar el rendimiento.

## Objetivos

1. Permitir la navegación entre vistas independientes (`/`, `/servicios`, `/industria/grafica`, `/recursos`).
2. Mantener un tiempo de carga inicial inferior a 2 segundos en conexiones 4G (NFR-031) y un CLS < 0.1 (NFR-032).
3. Facilitar la incorporación de nuevas features por equipo distribuido con guías claras de capas.

## Arquitectura propuesta

```
src/
├─ application/
│  ├─ router/
│  │  ├─ index.ts          # Configuración de Vue Router con rutas lazy-loaded
│  │  └─ guards.ts         # Protecciones y tracking de navegación
│  ├─ services/            # Casos de uso y orquestación (WhatsApp, contacto)
│  └─ analytics/           # Adaptadores hacia GA4/Clarity
├─ presentation/
│  ├─ layouts/             # Layouts compartidos (LandingLayout, ServiceLayout)
│  ├─ pages/               # Vistas (HomePage.vue, ServiciosPage.vue, etc.)
│  ├─ components/          # Componentes compartidos por vistas
│  └─ styles/              # Tokens y capas CSS
├─ infrastructure/         # Configuración y adaptadores HTTP
└─ domain/                 # Modelos y entidades de negocio (opcional)
```

## Estrategia de migración

1. **Preparación (Sprint 1)**
   - Introducir `vue-router` y definir rutas perezosas.
   - Crear `LandingLayout` con slots para cabecera, contenido y pie.
   - Extraer `Navbar`, `Footer`, `WhatsappFab` a `presentation/components/`.
2. **División de vistas (Sprint 2)**
   - Convertir secciones existentes en páginas: `HomePage` (hero + CTA), `ServiciosPage` (cards detalladas), `ContactoPage`.
   - Añadir navegación semántica (breadcrumbs, `aria-current`).
3. **Contenido específico por industria (Sprint 3)**
   - Generar rutas dinámicas `/industria/:slug` consumiendo data estática (JSON) para cooperativas, gráfica, alimentos.
   - Implementar lazy loading de assets usando `defineAsyncComponent` y `IntersectionObserver`.
4. **Documentación y QA (Sprint 4)**
   - Actualizar Storybook/guía visual (si aplica).
   - Ejecutar pruebas automatizadas y actualizar métricas Lighthouse.

## Recomendaciones de estilos

- Centralizar tokens en `presentation/styles/tokens.css` con capas `@layer base, components, utilities`.
- Adoptar `CSS Custom Properties` para esquemas claros/oscuro con preferencia de usuario (`prefers-color-scheme`).
- Mantener componentes agnósticos a datos, recibiendo props tipadas.

## Consideraciones de rendimiento

- Usar `defineAsyncComponent` para secciones pesadas (> 25 KB) y cargar on-demand.
- Configurar `route` level code splitting con `import()`.
- Reutilizar las nuevas ilustraciones en SVG para minimizar payload.

## Dependencias nuevas sugeridas

- `vue-router` (core) y `@vueuse/head` para manejo de meta tags.
- `vite-plugin-pwa` si se desea soporte offline futuro.

## Seguimiento

- Registrar avances en `docs/todo.md` y actualizar métricas en cada release.
- Incorporar este plan al onboarding técnico del equipo.
