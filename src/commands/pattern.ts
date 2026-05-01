import { Command } from "commander";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import Table from "cli-table3";
import { initDB, findPatterns, addPattern, removePattern } from "../lib/db";

export function patternCommand() {
  const cmd = new Command("pattern");
  cmd.description("Gestionar patterns locales");

  cmd
    .command("list")
    .description("Listar patterns registrados")
    .action(async () => {
      await initDB();
      const rows = await findPatterns("");
      const table = new Table({ head: ["id", "name", "description"] });
      rows.forEach((r: any) => table.push([r.id, r.name, r.description]));
      console.log(table.toString());
    });

  cmd
    .command("add <patternName>")
    .description("Registrar un pattern existente en patterns/<patternName>")
    .action(async (patternName: string) => {
      const metaPath = path.join(process.cwd(), "patterns", patternName, "pattern.json");
      if (!fsSync.existsSync(metaPath)) {
        console.error("pattern.json no encontrado en:", metaPath);
        return;
      }
      try {
        const raw = await fs.readFile(metaPath, "utf-8");
        const meta = JSON.parse(raw);
        await addPattern({ name: meta.name || patternName, description: meta.description || "", metadata: meta.metadata || {}, template: meta.template || "templates" });
        console.log(`Pattern '${patternName}' registrado.`);
      } catch (err) {
        console.error("Error registrando pattern:", err);
      }
    });

  cmd
    .command("remove <patternName>")
    .description("Eliminar pattern de la KB (opcionalmente borrar carpeta)")
    .option("-d, --delete", "Borrar carpeta patterns/<patternName>")
    .action(async (patternName: string, opts: any) => {
      const ok = await removePattern(patternName);
      if (!ok) {
        console.log("Pattern no encontrado en la KB:", patternName);
        return;
      }
      console.log(`Pattern '${patternName}' eliminado de la KB.`);
      if (opts.delete) {
        const dir = path.join(process.cwd(), "patterns", patternName);
        try {
          await fs.rm(dir, { recursive: true, force: true });
          console.log(`Carpeta patterns/${patternName} borrada.`);
        } catch (err) {
          console.error("Error borrando carpeta:", err);
        }
      }
    });

  return cmd;
}
