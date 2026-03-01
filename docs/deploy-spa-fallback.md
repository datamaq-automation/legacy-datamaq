# Deploy SPA Fallback

Para usar `vue-router` en `history mode` con URLs limpias como `/contact`, el servidor que entrega el frontend tiene que devolver `index.html` para rutas SPA, pero sin interceptar la API.

## Objetivo

- `/v1/*` sigue yendo a FastAPI.
- `/api/*` sigue yendo a FastAPI si ese prefijo existe en el entorno.
- cualquier otra ruta del frontend (`/`, `/contact`, `/gracias`, `/cotizador/...`) debe resolver `index.html` cuando no exista un archivo físico.

## Nginx

Snippet de referencia:

```nginx
server {
  listen 80;
  server_name _;

  root /var/www/plantilla-www/dist;
  index index.html;

  location ^~ /v1/ {
    proxy_pass http://127.0.0.1:8899;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location ^~ /api/ {
    proxy_pass http://127.0.0.1:8899;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Verificacion rapida

1. abrir `/contact` directamente en el navegador: debe responder HTML de la SPA, no 404.
2. refrescar `/contact`: debe seguir cargando la SPA.
3. llamar `/v1/health`: debe responder JSON desde FastAPI, no `index.html`.
4. si usas `/api/v1/...` en el reverse proxy, verificar que siga llegando al backend y no al frontend.
