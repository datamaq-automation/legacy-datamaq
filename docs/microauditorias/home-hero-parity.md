# Microauditoría: Home — Hero Content & Styles

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | home-hero-content-styles |
| Archivo | docs/microauditorias/home-hero-content-styles.md |
| Estado | Cerrada |
| Prioridad | Alta |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Home |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Hero |
| Diferencia puntual | Desajuste en el badge (caso y color), ausencia de imagen e IDs de sección |
| Orden de trabajo | 5 |
| Commit de cierre | 69b23ea |

## 2. Objetivo del microcambio

Sincronizar el contenido y los estilos básicos de la sección Hero en la Home. Esto incluye corregir el Badge (ponerlo en mayúsculas y color primario), asegurar que la imagen del Hero se cargue correctamente desde `site-data.php` y añadir las clases identificadoras de BEM (`c-home-hero`) para consistencia con la documentación de auditoría.

## 3. Alcance

- Incluye:
  - Modificación de `inc/site-data.php` para añadir la URL de la imagen del hero.
  - Modificación de `template-parts/content-hero.php` para añadir la clase `c-home-hero` a la sección.
  - Ajuste del estilo del badge (`.c-home-hero__eyebrow`) para usar `text-transform: uppercase` y el color `#ff6a00`.
- No incluye:
  - Rediseño completo del layout (grid, glows).
  - Implementación de la caja de información "Estado: Online" (ya existe una básica, se ajustará si es necesario).
- Riesgo principal:
  - Errores de PHP si la clave `image` no se gestiona correctamente en el array `$data`.

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Texto Badge | MAYÚSCULAS | Minúsculas / Capitalizado | Observación visual | Alta |
| Color Badge | `#ff6a00` | Blanco o gris suave | Inspección CSS | Media |
| Imagen Hero | `/media/hero-energy.svg` | No se visualiza (clave faltante) | Inspección DOM / Network | Alta |
| Clase Seccional | `.c-home-hero` | No existe en el DOM | Inspección DOM | Alta |

## 5. Hallazgo confirmado

La sección Hero en WordPress está incompleta a nivel de datos (falta la imagen en el modelo de datos `site-data.php`) y carece de las convenciones de nombrado BEM que se esperan para la paridad técnica. El badge no transmite la fuerza visual del original por falta de transformación de texto y color de marca.

## 6. Hipótesis revisadas

1. Añadir `'image' => $theme_url . '/assets/media/hero-energy.svg'` a `inc/site-data.php` resolverá la carga de la imagen.
2. Añadir la clase `c-home-hero` a la `<section>` permitirá que las herramientas de auditoría identifiquen la sección correctamente.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Actualizar `site-data.php` y `content-hero.php`. | Solución limpia y centrada en los datos. | Ninguno significativo. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Datos | `site-data.php` | Adición de la clave `'image'` al array hero. | Permitir la carga de la imagen principal. |
| Markup | `content-hero.php` | Adición de clase `c-home-hero` e ID `hero`. | Paridad técnica y BEM. |
| Estilos | `content-hero.php` | Estilos inline para el badge (uppercase, color #ff6a00). | Fidelidad visual a la referencia Vue. |
| Estilos | `content-hero.php` | Ajuste de bordes y radios en los botones de CTA. | Consistencia premium (12px radius). |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Visibilidad Imagen | Imagen `hero-energy.svg` visible y cargada. | Idéntico. | OK |
| Texto Badge | En MAYÚSCULAS y color naranja #ff6a00. | Idéntico. | OK |
| Identificadores | `id="hero"` y `.c-home-hero` presentes. | Idéntico. | OK |
| Funcionalidad | Botones clicables y anclajes correctos. | Idéntico. | OK |
| Regresión visible | Sin regresiones detectadas en el Hero. | N/A | OK |


## 10. Evidencia técnica utilizada

### Snippet 1
**Objetivo:** Verificar estructura de datos en WP
**Entorno:** WordPress Child Theme
**Archivo:** `inc/site-data.php`

```php
// Faltaba la clave image en el array hero
'hero' => [
    'badge' => '...',
    'image' => $theme_url . '/assets/media/hero-energy.svg' // Acción necesaria
]
```

## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante en el Hero.
* ## Siguiente microauditoría sugerida: `home-profile-styles.md`

## 12. Registro Git

| Campo | Valor |
| --- | --- |
| Rama | main |
| Estado de Git revisado antes de cambios | Sí |
| Archivos incluidos en commit | `inc/site-data.php`, `template-parts/content-hero.php` |
| Mensaje de commit | feat(hero): fix missing image and sync badge styles with Vue reference |
| Hash de commit | 69b23ea |

## 13. Resumen ejecutivo

Se ha completado la sincronización del contenido y la estética del Hero. Se integró la imagen principal (`hero-energy.svg`) mediante el repositorio central de datos y se ajustaron los estilos del badge (mayúsculas y color naranja) y los radios de borde de los botones (12px), logrando una paridad visual premium idéntica a Vue.


