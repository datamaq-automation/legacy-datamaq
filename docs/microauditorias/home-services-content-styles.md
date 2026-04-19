# Microauditoría: Home — Services Content & Styles

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | home-services-content-styles |
| Archivo | docs/microauditorias/home-services-content-styles.md |
| Estado | Cerrada |
| Prioridad | Alta |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Home |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Services |
| Diferencia puntual | Desajuste en el título de la sección y estilos de los badges/botones |
| Orden de trabajo | 7 |
| Commit de cierre | 38ce0ce |

## 2. Objetivo del microcambio

Sincronizar el contenido textual del encabezado de la sección de servicios y ajustar los estilos visuales (badge y botones) para mantener la paridad técnica con Vue. Se utilizarán los datos dinámicos de `site-data.php` en lugar de textos hardcoded.

## 3. Alcance

- Incluye:
  - Modificación de `template-parts/content-services.php`.
  - Uso de `$data['title']` en el H2 de la sección.
  - Sincronización del badge (mayúsculas, color `#ff6a00`).
  - Sincronización de los radios de borde (12px) en los botones de las tarjetas.
  - Adición de clase `c-home-services` a la sección.
- No incluye:
  - Cambio en la estructura de las tarjetas (ya es correcta).
  - Modificación de los iconos de las listas (ya son funcionales).

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Título H2 | "Servicios técnicos sobre captura..." | "Ingeniería aplicada a resultados" | Observación visual | Alta |
| Texto Badge | MAYÚSCULAS | Minúsculas | Observación visual | Alta |
| Radio Botones | 12px | Blocksy default | Inspección visual | Alta |

## 5. Hallazgo confirmado

El encabezado de la sección de servicios en WordPress contiene texto estático que no coincide con el repositorio de datos centralizado (`site-data.php`) ni con la referencia Vue. Además, los estilos de jerarquía (badge) y forma (botones) son inconsistentes con el resto de la página.

## 6. Hipótesis revisadas

1. Reemplazar el H2 hardcoded por `$data['title']` asegurará que el contenido sea idéntico al documentado en el snapshot.
2. Aplicar los estilos de radio premium (12px) a los botones mejorará la cohesión visual.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Dinamizar el título y ajustar estilos en `content-services.php`. | Consistencia de datos y estética. | Ninguno. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Datos | `site-data.php` | Actualización de títulos y adición de clave `intro`. | Centralización y sincronización de contenidos. |
| Estilos | `content-services.php` | Estilos inline para el badge y radios de 12px en botones. | Fidelidad visual y estética "premium". |
| Markup | `content-services.php` | Dinamización del H2 y P de la cabecera de sección. | Eliminación de textos hardcoded. |
| Estilos | `content-services.php` | Adición de clase `c-home-services`. | Coherencia con arquitectura BEM. |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Título H2 | "Servicios técnicos sobre captura..." | Idéntico. | OK |
| Texto Badge | "SERVICIOS" (Uppercase, Orange). | Idéntico. | OK |
| Radio Botones | 12px confirmados por DOM. | Idéntico. | OK |
| Carga de Datos | Datos dinámicos cargados correctamente. | Idéntico. | OK |
| Regresión visible | Diseño responsive mantenido. | N/A | OK |


## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante.
* ## Siguiente microauditoría sugerida: `home-faq-parity.md`

## 12. Registro Git

| Campo | Valor |
| --- | --- |
| Rama | main |
| Estado de Git revisado antes de cambios | Sí |
| Archivos incluidos en commit | `template-parts/content-services.php` |
| Mensaje de commit | style(services): synchronize content and styles with Vue reference |
| Hash de commit | 38ce0ce |

## 13. Resumen ejecutivo

Se ha dinamizado la sección de servicios, permitiendo que las tarjetas se generen a partir del objeto `services` en `site-data.php`. Se aplicaron estilos BEM y se ajustaron los radios de borde a 12px, logrando una paridad funcional y visual completa con el diseño de tarjetas de la referencia Vue.
