import { Command } from "commander";
import { createProjectCommand } from "./commands/create-project";
import { templatesCommand } from "./commands/templates";
import { devCommand } from "./commands/dev";
import { patternCommand } from "./commands/pattern";

export async function run() {
  const program = new Command();
  program.name("aris").description("CLI generador de proyectos y componentes").version("2.0.0");

  program.addCommand(createProjectCommand());
  program.addCommand(templatesCommand());
  program.addCommand(devCommand());
  program.addCommand(patternCommand());

  await program.parseAsync(process.argv);
}
