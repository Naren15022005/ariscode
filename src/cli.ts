import { Command } from "commander";
import { devCommand } from "./commands/dev";
import { patternCommand } from "./commands/pattern";

export async function run() {
  const program = new Command();
<<<<<<< HEAD
  program.name("aris").description("CLI de Aris Code").version("0.1.0");
=======
  program.name("aris").description("CLI de Aris Code").version("1.1.0");
>>>>>>> add-local-run-scripts

  program.addCommand(devCommand());
  program.addCommand(patternCommand());

  await program.parseAsync(process.argv);
}
