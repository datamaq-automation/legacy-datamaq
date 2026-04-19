# Vista: Contacto (DataMaq)

## 1. Ficha de la vista

| Campo | Valor |
|---|---|
| Vista | Contacto |
| Archivo | `src/ui/pages/ContactPage.vue` |
| URL Vue | `http://localhost:5173/contacto` |
| URL WordPress | `https://datamaq.com.ar/#contacto` |
| Estado del documento | Completo |
| Fecha de análisis | 2026-04-19 |
| Viewports analizados | Mobile (375px), Tablet (768px), Desktop (1440px) |
| Alcance | Análisis de página dedicada vs sección inline, comportamiento del formulario multi-paso y estética de paneles. |

## 2. Objetivo de la vista

La página de Contacto tiene como objetivo principal la captura de leads calificados mediante un proceso de consulta estructurado. A diferencia de la implementación en WordPress, esta vista actúa como un destino dedicado que minimiza distracciones y guía al usuario a través de un formulario de tres pasos (Identidad, Proyecto, Contacto) para mejorar la calidad de la información recibida.

## 3. Alcance de comparación

- Comparado visualmente entre Vue y WordPress:
  - Estructura del formulario, campos requeridos, paleta de colores de fondo y jerarquía visual del Hero.
- Validado con snippets F12 solo en Vue:
  - Padding vertical del Hero (clamp), ancho máximo de paneles (485px), y lógica visual del stepper.
- No evaluado:
  - Validación de campos en tiempo real (regex), envío real del formulario (API POST), ni persistencia de borrador local.

## 4. Estructura visible y jerarquía

| Orden | Sección / bloque visible | Propósito aparente | Jerarquía visual en Vue | Observación en WordPress |
|---|---|---|---|---|
| 1 | Header Simplificado | Navegación de retorno y Branding | Media | N/A (Sección inline) |
| 2 | Hero de Contacto | Autoridad y contexto de soporte | Alta | N/A (Directo al formulario) |
| 3 | Stepper (Pasos 1-3) | Guiar la carga de datos | Dominante | N/A (Campos lineales) |
| 4 | Formulario de Contacto | Input de datos del cliente | Muy Alta | Media |
| 5 | Footer de Contacto | Información legal y cierre | Baja | Media (Footer global) |

## 5. Composición visual y ritmo vertical

| Aspecto | Referencia en Vue | Observación en WordPress | Impacto en la migración |
|---|---|---|---|
| Ancho de contenido | ~485px (Panel/Form) | Full width con márgenes laterales | Crítico: Centralizar formularios |
| Espaciado vertical entre bloques | ~32px (Paddings de clamp) | ~40px | Mantener densidad en móvil |
| Padding interno de secciones | 52px (Hero Vertical) | ~20px (Section inline) | Vue es mucho más "espacioso" |
| Alineación general | Centrada / Grid responsive | Alineación a la izquierda | Cambio de layout necesario |
| Densidad visual | Baja (Muy aireado) | Alta (Compacto) | Preservar el estilo premium de Vue |
| Uso de aire / respiración | Significativo en paneles | Mínimo | Core de la estética de Vue |

## 6. Responsive y breakpoints observados

| Viewport | Comportamiento observado en Vue | Observación en WordPress | Diferencia crítica |
|---|---|---|---|
| Desktop | Layout de dos columnas para panels | Sección de ancho completo | Distribución de paneles |
| Tablet | Apilamiento de paneles (Intro/Support) | Sección compacta | Breakpoint en 992px |
| Mobile | Formulario ocupa 100% del container | Campos apilados | UX de pasos es vital en móvil |

## 7. Interacciones y comportamiento perceptible

| Elemento / interacción | Comportamiento esperado en Vue | Observación en WordPress | Relevancia para la migración |
|---|---|---|---|
| Hover | Chips de navegación con glow naranja | N/A | Ayuda a la navegación interna |
| Estados activos | Indicador de paso en el stepper | N/A | Claridad en el proceso |
| Scroll / sticky | Header con backdrop-blur | N/A | Estética moderna |
| Acordeones / tabs / sliders | Transición entre pasos (Stepper) | N/A | Dinamismo y menor carga cognitiva |
| Transiciones visibles | Pulsación en botón "Siguiente" | N/A | Feedback de usuario |

## 8. Diferencias críticas frente a WordPress

| ID | Categoría | Descripción de la diferencia | Evidencia | Severidad | Prioridad de migración |
|---|---|---|---|---|---|
| D-01 | Funcionalidad | Formulario multi-paso (Identidad/Proyecto/Contacto). | `ContactFormSection.vue` | Alta | Alta |
| D-02 | Composición | Uso de "Paneles" (Intro y Support) con efecto glassmorphism. | Clase `.c-contact-page-panel` | Media | Media |
| D-03 | Navegación | Inclusión de "Chips" para saltar a secciones de la Home. | Clase `.c-contact-page-chip` | Baja | Baja |
| D-04 | Contenido | Campo de "Apellido" (opcional) no presente en WP. | Input id `last_name` | Media | Media |

## 9. Evidencia observable

1. El fondo utiliza un gradiente radial (`radial-gradient(circle at top right, rgba(235, 126, 73, 0.14), transparent 24%)`) que le da profundidad.
2. Los paneles tienen un `backdrop-filter: blur(10px)` y `border: 1px solid rgba(255, 255, 255, 0.1)`.
3. El formulario multi-paso reduce el ruido visual al mostrar solo 2-3 campos por pantalla.

## 10. Snippets F12 ejecutados en Vue

### Snippet 1
**Objetivo:** Obtener el valor computado del gradiente de fondo.
**Elemento o zona inspeccionada:** `.app-shell--contact`
**Qué valida:** Fidelidad cromática.

```js
const shell = document.querySelector('.app-shell--contact');
console.log(window.getComputedStyle(shell).backgroundImage);
```

**Resultado observado:** `radial-gradient(at right top, rgba(255, 154, 77, 0.14), transparent 24%), linear-gradient(rgb(10, 11, 30) 0%, rgb(18, 19, 44) 40%, rgb(24, 25, 54) 100%)`
**Conclusión útil para migración:** El fondo no es un color sólido, es una composición compleja que debe replicarse en CSS para mantener la estética.

### Snippet 2
**Objetivo:** Medir el espaciado interno de los paneles.
**Elemento o zona inspeccionada:** `.c-contact-page-panel`
**Qué valida:** Densidad visual.

```js
const panel = document.querySelector('.c-contact-page-panel');
const padding = window.getComputedStyle(panel).padding;
console.log('Panel Padding:', padding);
```

**Resultado observado:** `Panel Padding: 32px` (en Desktop).
**Conclusión útil para migración:** El padding de 32px es generoso y contribuye a la imagen premium de la marca técnico-profesional.

## 11. Criterios de migración hacia WordPress

1. Considerar si el formulario en WordPress debe migrar a un formato de pasos para mejorar conversiones.
2. Aplicar el gradiente radial en el contenedor de contacto para evitar el look "plano" de la versión actual en WP.
3. Mantener el ancho máximo de ~500px para el formulario para evitar que los inputs se estiren demasiado en pantallas anchas.

## 12. Pendientes y dudas abiertas

* ¿El guardado de borrador (draft) es una funcionalidad requerida para el sitio final?
* Confirmar si el modal de WhatsAppFab debe tener el mismo comportamiento en la página de contacto que en la Home.

## 13. Resumen ejecutivo de la vista

La vista de Contacto en Vue representa un salto cualitativo sobre WordPress, transformando una sección complementaria en una experiencia de usuario dirigida y profesional. La migración estética debe priorizar la implementación del stepper (aunque sea visual) y el uso de gradientes y transparencias (glassmorphism) en los contenedores de datos para preservar la identidad visual de "Ingeniería de vanguardia".

---
