import { Command } from "commander";

export function errorCommand() {
  const cmd = new Command("error");
  cmd
    .description("Busca soluciones para un error dado (stub)")
    .argument("<message>", "Mensaje o código de error")
    .action(async (message: string) => {
      console.log("Función de búsqueda de errores no implementada aún:", message);
    });
  return cmd;
}
