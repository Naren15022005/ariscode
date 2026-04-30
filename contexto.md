# Contexto

Documento que resume lo que entendí sobre la idea general del proyecto **Aris Code** y el contexto técnico y estratégico para su desarrollo inicial.

## Resumen ejecutivo

Aris Code es un motor de generación y análisis de código basado en patrones (no en LLMs) cuyo objetivo es ofrecer la mayor parte de la productividad que hoy ofrecen herramientas de IA, pero sin costes recurrentes ni dependencia externa. La propuesta central es: determinismo (mismo input → mismo output), velocidad (<500ms), personalización (aprende del código del usuario) y funcionamiento offline.

## Propuesta de valor

- **Velocidad:** generación instantánea usando plantillas y manipulación de AST.
- **Determinismo:** resultados reproducibles sin alucinaciones.
- **Personalización:** prioriza patterns personales sobre los de comunidad.
- **Privacidad / Offline-first:** la información y patterns permanecen en la máquina del usuario.

## Componentes clave

- **Knowledge Base local (SQLite):** patterns personales, patterns curados de GitHub, base manual.
- **Pattern Matcher:** búsqueda full-text y scoring de coincidencias.
- **Code Generator:** Handlebars + AST transformations para producir código confiable.
- **Sync con GitHub:** cron opcional para mantener patterns públicos curados.
- **CLI / Web / VSCode:** consumidores del core (CLI primero según roadmap).
- **Analizador AST:** para entender código existente y extraer patterns.

## Stack técnico (entendido)

- Node.js + TypeScript (Core)
- SQLite via `better-sqlite3`
- FlexSearch para búsqueda full-text
- Parsers: `@babel/parser`, `php-parser`, (futuro: `tree-sitter`)
- Templates: Handlebars
- GitHub API: `@octokit/rest`
- UI: Next.js 14, Tailwind, shadcn/ui; empaquetado con Tauri
- VSCode: Extension API

## Alcance inicial (Fase 1 - prioridades)

- Implementar el core sin dependencias de UI.
- Crear CLI con comandos mínimos: `create`, `search`, `error`.
- Diseñar el esquema de la KB y formato de patterns.
- Implementar generador mínimo (templates + AST) y pruebas básicas.

## Limitaciones y supuestos

- No reemplaza un LLM para tareas creativas o de razonamiento profundo; puede integrar LLMs como fallback.
- Se priorizará contenido con licencias permisivas al sincronizar desde GitHub.
- El workflow de actualización no sobrescribirá patterns personales sin confirmación.

## Riesgos principales y mitigaciones

- **Calidad de patterns externos:** aplicar scoring y revisión automática; mantener `update available` en lugar de sobrescribir.
- **Licencias:** filtrar repos por licencia permisiva y documentar origen de cada pattern.
- **Privacidad del usuario:** mantener todo lo personal en local y dejar opt-in para compartir.

## Siguientes pasos sugeridos

1. Confirmar que este resumen coincide con tu visión y prioridades.
2. Acordar el formato de un pattern (estructura de metadatos + plantilla + tests).
3. Scaffolding: crear carpeta `patterns/` y un pattern de ejemplo.
4. Implementar el generador mínimo y añadir tests unitarios.

---

Si quieres, lo amplío con: ejemplo de formato de pattern, plantilla de DB (esquema), o un primer pattern ejemplo listo para usar.
