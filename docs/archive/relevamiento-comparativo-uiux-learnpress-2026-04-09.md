# Relevamiento Comparativo UI/UX

Fecha: 2026-04-09
Última actualización: 2026-04-09 (post fix compatibilidad PHP + CTA)

## 1) Objetivo y alcance
Comparar `https://cursos.datamaq.com.ar` (WordPress + LearnPress) contra la referencia `C:\AppServ\www\plantilla-www` para detectar brechas UI/UX y priorizar mejoras de mayor impacto.

Alcance evaluado:
- Home / catálogo de cursos
- Ficha de curso
- Perfil de instructor
- Base visual (tipografía, color, componentes, jerarquía)
- Señales de rendimiento visibles (`TTFB`)

## 2) Fuentes y evidencia usada
Referencia local:
- `C:\AppServ\www\plantilla-www\src\ui\pages\HomePage.vue`
- `C:\AppServ\www\plantilla-www\src\styles\scss\_dm.tokens.scss`
- `C:\AppServ\www\plantilla-www\src\styles\scss\_tokens.scss`
- `C:\AppServ\www\plantilla-www\src\styles\scss\layout.scss`

Sitio en producción:
- `https://cursos.datamaq.com.ar/courses/`
- `https://cursos.datamaq.com.ar/courses/arquitectura-y-sistemas-operativos/`
- `https://cursos.datamaq.com.ar/instructor/agustinbustos/`

## 3) Estado actual validado (certezas)
1. LearnPress quedó mayormente en español con paquete `es_ES` + overrides puntuales.
2. En `/courses/` se removieron controles de búsqueda/orden por render server-side (no sólo ocultación CSS).
3. Se aplicó `theme bridge` visual en superficies LearnPress (cards, CTA, metadatos, espaciados).
4. Se corrigió incidente crítico de compatibilidad PHP en MU plugin (`??`), que estaba impidiendo cargar parte de los estilos/overrides.
5. Se restauró la carga del bloque de estilos del bridge en frontend tras corregir el punto anterior.
6. El repo remoto `AgustinMadygraf/wp-cursos` está actualizado con los últimos fixes aplicados.

## 4) Dudas abiertas (a validar)
1. Confirmar en navegador final (hard refresh) que el CTA de perfil de instructor mantiene estado normal/hover consistente en todos los cursos listados.
2. Confirmar si el avatar de instructor en esa vista está saliendo desde URL local o sigue priorizando Gravatar en algún template específico.
3. Definir nivel objetivo de convergencia visual con `plantilla-www`: parcial pragmática o alta fidelidad.

## 5) Comparativa por dimensión
| Dimensión | Referencia (`plantilla-www`) | Estado actual (WP + LearnPress) | Brecha |
|---|---|---|---|
| Identidad visual | Sistema de diseño completo (tokens + narrativa) | Mejorada con bridge, aún sobre base TT3/LP | Media |
| Jerarquía Home/Catálogo | Hero + narrativa de marca fuerte | Catálogo limpio y más consistente | Media |
| Consistencia textual | Centralizada por componentes | Alta en español con parches puntuales | Baja/Media |
| Mantenibilidad UI | Arquitectura componentizada | Mejoró, pero depende de MU plugin | Media |
| Rendimiento percibido | No medido en runtime de referencia | Sin regresión visible tras ajustes | Baja |

## 6) Hallazgos de mayor impacto
1. El mayor riesgo real encontrado fue técnico, no visual: incompatibilidad de sintaxis PHP en MU plugin que anulaba parte de la capa UI.
2. Resolver ese punto recuperó overrides clave (incluyendo estilos CTA en vistas LearnPress afectadas).
3. La principal brecha remanente es de coherencia global con la referencia, no de traducción básica.

## 7) Priorización recomendada (siguiente paso)
1. **P1 (única): consolidar un bloque de estilos específico para perfil de instructor (CTA/avatar/meta) con pruebas manuales en desktop/mobile y estados hover/focus.**

## 8) Cambios recientes relevantes
- Fix de compatibilidad PHP del MU plugin para que vuelva a ejecutar en entorno actual.
- Ajustes de selector para CTA en perfil de instructor.
- Push de fixes al remoto principal.

## 9) Conclusión ejecutiva
El estado general mejoró y ya no hay bloqueo estructural por i18n ni por controles de catálogo. El próximo salto de valor está en cerrar consistencia visual de la vista de instructor (CTA/avatar/meta) y luego decidir hasta qué fidelidad se quiere replicar `plantilla-www`.
