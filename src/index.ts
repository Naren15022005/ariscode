#!/usr/bin/env node
import { initErrorsTable } from "./lib/errors";
import { run } from "./cli";

(async () => {
  try {
    await initErrorsTable();
    await run();
  } catch (err) {
    console.error("Error en CLI:", err);
    process.exit(1);
  }
})();
