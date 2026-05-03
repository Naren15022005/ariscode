import { Command } from "commander";
import chalk from "chalk";
import { listRemoteTemplates } from "../lib/templates-remote";

export function templatesCommand() {
  const cmd = new Command("templates");
  cmd.description("Manage templates")
    .addCommand(listCommand());
  return cmd;
}

function listCommand() {
  const cmd = new Command("list");
  cmd.description("List available templates")
    .action(async () => {
      console.log(chalk.blue("\nAvailable Templates\n"));
      const remoteTemplates = await listRemoteTemplates();
      if (remoteTemplates.length === 0) {
        console.log(chalk.yellow("None available"));
        return;
      }
      console.log(chalk.cyan("Templates:"));
      remoteTemplates.forEach((t) => {
        console.log(`  - ${chalk.bold(t.name)}`);
      });
    });
  return cmd;
}
