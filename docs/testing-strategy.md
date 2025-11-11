# Estrategia de pruebas automatizadas

_Última actualización: 12 feb 2025_

## Objetivos

1. Validar los flujos críticos definidos en el SRS (solicitud de diagnóstico, contacto por correo y registro de conversión).
2. Detectar regresiones funcionales y de accesibilidad antes de los despliegues a producción.
3. Proveer evidencia trazable para los NFR relacionados con disponibilidad (NFR-040) y calidad percibida.

## Alcance inicial

- **Front-end (Vue 3 + Vite)**
  - Componentes atómicos y secciones clave (`HeroSection`, `ServiciosSection`, `ContactFormSection`).
  - Integraciones con servicios externos simuladas mediante dobles de prueba (WhatsApp y API de contacto).
- **Páginas estáticas generadas**
  - Validación de meta etiquetas y scripts de analítica requeridos (GA4 y Clarity).
- **Accesibilidad básica**
  - Auditoría heurística `npm run test:a11y` que revisa los templates `.vue` (nombres accesibles, etiquetas `alt`, encabezados).

## Tipos de pruebas

| Tipo | Herramientas | Objetivo | Cobertura mínima |
| --- | --- | --- | --- |
| Unitarias | [Vitest](https://vitest.dev/) + @vue/test-utils | Validar render de componentes y lógica de estados | 80 % statements en componentes críticos |
| Integración UI | Playwright | Validar flujos de usuario: hero CTA, formulario de contacto, accesos a WhatsApp | 3 escenarios end-to-end |
| Accesibilidad | Heurísticas personalizadas (`npm run test:a11y`) | Detectar errores básicos de nombre accesible y `alt` | Sin incidencias reportadas |
| Performance | Lighthouse CI (modo `--preset=desktop`) | Confirmar métricas LCP < 2.5s, CLS < 0.1 | Umbrales >= 90 |

## Requisitos previos

- Endpoint de contacto accesible en staging (`VITE_CONTACT_API_URL`).
- Credenciales de analítica de prueba para validar envío de eventos.
- Datos de usuario ficticios aprobados por Legal.

## Plan de implementación

1. **Configurar Vitest**
   - Añadir dependencia `vitest` y `@vue/test-utils`.
   - Crear `vitest.config.ts` que reutilice la configuración de Vite.
   - Escribir pruebas para `ContactFormSection` validando estados (loading, éxito, error) con mocks del handler `onSubmit`.
2. **Automatizar accesibilidad**
   - ✅ `npm run test:a11y` inspecciona los templates `.vue` y falla cuando encuentra botones/enlaces sin nombre accesible,
     imágenes sin `alt` o secciones sin encabezado/etiqueta.
3. **E2E con Playwright**
   - Añadir `@playwright/test` y configurar `npm run test:e2e`.
   - Cubrir flujos: apertura del hero CTA, click en botones de servicios, envío de formulario mockeado.
4. **Integración CI**
   - Extender `.github/workflows/ci.yml` con jobs `test` y `accessibility` dependientes del build.
   - Ejecutar pruebas E2E en modo headless con `npx playwright install --with-deps` previo.

## Pendientes y riesgos

- Confirmar disponibilidad de un backend de contacto de staging para ejecutar pruebas integradas.
- Definir con QA los datos de prueba aceptables para analítica sin contaminar métricas de producción.
- Ajustar tiempos de ejecución del pipeline para mantenerlo < 10 minutos.

## Referencias

- Documento de requerimientos funcionales `docs/audit-2025-02-17.md`.
- Lineamientos de accesibilidad `https://www.w3.org/TR/WCAG21/`.
