import { Command } from "commander";

export function updateCommand() {
  const cmd = new Command("update");
  cmd
    .description("Sincroniza la base de patrones con GitHub (no implementado aún)")
    .action(async () => {
      console.log("Sync con GitHub no implementado. Se requiere token y lógica de scraping/scoring.");
    });
  return cmd;
}
