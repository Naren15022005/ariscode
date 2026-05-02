import { Command } from "commander";
import { syncPatternsFromDisk } from "../lib/patterns";

export function syncCommand() {
  const cmd = new Command("sync");
  cmd
    .description("Sincroniza patterns desde disco a la base de conocimiento")
    .action(async () => {
      console.log("🔄 Sincronizando patterns desde disco...");
      try {
        await syncPatternsFromDisk();
      } catch (err: any) {
        console.error("❌ Error al sincronizar:", err.message);
      }
    });
  return cmd;
}
