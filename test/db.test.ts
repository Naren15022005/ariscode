import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { initDB, addPattern, findPatterns, removePattern } from "../src/lib/db";

describe("KB JSON fallback", () => {
  const name = "test-pattern-cli";
  beforeEach(async () => {
    await initDB();
    try { await removePattern(name); } catch {};
  });
  afterEach(async () => {
    try { await removePattern(name); } catch {};
  });

  it("permite agregar, buscar y eliminar un pattern", async () => {
    await addPattern({ name, description: "desc" });
    const res = await findPatterns(name);
    expect(res.some((r: any) => r.name === name)).toBe(true);
    const removed = await removePattern(name);
    expect(removed).toBe(true);
  });
});
