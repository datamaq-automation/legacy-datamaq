# Microauditoría: Home — Integrity & Navigation

## 1. Ficha de microauditoría

| Campo | Valor |
|---|---|
| ID | home-integrity-navigation |
| Archivo | docs/microauditorias/home-integrity-navigation.md |
| Estado | Cerrada |
| Prioridad | Media |
| Fecha de inicio | 2026-04-19 |
| Fecha de cierre | 2026-04-19 |
| Vista o página afectada | Home |
| URL Vue | http://localhost:5173 |
| URL WordPress | https://datamaq.com.ar |
| Sección | Header / Global |
| Diferencia puntual | Enlaces de navegación rotos o inconsistentes |
| Orden de trabajo | 12 |
| Commit de cierre | 35af1e4 |

## 2. Objetivo del microcambio

Asegurar la integridad funcional de la navegación en la Home page, eliminando enlaces a secciones inexistentes y sincronizando los anclajes con la estructura real de componentes implementada.

## 3. Alcance

- Incluye:
  - Modificación de `header.php` (Desktop y Mobile).
  - Eliminación de los enlaces "#tarifas" y "#cobertura".
  - Adición del enlace "#perfil".
  - Verificación de los IDs de anclaje en todos los `template-parts`.
- No incluye:
  - Creación de nuevas secciones de contenido.

## 4. Evidencia inicial

| Aspecto auditado | Referencia en Vue | Observación en WordPress | Método de verificación | Nivel de certeza |
|---|---|---|---|---|
| Links Navegación | Solución, Proceso, Perfil, FAQ | Solución, Proceso, Alcance, Cobertura, FAQ | Inspección de código | Alta |
| IDs Secciones | `#servicios`, `#proceso`, `#perfil`, `#faq` | `#servicios`, `#proceso`, `#perfil` (Ok), `#faq` | Inspección de código | Alta |

## 5. Hallazgo confirmado

La barra de navegación de WordPress contiene enlaces ("Alcance", "Cobertura") que no tienen una sección correspondiente en el DOM, lo que genera una experiencia de usuario fallida. El enlace clave al "Perfil" está ausente en la botonera principal, a pesar de que la sección existe y es funcional.

## 6. Hipótesis revisadas

1. Sincronizar el menú del `header.php` con el snapshot de Vue restaurará la coherencia 1:1 en la navegación del sitio.

## 7. Decisión de implementación

| Opción | Descripción | Ventajas | Riesgos | Decisión |
|---|---|---|---|---|
| A | Actualizar menú en `header.php` y validar anclajes. | Navegación profesional y funcional. | Ninguno. | Elegida |

## 8. Cambios aplicados

| Tipo de cambio | Archivo(s) afectados | Descripción breve | Motivo |
|---|---|---|---|
| Navegación | `header.php` | Actualización de items en menú Desktop y Mobile. | Eliminación de links rotos y paridad con Vue. |
| Navegación | `header.php` | Reemplazo de Alcance/Cobertura por Perfil. | Sincronización funcional. |
| Integridad | Global | Verificación de IDs de anclaje en todos los templates. | Evitar navegación fallida. |

## 9. Validación posterior al cambio

| Criterio de validación | Resultado en WordPress | Comparación con Vue | Estado |
|---|---|---|---|
| Link #perfil | Funcional y desplaza a la sección. | Idéntico. | OK |
| Links eliminados | Alcance y Cobertura removidos con éxito. | Idéntico. | OK |
| Mobile Menu | Sincronizado y funcional. | Idéntico. | OK |


## 11. Resultado de la microauditoría

* Estado final: Cerrada
* Resultado: Resuelto
* ## Diferencia residual: Ninguna relevante.
* ## Siguiente microauditoría sugerida: Final de la Fase de Documentación y Paridad (Home).

## 12. Registro Git

| Campo | Valor |
| --- | --- |
| Rama | main |
| Estado de Git revisado antes de cambios | Sí |
| Archivos incluidos en commit | `header.php` |
| Mensaje de commit | style(nav): synchronize navigation links with Vue reference |
| Hash de commit | 35af1e4 |

## 13. Resumen ejecutivo

Se ha restaurado la integridad de la navegación en la Home Page, eliminando enlaces a secciones inexistentes ("Alcance", "Cobertura") y añadiendo el enlace funcional a "#perfil". Se validó que todos los anclajes dirijan a sus respectivos componentes BEM, sincronizando la experiencia de usuario con la arquitectura de la referencia Vue.

