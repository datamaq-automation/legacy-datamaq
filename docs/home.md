# Home de Agustin Bustos / DataMaq

## 1. Ficha de la vista

| Campo | Valor |
|---|---|
| Vista | Home / Inicio |
| Archivo | `src/ui/pages/HomePage.vue` |
| URL Vue | `http://localhost:5173/` |
| URL WordPress | `https://datamaq.com.ar/` |
| Estado del documento | Completo |
| Fecha de análisis | 2026-04-19 |
| Viewports analizados | Mobile (390px), Tablet (820px), Desktop (1440px) |
| Alcance | Análisis de estructura, composición visual, ritmo vertical y responsive. |

## 2. Objetivo de la vista

La Home de Agustin Bustos / DataMaq funciona como una landing page técnica de alta conversión orientada a captar clientes interesados en soluciones de IoT y gestión de datos. Debe preservar la jerarquía de secciones que guía al usuario desde la propuesta de valor (Hero) hasta la conversión directa (Formulario de contacto), manteniendo el estilo visual oscuro con acentos de alto contraste (naranja) y la estética de "ingeniería sofisticada" presente en WordPress.

## 3. Alcance de comparación

- Comparado visualmente entre Vue y WordPress:
  - Orden de secciones, paleta de colores, tipografía principal y comportamiento de navegación sticky.
- Validado con snippets F12 solo en Vue:
  - Ancho de contenedores, espaciado vertical entre bloques, padding de secciones y comportamiento del mobile dock.
- No evaluado:
  - Rendimiento (Lighthouse), accesibilidad profunda (WCAG 2.1), ni lógica de backend de los formularios.

## 4. Estructura visible y jerarquía

| Orden | Sección / bloque visible | Propósito aparente | Jerarquía visual en Vue | Observación en WordPress |
|---|---|---|---|---|
| 1 | Hero / Banner Principal | Propuesta de valor y CTAs rápidos | Dominante (H1, badge naranja) | Idéntica composición |
| 2 | Perfil Profesional (#perfil) | Generar autoridad y confianza | Secundaria | Idéntica composición |
| 3 | Soluciones Técnicas (#servicios) | Detalle de servicios IoT/Datos | Alta (Cards con iconos) | Idéntica composición |
| 4 | Preguntas Frecuentes (#faq) | Resolver dudas y objeciones | Media-Baja | Idéntica composición |
| 5 | Consulta Técnica (#contacto) | Lead generation (Conversión) | Muy Alta (Formulario por pasos) | Presente como ancla, menos prominente |

## 5. Composición visual y ritmo vertical

| Aspecto | Referencia en Vue | Observación en WordPress | Impacto en la migración |
|---|---|---|---|
| Ancho de contenido | ~485px (Observado durante análisis) | Full width con márgenes laterales | Crítico: Alinear comportamiento fluido |
| Espaciado vertical entre bloques | ~28px - 29px | Similar (aproximadamente 2rem) | Mantener ritmo para consistencia |
| Padding interno de secciones | 52px (Hero Top) | ~60px en Hero | Ajuste menor necesario |
| Alineación general | Centrada (Mobile) / Left (Desktop) | Idéntica | Sin riesgo |
| Densidad visual | Media (Respiración adecuada) | Similar | Preservar el "aire" entre bloques |
| Uso de aire / respiración | Significativo en márgenes | Consistente | Core de la estética premium |

## 6. Responsive y breakpoints observados

| Viewport | Comportamiento observado en Vue | Observación en WordPress | Diferencia crítica |
|---|---|---|---|
| Desktop | Navegación horizontal en header | Tradicional | Layout expandido |
| Tablet | Transición de layout (sin dock) | Similar | Breakpoint en 1024px |
| Mobile | Mobile Dock activo (Inicio/Contacto) | No posee dock inferior | El dock en Vue mejora UX móvil |

## 7. Interacciones y comportamiento perceptible

| Elemento / interacción | Comportamiento esperado en Vue | Observación en WordPress | Relevancia para la migración |
|---|---|---|---|
| Hover | Brillo en botones naranja | Cambio de opacidad/color | Estética premium |
| Estados activos | Link subrayado en navegación | Sin indicador visual claro | Mejora de accesibilidad en Vue |
| Scroll / sticky | Header sticky con desenfoque | Sticky simple | El efecto glassmorphism en Vue |
| Acordeones / tabs / sliders | Apertura suave en FAQ | Apertura instantánea | Transiciones animadas en Vue |
| Transiciones visibles | Fade-in al cargar secciones | Carga estática | Dinamismo visual en Vue |

## 8. Diferencias críticas frente a WordPress

| ID | Categoría | Descripción de la diferencia | Evidencia | Severidad | Prioridad de migración |
|---|---|---|---|---|---|
| D-01 | UX/Mobile | Inclusión de Dock inferior para navegación rápida. | `.c-home-dock` en Vue vs N/A en WP | Media | Media |
| D-02 | Composición | Fondo con patrón de rejilla (grid) más definido en Vue. | Overlay visual en Hero | Baja | Baja |
| D-03 | Estructura | El formulario de contacto es un componente multi-paso en Vue. | Interacción modal/pasos vs estático | Alta | Alta |

## 9. Evidencia observable

1. La paleta de colores mantiene el fondo `#0a0b1e` y acentos en `#ff9a4d`.
2. El uso de la tipografía (Inter/Roboto) es consistente con la imagen de marca.
3. El ritmo vertical de ~30px entre secciones asegura que el contenido no se sienta amontonado.

## 10. Snippets F12 ejecutados en Vue

### Snippet 1
**Objetivo:** Medir el ancho del contenedor principal en mobile.
**Elemento o zona inspeccionada:** `.tw:container`
**Qué valida:** Ancho máximo y centrado.

```js
const container = document.querySelector('.tw\\:container');
const styles = window.getComputedStyle(container);
console.log({
  width: container.offsetWidth,
  maxWidth: styles.maxWidth,
  paddingLeft: styles.paddingLeft,
  paddingRight: styles.paddingRight
});
```

**Resultado observado:** `{ width: 485, maxWidth: "none", paddingLeft: "16px", paddingRight: "16px" }` (valor medido durante el análisis en un viewport de ~485px).
**Conclusión útil para migración:** El contenedor en Vue es fluido hasta el primer breakpoint; la medida de 485px es una observación de comportamiento elástico y no un breakpoint estándar rígido.

### Snippet 2
**Objetivo:** Validar espaciado entre secciones.
**Elemento o zona inspeccionada:** Espacio entre `#perfil` y `#servicios`.
**Qué valida:** Margen/Padding vertical para ritmo visual.

```js
const perfil = document.querySelector('#perfil');
const servicios = document.querySelector('#servicios');
const gap = servicios.getBoundingClientRect().top - perfil.getBoundingClientRect().bottom;
console.log('Vertical Gap:', gap);
```

**Resultado observado:** `Vertical Gap: 28.5`
**Conclusión útil para migración:** Mantener un gap de ~30px entre bloques para replicar la densidad visual de Vue.

## 11. Criterios de migración hacia WordPress

1. Implementar el Mobile Dock si se desea paridad total de experiencia de usuario.
2. Replicar el sistema de espaciado de ~30px entre secciones de landing.
3. Asegurar que el efecto de glassmorphism (desenfoque) en el header se mantenga en WordPress.

## 12. Pendientes y dudas abiertas

* ¿El formulario multi-paso debe ser replicado exactamente en WordPress o puede usarse un formulario lineal estándar?
* Confirmar si el patrón de rejilla de fondo es un asset estático o generado por CSS.

## 13. Resumen ejecutivo de la vista

La vista Home en Vue es una implementación técnicamente superior en términos de UX móvil debido al Dock inferior y a las micro-animaciones en FAQ y formularios. La migración estética debe enfocarse en mantener la paleta de colores oscura, el ritmo vertical de 30px y el espaciado interno de 50-60px en las cabeceras de sección para no perder la sensación de modernidad y aire.

---
