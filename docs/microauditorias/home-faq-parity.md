# Microauditoría: Home — FAQ Parity

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | home-faq-parity |
| Archivo | docs/microauditorias/home-faq-parity.md |
| Estado | Cerrada |
| Prioridad | Media |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Home |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | FAQ |
| Diferencia puntual | Desajuste en el badge, cantidad de items y dinamismo de los datos |
| Orden de trabajo | 8 |
| Commit de cierre | 697c1f8 |

## 2. Objetivo del microcambio

Sincronizar la sección de FAQ para que sea 100% dinámica basándose en `site-data.php`, asegurando que se muestren las 6 preguntas reglamentarias y que el estilo del badge coincida con la jerarquía establecida (AYUDA en mayúsculas y naranja).

## 3. Alcance

- Incluye:
  - Modificación de `template-parts/content-faq.php`.
  - Reemplazo de los items hardcoded por un bucle `foreach` sobre `$data['items']`.
  - Sincronización del badge (texto "Ayuda", uppercase, color `#ff6a00`).
  - Ajuste de la clase de sección a `c-home-faq`.
- No incluye:
  - Cambio en la lógica del acordeón (`details`/`summary`).
  - Rediseño de las sombras o glows.

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Texto Badge | "AYUDA" | "Dudas comunes" | Observación visual | Alta |
| Cantidad de Items | 6 | 4 | Conteo visual | Alta |
| Dinamismo | Basado en data | Hardcoded en el template | Inspección de código | Alta |

## 5. Hallazgo confirmado

La sección FAQ en WordPress es estática y contiene menos información de la que ya está disponible en el repositorio de datos centralizado del tema. El badge no sigue la norma de diseño aplicada en el resto del sitio.

## 6. Hipótesis revisadas

1. Implementar un bucle PHP sobre el array centralizado permitirá mantener la paridad automática si el snapshot de datos cambia en el futuro.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Dinamizar la sección FAQ completamente. | Mantenibilidad y paridad garantizada. | Ninguno. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Markup | `content-faq.php` | Implementación de bucle `foreach` dinámico. | Paridad de datos y escalabilidad. |
| Estilos | `content-faq.php` | Ajuste de badge a "AYUDA" (uppercase, #ff6a00). | Cohesión estética. |
| Estilos | `content-faq.php` | Adición de clase `c-home-faq`. | Identificación técnica BEM. |
| Contenido | `content-faq.php` | Corrección de títulos y sincronización de los 6 items. | Precisión informativa. |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Título H2 | "Preguntas frecuentes" | Idéntico. | OK |
| Cantidad de Items | 6 items detectados y operativos. | Idéntico. | OK |
| Texto Badge | "AYUDA" (Uppercase, Orange). | Idéntico. | OK |
| Apertura/Cierre | Funcionalidad nativa `details` mantenida. | Idéntico. | OK |


## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante.
* ## Siguiente microauditoría sugerida: `home-footer-parity.md` (Auditoría de la sección de Footer).

## 12. Registro Git

| Campo | Valor |
| --- | --- |
| Rama | main |
| Estado de Git revisado antes de cambios | Sí |
| Archivos incluidos en commit | `template-parts/content-faq.php`, `inc/site-data.php` |
| Mensaje de commit | style(faq): synchronize content and styles with Vue reference |
| Hash de commit | 697c1f8 |

## 13. Resumen ejecutivo

Se ha dinamizado la sección de preguntas frecuentes (FAQ), extrayendo los 6 ítems del snapshot de Vue. Se actualizaron los badges a mayúsculas con el color institucional `#ff6a00` y se implementó la arquitectura BEM (`c-home-faq`), asegurando que la sección de ayuda sea totalmente coherente con la de la referencia local.
