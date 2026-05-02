import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";

describe("aris dev create", () => {
  const projectDir = path.join(__dirname, "..");

  afterEach(async () => {
    try {
      await fs.rm(path.join(projectDir, "TestButton"), { recursive: true, force: true });
      await fs.rm(path.join(projectDir, "User"), { recursive: true, force: true });
    } catch (e) {
      // Ignored
    }
  });

  it("debe generar componente React con nombres correctos", async () => {
    execSync("node dist/index.js dev create react-component TestButton", {
      cwd: projectDir,
      stdio: "inherit"
    });

    const buttonDir = path.join(projectDir, "TestButton");
    const files = await fs.readdir(buttonDir);
    expect(files).toContain("TestButton.tsx");
    expect(files).toContain("TestButton.module.css");
    expect(files).not.toContain("{{ComponentName}}.tsx");

    const tsxContent = await fs.readFile(
      path.join(buttonDir, "TestButton.tsx"),
      "utf-8"
    );
    expect(tsxContent).toContain("export const TestButton");
    expect(tsxContent).toContain("interface TestButtonProps");
    expect(tsxContent).toContain("import styles from './TestButton.module.css'");
  });

  it("debe generar CRUD NestJS con entity correcto", async () => {
    execSync("node dist/index.js dev create nestjs-crud User", {
      cwd: projectDir,
      stdio: "inherit"
    });

    const userDir = path.join(projectDir, "User");
    const files = await fs.readdir(userDir);
    expect(files).toContain("User.controller.ts");
    expect(files).toContain("User.service.ts");
    expect(files).toContain("User.module.ts");

    const controllerContent = await fs.readFile(
      path.join(userDir, "User.controller.ts"),
      "utf-8"
    );
    expect(controllerContent).toContain("export class UserController");
    expect(controllerContent).toContain("UserService");
  });
});
