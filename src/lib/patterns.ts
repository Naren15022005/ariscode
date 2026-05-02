import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import Handlebars from "handlebars";

// Registrar helpers globales de Handlebars
Handlebars.registerHelper("pascalCase", (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper("kebabCase", (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
});

Handlebars.registerHelper("snakeCase", (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
});

Handlebars.registerHelper("camelCase", (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
});

Handlebars.registerHelper("uppercase", (str: string) => str.toUpperCase());
Handlebars.registerHelper("lowercase", (str: string) => str.toLowerCase());

/**
 * Obtiene la ruta a la carpeta patterns
 * Funciona tanto en desarrollo como en instalación npm global
 */
function getPackageRoot(): string {
  // 1. Desarrollo local (cuando estás trabajando en el código)
  const devPath = path.join(__dirname, '..', '..', 'patterns');
  if (fsSync.existsSync(devPath)) {
    return devPath;
  }

  // 2. Instalación npm local (node_modules del proyecto)
  const localNpmPath = path.join(__dirname, '..', 'patterns');
  if (fsSync.existsSync(localNpmPath)) {
    return localNpmPath;
  }

  // 3. Instalación npm global
  // En Windows: C:\Users\Usuario\AppData\Roaming\npm\node_modules\ariscode-cli\patterns
  // En Mac/Linux: /usr/local/lib/node_modules/ariscode-cli/patterns
  const globalNpmPath = path.join(__dirname, 'patterns');
  if (fsSync.existsSync(globalNpmPath)) {
    return globalNpmPath;
  }

  // 4. Fallback: directorio actual
  return path.join(process.cwd(), 'patterns');
}

export interface PatternMeta {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  template?: string;
  variables?: Record<string, any>[];
}

export interface Pattern {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  variables?: Record<string, any>[];
  templateDir: string;
}

export async function loadLocalPattern(name: string): Promise<Pattern | null> {
  const patternsDir = getPackageRoot();
  const patternPath = path.join(patternsDir, name);

  try {
    const patternJsonPath = path.join(patternPath, "pattern.json");
    const raw = await fs.readFile(patternJsonPath, "utf-8");
    const meta: PatternMeta = JSON.parse(raw);
    const templateDir = path.join(patternPath, meta.template || "templates");
    return {
      name: meta.name || name,
      description: meta.description,
      metadata: meta.metadata || {},
      variables: meta.variables || [],
      templateDir,
    };
  } catch (err) {
    return null;
  }
}

export async function renderTemplateDir(
  srcDir: string,
  destDir: string,
  context: Record<string, any>
) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);

    // 1. Procesar prefijo "_" → "."
    let destName = entry.name;
    if (destName.startsWith("_")) {
      destName = "." + destName.slice(1);
    }

    // 2. ✅ NUEVO: Compilar el nombre del archivo con Handlebars
    const nameTemplate = Handlebars.compile(destName);
    destName = nameTemplate(context);

    // 3. Remover extensión .hbs
    const destPath = path.join(destDir, destName.replace(/\.hbs$/, ""));

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await renderTemplateDir(srcPath, destPath, context);
    } else {
      // 4. Compilar el contenido del archivo
      const content = await fs.readFile(srcPath, "utf-8");
      const template = Handlebars.compile(content);
      const rendered = template(context);

      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.writeFile(destPath, rendered, "utf-8");
    }
  }
}

export async function syncPatternsFromDisk(patternsDir?: string) {
  const dir = patternsDir || getPackageRoot();
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const synced: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "README.md") continue;

    const patternJsonPath = path.join(dir, entry.name, "pattern.json");

    try {
      const exists = await fs.access(patternJsonPath).then(() => true).catch(() => false);
      if (!exists) continue;

      const content = await fs.readFile(patternJsonPath, "utf-8");
      const metadata = JSON.parse(content);

      synced.push(metadata.name || entry.name);
    } catch (err) {
      console.error(`⚠️  Error al sincronizar pattern ${entry.name}:`, err);
    }
  }

  console.log(`✅ Sincronizados ${synced.length} patterns: ${synced.join(", ")}`);
  return synced;
}
