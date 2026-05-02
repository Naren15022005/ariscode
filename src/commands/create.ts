import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { loadLocalPattern, renderTemplateDir } from "../lib/patterns";

function buildContext(pattern: any, defaultName: string): Record<string, any> {
  const context: Record<string, any> = {
    name: defaultName,
    pattern: pattern.metadata
  };

  if (pattern.variables && Array.isArray(pattern.variables)) {
    for (const varDef of pattern.variables) {
      if (varDef.name === "ComponentName" || varDef.name === "entity") {
        context[varDef.name] = defaultName;
      } else if (varDef.name === "entityLower") {
        context[varDef.name] = defaultName.toLowerCase();
      } else if (varDef.name === "entityPlural") {
        // Auto-generate plural by adding 's'
        context[varDef.name] = defaultName.toLowerCase() + "s";
      }
    }
  }

  return context;
}

function validateContext(pattern: any, context: Record<string, any>): void {
  if (!pattern.variables || !Array.isArray(pattern.variables)) return;

  for (const varDef of pattern.variables) {
    if (varDef.required && !context[varDef.name]) {
      throw new Error(
        `Variable requerida '${varDef.name}' no proporcionada. Prompt: ${varDef.prompt}`
      );
    }
  }
}

export function createCommand() {
  const cmd = new Command("create");
  cmd
    .description("Genera un scaffold básico usando un pattern")
    .argument("[pattern]", "Nombre del pattern")
    .argument("[name]", "Nombre del módulo/proyecto")
    .action(async (patternArg, nameArg) => {
      const questions: any[] = [];
      if (!patternArg) {
        questions.push({
          type: "text",
          name: "pattern",
          message: "Pattern a usar"
        });
      }
      if (!nameArg) {
        questions.push({
          type: "text",
          name: "name",
          message: "Nombre del módulo/proyecto",
          initial: "app"
        });
      }

      const answers = questions.length
        ? await prompts(questions, {
            onCancel: () => {
              console.log("Cancelado");
              process.exit(1);
            }
          })
        : {};

      const chosenPattern = patternArg || answers.pattern;
      const name = nameArg || answers.name || "app";

      console.log("Generando...");

      try {
        const pattern = await loadLocalPattern(chosenPattern);
        if (!pattern) {
          throw new Error(`Pattern local '${chosenPattern}' no encontrado.`);
        }

        const outDir = path.join(process.cwd(), name);
        await fs.mkdir(outDir, { recursive: true });

        const context = buildContext(pattern, name);
        validateContext(pattern, context);
        await renderTemplateDir(pattern.templateDir, outDir, context);

        console.log(`✅ Pattern ${chosenPattern} aplicado en ${outDir}`);
      } catch (err: any) {
        console.error("❌ Fallo al generar");
        console.error(err.message || err);
      }
    });
  return cmd;
}
