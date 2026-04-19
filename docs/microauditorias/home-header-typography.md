# Microauditoría: Global — Header Typography

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | global-header-typography |
| Archivo | docs/microauditorias/global-header-typography.md |
| Estado | Cerrada |
| Prioridad | Alta |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Global |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Header |
| Diferencia puntual | Desajuste en tipografía, pesos y radios de los elementos del menú |
| Orden de trabajo | 4 |
| Commit de cierre | eb07534 |

## 2. Objetivo del microcambio

Sincronizar la tipografía y los estilos de interacción del header con la referencia Vue. Esto incluye ajustar el tamaño de fuente, peso, color base y color de hover de los enlaces, así como el peso y radio de borde del botón CTA.

## 3. Alcance

- Incluye:
  - Modificación de los estilos de los enlaces (`<a>`) en `header.php` (Desktop).
  - Ajuste del botón CTA (`tw:btn-primary` o equivalente inyectado).
  - Unificación de colores de marca (usar `#ff6a00` para hover/primario).
  - Ajuste de radios de borde (12px para botones).
- No incluye:
  - Cambio en el contenido de los menús (ya realizado).
  - Cambio de la fuente global del sitio (se asume Inter desde el tema base).
- Riesgo principal:
  - Legibilidad si el color `#e2e9f3` con 88% de opacidad no tiene suficiente contraste contra el fondo (en Vue está validado).

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Fuente Enlaces | 15.68px / Peso 400 | ~16px / Peso bold (actual tipado) | F12 / Inspect | Alta |
| Color Enlaces | `rgba(226, 233, 243, 0.88)` | `tw:text-white/90` | Inspección CSS | Alta |
| Color Hover | `#ff6a00` | `#ff9a4d` | Inspección de código | Alta |
| Peso CTA | 500 (font-medium) | 700 (font-bold) | Inspección visual | Alta |
| Radio CTA | 12px (rounded-xl) | Blocksy default (prob 4-6px) | Inspección visual | Alta |

## 5. Hallazgo confirmado

La tipografía actual en WordPress es demasiado "pesada" (mucho bold) y el color naranja de hover no es el exacto. Además, los botones no tienen el radio de borde premium (12px) de la referencia Vue.

## 6. Hipótesis revisadas

1. Inyectar clases de Tailwind específicas o estilos inline en `header.php` permitirá alcanzar la fidelidad sin afectar el resto del sitio.
2. Usar `tw:font-medium` (500) en lugar de `tw:font-bold` para el CTA mejorará la estética premium.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Uso de clases arbitrarias de Tailwind y estilos CSS en `header.php`. | Control total sobre la zona auditada. | Duplicidad de estilos si no se gestionan bien. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Estilo / PHP | `header.php` | Inyección de clases `.dm-nav-link` y `.dm-btn-cta`. | Control preciso de tipografía sin Tailwind full bundle. |
| Tipografía | `header.php` | Ajuste de font-size a 15.68px y peso 400. | Fidelidad al diseño Inter en Vue. |
| Colores | `header.php` | Uso de `#e2e9f3/88` y `#ff6a00`. | Paridad cromática de marca. |
| Formas | `header.php` | Ajuste de border-radius a 12px en CTA. | Mejora de estética visual (premium). |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Color Enlaces | rgba(226, 233, 243, 0.88) | Idéntico. | OK |
| Peso Enlaces | 400 (normal) | Idéntico. | OK |
| Radio Botón | 12px | Idéntico. | OK |
| Hover behavior | Color #ff6a00 con transición suave. | Idéntico. | OK |
| Regresión visible | Sin regresiones detectadas. | N/A | OK |


## 10. Evidencia técnica utilizada

### Snippet 1
**Objetivo:** Obtener tokens exactos de tipografía
**Entorno:** Vue SCSS Tokens
**Archivo:** `_dm.tokens.scss` / `_navbar.scss`

```scss
$dm-text-0: #e2e9f3;
.nav-link {
  font-size: 0.98rem;
  color: rgba($dm-text-0, 0.88);
  transition: color 0.2s ease;
  &:hover { color: #ff6a00; }
}
```

## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante en el header.
* ## Siguiente microauditoría sugerida: `home-hero-content.md` (Inicio de auditoría de secciones de la Home).

