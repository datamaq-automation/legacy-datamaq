---
name: ui-ux-audit
description: Auditoria de UI/UX orientada a frontend Vue para detectar regresiones visuales, problemas de usabilidad y oportunidades de mejora durante refactors. Usa navegador local (Playwright o navegador manual), revisa pantallas clave en desktop/mobile, y genera backlog priorizado en docs/todo.md (sin aplicar cambios de codigo). Usar cuando se pida revisar estetica, UX, consistencia visual, accesibilidad percibida o calidad de interfaz.
---

# UI/UX Audit

## Objetivo
Detectar oportunidades de mejora visual y de experiencia de usuario, y documentarlas en `docs/todo.md` con formato accionable.

## Alcance
- Revisar `src/ui/**` y pantallas renderizadas.
- Cubrir al menos: Home, Contacto, Cotizador, Gracias.
- Evaluar desktop y mobile.
- No modificar codigo de UI en este skill.

## Flujo de ejecucion
1. Preparar entorno y abrir sitio en navegador.
2. Recorrer pantallas clave y estados relevantes.
3. Evaluar con checklist UI/UX.
4. Convertir hallazgos en tareas priorizadas en `docs/todo.md`.
5. Reportar resumen al usuario.

## Paso 1: Preparar y abrir navegador
- Levantar app local:
  - `npm run dev`
- Si se requiere automatizar capturas, usar Playwright ya presente en el repo.
- Rutas minimas a revisar:
  - `/`
  - `/contact`
  - `/cotizador`
  - `/gracias`

## Paso 2: Recorrido minimo por pantalla
Para cada ruta, validar:
- Primer viewport mobile (~390x844)
- Viewport desktop (~1366x768)
- Estado inicial + estado con interaccion principal (ej: formulario con error/exito)

## Paso 3: Checklist UI/UX
Clasificar cada hallazgo en uno de estos pilares:

### 1) Jerarquia visual
- Titulos/subtitulos claros.
- CTA primaria claramente dominante.
- Espaciado consistente entre bloques.

### 2) Consistencia de interfaz
- Botones, inputs y cards con estilo coherente.
- Tokens de color/tipografia consistentes.
- Estados hover/focus/disabled visibles y consistentes.

### 3) Usabilidad
- Flujos de formulario sin friccion innecesaria.
- Mensajes de error comprensibles y cerca del campo.
- Navegacion obvia entre secciones clave.

### 4) Responsive y legibilidad
- Sin desbordes horizontales.
- Texto legible en mobile (tamano/contraste/interlineado).
- CTA importante visible sin zoom.

### 5) Accesibilidad percibida (UI)
- Orden visual compatible con lectura.
- Foco visible en controles interactivos.
- Contraste suficiente en texto principal/acciones.

## Paso 4: Output obligatorio en docs/todo.md
Sobrescribir `docs/todo.md` con formato:

```markdown
# Agenda de Tareas Frontend (`docs/todo.md`)

Backlog activo. Las tareas cerradas se registran en `docs/todo.done.md`.

## Tareas Pendientes

### Prioridad Alta
- [ ] [UI/UX] <titulo breve>
  - **Ruta**: `<ruta>`
  - **Viewport**: `mobile|desktop|ambos`
  - **Problema**: <descripcion concreta>
  - **Impacto**: <conversion/usabilidad/confianza>
  - **Propuesta**: <cambio puntual>
  - **Archivo objetivo**: `<ruta de archivo sugerida>`

### Prioridad Media
- [ ] ...

### Prioridad Baja
- [ ] ...

## Dudas de Alto Nivel (Registradas en docs/decisions/)

Ver `docs/decisions/preguntas-arquitectura.md` para decisiones arquitectonicas pendientes.
```

## Reglas de priorizacion
- Alta: bloquea conversion, rompe flujo principal, o regresion visual fuerte.
- Media: degrada claridad/consistencia pero hay workaround.
- Baja: refinamiento estetico sin impacto funcional inmediato.

## Criterios de calidad del hallazgo
Cada tarea debe ser:
- Observable (que se ve mal y donde).
- Reproducible (ruta + viewport + paso).
- Accionable (archivo objetivo + propuesta concreta).
- Priorizada por impacto.

## No hacer
- No editar codigo de UI directamente.
- No crear ADR salvo que aparezca una duda arquitectonica real.
- No dejar `docs/todo.md` sin tareas si se detectaron problemas reales.