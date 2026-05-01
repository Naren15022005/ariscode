import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { loadLocalPattern } from "../lib/patterns";

function tokenize(s: string) {
  return new Set(s.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean));
}

function jaccard(a: Set<string>, b: Set<string>) {
  const inter = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : inter.size / union.size;
}

export function compareCommand() {
  const cmd = new Command("compare");
  cmd
    .description("Compara un archivo con un pattern de referencia")
    .argument("<file>", "Archivo a comparar")
    .requiredOption("--with <pattern>", "Pattern de referencia")
    .action(async (file: string, opts: any) => {
      const filePath = path.resolve(process.cwd(), file);
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const pattern = await loadLocalPattern(opts.with);
        if (!pattern) {
          console.error("Pattern no encontrado:", opts.with);
          return;
        }
        // Concatenate all template files in pattern
        const walk = async (dir: string): Promise<string[]> => {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          let files: string[] = [];
          for (const e of entries) {
            const p = path.join(dir, e.name);
            if (e.isDirectory()) files = files.concat(await walk(p));
            else files.push(p);
          }
          return files;
        };

        const tplFiles = await walk(pattern.templateDir);
        let tplConcat = "";
        for (const f of tplFiles) {
          const txt = await fs.readFile(f, "utf-8");
          tplConcat += "\n" + txt;
        }

        const s1 = tokenize(fileContent);
        const s2 = tokenize(tplConcat);
        const score = jaccard(s1, s2);
        console.log(`Similitud (Jaccard tokens): ${(score * 100).toFixed(2)}%`);
      } catch (err) {
        console.error("Error comparando:", err);
      }
    });
  return cmd;
}
