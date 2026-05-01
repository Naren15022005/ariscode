import { Command } from "commander";
import { searchErrorSolutions } from "../lib/errors";

export function errorCommand() {
  const cmd = new Command("error");
  cmd
    .description("Busca soluciones para un error dado (sugerencias y fixes)")
    .argument("<message>", "Mensaje o código de error")
    .action(async (message: string) => {
      console.log(`\n🔍 Buscando soluciones para:\n  "${message}"\n`);

      const solutions = await searchErrorSolutions(message || "");

      if (!solutions || solutions.length === 0) {
        console.log("❌ No se encontraron soluciones conocidas.");
        console.log('\n💡 Sugerencias:');
        console.log('  • Reformula el mensaje de error');
        console.log('  • Busca en Google o Stack Overflow');
        console.log('  • Usa: aris learn <pattern> para agregar tu propia solución');
        return;
      }

      console.log(`✅ Se encontraron ${solutions.length} soluciones:\n`);

      solutions.forEach((solution: any, i: number) => {
        const confidence = solution.confidence ? ` (${Math.round(solution.confidence * 100)}% match)` : "";
        console.log(`─────────────────────────────────────────────────────`);
        console.log(`${i + 1}. ${solution.title}${confidence}`);
        if (solution.framework) console.log(`   Framework: ${solution.framework}`);
        console.log(`\n   ${solution.explanation}\n`);
        if (solution.fix) {
          console.log('   💡 Solución:');
          console.log('   ' + solution.fix.split('\n').join('\n   '));
          console.log('');
        }
      });

      console.log(`─────────────────────────────────────────────────────\n`);
    });

  return cmd;
}
