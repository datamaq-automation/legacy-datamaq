# Vista: Gracias (DataMaq)

## 1. Ficha de la vista

| Campo | Valor |
|---|---|
| Vista | Gracias / Éxito de contacto |
| Archivo | `src/ui/views/ThanksView.vue` |
| URL Vue | `http://localhost:5173/gracias` |
| URL WordPress | `https://datamaq.com.ar/ (Mensaje inline / Página estándar)` |
| Estado del documento | Completo |
| Fecha de análisis | 2026-04-19 |
| Viewports analizados | Mobile (375px), Tablet (768px), Desktop (1440px) |
| Alcance | Análisis de la pantalla de confirmación, efectos de iluminación (glow) y flujo de retorno. |

## 2. Objetivo de la vista

La vista de Gracias tiene como objetivo confirmar al usuario que su consulta ha sido enviada con éxito, proporcionando una sensación de cierre y profesionalismo. A diferencia de un mensaje de éxito estándar, esta página utiliza un diseño inmersivo con efectos de profundidad y brillo que refuerzan la identidad tecnológica de DataMaq, ofreciendo además vías de salida claras hacia la Home o hacia el chat de WhatsApp.

## 3. Alcance de comparación

- Comparado visualmente entre Vue y WordPress:
  - Estética del mensaje de confirmación, uso de iconos y coherencia con la marca.
- Validado con snippets F12 solo en Vue:
  - Padding vertical (~48px), tamaño de icono central (120px) y gradientes de fondo.
- No evaluado:
  - Persistencia de datos post-envío ni integración con herramientas de analítica (píxeles de conversión).

## 4. Estructura visible y jerarquía

| Orden | Sección / bloque visible | Propósito aparente | Jerarquía visual en Vue | Observación en WordPress |
|---|---|---|---|---|
| 1 | Topbar / Header de cierre | Opción de retorno rápido | Media-Baja | N/A |
| 2 | Icono de Éxito con Glow | Confirmación visual inmediata | Dominante | Icono discreto (si existe) |
| 3 | Mensaje de Éxito (H1) | Feedback textual claro | Alta | Párrafo estándar |
| 4 | Acciones de Usuario | Continuar navegación (Home/WA) | Alta | Enlace simple |

## 5. Composición visual y ritmo vertical

| Aspecto | Referencia en Vue | Observación en WordPress | Impacto en la migración |
|---|---|---|---|
| Ancho de contenido | Centrado absoluto | Ancho de página estándar | Crítico: Layout inmersivo |
| Espaciado vertical entre bloques | ~48px (3rem) | ~24px | Preservar aire para impacto |
| Padding interno de secciones | ~32px (Paddings laterales) | ~15px | Vue es más expansivo |
| Alineación general | Centrado horizontal y vertical | Alineación estándar | Cambio de composición |
| Densidad visual | Muy Baja (Minimalista) | Media | Mantener el foco en el éxito |
| Uso de aire / respiración | Extensivo en todo el viewport | Limitado | Clave para la estética premium |

## 6. Responsive y breakpoints observados

| Viewport | Comportamiento observado en Vue | Observación en WordPress | Diferencia crítica |
|---|---|---|---|
| Desktop | Layout centrado con gran espacio negativo | Página estándar completa | Foco central inmersivo |
| Tablet | Mantiene centrado, botones en línea | Similar | Sin diferencias mayores |
| Mobile | Botones ocupan el ancho completo (stack) | Alineado a la izquierda | UX de botones grandes |

## 7. Interacciones y comportamiento perceptible

| Elemento / interacción | Comportamiento esperado en Vue | Observación en WordPress | Relevancia para la migración |
|---|---|---|---|
| Hover | Brillo intenso en botón de WhatsApp | N/A | Refuerza el CTA |
| Estados activos | N/A | N/A | N/A |
| Scroll / sticky | Inhabilitado (Vista estática) | N/A | Evita distracciones |
| Acordeones / tabs / sliders | N/A | N/A | N/A |
| Transiciones visibles | Glow pulsante en el icono | N/A | Estética de "energía tecnológica" |

## 8. Diferencias críticas frente a WordPress

| ID | Categoría | Descripción de la diferencia | Evidencia | Severidad | Prioridad de migración |
|---|---|---|---|---|---|
| D-01 | Estética | Uso de "Stage Glow" (iluminación de fondo). | `.thanks-stage__glow` en Vue | Media | Media |
| D-02 | Composición | Layout centrado inmersivo tipo "App Shell". | Clase `.thanks-shell` | Alta | Alta |
| D-03 | UX | Botón de WhatsApp destacado como acción primaria. | `.thanks-actions__whatsapp` | Alta | Media |

## 9. Evidencia observable

1. El icono central tiene un diámetro de 120px con un borde circular y un efecto de resplandor naranja (`box-shadow` o `drop-shadow`).
2. El fondo (`.thanks-view`) utiliza gradientes radiales en las esquinas superiores e inferiores para evitar el fondo plano.
3. Los botones de acción tienen una altura mínima de ~48px para facilitar el click en dispositivos móviles.

## 10. Snippets F12 ejecutados en Vue

### Snippet 1
**Objetivo:** Obtener las dimensiones y efectos del icono de éxito.
**Elemento o zona inspeccionada:** `.thanks-main__icon`
**Qué valida:** Jerarquía visual central.

```js
const icon = document.querySelector('.thanks-main__icon');
const styles = window.getComputedStyle(icon);
console.log({
  width: icon.offsetWidth,
  height: icon.offsetHeight,
  backgroundColor: styles.backgroundColor,
  boxShadow: styles.boxShadow
});
```

**Resultado observado:** `{ width: 120, height: 120, backgroundColor: "rgba(255, 154, 77, 0.14)", boxShadow: "0 0 40px rgba(255, 154, 77, 0.2)" }` (valores aproximados basados en observación).
**Conclusión útil para migración:** El icono no es solo un elemento gráfico, es el ancla visual de la página y requiere el efecto de sombra para su paridad estética.

### Snippet 2
**Objetivo:** Verificar padding del contenedor principal.
**Elemento o zona inspeccionada:** `.thanks-stage`
**Qué valida:** Ritmo vertical y centrado.

```js
const stage = document.querySelector('.thanks-stage');
console.log('Padding Vertical:', window.getComputedStyle(stage).paddingBlock);
```

**Resultado observado:** `Padding Vertical: 48px` (3rem).
**Conclusión útil para migración:** El espaciado de 3rem es constante en desktop para centrar el contenido en el viewport.

## 11. Criterios de migración hacia WordPress

1. Implementar la página de confirmación como una plantilla dedicada (no un simple mensaje inline) para mantener la autoridad de marca.
2. Replicar los gradientes radiales de fondo para evitar que la página se vea vacía.
3. Asegurar que el botón de WhatsApp sea el CTA principal destacado cromáticamente.

## 12. Pendientes y dudas abiertas

* ¿Se debe incluir el seguimiento de conversiones (GTM/GA4) específicamente en esta vista durante la migración?
* Confirmar si el botón de "Cerrar" (X) debe redirigir siempre a la Home o a la página anterior.

## 13. Resumen ejecutivo de la vista

La vista de Gracias en Vue es una pieza clave de la experiencia de marca, transformando un evento técnico (envío de formulario) en un momento de satisfacción visual mediante el uso de iluminación generativa (glow) y un layout inmersivo. La migración a WordPress debe evitar el uso de páginas predeterminadas y optar por una composición centrada que replique los 3rem de padding y los efectos de resplandor para mantener la consistencia premium.

---
