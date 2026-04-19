# AGENT.md

## Propósito del repositorio
Este repositorio se usa para auditar y documentar la migración estética desde una implementación Vue de referencia hacia un sitio WordPress existente, sin aplicar cambios en WordPress.

## Fuente de verdad
La fuente de verdad visual y funcional es el proyecto Vue local:

- Proyecto: `C:\AppServ\www\plantilla-www`
- Comando: `npm run dev`
- URL de referencia: `http://localhost:5173`

El sitio WordPress publicado se usa solo para comparación visual/funcional desde navegador:

- URL WordPress: `https://datamaq.com.ar`

## Objetivo principal del agente
Generar y mantener documentación técnica en `docs/*.md` para preparar una migración estética posterior desde Vue hacia WordPress.

La salida principal es documentación.
La salida principal NO es implementación.

## Restricciones duras
El agente no debe:

1. Modificar WordPress.
2. Conectarse por SSH.
3. Inspeccionar código del servidor o del proyecto WordPress.
4. Ejecutar snippets F12 sobre WordPress.
5. Modificar, mover o crear archivos dentro de `C:\AppServ\www\plantilla-www`.
6. Presentar hipótesis no validadas como hechos.
7. Sustituir la plantilla documental definida en `docs/plantilla.md`.

## Acciones permitidas
El agente sí puede:

1. Levantar y observar el proyecto Vue local.
2. Comparar visual y funcionalmente Vue con WordPress desde navegador.
3. Ejecutar snippets F12 solo en el frontend Vue.
4. Crear o actualizar documentación en `docs/*.md`.
5. Generar o actualizar `docs/README.md`.

## Unidad principal de análisis
La unidad principal de documentación es la página o vista completa, no un design system abstracto ni componentes aislados.

La migración estética debe documentarse por vista para capturar correctamente:

- estructura visible
- jerarquía visual
- composición
- ritmo vertical
- responsive
- interacción perceptible
- consistencia visual

## Formato obligatorio de los documentos
`docs/plantilla.md` es la fuente normativa para el formato de todos los documentos por vista.

El agente debe:

- usar exactamente las secciones definidas allí
- respetar el orden exacto
- no omitir secciones
- no agregar secciones nuevas salvo instrucción explícita
- mantener tablas, listas y bloques según la plantilla

## Documentación requerida
Debe existir:

1. `docs/plantilla.md` como plantilla obligatoria
2. `docs/README.md` como índice general
3. un archivo Markdown por página o vista relevante en `docs/*.md`

## Reglas para `docs/README.md`
El índice debe listar todas las vistas documentadas y contener una tabla con estas columnas:

- Vista
- Archivo
- URL Vue
- URL WordPress
- Estado

## Criterio de evidencia
Toda afirmación debe estar basada en una de estas fuentes:

1. observación visual directa en Vue
2. observación visual directa en WordPress
3. evidencia obtenida mediante snippets F12 ejecutados solo en Vue

Cuando algo no pueda confirmarse, debe registrarse en la sección `Pendientes y dudas abiertas`.

## Uso de snippets F12
Los snippets F12 se usan solo sobre `http://localhost:5173` y solo cuando aportan evidencia útil para documentar la migración.

Usos válidos:

- medir spacing entre bloques
- confirmar ancho de contenedores
- revisar estilos computados
- validar jerarquía DOM relevante
- confirmar comportamiento visible
- verificar breakpoints observados

Usos no válidos:

- exploración sin objetivo documental
- snippets genéricos sin relación con diferencias detectadas
- cualquier snippet sobre WordPress

## Flujo recomendado de trabajo
1. recorrer una vista en Vue
2. observar la misma vista en WordPress
3. detectar diferencias críticas
4. validar en Vue con snippets cuando haga falta
5. documentar la vista en `docs/<vista>.md`
6. actualizar `docs/README.md`

## Convención de nombres
Usar nombres de archivo estables, legibles y orientados a la vista.

Ejemplos:

- `docs/home.md`
- `docs/productos.md`
- `docs/nosotros.md`
- `docs/contacto.md`

## Prioridades
1. fidelidad documental respecto a Vue
2. utilidad real para migración estética posterior
3. consistencia estricta del formato
4. evidencia observable antes que interpretación
5. cobertura por vista completa antes que detalle aislado

## Entregable esperado
El trabajo se considera correcto solo cuando:

- las vistas relevantes están documentadas en `docs/*.md`
- cada archivo respeta `docs/plantilla.md`
- `docs/README.md` fue generado o actualizado
- no se realizaron cambios en WordPress