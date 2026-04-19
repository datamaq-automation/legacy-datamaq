# Microauditoría: Home — Footer Parity

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | home-footer-parity |
| Archivo | docs/microauditorias/home-footer-parity.md |
| Estado | Cerrada |
| Prioridad | Baja |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Home |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Footer |
| Diferencia puntual | Desajuste en el layout, textos legales y etiquetas del dock móvil |
| Orden de trabajo | 9 |
| Commit de cierre | d021868 |

## 2. Objetivo del microcambio

Sincronizar el footer y el dock de navegación móvil para lograr paridad estructural y de contenido con la referencia Vue. Esto incluye la adición del texto legal dinámico y la actualización de las etiquetas de navegación rápida.

## 3. Alcance

- Incluye:
  - Modificación de `footer.php`.
  - Implementación de la estructura `c-home-footer__shell` (Brand, Legal, WhatsApp).
  - Sincronización de los labels del dock (Inicio, Solución, Perfil, Contacto).
  - Uso de datos dinámicos de `site-data.php` para el texto legal y nota al pie.
- No incluye:
  - Cambios en el `wp_footer()` o scripts de terceros.
  - Modificación del FAB de WhatsApp (ya es funcional).

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Layout Footer | Shell flexible (1 fila) | 2 filas (Stack) | Observación visual | Alta |
| Texto Legal | Presente | Ausente | Observación visual | Alta |
| Labels Dock | Inicio, Solución, Perfil, Contacto | INICIO, SOLUCIÓN, FAQ, CONTACTO | Observación visual | Alta |
| Label WhatsApp | "Escribime" | Icono solo | Observación visual | Alta |

## 5. Hallazgo confirmado

El footer actual de WordPress es una versión simplificada que no incluye la información legal requerida ni sigue la estructura de diseño unificada. El dock móvil utiliza etiquetas en mayúsculas y omite el enlace al perfil técnico, que es una pieza clave de la navegación en la versión Vue.

## 6. Hipótesis revisadas

1. Reestructurar el footer para usar un contenedor de tipo "shell" permitirá albergar los tres bloques de información (Marca, Legal, Acción) en una sola línea en escritorio, mejorando la sofisticación visual.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Sincronizar footer y dock con `site-data.php`. | Paridad total y datos centralizados. | Ninguno. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Layout | `footer.php` | Reestructuración a `c-home-footer__shell` (flex-row). | Paridad técnica y estética "premium". |
| Contenido | `footer.php` | Inclusión de nota legal dinámica y footer note. | Cumplimiento informativo. |
| Navegación | `footer.php` | Actualización de etiquetas del dock móvil (Perfil añadido). | Consistencia en UX móvil. |
| Estilos | `footer.php` | Clase `c-home-footer` añadida. | Identificación técnica BEM. |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Label WhatsApp | "Escribime" presente en el footer. | Idéntico. | OK |
| Texto Legal | Visible y alineado en el centro. | Idéntico. | OK |
| Dock Labels | Inicio, Solución, Perfil, Contacto. | Idéntico. | OK |
| Responsive | Layout shell se apila verticalmente en móvil. | Idéntico. | OK |


## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante.
* ## Siguiente microauditoría sugerida: `home-pricing-structure.md` (Auditoría de la sección de Alcance/Tarifas).

