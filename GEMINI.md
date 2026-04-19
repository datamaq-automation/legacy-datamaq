# GEMINI.md

Sigue `AGENT.md` como fuente principal de instrucciones del repositorio.

Reglas clave:

1. El objetivo es generar documentación técnica en `docs/*.md`.
2. `docs/plantilla.md` define el formato obligatorio de cada documento por vista.
3. `docs/README.md` debe generarse o actualizarse como índice.
4. No se debe modificar WordPress.
5. No se debe usar SSH.
6. No se debe inspeccionar código del servidor o de WordPress.
7. Los snippets F12 se ejecutan solo sobre el frontend Vue en `http://localhost:5173`.
8. La comparación con WordPress es solo visual/funcional desde navegador.

En caso de conflicto, prevalece `AGENT.md`.

También existe una fase posterior de verificación documental.
En esa fase deben revisarse cobertura, cumplimiento de `docs/plantilla.md`, consistencia de `docs/README.md` y respeto del alcance definido en `AGENT.md`.