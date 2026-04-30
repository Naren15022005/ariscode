# Instrucciones — CLI de Aris Code

Guía rápida para instalar y usar la CLI localmente (scaffold de patterns).

## Requisitos

- Node.js (recomendado: 18+ LTS)
- `pnpm` (recomendado) o `npm` como alternativa

## Instalación de dependencias

Con `pnpm` (recomendado — Corepack):

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
```

Si no quieres instalar `pnpm`, usa `npm`:

```powershell
npm install
```

Si `pnpm` no se reconoce, abre PowerShell como Administrador o ejecuta la instalación global:

```powershell
npm install -g pnpm --location=global
```

## Ejecutar en desarrollo

Genera un proyecto desde el pattern `hello-world` en la carpeta `myapp` (modo desarrollo):

```powershell
pnpm run dev -- create hello-world myapp
# o con npm
npm run dev -- create hello-world myapp
```

Esto crea `myapp/` con los ficheros renderizados desde el pattern.

## Build y ejecución

```powershell
pnpm run build
node dist/index.js create hello-world myapp
```

## Comandos principales

- `aris create <pattern> <name>` — Genera un proyecto usando un pattern local.
- `aris search <query>` — Busca patterns locales por nombre/descripcion.
- `aris error "<mensaje>"` — Búsqueda de soluciones para un error (stub).

Ejemplo:

```powershell
aris create hello-world myapp
aris search hello
```

## Formato de un pattern local

Un pattern mínimo vive en `patterns/<nombre>/` y contiene `pattern.json` y una carpeta `templates/`.

- Ejemplo de metadata: [patterns/hello-world/pattern.json](patterns/hello-world/pattern.json)
- Plantillas de ejemplo: [patterns/hello-world/templates](patterns/hello-world/templates)

`pattern.json` mínimo:

```json
{
  "name": "hello-world",
  "description": "Generador mínimo: módulo TypeScript que imprime un saludo",
  "metadata": { "language": "ts" },
  "template": "templates"
}
```

Las plantillas usan Handlebars. Los archivos terminados en `.hbs` se renderizan y se escriben sin la extensión `.hbs`.

## Ubicaciones útiles

- Código CLI: [src/index.ts](src/index.ts)
- Comando `create`: [src/commands/create.ts](src/commands/create.ts)
- Utilidad de patterns: [src/lib/patterns.ts](src/lib/patterns.ts)

## Solución de problemas rápida

- `pnpm` no reconocido: ver sección "Instalación de dependencias".
- Si al generar obtiene errores de permisos o rutas, pruebe a ejecutar PowerShell como Administrador.

## Siguientes pasos sugeridos

1. Añadir más patterns en `patterns/`.
2. Añadir tests unitarios para el renderizado de plantillas.
3. Configurar empaquetado con `pkg`/`nexe` y scripts de CI.

---

Si quieres, actualizo `README.md` principal con un extracto de estas instrucciones o configuro el empaquetado binario ahora.
