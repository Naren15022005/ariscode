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
