import { Command } from "commander";
import Table from "cli-table3";
import { initDB, findPatterns } from "../lib/db";

export function searchCommand() {
  const cmd = new Command("search");
  cmd
    .description("Busca patterns disponibles")
    .argument("[query]", "Término a buscar")
    .action(async (query) => {
      await initDB();
      const rows = await findPatterns(query || "");

      const table = new Table({ head: ["id", "name", "description"] });
      rows.forEach((r: any) => table.push([r.id, r.name, r.description]));
      console.log(table.toString());
    });
  return cmd;
}
