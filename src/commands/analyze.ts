import { Command } from "commander";
import { Project, SyntaxKind } from "ts-morph";
import path from "path";

export function analyzeCommand() {
  const cmd = new Command("analyze");
  cmd
    .description("Analiza código existente (JS/TS) y devuelve métricas básicas")
    .argument("<target>", "Archivo o directorio a analizar")
    .action(async (target: string) => {
      const abs = path.resolve(process.cwd(), target || ".");
      const glob = `${abs.replace(/\\/g, "/")}/**/*.{ts,tsx,js,jsx}`;
      const project = new Project({ skipFileDependencyResolution: true });
      project.addSourceFilesAtPaths(glob);
      const files = project.getSourceFiles();

      let totalLines = 0;
      let totalFunctions = 0;
      let totalClasses = 0;

      for (const f of files) {
        const text = f.getFullText();
        totalLines += text.split(/\r?\n/).length;
        totalFunctions += f.getFunctions().length;
        totalFunctions += f.getDescendantsOfKind(SyntaxKind.FunctionExpression).length;
        totalFunctions += f.getDescendantsOfKind(SyntaxKind.ArrowFunction).length;
        totalClasses += f.getClasses().length;
      }

      console.log(`Archivos analizados: ${files.length}`);
      console.log(`Líneas totales: ${totalLines}`);
      console.log(`Funciones detectadas: ${totalFunctions}`);
      console.log(`Clases detectadas: ${totalClasses}`);
    });
  return cmd;
}
