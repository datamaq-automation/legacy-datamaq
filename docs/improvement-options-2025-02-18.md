# Evaluación de alternativas para mejoras priorizadas (18 feb 2025)

Este documento analiza opciones para implementar las oportunidades detectadas en la auditoría técnica inicial y registra decisiones, dudas y próximas acciones.

## 1. Tipado estricto en TypeScript
- **Alternativa A — Activar `strict`, `noImplicitAny` y `skipLibCheck` inmediatamente:**
  - Ventajas: detección temprana de errores, alineación con recomendaciones de la auditoría, consistencia para futuros colaboradores.
  - Desventajas: puede requerir ajustes en archivos existentes y exponer APIs globales sin tipos.
- **Alternativa B — Habilitar solo `skipLibCheck` y posponer el resto:**
  - Ventajas: cero fricción inmediata.
  - Desventajas: mantiene riesgos de `any` implícitos y resta valor a la auditoría.
- **Decisión:** Adoptar la alternativa A. El código actual es reducido y permite ajustar declaraciones globales para satisfacer el modo estricto.

## 2. Plugins de desarrollo en el build de producción
- **Alternativa A — Condicionar `vite-plugin-vue-devtools` a `mode !== 'production'`:**
  - Ventajas: elimina tooling innecesario del bundle, cero impacto en DX local.
  - Desventajas: requiere condicionar manualmente el arreglo de plugins.
- **Alternativa B — Eliminar el plugin del proyecto:**
  - Ventajas: bundle mínimo sin condicionales.
  - Desventajas: pierde observabilidad en desarrollo, contradice la práctica actual del equipo.
- **Decisión:** Alternativa A. Permite mantener la experiencia local y cumplir NFR de seguridad/performance.

## 3. Normalización de `CONTACT_API_URL`
- **Alternativa A — Reutilizar `ensureHttpsUrl` y descartar valores no HTTPS:**
  - Ventajas: garantiza cumplimiento de NFR-021, reutiliza utilidades existentes.
  - Desventajas: variables mal configuradas quedan silenciosamente deshabilitadas en producción.
- **Alternativa B — Validar solo con `try/catch` en runtime:**
  - Ventajas: mantiene retrocompatibilidad con URLs HTTP de pruebas.
  - Desventajas: contradice el requisito de HTTPS only y delega la validación a runtime.
- **Decisión:** Alternativa A. Las integraciones previstas (contacto y Whatsapp) deben operar sobre HTTPS.

## 4. Accesibilidad del formulario de contacto
- **Alternativa A — Añadir región `aria-live` y devolver foco al mensaje de estado:**
  - Ventajas: cumple WCAG 2.1 (criterios 3.3.1 y 4.1.3), mejora UX para lectores de pantalla.
  - Desventajas: requiere administrar referencias y `nextTick`.
- **Alternativa B — Solo añadir `aria-live` sin gestionar el foco:**
  - Ventajas: implementación mínima.
  - Desventajas: usuarios de teclado seguirían sin recibir feedback claro tras el envío.
- **Decisión:** Alternativa A. El esfuerzo adicional es acotado y ofrece la mejor experiencia inclusiva.

## 5. Convenciones y descubribilidad de componentes
- **Alternativa A — Corregir importaciones/alias para respetar PascalCase:**
  - Ventajas: coherencia con la convención Vue, facilita la búsqueda global.
  - Desventajas: requiere revisar referencias.
- **Alternativa B — Renombrar el archivo a minúsculas:**
  - Ventajas: evita tocar archivos existentes.
  - Desventajas: rompe la convención recomendada por Vue y confunde a colaboradores futuros.
- **Decisión:** Alternativa A. Se alinea con la guía oficial y reduce deuda técnica.

## 6. Contrato analítico y tipos globales
- **Alternativa A — Documentar el formato de `dataLayer`/`gtag` vía declaraciones globales:**
  - Ventajas: tipado estático del contrato, soporte al modo estricto.
  - Desventajas: requiere mantener el archivo si el contrato cambia.
- **Alternativa B — Dejar firmas genéricas (`Record<string, unknown>`):**
  - Ventajas: cero mantenimiento adicional.
  - Desventajas: el compilador no detecta regresiones al cambiar las claves esperadas.
- **Decisión:** Alternativa A. El contrato es estable y aporta seguridad durante refactors.

## 7. Documentación operativa y plantillas de entorno
- **Alternativa A — Actualizar README y agregar `.env.example`:**
  - Ventajas: onboarding rápido, evita publicar valores reales, refuerza la gobernanza de entornos.
  - Desventajas: requiere mantener ambos artefactos en paralelo.
- **Alternativa B — Mantener README actual y documentar verbalmente:**
  - Ventajas: ningún esfuerzo adicional.
  - Desventajas: README contiene información obsoleta (PHP/MySQL) y genera confusión.
- **Decisión:** Alternativa A. Se implementará documentación actualizada con pasos claros de despliegue.

## 8. Cobertura de pruebas automatizadas
- **Alternativa A — Incorporar Vitest + Vue Test Utils ahora:**
  - Ventajas: se avanza inmediatamente en la cobertura.
  - Desventajas: incremento de dependencias y tiempo de configuración; sin criterios de aceptación acordados aún.
- **Alternativa B — Documentar lineamientos y posponer la adopción:**
  - Ventajas: permite definir alcance (componentes críticos, contratos con backend) antes de invertir en tooling.
  - Desventajas: mantiene el riesgo señalado en la auditoría por más tiempo.
- **Preguntas:**
  1. ¿Existe un set mínimo de escenarios críticos acordado con stakeholders? *(No documentado en el repositorio; el SRS no incluye casos de prueba específicos para frontend.)*
  2. ¿El backend de contacto ya expone endpoints de staging para pruebas automatizadas? *(No hay referencias en `docs/` ni en `.env`; se asume que existe una API externa pero se desconoce su entorno de pruebas.)*
- **Intento de respuesta:** Con la información disponible no se puede garantizar un backend de staging ni criterios de aceptación específicos. Se recomienda definirlos antes de invertir en tooling.
- **Decisión provisional:** Mantener la alternativa B documentada y revaluar cuando haya claridad funcional.

## 9. Optimización de assets e importaciones CSS
- **Alternativa A — Migrar a imágenes WebP/AVIF y tree-shaking de Bootstrap en esta iteración:**
  - Ventajas: impacto directo en NFR-031/NFR-032.
  - Desventajas: requiere coordinación con diseño/contenido y tests visuales; excede el alcance de esta iteración.
- **Alternativa B — Documentar la estrategia y planificar un sprint específico de performance:**
  - Ventajas: permite preparar mediciones Lighthouse y validar contrastes en paralelo.
  - Desventajas: las mejoras de performance quedan diferidas.
- **Decisión provisional:** Adoptar la alternativa B y priorizar tareas de bajo riesgo en esta entrega.

## 10. Gestión de consentimiento y legal
- **Alternativa A — Implementar un CMP/banner antes de habilitar Clarity/GA4:**
  - Ventajas: cumplimiento pleno de Ley 25.326.
  - Desventajas: requiere definir textos legales y lógica de almacenamiento de consentimientos.
- **Alternativa B — Documentar la necesidad y esperar definiciones legales/comerciales:**
  - Ventajas: evita bloquear el despliegue actual y respeta el roadmap legal pendiente.
  - Desventajas: los trackers siguen activos sin consentimiento explícito.
- **Pregunta:** ¿El equipo legal ya entregó borradores de política de privacidad y cookies? *(No hay referencias en `docs/` ni enlaces en el proyecto.)*
- **Intento de respuesta:** A la fecha no existen documentos legales incorporados al repositorio, por lo que se mantiene la alternativa B mientras se esperan lineamientos oficiales.

---

### Próximos pasos
1. Implementar las decisiones adoptadas en los puntos 1–7 dentro de esta iteración.
2. Registrar las preguntas abiertas (puntos 8 y 10) para seguimiento con stakeholders de QA y Legal.
3. Preparar métricas de referencia (Lighthouse, peso de imágenes) antes de la iteración enfocada en performance.
