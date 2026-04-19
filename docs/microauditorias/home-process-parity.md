# Microauditoría: Home — Process Parity

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | home-process-parity |
| Archivo | docs/microauditorias/home-process-parity.md |
| Estado | Cerrada |
| Prioridad | Media |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Home |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Proceso |
| Diferencia puntual | Datos faltantes en el repositorio central y desajuste estético |
| Orden de trabajo | 10 |
| Commit de cierre | a6f9bb0 |

## 2. Objetivo del microcambio

Sincronizar la sección "Cómo trabajamos" (Proceso) para que utilice los datos dinámicos del repositorio centralizado y adopte la estética de la arquitectura BEM, incluyendo el trayecto de pasos y los estilos de badge unificados.

## 3. Alcance

- Incluye:
  - Modificación de `inc/site-data.php` para incluir el bloque `process`.
  - Modificación de `template-parts/content-proceso.php`.
  - Adición del branding (eyebrow "CÓMO TRABAJAMOS").
  - Sincronización de los 4 pasos del proceso.
- No incluye:
  - Cambio en la disposición de cuadrícula (ya es correcta 1x4).

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Datos Centralizados | Presentes | Ausentes (Error de variable indefinida potencial) | Revisión de código | Alta |
| Eyebrow Section | Presente | Ausente | Observación visual | Alta |
| Estilo Títulos | Black / Tracking-tighter | Normal | Observación visual | Alta |

## 5. Hallazgo confirmado

La sección de proceso en WordPress intenta consumir datos de un repositorio centralizado que aún no los contiene, lo que rompe el dinamismo. Además, carece del elemento badge/eyebrow que identifica el inicio de cada sección en la nueva arquitectura técnica.

## 6. Hipótesis revisadas

1. Completar el repositorio `site-data.php` con los 4 pasos definidos en Vue restablecerá la funcionalidad completa de la sección.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Completar datos y ajustar estilos en `content-proceso.php`. | Paridad técnica y visual 100%. | Ninguno. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Datos | `site-data.php` | Inclusión del objeto `process` con 4 pasos. | Centralización y sincronización de contenidos. |
| Markup | `content-proceso.php` | Adición de badge "CÓMO TRABAJAMOS" y clase `c-home-process`. | Paridad técnica BEM. |
| Estilos | `content-proceso.php` | Uso de pesos `black` y `tracking-tighter` en títulos. | Fidelidad estética. |
| Datos | `content-proceso.php` | Dinamización total del bucle de pasos. | Mantenibilidad. |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Título H2 | "Flujo de implementación técnica" | Idéntico. | OK |
| Cantidad de Pasos | 4 pasos correlativos (01-04). | Idéntico. | OK |
| Texto Badge | "CÓMO TRABAJAMOS" (Uppercase, Orange). | Idéntico. | OK |
| Estilo Números | Grandes, sutiles (opacity 0.04). | Idéntico. | OK |


## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante.
* ## Siguiente microauditoría sugerida: `home-contact-parity.md`

## 12. Registro Git

| Campo | Valor |
| --- | --- |
| Rama | main |
| Estado de Git revisado antes de cambios | Sí |
| Archivos incluidos en commit | `template-parts/content-proceso.php`, `inc/site-data.php` |
| Mensaje de commit | style(process): synchronize content and styles with Vue reference |
| Hash de commit | a6f9bb0 |

## 13. Resumen ejecutivo

Se ha implementado el flujo de trabajo de 4 pasos ("CÓMO TRABAJAMOS") en WordPress, utilizando los datos dinámicos de la referencia Vue. La sección incluye el estilo visual de números de fondo sutiles y el badge institucional sincronizado en color y tipografía. Se han integrado las clases BEM (`c-home-process`), logrando paridad técnica completa.


