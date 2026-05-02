import { Command } from "commander";
import { createCommand } from "./create";
import { searchCommand } from "./search";
import { errorCommand } from "./error";
import { analyzeCommand } from "./analyze";
import { learnCommand } from "./learn";
import { updateCommand } from "./update";
import { statusCommand } from "./status";
import { compareCommand } from "./compare";
<<<<<<< HEAD
=======
import { syncCommand } from "./sync";
>>>>>>> add-local-run-scripts

export function devCommand() {
  const dev = new Command("dev");
  dev.description("Comandos para desarrolladores (power users)");

  dev.addCommand(createCommand());
  dev.addCommand(searchCommand());
  dev.addCommand(errorCommand());
  dev.addCommand(analyzeCommand());
  dev.addCommand(learnCommand());
  dev.addCommand(updateCommand());
  dev.addCommand(statusCommand());
  dev.addCommand(compareCommand());
<<<<<<< HEAD
=======
  dev.addCommand(syncCommand());
>>>>>>> add-local-run-scripts

  return dev;
}
