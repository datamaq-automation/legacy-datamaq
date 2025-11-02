# Instalación del Proyecto

Este documento explica cómo instalar y ejecutar el frontend (Vue + Vite) y el backend (API REST en Python con Flask).

---

## 1. Instalación del Frontend

### Requisitos

- Node.js >= 16
- npm >= 8

### Pasos

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tu-usuario/profebustos-www.git
   cd profebustos-www
   ```

2. Copia el archivo de configuración de ejemplo y personalízalo:
   ```sh
   cp config.example.json config.json
   ```
   Edita `config.json` con tus datos privados:
   ```json
   {
     "WHATSAPP_NUMBER": "54911XYYYZZZZ",
     "CHAT_URL": "https://chat.tu-dominio.com.ar",
     "API_BASE_URL": "https://<subdominio>.ngrok-free.app"
   }
   ```

   > **Importante:** No subas `config.json` al repositorio. Este archivo está en `.gitignore` para proteger tus datos privados.

3. Instala las dependencias:
   ```sh
   npm install
   ```

4. Ejecuta el servidor de desarrollo:
   ```sh
   npm run dev
   ```

5. Compila para producción:
   ```sh
   npm run build
   ```

---

## 2. Instalación del Backend (Flask)

### Requisitos

- Python >= 3.8
- pip

### Pasos

1. Ve al directorio del backend (por ejemplo, `backend/`):
   ```sh
   cd backend
   ```

2. Crea un entorno virtual (opcional pero recomendado):
   ```sh
   python -m venv venv
   source venv/bin/activate   # En Linux/macOS
   venv\Scripts\activate      # En Windows
   ```

3. Instala Flask y dependencias:
   ```sh
   pip install flask flask-cors mysql-connector-python
   ```

4. Crea el archivo principal, por ejemplo `app.py`:

   ```python
   from flask import Flask, request, jsonify
   from flask_cors import CORS

   app = Flask(__name__)
   CORS(app)

   @app.route('/api/registrar_conversion.php', methods=['POST'])
   def registrar_conversion():
       data = request.get_json()
       # TODO: Validar y guardar conversión en la base de datos
       return jsonify(success=True)

   if __name__ == '__main__':
       app.run(debug=True)
   ```

5. Ejecuta el backend:
   ```sh
   python app.py
   ```

---

## 3. Configuración de la Base de Datos

- Crea una base de datos en MySQL/MariaDB.
- Crea la tabla `conversiones` según la documentación de la API.
- Configura la conexión en el backend Flask.

---

## 4. Conexión Frontend ↔ Backend

- Asegúrate de que el endpoint en `src/App.vue` apunte a la URL correcta de tu backend Flask.
- Habilita CORS en Flask para permitir peticiones desde el frontend.

---

## 5. Despliegue

- Para producción, sirve el frontend compilado desde un servidor web (Apache, Nginx, etc.).
- Ejecuta el backend Flask con un servidor WSGI (por ejemplo, Gunicorn).
- **Configuración remota:** En el flujo de despliegue (GitHub Actions), el archivo `config.json` se genera automáticamente usando los secrets configurados en el repositorio. No necesitas subir tus credenciales al código fuente.

  Ejemplo de paso en `.github/workflows/deploy.yml`:
  ```yaml
  - name: Generate config.json from secrets
    run: |
      cat > config.json <<EOF
      {
        "WHATSAPP_NUMBER": "${{ secrets.WHATSAPP_NUMBER }}",
        "CHAT_URL": "${{ secrets.CHAT_URL }}",
        "API_BASE_URL": "${{ secrets.API_BASE_URL }}"
      }
      EOF
  ```

---

## 6. Despliegue Automático con GitHub Actions

El despliegue a producción se realiza automáticamente mediante GitHub Actions usando el archivo `.github/workflows/deploy.yml`.  
En este flujo:

- El archivo `config.json` se genera automáticamente con los valores privados almacenados como secrets en el repositorio de GitHub.
- El build y el deploy se ejecutan en el entorno remoto, sin exponer credenciales en el código fuente.

**No es necesario copiar ni editar manualmente `config.json` para producción.**

Ejemplo del paso relevante en `deploy.yml`:
```yaml
- name: Generate config.json from secrets
  run: |
    cat > config.json <<EOF
    {
      "WHATSAPP_NUMBER": "${{ secrets.WHATSAPP_NUMBER }}",
      "CHAT_URL": "${{ secrets.CHAT_URL }}",
      "API_BASE_URL": "${{ secrets.API_BASE_URL }}"
    }
    EOF
```

Para más detalles, revisa el archivo `.github/workflows/deploy.yml` en el repositorio.

---

¿Dudas o problemas?  
Contacta a [Profebustos](mailto:contacto@profebustos.com.ar)