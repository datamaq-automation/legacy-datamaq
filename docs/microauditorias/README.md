# Índice de microauditorías WordPress

Esta carpeta contiene microauditorías técnicas orientadas a acercar progresivamente la implementación WordPress a la referencia Vue local.

La fuente de verdad visual y funcional es:

- Vue local: `http://localhost:5173`

El objetivo de esta carpeta no es documentar vistas completas, sino registrar y trazar **diferencias puntuales concretas** dentro de secciones específicas, resolverlas con cambios pequeños y verificables, y dejar constancia documental y en Git de cada intervención.

## Alcance de una microauditoría

Cada microauditoría debe cubrir **una sola diferencia puntual concreta**.

Ejemplos válidos:
- altura del header global
- espaciado superior del hero en Home
- gap entre campos del formulario de contacto
- ancho del logo en sticky header
- padding superior del footer

Ejemplos no válidos:
- arreglar todo el header
- igualar toda la Home
- mejorar responsive general
- corregir todo el formulario

## Flujo obligatorio

Toda microauditoría debe seguir este flujo:

1. auditar
2. documentar hallazgos
3. aplicar cambios pequeños
4. validar
5. registrar en Git

## Reglas operativas

1. La fuente de verdad sigue siendo Vue local.
2. Cada microauditoría debe tener su propio archivo Markdown.
3. Cada microauditoría debe terminar obligatoriamente con un commit de Git.
4. Una microauditoría solo puede darse por terminada si queda en estado **`Cerrada`**.
5. Si queda una diferencia residual relevante, debe abrirse **otra microauditoría separada**.
6. No deben mezclarse varias diferencias no relacionadas en un mismo documento.
7. Antes de modificar cualquier archivo, debe evaluarse:
   - arquitectura
   - principios SOLID cuando apliquen
   - buenas prácticas de CSS
   - buenas prácticas de JS
   - buenas prácticas de Blocksy
8. La implementación debe priorizar la superficie más local, segura, mantenible y reversible.
9. Si Git no está limpio al comenzar, no debe iniciarse ninguna microauditoría hasta dejar constancia explícita del bloqueo.

## Convención de nombres

Cada archivo debe usar esta convención:

`docs/microauditorias/<ambito>-<seccion>-<diferencia-puntual>.md`

Ejemplos:
- `docs/microauditorias/global-header-altura.md`
- `docs/microauditorias/home-hero-espaciado-superior.md`
- `docs/microauditorias/contacto-formulario-gap-campos.md`
- `docs/microauditorias/global-footer-padding-superior.md`

## Plantilla obligatoria

Cada microauditoría debe seguir estrictamente:

- `docs/microauditorias/plantilla.md`

No se deben alterar secciones, orden ni estructura sin una instrucción explícita.

## Estados permitidos

Estados esperados en una microauditoría:

- `Pendiente`
- `En curso`
- `Validada`
- `Cerrada`

Regla final:
- solo se considera finalizada cuando el estado es **`Cerrada`**
- si la validación deja un residual relevante, debe abrirse otra microauditoría y la actual no debe absorber ese trabajo adicional

## Índice general

La siguiente tabla resume todas las microauditorías existentes, su estado y su trazabilidad en Git.

| ID | Archivo | Ámbito | Vista o página afectada | Sección | Diferencia puntual | Estado | Prioridad | Commit de cierre | Fecha de cierre |
|---|---|---|---|---|---|---|---|---|---|
| MA-001 | [global-header-altura.md](./global-header-altura.md) | Global | Todas las vistas con header | Header | Altura del header | Cerrada | Alta | `abc1234` | 2026-04-19 |
| MA-002 | [home-hero-espaciado-superior.md](./home-hero-espaciado-superior.md) | Home | Home | Hero | Espaciado superior | En curso | Alta |  |  |
| MA-003 | [contacto-formulario-gap-campos.md](./contacto-formulario-gap-campos.md) | Contacto | Contacto | Formulario | Gap entre campos | Pendiente | Media |  |  |

## Criterio de cierre de esta carpeta

Esta carpeta se considera correctamente mantenida cuando:

1. cada diferencia puntual relevante tiene su propio archivo
2. cada archivo sigue `docs/microauditorias/plantilla.md`
3. cada microauditoría trazable cerrada tiene su commit registrado
4. la tabla de este índice refleja fielmente el estado real de los archivos
5. no existen microauditorías marcadas como resueltas si todavía mantienen residuales relevantes sin separar