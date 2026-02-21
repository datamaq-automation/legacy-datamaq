# DV-05 - Guia para obtener credenciales (general)

Fecha de creacion: 2026-02-18

## 1) Objetivo
Estandarizar como pedir, generar, validar y guardar credenciales necesarias para operar este proyecto, minimizando riesgo y evitando secretos en frontend.

## 2) Principios obligatorios
- `least privilege`: otorgar solo permisos minimos por tarea.
- Separar credenciales por entorno (`dev`, `staging`, `prod`).
- Nunca guardar secretos en `src/`, `tests/`, `.env.example` ni commits.
- Rotacion planificada y revocacion inmediata ante sospecha de fuga.
- Toda credencial productiva debe quedar en gestor de secretos o en `GitHub Environment secrets`, no en archivos versionados.

## 3) Inventario de credenciales por sistema
### 3.1 GitHub (CI/CD)
- Uso: deploy FTPS, variables de build, checks operativos.
- Secrets esperados:
  - `VITE_BACKEND_BASE_URL`
  - `FTPS_SERVER`
  - `FTPS_PORT`
  - `FTPS_USERNAME`
  - `FTPS_PASSWORD`
  - `FTPS_REMOTE_DIR`

### 3.2 Backend FastAPI (API de contacto/mail)
- Uso: recibir submit frontend y reenviar a email/chat backend.
- Variables habituales:
  - SMTP host/port/user/password
  - remitente (`From`) y destinatario operativo
  - CORS allowlist
  - rate-limit settings
  - logs/request-id

### 3.3 Chatwoot (operacion inbox)
- Uso: gestion de conversaciones de soporte/comercial.
- Credenciales/config:
  - acceso admin/owner (2FA recomendado)
  - configuracion inbox email (IMAP/SMTP)
  - tokens API solo server-to-server (nunca frontend)

### 3.4 Correo (IMAP/SMTP)
- Uso: identidad `info@datamaq.com.ar` y threading real.
- Credenciales/config:
  - usuario/cuenta
  - password o app password
  - host/puerto TLS para SMTP/IMAP

### 3.5 Analytics/terceros
- Uso: IDs publicos (GA4/Clarity) y panel de administracion.
- Regla:
  - IDs publicos pueden vivir en config publica.
  - secretos de admin/API no deben llegar al cliente.

## 4) Procedimiento general para obtener credenciales
1. Definir necesidad exacta:
   - sistema, entorno, permiso minimo y fecha de expiracion.
2. Solicitar al owner correcto:
   - GitHub org/repo admin, DevOps, responsable de mail, owner Chatwoot.
3. Pedir solo alcance minimo:
   - ejemplo: acceso solo a `Environment production` en lugar de admin total.
4. Recibir por canal seguro:
   - password manager corporativo, vault o canal cifrado.
5. Cargar en destino seguro:
   - GitHub Secrets / vault backend / config del proveedor.
6. Verificar tecnicamente:
   - correr smoke/check del componente que usa esa credencial.
7. Registrar evidencia operativa (sin exponer secreto):
   - fecha, responsable, sistema y resultado de validacion.

## 5) Como obtener credenciales por plataforma
### 5.1 GitHub Environment secrets (repo)
1. Ir a `GitHub -> Repo -> Settings -> Environments -> production`.
2. Abrir `Environment secrets`.
3. Crear/actualizar secretos requeridos (`VITE_BACKEND_BASE_URL`, etc.).
4. Validar:
   - ejecutar workflow `CI/CD FTPS`.
   - confirmar paso `Validate inquiry API URL` en verde.
5. Evidencia:
   - ID de workflow run + estado de jobs.

### 5.2 Hosting FTPS (DonWeb/Ferozo u otro)
1. Solicitar al proveedor/owner:
   - host FTPS, puerto, usuario, password, directorio remoto.
2. Confirmar conectividad y permisos:
   - listar/crear directorio objetivo (`FTPS_REMOTE_DIR`).
3. Cargar secretos en GitHub Environment.
4. Validar deploy:
   - pipeline `Deploy Production (FTPS)` completo en verde.

### 5.3 Backend FastAPI (VPS/Cloud)
1. Solicitar al owner de infraestructura:
   - URL canonica HTTPS (`https://api.datamaq.com.ar/contact` y `/mail`).
   - acceso para cargar secretos SMTP/CORS/rate-limit.
2. Cargar variables en entorno runtime del backend (no en frontend).
3. Validar:
   - `npm run smoke:contact:backend -- <url_contact>`
   - prueba manual de `POST /mail` con payload valido.
4. Registrar:
   - fecha, endpoint probado, status code esperado/obtenido.

### 5.4 Chatwoot
1. Solicitar acceso a cuenta owner/admin.
2. Configurar/verificar inbox email publico:
   - IMAP recepcion y SMTP envio.
3. Probar flujo real:
   - mensaje entra a inbox -> reply desde Chatwoot -> respuesta llega al cliente.
4. Registrar evidencia:
   - captura de hilo + timestamps + logs relevantes sin datos sensibles.

### 5.5 Proveedor de email (SMTP/IMAP)
1. Solicitar cuenta o app password dedicada para servicio.
2. Activar TLS y limitar uso por IP/servicio cuando el proveedor lo permita.
3. Verificar parametros:
   - host, port, auth, cifrado.
4. Ejecutar envio y recepcion de prueba end-to-end.

## 6) Matriz rapida de responsabilidades
- Product/Owner:
  - define dominio, identidad publica de correo y politicas de respuesta.
- DevOps/Infra:
  - entrega credenciales FTPS/VPS/SMTP y hardening de red.
- Backend:
  - integra secretos server-side y protege endpoints.
- Frontend:
  - consume solo URLs publicas de API; nunca secretos.

## 7) Checklist de recepcion de credenciales
- [ ] La credencial corresponde al entorno correcto.
- [ ] El alcance es minimo y justificado.
- [ ] Se cargo en un storage seguro (no en repo).
- [ ] Se valido con smoke/test tecnico.
- [ ] Se registro evidencia operativa sin exponer secreto.
- [ ] Se definio fecha de rotacion o caducidad.

## 8) Anti-patrones (prohibidos)
- Compartir secretos por chat sin cifrado o en texto plano persistente.
- Subir `.env.local` o tokens a Git.
- Usar credenciales de produccion en desarrollo local.
- Exponer `Authorization`/`X-API-Key` desde cliente web.
- Reusar una sola password para multiples sistemas.

## 9) Plantilla de solicitud de credenciales
Usar este formato al pedir acceso:

```txt
Sistema: <GitHub/FTPS/FastAPI/Chatwoot/SMTP>
Entorno: <dev/staging/prod>
Motivo: <cambio o incidente>
Permiso minimo requerido: <lectura/escritura puntual>
Tiempo requerido: <temporal/permanente con revision>
Validacion planificada: <comando smoke/check>
Responsable receptor: <nombre/rol>
```

## 10) Referencias del repo
- `AGENTS.md`
- `docs/dv-depl-01.md`
- `docs/dv-secu-01.md`
- `docs/dv-chatwoot.md`
- `docs/todo.md`
