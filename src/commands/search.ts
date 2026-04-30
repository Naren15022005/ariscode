import { Command } from "commander";
import Table from "cli-table3";
import { getDB } from "../lib/db";

export function searchCommand() {
  const cmd = new Command("search");
  cmd
    .description("Busca patterns disponibles")
    .argument("[query]", "Término a buscar")
    .action(async (query) => {
      const db = getDB();
      const rows = db
        .prepare("SELECT id, name, description FROM patterns WHERE name LIKE ? LIMIT 50")
        .all(`%${query || ""}%`);

      const table = new Table({ head: ["id", "name", "description"] });
      rows.forEach((r: any) => table.push([r.id, r.name, r.description]));
      console.log(table.toString());
    });
  return cmd;
}
