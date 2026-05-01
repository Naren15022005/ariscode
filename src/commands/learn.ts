import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { addPattern } from "../lib/db";

async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(src, e.name);
    const destPath = path.join(dest, e.name);
    if (e.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (e.isSymbolicLink()) {
      const real = await fs.readlink(srcPath);
      await fs.symlink(real, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

export function learnCommand() {
  const cmd = new Command("learn");
  cmd
    .description("Aprende un nuevo pattern desde código existente (copia folder a patterns/<name>)")
    .argument("<ruta>", "Ruta al código a aprender")
    .option("-n, --name <name>", "Nombre del pattern a crear")
    .option("-d, --description <desc>", "Descripción del pattern (opcional)")
    .action(async (ruta: string, opts: any) => {
      const src = path.resolve(process.cwd(), ruta);
      if (!fsSync.existsSync(src)) {
        console.error("Ruta no encontrada:", src);
        return;
      }
      let name = opts.name;
      let description = opts.description;
      if (!name || !description) {
        const suggested = name || path.basename(src);
        const qs: any[] = [];
        if (!name) qs.push({ type: "text", name: "name", message: "Nombre del pattern", initial: suggested });
        if (!description) qs.push({ type: "text", name: "description", message: "Descripción (opcional)", initial: description || `Pattern aprendido desde ${ruta}` });
        const answers = qs.length ? await prompts(qs, { onCancel: () => { console.log("Cancelado"); process.exit(1); } }) : {};
        name = name || answers.name;
        description = description || answers.description;
      }

      const dest = path.join(process.cwd(), "patterns", name);
      const templatesDest = path.join(dest, "templates");

      try {
        await copyDir(src, templatesDest);
        const meta = {
          name,
          description: description || "",
          metadata: { learnedFrom: ruta },
          template: "templates",
        };
        await fs.writeFile(path.join(dest, "pattern.json"), JSON.stringify(meta, null, 2), "utf-8");
        await addPattern({ name, description: meta.description, metadata: meta.metadata, template: meta.template });
        console.log(`Pattern '${name}' creado en patterns/${name}`);
      } catch (err) {
        console.error("Error aprendiendo pattern:", err);
      }
    });

  return cmd;
}
