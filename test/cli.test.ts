import { describe, it, expect } from "vitest";
import { execFileSync } from "child_process";
import path from "path";

describe("CLI integration", () => {
  it("pattern add/list/remove (hello-world) via ts-node", () => {
    const entry = path.join(process.cwd(), "src", "index.ts");
    // add
    const addOut = execFileSync("node", ["-r", "ts-node/register/transpile-only", entry, "pattern", "add", "hello-world"], { encoding: "utf-8" });
    expect(addOut).toMatch(/registrad/i);

    const listOut = execFileSync("node", ["-r", "ts-node/register/transpile-only", entry, "pattern", "list"], { encoding: "utf-8" });
    expect(listOut).toContain("hello-world");

    const rmOut = execFileSync("node", ["-r", "ts-node/register/transpile-only", entry, "pattern", "remove", "hello-world"], { encoding: "utf-8" });
    expect(rmOut).toMatch(/eliminad|no encontrado/i);
  });

  it("dev status muestra KB status via ts-node", () => {
    const entry = path.join(process.cwd(), "src", "index.ts");
    const out = execFileSync("node", ["-r", "ts-node/register/transpile-only", entry, "dev", "status"], { encoding: "utf-8" });
    expect(out).toContain("KB status:");
    expect(out).toMatch(/Patterns disponibles/);
  });
});
