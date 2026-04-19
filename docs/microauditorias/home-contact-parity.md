# Microauditoría: Home — Contact Parity

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | home-contact-parity |
| Archivo | docs/microauditorias/home-contact-parity.md |
| Estado | Cerrada |
| Prioridad | Baja |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Home |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Contacto |
| Diferencia puntual | Sincronización de textos descriptivos y radios de botones |
| Orden de trabajo | 11 |
| Commit de cierre | 79246b6 |

## 2. Objetivo del microcambio

Sincronizar la sección de contacto para que utilice los textos exactos definidos en el snapshot de Vue para el formulario principal (título, subtítulo y etiqueta del botón) y ajustar los radios de borde a la norma de 12px.

## 3. Alcance

- Incluye:
  - Modificación de `inc/site-data.php` para incluir `primaryContactForm`.
  - Modificación de `template-parts/content-contact.php`.
  - Sincronización del badge/eyebrow (uppercase, color `#ff6a00`).
  - Actualización de textos dinámicos.
  - Ajuste de radios a 12px en el botón de envío.
- No incluye:
  - Implementación del envío funcional (se mantiene la lógica de mailto/whatsapp actual por ahora).

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Título | "Iniciá una consulta técnica" | "Iniciá una consulta técnica" | Observación visual | Alta |
| Subtítulo | "Dejanos el contexto del caso..." | "Indicá qué variable querés capturar..." | Observación visual | Alta |
| Label Botón | "Enviá tu consulta" | "Continuar por WhatsApp" | Observación visual | Alta |
| Radio Botón | 12px | normal | Observación visual | Alta |

## 5. Hallazgo confirmado

Aunque el título coincide, el subtítulo y el label del botón en WordPress están utilizando los datos de la "Página de Contacto" (`contactPage`) en lugar de los datos del "Formulario de la Home" (`primaryContactForm`), lo que rompe la paridad específica de la vista principal. El radio del botón tampoco sigue la norma estética definida.

## 6. Hipótesis revisadas

1. Mapear correctamente los campos de datos dinámicos en `site-data.php` y en el template resolverá la discrepancia de contenido.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Sincronizar textos y estilos de botón en `content-contact.php`. | Paridad total de contenido y visual. | Ninguno. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Datos | `site-data.php` | Inclusión de `primaryContactForm` para la Home. | Sincronización de contenidos específicos. |
| Markup | `content-contact.php` | Adición de clase `c-home-contact` y badge "CONTACTO". | Paridad técnica BEM. |
| Estilos | `content-contact.php` | Ajuste de radio de botón a 12px y peso medium. | Fidelidad estética. |
| Contenido | `content-contact.php` | Uso de strings específicos de la Home (subtítulo y label botón). | Precisión informativa. |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Título H2 | "Iniciá una consulta técnica" | Idéntico. | OK |
| Subtítulo | "Dejanos el contexto del caso..." | Idéntico. | OK |
| Label Botón | "Enviá tu consulta" | Idéntico. | OK |
| Radio Botón | 12px (0.75rem). | Idéntico. | OK |


## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante.
* ## Siguiente microauditoría sugerida: `home-integrity-navigation.md`

## 12. Registro Git

| Campo | Valor |
| --- | --- |
| Rama | main |
| Estado de Git revisado antes de cambios | Sí |
| Archivos incluidos en commit | `template-parts/content-contact.php`, `inc/site-data.php` |
| Mensaje de commit | style(contact): synchronize content and styles with Vue reference |
| Hash de commit | 79246b6 |

## 13. Resumen ejecutivo

Se ha sincronizado la sección de contacto de la Home con la referencia Vue, corrigiendo la asignación de textos dinámicos (`primaryContactForm` vs `contactPage`). Se ajustó el radio de borde de los botones a 12px y se unificó la estética del badge institucional. La sección es ahora funcionalmente coherente con el snapshot de datos.


