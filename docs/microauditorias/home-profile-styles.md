# Microauditoría: Home — Profile Styles

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | home-profile-styles |
| Archivo | docs/microauditorias/home-profile-styles.md |
| Estado | Cerrada |
| Prioridad | Media |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Home |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Profile |
| Diferencia puntual | Desajuste en el badge (caso y color) y radio del botón CTA |
| Orden de trabajo | 6 |
| Commit de cierre | c34d019 |

## 2. Objetivo del microcambio

Sincronizar la estética de la sección de perfil con la referencia Vue. Esto incluye corregir el badge para que sea mayúsculo y use el color primario, además de ajustar el radio de borde del botón de contacto para mantener la consistencia "premium" de 12px.

## 3. Alcance

- Incluye:
  - Modificación de `template-parts/content-profile.php`.
  - Ajuste del badge a uppercase y color `#ff6a00`.
  - Ajuste del botón CTA a 12px de radio y peso 500.
  - Adición de clase `c-home-profile` a la sección.
- No incluye:
  - Cambio en el contenido de texto (ya sincronizado).
  - Rediseño de la animación circular de la foto.

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Texto Badge | MAYÚSCULAS | Minúsculas | Observación visual | Alta |
| Color Badge | `#ff6a00` | Blanco/Gris suave | Inspección visual | Alta |
| Radio Botón | 12px | Blocksy default (recto/curvo suave) | Inspección visual | Alta |

## 5. Hallazgo confirmado

La sección de perfil reutiliza clases del hero (`c-home-hero__eyebrow`) pero no aplica la transformación a mayúsculas ni el color de marca, lo que rompe la jerarquía visual de la página.

## 6. Hipótesis revisadas

1. Aplicar estilos inline o una nueva clase `c-home-profile__eyebrow` resolverá la inconsistencia sin afectar otras secciones.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Actualizar `content-profile.php` con clases BEM y estilos específicos. | Claridad técnica y paridad visual. | Ninguno. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Markup | `content-profile.php` | Adición de clase `c-home-profile` a la sección. | Paridad técnica y BEM. |
| Estilos | `content-profile.php` | Nombramiento `c-home-profile__eyebrow` y estilos inline (uppercase, color #ff6a00). | Segmentación de componentes y fidelidad visual. |
| Estilos | `content-profile.php` | Ajuste de radios a 12px y peso 500 en el botón CTA. | Consistencia estética "premium". |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Texto Badge | En MAYÚSCULAS ("PERFIL PROFESIONAL"). | Idéntico. | OK |
| Color Badge | Naranja #ff6a00. | Idéntico. | OK |
| Radio Botón | 12px (0.75rem). | Idéntico. | OK |
| Regresión visible | Sin regresiones detectadas. | N/A | OK |


## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante.
* ## Siguiente microauditoría sugerida: `home-services-structure.md` (Auditoría de la sección de Servicios).

