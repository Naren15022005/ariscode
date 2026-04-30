#!/usr/bin/env node
import { run } from "./cli";

run().catch((err) => {
  console.error("Error en CLI:", err);
  process.exit(1);
});
