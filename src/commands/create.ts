import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { loadLocalPattern, renderTemplateDir } from "../lib/patterns";

export function createCommand() {
  const cmd = new Command("create");
  cmd
    .description("Genera un scaffold básico usando un pattern")
    .argument("[pattern]", "Nombre del pattern")
    .argument("[name]", "Nombre del módulo/proyecto")
    .action(async (patternArg, nameArg) => {
      const questions: any[] = [];
      if (!patternArg) questions.push({ type: "text", name: "pattern", message: "Pattern a usar" });
      if (!nameArg) questions.push({ type: "text", name: "name", message: "Nombre del módulo/proyecto", initial: "app" });

      const answers = questions.length
        ? await prompts(questions, { onCancel: () => { console.log("Cancelado"); process.exit(1); } })
        : {};

      const chosenPattern = patternArg || answers.pattern;
      const name = nameArg || answers.name || "app";
      console.log("Generando...");
      try {
        const pattern = await loadLocalPattern(chosenPattern);
        if (!pattern) throw new Error(`Pattern local '${chosenPattern}' no encontrado.`);

        const outDir = path.join(process.cwd(), name);
        await fs.mkdir(outDir, { recursive: true });
        await renderTemplateDir(pattern.templateDir, outDir, { name, pattern: pattern.metadata });

        console.log(`Pattern ${chosenPattern} aplicado en ${outDir}`);
      } catch (err: any) {
        console.error("Fallo al generar");
        console.error(err.message || err);
      }
    });
  return cmd;
}
