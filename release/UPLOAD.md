# Cómo publicar los artefactos de release

Pasos rápidos para publicar los archivos generados en `release/` usando la CLI de GitHub (`gh`).

Requisitos:
- Tener instalado y autenticado `gh` (https://cli.github.com/).

Comandos:

En Linux/macOS:

```bash
# Crear release (por ejemplo v0.1.0) y adjuntar todos los archivos en release/
npm run release:gh v0.1.0
```

En Windows PowerShell:

```powershell
npm run release:gh-windows -v v0.1.0
# o ejecutar directamente scripts\create_release.ps1 -Tag v0.1.0
```

Qué hace:
- Usa `gh release create` para crear un release con el contenido de `release/` y el fichero `release/RELEASE_NOTES.md`.
- Si ya existe el tag, intentará subir (upload) los assets con `gh release upload --clobber`.

Notas:
- `pkg` emitió advertencias sobre bytecode para algunos módulos (dinámicos/ESM). Los ejecutables fueron generados, pero prueba los binarios en las plataformas objetivo.
- `release/checksums.txt` contiene los SHA256 de los archivos; compara con tus descargas para verificarlas.
