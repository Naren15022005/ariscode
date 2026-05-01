import { Command } from "commander";
import { initDB, findPatterns } from "../lib/db";
import fs from "fs";
import path from "path";

export function statusCommand() {
  const cmd = new Command("status");
  cmd.description("Muestra el estado de la base de conocimiento (KB)")
    .action(async () => {
      await initDB();
      // count patterns by reading either sqlite (internal) or json
      const patterns = await findPatterns("");
      const jsonPath = path.join(process.cwd(), "ariscode_store.json");
      const sqliteExists = fs.existsSync(path.join(process.cwd(), "ariscode.db"));

      console.log("KB status:");
      console.log(`- Patterns disponibles: ${patterns.length}`);
      console.log(`- SQLite presente: ${sqliteExists}`);
      console.log(`- Fallback JSON: ${fs.existsSync(jsonPath)}`);
    });

  return cmd;
}
