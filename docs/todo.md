# Listado de Tareas

## Backend endpoints y observabilidad

- Unificar la politica de resolucion de endpoints backend en un modulo de infraestructura compartido.
  Hoy la decision entre URL directa, relativa o dependiente del origen esta distribuida entre `runtimeProfiles.json`, `probeBackendHealth.ts` y los servicios remotos.

- Extraer la seleccion de endpoint de `health` a un resolver dedicado.
  `probeBackendHealth.ts` no deberia mezclar chequeo de salud con reglas de transporte por origen.

- Estandarizar el formato de logs tecnicos de backend.
  `health`, `content` y `pricing` ya emiten `console.info`, pero cada uno arma y normaliza metadatos por separado.

- Crear un helper compartido para diagnostico de backend.
  Debe resolver endpoint loggable, normalizar metadatos (`requestId`, `version`, `brandId`, `backendStatus`) y evitar duplicacion entre servicios.

## Contratos de infraestructura

- Extender `LoggerPort` para soportar `info(...)`.
  Hoy la infraestructura cae en `console.info` directo porque el puerto de logging solo expone `debug`, `warn` y `error`.

- Revisar si corresponde introducir un puerto especifico de diagnostico tecnico.
  Si el logger de aplicacion no debe absorber logs operativos de backend, conviene separar responsabilidades con un `DiagnosticsPort`.

## Configuracion y perfiles

- Definir y documentar una convencion unica por perfil para consumo backend.
  Cada perfil debe dejar explicito si usa acceso directo al backend, proxy de Vite o una excepcion puntual documentada.

- Documentar por que `integration` mezcla endpoints directos y proxiados.
  En el estado actual `health` y `content` usan URL absoluta, mientras `pricing` sigue relativo por compatibilidad de red.

## Tipado y mantenibilidad

- Introducir un tipo compartido para metadatos de respuestas backend.
  Evita repetir estructuras parciales y casts locales en `health`, `content` y `pricing`.

- Modelar explicitamente el resultado de resolucion de endpoint.
  En lugar de pasar solo `string`, usar un tipo con `configuredUrl`, `browserUrl` y `transportMode` para hacer el flujo mas claro y testeable.

## Cobertura y regresion

- Agregar tests unitarios del resolver compartido de endpoints cuando exista.
  Deben cubrir origen `localhost:5173`, origen `127.0.0.1:4173`, endpoints absolutos y endpoints relativos.

- Agregar tests unitarios del helper compartido de diagnostico cuando exista.
  Deben validar formato de logs, normalizacion de metadatos y deduplicacion donde aplique.
