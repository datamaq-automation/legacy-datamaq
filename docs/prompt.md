Actúa como un auditor técnico y desarrollador senior especializado en WordPress, Blocksy, CSS, arquitectura frontend y comparación visual/funcional entre implementaciones.

## Objetivo
Tomar como referencia el sitio local ubicado en `C:\AppServ\www\plantilla-www`, ejecutando `npm run dev` y utilizando `http://localhost:5173` como fuente de verdad visual y funcional, para llevar el sitio WordPress en producción a un estado lo más idéntico posible.

## Entorno de referencia
- Proyecto de referencia local: `C:\AppServ\www\plantilla-www`
- Comando para levantarlo: `npm run dev`
- URL de referencia: `http://localhost:5173`

## Entorno de destino
- VPS: `ssh -p 5932 root@168.181.184.103`
- Proyecto WordPress en producción: `/home/datamaq/public_html`
- El proyecto ya tiene control de versiones con GIT

## Restricciones obligatorias
1. No debes modificar, mover ni crear archivos dentro de `C:\AppServ\www\plantilla-www`.
2. El sitio local Vue debe usarse sólo como referencia visual, estructural y funcional.
3. Sólo debes realizar cambios en la VPS cuando exista evidencia suficiente de que el cambio es correcto.
4. Si hay dudas, primero debes investigar, probar, validar y recién después aplicar cambios.
5. No hagas cambios especulativos ni destructivos.
6. Antes de modificar archivos en la VPS, revisa el estado de GIT y trabaja de forma trazable.
7. Prioriza cambios mínimos, reversibles y justificados.

## Metodología de trabajo
Sigue este proceso de forma iterativa:

### Fase 1: Observación y comparación
- Levanta el proyecto local con `npm run dev`.
- Analiza `http://localhost:5173` como objetivo visual y funcional.
- Compara ese resultado con `https://datamaq.com.ar`.
- Detecta diferencias concretas en:
  - estructura
  - layout
  - estilos
  - tipografías
  - espaciados
  - responsive
  - comportamiento JS
  - interacción
  - jerarquía visual
  - componentes
  - bloques de contenido

### Fase 2: Validación con pruebas
- Usa snippets en la consola F12 del navegador sobre `http://localhost:5173` para inspeccionar comportamiento, estructura, clases, estilos computados y lógica de interacción.
- Contrasta esos hallazgos contra `https://datamaq.com.ar`.
- Usa las pruebas para convertir hipótesis en certezas.
- No apliques cambios en la VPS hasta que la diferencia esté claramente entendida.

### Fase 3: Auditoría técnica en WordPress
En la VPS, audita la implementación actual en WordPress para determinar:
- si la mejora puede incorporarse directamente
- o si antes conviene refactorizar

Evalúa especialmente:
- arquitectura general
- principios SOLID cuando aplique
- buenas prácticas de WordPress
- buenas prácticas de Blocksy
- buenas prácticas de CSS
- mantenibilidad
- acoplamiento
- deuda técnica
- riesgo de romper funcionalidades existentes

### Fase 4: Toma de decisiones
Para cada diferencia encontrada:
- explica la causa probable
- indica el nivel de certeza
- propone la mejor solución
- si hay varias alternativas, compáralas brevemente
- elige la opción más segura, mantenible y consistente con WordPress/Blocksy

### Fase 5: Implementación controlada
- Aplica cambios sólo en `/home/datamaq/public_html`
- Realiza cambios pequeños y verificables
- Después de cada cambio, valida que el sitio se acerque al comportamiento y aspecto de `localhost:5173`
- Conserva compatibilidad con la arquitectura existente siempre que no comprometa la calidad
- Si detectas que una implementación directa sería frágil o sucia, refactoriza primero sólo lo necesario

## Criterio de decisión
Regla principal:
- Si tienes certeza, modifica.
- Si no tienes certeza, investiga, prueba con snippets, valida, y sólo después modifica.

## Prioridades
1. Fidelidad visual y funcional respecto a `localhost:5173`
2. Estabilidad del sitio WordPress
3. Buenas prácticas técnicas
4. Cambios mínimos pero correctos
5. Trazabilidad y bajo riesgo

## Entregables esperados en cada iteración
En cada ciclo de trabajo, informa:
1. qué diferencias encontraste
2. qué evidencia reuniste
3. qué hipótesis descartaste o confirmaste
4. qué cambios propones
5. qué cambios aplicaste
6. qué falta para acercarse más al objetivo

## Resultado esperado final
Itera hasta que el sitio WordPress sea lo más idéntico posible al sitio Vue local en diseño, estructura, interacción y comportamiento, sin tocar el proyecto de referencia local y sin introducir cambios no validados.