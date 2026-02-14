# DV-01 - Matriz de consentimiento y tracking

## 1) Objetivo
Definir el comportamiento funcional y tecnico de consentimiento para analytics en el frontend.

Alcance:
- Google Analytics 4 (GA4)
- Microsoft Clarity
- Eventos de conversion y page views del sitio

## 2) Fuente de verdad y almacenamiento
- Clave activa: `consent.analytics`
- Clave legacy (solo migracion): `datamaq-www-consent`

Regla:
- Solo `consent.analytics` debe quedar persistida luego de cualquier lectura/escritura.
- Valores validos persistidos: `granted` o `denied`.
- Estado sin eleccion: clave ausente (se interpreta como `unknown` / `unset`).

## 3) Matriz de estados
| Estado de consentimiento | Persistencia esperada | Banner | Inicializacion GA4/Clarity | Envio de eventos/pageview |
| --- | --- | --- | --- | --- |
| `unknown` (sin decision) | sin clave | visible | bloqueada | bloqueado |
| `granted` | `consent.analytics=granted` | oculto | habilitada | habilitado |
| `denied` | `consent.analytics=denied` | oculto | bloqueada | bloqueado |

## 4) Matriz de transiciones
| Disparador | Estado origen | Estado destino | Persistencia esperada | Resultado de tracking |
| --- | --- | --- | --- | --- |
| Primera visita (sin clave) | n/a | `unknown` | sin clave | no se inicializa analytics, no se envian eventos |
| Click en "Aceptar" | `unknown` o `denied` | `granted` | `consent.analytics=granted` | se inicializa analytics y se habilita tracking |
| Click en "Rechazar" | `unknown` o `granted` | `denied` | `consent.analytics=denied` | se bloquea tracking para eventos futuros |
| Migracion legacy al cargar | `datamaq-www-consent` | `granted` o `denied` | mover valor a `consent.analytics` y borrar legacy | aplica reglas segun estado migrado |
| Revocacion desde configuracion futura | `granted` | `denied` | `consent.analytics=denied` | se bloquea tracking para eventos futuros |

## 5) Politica propuesta para revocacion (pendiente Product/Legal)
Estado actual de implementacion:
- Al pasar a `denied`, se bloquean eventos y page views nuevos.
- No hay panel de preferencias publico para revocar luego de aceptar.
- No hay limpieza activa de cookies de terceros ya creadas.

Decision requerida (DV-01):
- Opcion A (soft revoke): bloquear nuevos envios sin limpiar cookies existentes.
- Opcion B (hard revoke): bloquear nuevos envios y limpiar cookies GA4/Clarity cuando sea tecnicamente posible.

Recomendacion tecnica:
- Adoptar Opcion B si Legal lo exige; si no, formalizar Opcion A en politica de privacidad para evitar ambiguedad.

## 6) Eventos cubiertos por la matriz
- `contact`
- `generate_lead`
- `page_view` (via tracking SPA)

Regla:
- Estos eventos solo pueden salir cuando el estado es `granted`.

## 7) Evidencia tecnica actual (implementado)
- `src/application/consent/consentStorage.ts`
- `src/application/consent/consentManager.ts`
- `src/infrastructure/consent/consent.ts`
- `src/infrastructure/analytics/index.ts`
- `src/infrastructure/analytics/browserAnalytics.ts`
- `src/main.ts`

Tests:
- `tests/unit/application/consentManager.test.ts`
- `tests/unit/infrastructure/consent.test.ts`
- `tests/unit/infrastructure/analyticsConsentSync.test.ts`
- `tests/unit/infrastructure/browserAnalytics.test.ts`

## 8) Checklist de aprobacion DV-01 (Product/Legal)
- [ ] Se aprueba que `unknown` implique bloqueo total de analytics.
- [ ] Se aprueba que `denied` implique bloqueo total de analytics.
- [ ] Se define politica de revocacion (Opcion A u Opcion B).
- [ ] Se valida texto legal/politica de privacidad alineado con la decision.
- [ ] Se confirma que la implementacion tecnica cumple la politica aprobada.
