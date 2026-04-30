import path from "path";
import fs from "fs/promises";
import Handlebars from "handlebars";

export interface PatternMeta {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  template?: string;
}

export interface Pattern {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  templateDir: string;
}

export async function loadLocalPattern(name: string): Promise<Pattern | null> {
  const root = path.join(process.cwd(), "patterns", name);
  try {
    const metaPath = path.join(root, "pattern.json");
    const raw = await fs.readFile(metaPath, "utf-8");
    const meta: PatternMeta = JSON.parse(raw);
    const templateDir = path.join(root, meta.template || "templates");
    return {
      name: meta.name || name,
      description: meta.description,
      metadata: meta.metadata || {},
      templateDir,
    };
  } catch (err) {
    return null;
  }
}

export async function renderTemplateDir(srcDir: string, destDir: string, context: Record<string, any>) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    let destName = entry.name;
    if (destName.startsWith("_")) destName = "." + destName.slice(1);
    const destPath = path.join(destDir, destName.replace(/\.hbs$/, ""));

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await renderTemplateDir(srcPath, destPath, context);
    } else {
      const content = await fs.readFile(srcPath, "utf-8");
      const template = Handlebars.compile(content);
      const rendered = template(context);
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.writeFile(destPath, rendered, "utf-8");
    }
  }
}
