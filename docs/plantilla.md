# Plantilla obligatoria para documentación por vista

Todos los archivos `docs/*.md` que documenten una vista o página deben seguir exactamente esta estructura, en este orden y sin omitir secciones.

---

# <Nombre de la vista>

## 1. Ficha de la vista

| Campo | Valor |
|---|---|
| Vista | |
| Archivo | |
| URL Vue | |
| URL WordPress | |
| Estado del documento | |
| Fecha de análisis | |
| Viewports analizados | |
| Alcance | |

## 2. Objetivo de la vista

<Párrafo breve de 3 a 6 líneas. Debe explicar qué función cumple la vista y qué debe preservarse en la migración estética. No usar listas en esta sección.>

## 3. Alcance de comparación

- Comparado visualmente entre Vue y WordPress:
  - 
- Validado con snippets F12 solo en Vue:
  - 
- No evaluado:
  - 

## 4. Estructura visible y jerarquía

| Orden | Sección / bloque visible | Propósito aparente | Jerarquía visual en Vue | Observación en WordPress |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## 5. Composición visual y ritmo vertical

| Aspecto | Referencia en Vue | Observación en WordPress | Impacto en la migración |
|---|---|---|---|
| Ancho de contenido | | | |
| Espaciado vertical entre bloques | | | |
| Padding interno de secciones | | | |
| Alineación general | | | |
| Densidad visual | | | |
| Uso de aire / respiración | | | |

## 6. Responsive y breakpoints observados

| Viewport | Comportamiento observado en Vue | Observación en WordPress | Diferencia crítica |
|---|---|---|---|
| Desktop | | | |
| Tablet | | | |
| Mobile | | | |

## 7. Interacciones y comportamiento perceptible

| Elemento / interacción | Comportamiento esperado en Vue | Observación en WordPress | Relevancia para la migración |
|---|---|---|---|
| Hover | | | |
| Estados activos | | | |
| Scroll / sticky | | | |
| Acordeones / tabs / sliders | | | |
| Transiciones visibles | | | |

## 8. Diferencias críticas frente a WordPress

| ID | Categoría | Descripción de la diferencia | Evidencia | Severidad | Prioridad de migración |
|---|---|---|---|---|---|
| D-01 | | | | Alta / Media / Baja | Alta / Media / Baja |
| D-02 | | | | Alta / Media / Baja | Alta / Media / Baja |

## 9. Evidencia observable

1. 
2. 
3. 

## 10. Snippets F12 ejecutados en Vue

### Snippet 1
**Objetivo:**  
**Elemento o zona inspeccionada:**  
**Qué valida:**  

```js
// código
````

**Resultado observado:**
**Conclusión útil para migración:**

### Snippet 2

**Objetivo:**
**Elemento o zona inspeccionada:**
**Qué valida:**

```js
// código
```

**Resultado observado:**
**Conclusión útil para migración:**

## 11. Criterios de migración hacia WordPress

1.
2.
3.

## 12. Pendientes y dudas abiertas

*
*
*

## 13. Resumen ejecutivo de la vista

<Párrafo breve de 3 a 5 líneas con síntesis del estado de la vista, principales brechas frente a WordPress y foco de migración. No usar listas en esta sección.>

---

## Reglas obligatorias de uso

1. No cambiar el orden de las secciones.
2. No omitir secciones.
3. No agregar secciones nuevas salvo que una instrucción futura lo exija explícitamente.
4. Las secciones tabulares deben mantenerse como tablas.
5. Los snippets F12 se documentan solo para Vue.
6. No incluir snippets ni inspecciones técnicas ejecutadas sobre WordPress.
7. Toda afirmación debe basarse en observación visible o evidencia obtenida en Vue.
8. Si algo no puede confirmarse, debe quedar en `Pendientes y dudas abiertas`.
9. Esta plantilla documenta vistas completas, no componentes abstractos aislados.
10. El objetivo final es preparar una migración estética posterior, no implementar cambios.
