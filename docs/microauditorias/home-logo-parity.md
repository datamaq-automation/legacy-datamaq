# Microauditoría: Global — Header Logo Icon

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | global-header-logo-icon |
| Archivo | docs/microauditorias/global-header-logo-icon.md |
| Estado | Cerrada |
| Prioridad | Alta |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Global |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Header |
| Diferencia puntual | Ausencia de icono en el logo |
| Orden de trabajo | 1 |
| Commit de cierre | 781cf92 |

## 2. Objetivo del microcambio

Añadir el icono de terminal (`>_`) dentro de un cuadrado naranja con bordes redondeados al logo de la cabecera. Esto busca igualar la identidad visual de la marca tal como se presenta en la referencia Vue, donde el logo no es solo texto sino un componente compuesto.

## 3. Alcance

- Incluye:
  - Modificación de `header.php` para inyectar el HTML del icono.
  - Uso de clases `tw:` existentes para el estilo (bg, rounded, flex, etc.).
- No incluye:
  - Cambios en el tamaño del texto del logo.
  - Cambios en la tipografía (se tratarán en otra microauditoría si hay diferencias).
- Riesgo principal:
  - Desalineación vertical del texto respecto al nuevo icono.

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Presencia de icono | Icono `>_` en cuadrado naranja | Solo texto "DataMaq" | Observación visual / F12 | Alta |
| Estructura logo | Flexbox con gap-2 | Texto directo en `<a>` | F12 | Alta |

## 5. Hallazgo confirmado

La implementación en WordPress carece del elemento visual que precede al nombre de la marca. En Vue, el logo es un contenedor flexible que agrupa un `span` con fondo naranja `#f97316` (con el texto `>_`) y el nombre "DataMaq".

## 6. Hipótesis revisadas

1. Se puede implementar directamente en `header.php` usando clases de Tailwind.
2. El color naranja está disponible como utilidad de Tailwind o deberá hardcodearse.
3. El gap entre icono y texto debe ser de 8px (`tw:gap-2`).

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Modificar `header.php` con HTML + clases `tw:` | Rápido, local, fácil de revertir. | Dependencia de que el shim de Tailwind soporte las clases usadas. | Elegida |
| B | Usar CSS pseudo-elementos | No toca PHP. | Más complejo de posicionar exactamente el texto `>_`. | Descartada |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Plantilla / PHP | `header.php` | Inyección de HTML para el icono del logo. | Replicar identidad visual de Vue. |
| CSS local | `header.php` | Definición de clase `.c-logo-icon` y estilos inline. | Garantizar fidelidad sin depender de compilación de Tailwind. |
| Markup | `header.php` | Adición de clase `tw:fixed` al tag `header`. | Compatibilidad con el script JS de control de scroll/mobile. |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Visual desktop | Icono naranja presente y alineado. | Idéntico. | OK |
| Visual tablet | Icono naranja presente. | Idéntico. | OK |
| Visual mobile | Icono presente en header y menú offcanvas. | Idéntico. | OK |
| Interacción perceptible | Menú hamburguesa funcional. | Funcional (aunque Vue usa Dock). | OK |
| Regresión visible | Sin regresiones detectadas. | N/A | OK |


## 10. Evidencia técnica utilizada

### Snippet 1
**Objetivo:** Obtener estilos exactos del icono en Vue
**Entorno:** Vue
**Elemento o zona inspeccionada:** `.c-navbar__inner a > span` (simulado)
**Qué valida:** Dimensiones y colores

```css
background-color: rgb(249, 115, 22); /* #f97316 */
border-radius: 4px;
width: 28px;
height: 28px;
display: flex;
align-items: center;
justify-content: center;
font-family: ui-monospace, SFMono-Regular, ...;
```

## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante para el icono.
* ## Siguiente microauditoría sugerida: `global-header-menu-items.md` (Ajustar labels y enlaces del menú).

