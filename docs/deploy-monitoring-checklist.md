# Deploy Monitoring Checklist (24h)

Fecha base: 2026-03-30
Scope: deploy FTPS + ajustes de CD

## Baseline inicial (manual)

- Endpoint `/`: `200` en 3/3 checks
- Endpoint `/contact`: `200` en 3/3 checks
- Endpoint `/gracias`: `200` en 3/3 checks

Mediciones de referencia (curl):
- `time_connect`: ~0.016s a ~0.030s
- `time_starttransfer`: ~0.069s a ~0.093s
- `time_total`: ~0.069s a ~0.093s

## Checklist de seguimiento (cada 6h durante 24h)

1. Disponibilidad:
- Verificar `200` en:
  - `https://datamaq.com.ar/`
  - `https://datamaq.com.ar/contact`
  - `https://datamaq.com.ar/gracias`

2. Rendimiento básico:
- Confirmar que `time_total` no se degrada >2x respecto a baseline.

3. Funcional crítico:
- Enviar 1 formulario de contacto de prueba.

4. Señales operativas:
- Confirmar que no hubo nuevos fallos en `Deploy / FTPS (datamaq)` en GitHub Actions.
- Confirmar que no hay errores visibles de assets/caché en navegador.

## Criterios de alerta

- Algún endpoint crítico responde distinto de `200`.
- `time_total` sostenido >0.20s para páginas de referencia (desde este mismo punto de medición).
- Falla repetida de FTPS con `data-channel-failed` o `exit_code=124`.

## Registro de controles

### Control #1 (adelantado) - 2026-03-30

- Estado: OK
- Disponibilidad:
  - `/` -> `200` (3/3)
  - `/contact` -> `200` (3/3)
  - `/gracias` -> `200` (3/3)
- Latencia (`time_total`):
  - `/` max `0.088s`
  - `/contact` max `0.087s`
  - `/gracias` max `0.087s`
- Umbral 2x baseline (`0.186s`): cumplido en todas las rutas.
- Pendiente manual para siguiente control:
  - prueba funcional de envío de formulario
