# WP Native - Open Items

Estado: 2026-04-12
Scope: migracion `cursos.datamaq.com.ar` a `datamaq-native`

## Pendientes operativos
1. Push de `wp-cursos` al remoto GitHub:
   - Estado: bloqueado por clave SSH read-only en VPS.
2. Tracking final:
   - Definir/confirmar IDs GA4 + Clarity y politica final de consentimiento en produccion.
3. Monitoreo post-cutover:
   - Ventana recomendada: 24-48h de observacion de errores/metricas.

## Pendientes documentales
1. Actualizar indice de `docs/README.md` con fases WP 0/2/3/4/5.
2. Decidir si `docs/relevamiento-comparativo-uiux-learnpress-2026-04-09.md` queda como historico archivado.

## Hecho y cerrado
- Cutover a `datamaq-native`.
- Formulario nativo funcional con redirect a `/gracias/`.
- Redirecciones legacy `/cotizador*` activas (MU plugin).
- Canonicalizacion SEO de `/courses` hacia `/`.
