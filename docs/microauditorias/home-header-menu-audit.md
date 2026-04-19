# Microauditoría: Global — Header Menu Items

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | global-header-menu-items |
| Archivo | docs/microauditorias/global-header-menu-items.md |
| Estado | Cerrada |
| Prioridad | Alta |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Global |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Header |
| Diferencia puntual | Desajuste en los elementos y etiquetas del menú de navegación |
| Orden de trabajo | 2 |
| Commit de cierre | f117e70 |

## 2. Objetivo del microcambio

Sincronizar exactamente los ítems del menú de navegación de WordPress con la referencia Vue. Esto incluye añadir los enlaces faltantes (`Proceso`, `Alcance`, `Cobertura`) e igualar las etiquetas (cambiar "Contacto" por "Escribime" en el CTA). El objetivo es que la navegación principal sea idéntica en contenido y orden a la fuente de verdad.

## 3. Alcance

- Incluye:
  - Modificación de `header.php` (Desktop y Mobile Offcanvas) para actualizar la lista de enlaces y etiquetas.
  - Sincronización de los hashes de destino (`#servicios`, `#proceso`, `#tarifas`, `#cobertura`, `#faq`, `#contacto`).
- No incluye:
  - Ajuste de estilos CSS de los enlaces (se tratarán en otra microauditoría si hay diferencias).
  - Creación de las secciones de destino en el cuerpo de la Home (esto se asume que existe o se creará en fases posteriores; esta auditoría solo cubre el Header).
- Riesgo principal:
  - Enlaces "rotos" (que no desplazan) si las secciones de destino aún no tienen el ID correcto en WordPress.

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Lista de ítems | Solución, Proceso, Alcance, Cobertura, FAQ, Contacto | Solución, FAQ, Contacto | Observación visual / F12 | Alta |
| Etiqueta CTA | Escribime | Contacto / Escribime (móvil) | Observación visual | Alta |
| Orden | Ver lista arriba | Solución, FAQ, Contacto | Observación visual | Alta |

## 5. Hallazgo confirmado

El menú actual de WordPress es una versión simplificada del que existe en Vue. Faltan tres puntos clave de navegación (`Proceso`, `Alcance`, `Cobertura`) y la etiqueta del botón de contacto principal difiere ("Contacto" vs "Escribime").

## 6. Hipótesis revisadas

1. La estructura de `header.php` permite añadir los nuevos `<li>` directamente.
2. Debemos usar `home_url('#...')` para mantener la compatibilidad con navegación desde otras páginas si fuera necesario, aunque Vue use hashes puros.
3. El menú móvil (offcanvas) debe actualizarse en paralelo para mantener la paridad.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Modificar `header.php` inyectando los nuevos ítems. | Paridad inmediata en el elemento global. | Enlaces no funcionales hasta que las secciones tengan sus IDs. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Plantilla / PHP | `header.php` | Adición de enlaces `Proceso`, `Alcance` y `Cobertura`. | Paridad de navegación con Vue. |
| Etiquetas | `header.php` | Cambio de label "Contacto" a "Escribime". | Paridad de copy con Vue. |
| Enlaces | `header.php` | Sincronización de hashes (#proceso, #tarifas, #cobertura). | Trazabilidad funcional. |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Visual desktop | 6 ítems presentes + CTA "Escribime". | Idéntico. | OK |
| Visual tablet | 6 ítems presentes. | Idéntico. | OK |
| Visual mobile | 6 ítems presentes en el offcanvas. | Idéntico. | OK |
| Interacción perceptible | Enlaces presentes en el DOM y clicables. | Idéntico. | OK |
| Regresión visible | Sin regresiones en el header. | N/A | OK |


## 10. Evidencia técnica utilizada

### Snippet 1
**Objetivo:** Obtener la lista exacta de enlaces en Vue
**Entorno:** Vue
**Elemento o zona inspeccionada:** Navbar links data

```js
// datamaqSiteSnapshot.content.navbar.links
[
  { label: 'Solución', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Alcance', href: '#tarifas' },
  { label: 'Cobertura', href: '#cobertura' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contacto', href: '#contacto' }
]
```

## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Los enlaces `#proceso`, `#tarifas` y `#cobertura` no tienen destino funcional (anclajes) en el cuerpo de la página todavía.
* ## Siguiente microauditoría sugerida: `global-header-height.md` o iniciar con las secciones de la Home (Hero).

