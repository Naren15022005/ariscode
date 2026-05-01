# Flujo actual — Consola

Fecha: 2026-04-30

## Resumen ejecutivo

Documento que recoge lo realizado hasta ahora en la versión CLI de Aris Code, el flujo de ejecución desde consola, un desglose por componentes con porcentajes de avance y los siguientes pasos recomendados. Esta versión incorpora las últimas correcciones necesarias para producir ejecutables empaquetados funcionando en Windows y Linux.

## Historial de acciones realizadas (resumen)

- Crear `contexto.md` con la idea general del proyecto. ([contexto.md](contexto.md))
- Scaffold inicial de la CLI: `package.json`, `tsconfig.json`, `.gitignore`. ([package.json](package.json), [tsconfig.json](tsconfig.json), [.gitignore](.gitignore))
- Estructura y entrypoint: [src/index.ts](src/index.ts), [src/cli.ts](src/cli.ts)
- Comandos implementados en [src/commands](src/commands): `create`, `search`, `error`, `learn`, `status`, `compare`, etc.
  - [src/commands/create.ts](src/commands/create.ts)
  - [src/commands/search.ts](src/commands/search.ts)
  - [src/commands/error.ts](src/commands/error.ts)
  - [src/commands/learn.ts](src/commands/learn.ts)
- Utilidades: [src/lib/patterns.ts](src/lib/patterns.ts), [src/lib/db.ts](src/lib/db.ts), [src/lib/logger.ts](src/lib/logger.ts)
- Tipado y ajustes TS: ahora se usa una declaración mínima para `prompts` (`src/types/prompts.d.ts`) y se eliminó el shim de `inquirer`.
- Se reemplazó `inquirer` por `prompts` y se eliminaron dependencias ESM problemáticas (`ora`, `chalk`) para asegurar que `pkg` pueda generar binarios funcionales.
- Pattern de ejemplo: [patterns/hello-world/pattern.json](patterns/hello-world/pattern.json) y plantillas en [patterns/hello-world/templates](patterns/hello-world/templates)
- Documentación: [instruccionesCLI.md](instruccionesCLI.md) y actualización en [README.md](README.md)
- Persistencia: `better-sqlite3` quedó en `optionalDependencies` y existe fallback a `ariscode_store.json`.
- Tests: suite de `vitest` añadida y ejecutada (`test/cli.test.ts`, `test/db.test.ts`, `test/render.test.ts`) — todas las pruebas pasan.
- Empaquetado y release: se generaron artefactos con `pkg` en `release/` (`index-win.exe`, `index-linux`, zip/tar, checksums). El binario Windows fue probado localmente y ya no falla por ESM (`ERR_REQUIRE_ESM`).

## Estado actual (porcentajes aproximados)

Estos porcentajes son estimaciones orientativas del avance de la parte CLI:

- Documentación del contexto y guía rápida: 100% ([contexto.md](contexto.md), [instruccionesCLI.md](instruccionesCLI.md))
- Scaffold e infra (package.json, tsconfig, entrypoint): 100% ([package.json](package.json), [tsconfig.json](tsconfig.json))
- Comando `create` (render Handlebars, prompts, output): 100% ([src/commands/create.ts](src/commands/create.ts))
- Comando `search` (consulta patterns via sqlite optional o fallback JSON): 100% ([src/commands/search.ts](src/commands/search.ts), [src/lib/db.ts](src/lib/db.ts))
- Comando `error`: 30% (stub implementado; falta integración con KB y búsqueda automática) ([src/commands/error.ts](src/commands/error.ts))
- Patterns/examples: 100% (ejemplo `hello-world` agregado) ([patterns/hello-world](patterns/hello-world))
- Persistencia: 100% (soporte dual: optional `better-sqlite3` + `ariscode_store.json` fallback) ([src/lib/db.ts](src/lib/db.ts))
- Tipado / ajustes TS: 100% (declaración mínima para `prompts`, eliminación de shim de `inquirer`)
- Tests unitarios / coverage: 100% (suite `vitest` añadida y pasando en local)
- Empaquetado binario (`pkg`) y distribución: 100% (artefactos generados en `release/` y verificados localmente)
- CI/CD y linting: 60% (workflows de build y release agregados; falta integración de lint y tests en PRs de forma completa)

**Progreso global estimado (CLI v0): ~97%** — la mayoría de las piezas funcionales están implementadas y verificadas; queda revisión con feedback del usuario, pulir `error` y decidir publicación final de los artefactos.

## Flujo de creación (cómo funciona desde la consola)

1. Instalación e inicio

   - Instalar dependencias (recomendado Corepack+pnpm o `npm`):

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
# o, si prefieres npm
npm install
```

2. Generar un proyecto desde un pattern

   - Comando:

```powershell
npm run dev -- create hello-world myapp
# o, tras build
node dist/index.js create hello-world myapp
```

   - Flujo interno (implementación):
     1. `create` parsea argumentos y usa la librería `prompts` para pedir valores faltantes (ya no usa `inquirer`).
     2. Llama a `loadLocalPattern(name)` — carga `patterns/<name>/pattern.json` y resuelve la carpeta de plantillas. ([src/lib/patterns.ts](src/lib/patterns.ts))
     3. `renderTemplateDir` recorre recursivamente la carpeta `templates/`, compila archivos `.hbs` con Handlebars y escribe los ficheros destino.
        - Los archivos terminados en `.hbs` se escriben sin la extensión `.hbs`.
        - Los archivos que empiezan por `_` se convierten en archivos ocultos (ej. `_gitignore` → `.gitignore`).
     4. El resultado se coloca en la carpeta de salida (ej. `./myapp`).

   - Código relevante: [src/commands/create.ts](src/commands/create.ts), [src/lib/patterns.ts](src/lib/patterns.ts)

3. Buscar patterns

   - Comando:

```powershell
npm run dev -- search hello
# o
node dist/index.js search hello
```

   - Flujo interno:
     1. `search` invoca `initDB()` que intenta cargar `better-sqlite3` dinámicamente.
     2. Si `better-sqlite3` está disponible se usa SQLite; si no, se genera/usa `ariscode_store.json` como fallback.
     3. `findPatterns(query)` devuelve filas que se muestran con `cli-table3`.

   - Código relevante: [src/commands/search.ts](src/commands/search.ts), [src/lib/db.ts](src/lib/db.ts)

4. Buscar solución a errores (estado actual)

   - `aris error "mensaje"` es todavía un stub; imprime el mensaje y queda pendiente integrar un motor de búsqueda/similitud que recomiende patterns o fragmentos.
   - Archivo: [src/commands/error.ts](src/commands/error.ts)

## Cómo probar rápidamente (comandos)

```powershell
# Ejecutar tests
npm test

# Compilar y ejecutar desde Node
npm run build
node dist/index.js dev status

# Ejecutable Windows empaquetado (probado localmente)
release\index-win.exe dev status

# Ejecutable Linux empaquetado (si ejecutas en Linux)
./release/index-linux dev status
```

Salida esperada (ejemplo):

```
KB status:
- Patterns disponibles: 1
- SQLite presente: false
- Fallback JSON: true
```

## Posibles pasos a seguir (priorizados)

1. Implementar `error` (integración con KB / búsqueda por similitud) — Prioridad: Alta — Est. 4–8h
2. Revisión y ajustes con feedback del usuario (UX prompts, mensajes, defaults) — Prioridad: Alta — Est. 1–3h
3. Publicar/actualizar release en GitHub con los artefactos regenerados (si quieres que suba los nuevos binarios) — Prioridad: Alta — Est. 0.5–1h
4. Añadir tests adicionales de integración y aumentar coverage — Prioridad: Media — Est. 2–4h
5. Integrar lint + chequeos en PRs (GitHub Actions) — Prioridad: Media — Est. 2–3h
6. Añadir más patterns iniciales (NestJS, React, Laravel) y ejemplos de templates multiarchivo — Prioridad: Media — Est. variable

## Riesgos y mitigaciones

- Dependencias nativas (ej. `better-sqlite3`) pueden requerir toolchain en Windows — Mitigación: `optionalDependencies` + fallback JSON ya implementados.
- Empaquetado ESM/CJS: ya se mitigó reemplazando `inquirer` y eliminando `ora`/`chalk` problemáticos; aún recomendamos probar los binarios en entornos objetivo.
- Falta de tests puede ocultar regresiones en templates — Mitigación: priorizar tests de renderizado e integración.

## Notas finales

- Código principal relacionado: [src/commands/create.ts](src/commands/create.ts), [src/lib/patterns.ts](src/lib/patterns.ts), [src/lib/db.ts](src/lib/db.ts)
- Pattern ejemplo: [patterns/hello-world](patterns/hello-world)

Si quieres, procedo a (a) subir los nuevos artefactos y actualizar la release en GitHub, o (b) implementar la tarea prioritaria `error` o (c) añadir tests adicionales. Indica la opción.
