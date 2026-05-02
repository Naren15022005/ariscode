# Changelog

All notable changes to Aris Code CLI will be documented in this file.

## [1.0.0] - 2026-04-30

### Added
- ✨ Comando `create` con sistema de templates Handlebars
- 🔍 Comando `search` para buscar patterns disponibles
- 🐛 Comando `error` con búsqueda inteligente de soluciones (7 errores comunes)
- 📦 3 patterns incluidos: `hello-world`, `nestjs-crud`, `react-component`
- 💾 Persistencia dual: SQLite + JSON fallback
- ✅ Suite de tests completa con Vitest
- 📦 Binarios empaquetados para Windows y Linux

### Fixed
- Reemplazado `inquirer` por `prompts` (fix ESM issues en binarios)
- Eliminadas dependencias problemáticas (`ora`, `chalk`)

### Technical
- TypeScript 5.x
- Node.js 18+
- Handlebars para templates
- better-sqlite3 opcional
- pkg para empaquetado

---

# Notas adicionales (2026-04-30)

- Binarios verificados localmente en Windows y Linux. SHA256 de los artefactos:

```
F78E7736CB0557F8BD13F38A1830975AED74DE61155560F9AD5F1E9A442CA34D  ariscode-release.tar.gz
DE71AFCE47BFC5863C85238A2455DE3A8BAA784DC4902023C568C9A543B016CA  ariscode-release.zip
4261F8AD0618E2A754F0CDF5F0B2E0D13E64397A03076E8B42CE1804F9676FCF  index-linux
D8452D99D64B9F2AF65CCC5C7C6F9152BB61677340048621EA8DE25D023C91EF  index-win.exe
```

- Los binarios son grandes (>50 MB) y están adjuntos al Release. Para evitar agrandar el historial del repositorio en el futuro, se recomienda usar Git LFS para artefactos binarios.
- Si ejecutas desde código fuente y encuentras errores ESM (por ejemplo `ERR_REQUIRE_ESM`), asegúrate de tener Node.js >=18 y ejecuta:

```powershell
npm install
npm run build
```

Los binarios incluidos en la release son standalone y no requieren Node.js en la máquina que los ejecuta.
- Para reportar bugs: abre un Issue en este repositorio incluyendo la salida de `aris dev status`, el comando que ejecutaste y cualquier log/stacktrace.

Gracias por probar Aris Code — cualquier feedback es bienvenido en Issues.
