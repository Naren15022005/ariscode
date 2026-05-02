# Changelog

All notable changes to Aris Code CLI will be documented in this file.

## [1.1.0] - 2026-05-02

### Fixed
- **CRÍTICO**: Variables en nombres de archivo ahora se procesan correctamente con Handlebars
- **CRÍTICO**: Mapeo automático de variables del pattern.json al contexto de templates
- Sincronización automática de patterns desde disco a base de conocimiento
- Vulnerabilidades de seguridad en dependencias

### Added
- 🔄 Comando `dev sync` para sincronizar patterns desde disco
- 🎨 Helpers de Handlebars: pascalCase, kebabCase, snakeCase, camelCase, uppercase, lowercase
- ✅ Validación de variables requeridas antes de generar templates
- 📝 Logger mejorado con colores en la consola
- 🧪 Suite de tests automatizados con Vitest para comando create
- 📚 Documentación completa de patterns con README.md en cada carpeta

### Changed
- Mejorada documentación de patterns
- Mensajes de error más descriptivos con emojis
- Contexto de templates ahora incluye todas las variables del pattern.json

### Technical
- Refactorizado sistema de templates para soportar variables dinámicas en nombres de archivo
- Agregada función buildContext para mapeo automático de variables
- Agregada función validateContext para validación pre-generación

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
