import { execSync } from "child_process";
import chalk from "chalk";
import fs from "fs";
import path from "path";

export async function initGitRepo(cwd: string): Promise<boolean> {
  try {
    if (fs.existsSync(path.join(cwd, ".git"))) {
      console.log(chalk.yellow("⚠️  Ya es un repositorio Git"));
      return false;
    }

    execSync("git init", { cwd, stdio: "ignore" });
    console.log(chalk.green("✅ Repositorio Git inicializado"));

    const gitignorePath = path.join(cwd, ".gitignore");
    if (!fs.existsSync(gitignorePath)) {
      const gitignoreContent = `node_modules/
dist/
.env
.env.local
*.log
.DS_Store`;
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log(chalk.green("✅ .gitignore creado"));
    }

    return true;
  } catch (err: any) {
    console.error(chalk.red("❌ Error inicializando Git:"), err.message);
    return false;
  }
}

export async function createInitialCommit(cwd: string): Promise<boolean> {
  try {
    execSync("git add .", { cwd, stdio: "ignore" });
    execSync('git commit -m "Initial commit from ArisCode CLI"', {
      cwd,
      stdio: "ignore",
    });
    console.log(chalk.green("✅ Commit inicial creado"));
    return true;
  } catch {
    return false;
  }
}

export function isGitInstalled(): boolean {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
