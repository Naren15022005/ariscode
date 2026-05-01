import { describe, it, expect } from "vitest";
import path from "path";
import os from "os";
import fs from "fs/promises";
import { renderTemplateDir } from "../src/lib/patterns";

describe("renderTemplateDir", () => {
  it("renderiza plantillas Handlebars correctamente", async () => {
    const src = path.join(process.cwd(), "patterns", "hello-world", "templates");
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "aris-test-"));
    await renderTemplateDir(src, tmp, { name: "testapp", pattern: {} });

    const pkg = await fs.readFile(path.join(tmp, "package.json"), "utf-8");
    expect(pkg).toContain('"name": "testapp"');

    const index = await fs.readFile(path.join(tmp, "src", "index.ts"), "utf-8");
    expect(index).toContain("Hello from testapp");
  });
});
