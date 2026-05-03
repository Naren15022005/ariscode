import axios from "axios";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import tar from "tar";
import chalk from "chalk";
import ora from "ora";

const GITHUB_REPO = "Naren15022005/ariscode";
const TEMPLATES_CACHE_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE || "",
  ".ariscode",
  "templates"
);

export interface RemoteTemplate {
  name: string;
  version: string;
  url: string;
  size: number;
}

export async function listRemoteTemplates(): Promise<RemoteTemplate[]> {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`
    );

    const assets = response.data.assets || [];
    const templates: RemoteTemplate[] = [];

    for (const asset of assets) {
      if (asset.name.startsWith("template-") && asset.name.endsWith(".tar.gz")) {
        const templateName = asset.name
          .replace("template-", "")
          .replace(".tar.gz", "");

        templates.push({
          name: templateName,
          version: response.data.tag_name,
          url: asset.browser_download_url,
          size: asset.size,
        });
      }
    }

    return templates;
  } catch {
    return [];
  }
}

export async function downloadTemplate(
  template: RemoteTemplate,
  destDir: string
): Promise<boolean> {
  const spinner = ora({
    text: `Descargando template ${template.name} (${formatBytes(template.size)})...`,
    color: "cyan",
  }).start();

  try {
    await fs.mkdir(TEMPLATES_CACHE_DIR, { recursive: true });

    const tarballPath = path.join(TEMPLATES_CACHE_DIR, `${template.name}.tar.gz`);

    const response = await axios.get(template.url, {
      responseType: "arraybuffer",
    });

    await fs.writeFile(tarballPath, response.data);

    spinner.text = `Extrayendo ${template.name}...`;

    await tar.extract({
      file: tarballPath,
      cwd: destDir,
    });

    await fs.unlink(tarballPath);

    spinner.succeed(chalk.green(`✅ Template ${template.name} descargado`));
    return true;
  } catch (err: any) {
    spinner.fail(chalk.red(`❌ Error descargando template`));
    console.error(err.message);
    return false;
  }
}

export async function isTemplateCached(templateName: string): Promise<boolean> {
  const cachedPath = path.join(TEMPLATES_CACHE_DIR, templateName);
  return fsSync.existsSync(cachedPath);
}

export async function getTemplate(
  templateName: string,
  destDir: string
): Promise<boolean> {
  const cachedPath = path.join(TEMPLATES_CACHE_DIR, templateName);

  if (fsSync.existsSync(cachedPath)) {
    console.log(chalk.cyan(`📦 Usando template desde cache`));
    await copyDir(cachedPath, destDir);
    return true;
  }

  const remoteTemplates = await listRemoteTemplates();
  const template = remoteTemplates.find((t) => t.name === templateName);

  if (!template) {
    console.error(chalk.red(`❌ Template '${templateName}' no encontrado`));
    return false;
  }

  return await downloadTemplate(template, destDir);
}

async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
