# Respuesta Frontend -> Backend sobre CORS local e integracion

Fecha: 2026-02-28
Emisor: equipo frontend
Destinatario: equipo backend

## Resumen Ejecutivo

Tomamos nota de la correccion aplicada en backend para CORS local y de la confirmacion de que el contrato canonico del backend Laravel es `/v1/*`.

Desde frontend confirmamos dos decisiones tecnicas para la siguiente etapa:

1. El perfil `integration` no debe seguir mezclando endpoints directos y proxiados.
2. La fuente de verdad del transporte por perfil debe separar datos de reglas:
   - los perfiles runtime declaran endpoints configurados
   - la resolucion tecnica del transporte debe quedar centralizada en infraestructura

## Estado Actual del Frontend

En la branch actual de frontend ya convergimos el perfil `integration` al mismo criterio para `health`, `content` y `pricing`:

- `healthApiUrl`: `/api/v1/health`
- `contentApiUrl`: `/api/v1/content`
- `pricingApiUrl`: `/api/v1/pricing`

Esto significa que en desarrollo local:

- el navegador habla con el origen del frontend
- Vite hace proxy hacia Laravel local
- el backend real sigue manteniendo como contrato canonico `/v1/*`

## Respuesta a los dos puntos pedidos por Backend

### 1. Mezcla de `direct` y `proxy` en `integration`

Confirmamos que esa mezcla ya no debe continuar.

Posicion frontend:

- la mezcla anterior fue deuda tecnica heredada
- no responde a una restriccion actual de red ni a una necesidad funcional vigente
- el objetivo de diseño para `integration` y `e2e` es un criterio unico y predecible

Decision actual:

- `integration`: `proxy`
- `e2e`: `proxy`
- produccion: endpoint canonico configurado por perfil

Consecuencia:

- para desarrollo local, el frontend ya no necesita resolver excepciones por endpoint entre `health`, `content` y `pricing`
- aun con CORS corregido en backend, mantenemos `proxy` como politica principal de desarrollo por simplicidad operativa y menor acoplamiento del navegador al host real del backend

### 2. Fuente de verdad del transporte por perfil

Confirmamos que la fuente de verdad debe ser una combinacion con responsabilidades separadas.

#### Fuente de verdad propuesta

- `runtimeProfiles.json`
  - declara datos configurados del perfil
  - ejemplos: `pricingApiUrl`, `contentApiUrl`, `healthApiUrl`
- resolver centralizado de endpoints
  - interpreta esos datos
  - deriva `browserUrl`, `pathname`, `transportMode`
  - normaliza diagnostico y observabilidad

#### Regla de diseno

Los perfiles runtime deben declarar datos, no reglas de transporte embebidas.

Las reglas tecnicas de resolucion deben vivir en infraestructura compartida para evitar:

- excepciones ocultas por archivo
- drift entre `health`, `content` y `pricing`
- divergencia entre logs y transporte real

## Aclaracion sobre el Workspace Frontend

En esta branch actual de frontend, los modulos referenciados por backend si estan presentes, por ejemplo:

- `src/infrastructure/content/runtimeProfiles.json`
- `src/infrastructure/health/probeBackendHealth.ts`
- `src/infrastructure/content/dynamicContentService.ts`
- `src/infrastructure/content/dynamicPricingService.ts`

Tambien ya existe trabajo aplicado en:

- helper comun de diagnostico backend
- normalizacion de `console.info()` de integracion
- sanitizacion de `warn/error`
- convergencia del perfil `integration` a `proxy`

## Impacto de la Correccion CORS Aplicada por Backend

La correccion de backend es valiosa y reduce friccion para:

- pruebas directas contra Laravel
- debugging manual fuera del proxy
- validacion de endpoints reales `/v1/*`

Sin embargo, desde frontend no cambia la decision arquitectonica principal:

- en desarrollo local seguimos prefiriendo `proxy + /api/v1/*`

Razon:

- desacopla el navegador del host real del backend
- reduce problemas de entorno
- simplifica consistencia entre `dev`, `preview` y flujos E2E

## Propuesta de Siguiente Iteracion

Frontend propone continuar asi:

1. Mantener `/v1/*` como contrato backend canonico.
2. Mantener `/api/v1/*` como contrato frontend de desarrollo via proxy.
3. Avanzar en un resolver compartido para todos los endpoints backend, no solo `health`.
4. Estandarizar metadatos JSON de backend cuando aplique:
   - `status`
   - `request_id`
   - `version`
   - `brand_id`
   - `timestamp`
5. Revisar luego la estrategia de logging compartido sobre `LoggerPort` o una abstraccion especifica de diagnostico.

## Estado Final

- Incidente de CORS local: resuelto por backend.
- Confirmacion frontend sobre mezcla `direct/proxy`: no debe continuar.
- Confirmacion frontend sobre fuente de verdad:
  - perfiles runtime para datos
  - resolver centralizado para reglas tecnicas de transporte
- Contrato backend canonico confirmado: `/v1/*`.

