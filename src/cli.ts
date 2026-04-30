import { Command } from "commander";
import { createCommand } from "./commands/create";
import { searchCommand } from "./commands/search";
import { errorCommand } from "./commands/error";

export async function run() {
  const program = new Command();
  program.name("aris").description("CLI de Aris Code").version("0.1.0");

  program.addCommand(createCommand());
  program.addCommand(searchCommand());
  program.addCommand(errorCommand());

  await program.parseAsync(process.argv);
}
