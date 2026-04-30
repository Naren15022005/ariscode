import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
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
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "pattern",
          message: "Pattern a usar",
          when: () => !patternArg,
        },
        {
          type: "input",
          name: "name",
          message: "Nombre del módulo/proyecto",
          when: () => !nameArg,
        },
      ]);

      const chosenPattern = patternArg || answers.pattern;
      const name = nameArg || answers.name || "app";
      const spinner = ora("Generando...").start();

      try {
        const pattern = await loadLocalPattern(chosenPattern);
        if (!pattern) throw new Error(`Pattern local '${chosenPattern}' no encontrado.`);

        const outDir = path.join(process.cwd(), name);
        await fs.mkdir(outDir, { recursive: true });
        await renderTemplateDir(pattern.templateDir, outDir, { name, pattern: pattern.metadata });

        spinner.succeed(`Pattern ${chosenPattern} aplicado en ${outDir}`);
      } catch (err: any) {
        spinner.fail("Fallo al generar");
        console.error(err.message || err);
      }
    });
  return cmd;
}
