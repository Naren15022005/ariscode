import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs";

export interface InstallOptions {
  cwd: string;
  packageManager?: "npm" | "yarn" | "pnpm";
  silent?: boolean;
}

export async function installDependencies(
  options: InstallOptions
): Promise<boolean> {
  const { cwd, packageManager = "npm", silent = false } = options;

  const packageJsonPath = path.join(cwd, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.error(chalk.red(`❌ No se encontró package.json en ${cwd}`));
    return false;
  }

  const spinner = ora({
    text: `Instalando dependencias con ${packageManager}...`,
    color: "cyan",
  }).start();

  try {
    const commands = {
      npm: "npm install",
      yarn: "yarn install",
      pnpm: "pnpm install",
    };

    const command = commands[packageManager];

    execSync(command, {
      cwd,
      stdio: silent ? "ignore" : "inherit",
    });

    spinner.succeed(chalk.green(`✅ Dependencias instaladas`));
    return true;
  } catch (err: any) {
    spinner.fail(chalk.red(`❌ Error al instalar dependencias`));
    if (!silent) {
      console.error(err.message);
    }
    return false;
  }
}

export function detectPackageManager(cwd: string): "npm" | "yarn" | "pnpm" {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export async function runScript(
  scriptName: string,
  cwd: string,
  packageManager: "npm" | "yarn" | "pnpm" = "npm"
): Promise<boolean> {
  const spinner = ora({
    text: `Ejecutando script: ${scriptName}...`,
    color: "cyan",
  }).start();

  try {
    const commands = {
      npm: `npm run ${scriptName}`,
      yarn: `yarn ${scriptName}`,
      pnpm: `pnpm ${scriptName}`,
    };

    execSync(commands[packageManager], {
      cwd,
      stdio: "inherit",
    });

    spinner.succeed(chalk.green(`✅ Script ${scriptName} ejecutado`));
    return true;
  } catch {
    spinner.fail(chalk.red(`❌ Error ejecutando script ${scriptName}`));
    return false;
  }
}
