import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import chalk from "chalk";
import Handlebars from "handlebars";
import { executePrompts, type PromptConfig } from "../lib/prompts";
import { installDependencies, detectPackageManager } from "../lib/installer";
import { initGitRepo, createInitialCommit, isGitInstalled } from "../lib/git";
import { listRemoteTemplates } from "../lib/templates-remote";

interface TemplateConfig {
  name: string;
  displayName: string;
  description: string;
  category: string;
  prompts: PromptConfig[];
  files: Array<{ source: string; destination: string; type: "directory" | "template" | "file"; when?: string }>;
  scripts: Array<{ name: string; command: string; cwd: string; when?: string }>;
  postInstall: Array<{ type: "message"; content: string }>;
}

export function createProjectCommand() {
  const cmd = new Command("create");
  cmd.description("Crea nuevo proyecto completo")
    .argument("[template]", "Template")
    .argument("[name]", "Nombre")
    .option("--no-install", "No instalar")
    .option("--no-git", "No Git")
    .action(async (templateArg, nameArg, options) => {
      console.log(chalk.blue.bold("\n🚀 ArisCode\n"));
      const localTemplates = await loadLocalTemplates();
      const allTemplates = [...localTemplates.map((t) => ({ ...t, source: "local" as const }))];
      if (allTemplates.length === 0) {
        console.log(chalk.red("No templates"));
        return;
      }

      let selectedTemplate: any;
      if (templateArg) {
        const found = allTemplates.find((t) => t.name === templateArg);
        if (!found) {
          console.log(chalk.red("Not found"));
          return;
        }
        selectedTemplate = found;
      } else {
        const { template } = await prompts({
          type: "select",
          name: "template",
          message: "Project type?",
          choices: allTemplates.map((t) => ({ title: `${t.displayName} [${t.source}]`, value: t.name }))
        });
        if (!template) return;
        selectedTemplate = allTemplates.find((t) => t.name === template)!;
      }

      console.log(chalk.cyan(`\nTemplate: ${selectedTemplate.displayName}\n`));
      let selectedConfig = await loadTemplateConfig(selectedTemplate.name);
      if (!selectedConfig) {
        console.log(chalk.red("Error"));
        return;
      }

      const answers = await executePrompts(selectedConfig.prompts, nameArg ? { projectName: nameArg } : {});
      const projectPath = path.join(process.cwd(), answers.projectName);

      if (fsSync.existsSync(projectPath)) {
        console.log(chalk.red("Exists"));
        return;
      }

      console.log(chalk.blue(`\nCreating...\n`));
      await fs.mkdir(projectPath, { recursive: true });
      const templatePath = path.join(__dirname, "..", "..", "templates", selectedTemplate.name);

      for (const fileConfig of selectedConfig.files) {
        const sourcePath = path.join(templatePath, fileConfig.source);
        const destPath = compilePath(path.join(projectPath, fileConfig.destination), answers);
        try {
          if (fileConfig.type === "directory") {
            await copyDirectory(sourcePath, destPath, answers);
          }
        } catch {}
      }

      if (options.git !== false && isGitInstalled()) {
        const { initGit } = await prompts({
          type: "confirm",
          name: "initGit",
          message: "Init Git?",
          initial: true
        });
        if (initGit) {
          await initGitRepo(projectPath);
          await createInitialCommit(projectPath);
        }
      }
    });
  return cmd;
}

async function loadLocalTemplates(): Promise<TemplateConfig[]> {
  const templatesDir = path.join(__dirname, "..", "..", "templates");
  try {
    const entries = await fs.readdir(templatesDir, { withFileTypes: true });
    const templates: TemplateConfig[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const configPath = path.join(templatesDir, entry.name, "template.json");
      try {
        const content = await fs.readFile(configPath, "utf-8");
        templates.push(JSON.parse(content));
      } catch {}
    }
    return templates;
  } catch {
    return [];
  }
}

async function loadTemplateConfig(name: string): Promise<TemplateConfig | null> {
  const templatePath = path.join(__dirname, "..", "..", "templates", name);
  const configPath = path.join(templatePath, "template.json");
  try {
    const content = await fs.readFile(configPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function compilePath(template: string, context: Record<string, any>): string {
  const compiled = Handlebars.compile(template);
  return compiled(context);
}

async function copyDirectory(source: string, dest: string, context: Record<string, any>) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destPath, context);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}
