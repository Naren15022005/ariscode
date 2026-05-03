# Changelog

All notable changes to Aris Code CLI will be documented in this file.

## [2.0.0] - 2026-05-02

### Major: Generador Completo de Proyectos

#### Added
- 🎉 **Nuevo comando `aris create`** - Crear proyectos completos con un comando
- 📦 **Template `hello-project`** - Template básico para empezar
- 🔧 **Sistema de templates** - Localización automática de templates en development y npm
- 🌐 **Soporte para templates remotos** - Descarga desde GitHub Releases (futuro)
- ⚙️ **Configuración interactiva** - Prompts personalizables por template
- 📥 **Instalación automática** - Instala dependencias al crear proyecto
- 🔄 **Git integration** - Inicializa repo automáticamente (opcional)
- 📋 **Comando `aris templates`** - Gestión de templates (list, install)
- 🚀 **Dependencias nuevas**: chalk, ora, axios, tar para mejor UX

#### Changed
- Versión actualizada a 2.0.0
- Descripción del package actualizada
- Agregados "templates/" a la lista de archivos incluidos en npm

#### Technical
- Nueva estructura: src/lib/{prompts,installer,git,templates-remote}.ts
- Nuevos comandos: src/commands/{create-project,templates}.ts
- Sistema de templates robusto con error handling
- Soporte para variables en nombres de archivo y contenido
- Integración con Handlebars para compilación de contextos

#### Backward Compatibility
- ✅ Comandos `aris dev` siguen funcionando igual
- ✅ Patterns existentes sin cambios
- ✅ Compatibilidad 100% con v1.x.x

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
