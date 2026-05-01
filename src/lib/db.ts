import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";

const SQLITE_PATH = path.join(process.cwd(), "ariscode.db");
const JSON_PATH = path.join(process.cwd(), "ariscode_store.json");

let sqliteDB: any = null;
let usingSqlite = false;

function tryInitSqlite() {
  try {
    // dynamic require to avoid import error when optional dep is missing
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const BetterSqlite3 = require("better-sqlite3");
    sqliteDB = new BetterSqlite3(SQLITE_PATH);
    usingSqlite = true;
    const row = sqliteDB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='patterns'").get();
    if (!row) {
      sqliteDB.exec(`
        CREATE TABLE patterns (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE,
          description TEXT,
          metadata TEXT,
          template BLOB,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
  } catch (err) {
    usingSqlite = false;
  }
}

async function ensureJson() {
  try {
    await fsp.access(JSON_PATH, fs.constants.F_OK);
  } catch (err) {
    await fsp.writeFile(JSON_PATH, JSON.stringify({ patterns: [] }, null, 2), "utf-8");
  }
}

export async function initDB() {
  tryInitSqlite();
  if (!usingSqlite) await ensureJson();
  return usingSqlite && sqliteDB ? sqliteDB : null;
}

export async function countPatterns() {
  if (usingSqlite && sqliteDB) {
    const r = sqliteDB.prepare("SELECT COUNT(*) as c FROM patterns").get();
    return r ? r.c : 0;
  }
  const raw = await fsp.readFile(JSON_PATH, "utf-8");
  const data = JSON.parse(raw);
  return data.patterns.length || 0;
}

export async function getDBInfo() {
  return { usingSqlite, sqlitePath: SQLITE_PATH, jsonPath: JSON_PATH };
}

export async function findPatterns(query: string) {
  if (usingSqlite && sqliteDB) {
    const stmt = sqliteDB.prepare("SELECT id, name, description FROM patterns WHERE name LIKE ? OR description LIKE ? LIMIT 50");
    return stmt.all(`%${query}%`, `%${query}%`);
  }

  const raw = await fsp.readFile(JSON_PATH, "utf-8");
  const data = JSON.parse(raw);
  const q = (query || "").toLowerCase();
  return data.patterns
    .filter((p: any) => (p.name && p.name.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q)))
    .slice(0, 50)
    .map((p: any, idx: number) => ({ id: p.id ?? idx + 1, name: p.name, description: p.description }));
}

export async function addPattern(pattern: any) {
  if (usingSqlite && sqliteDB) {
    const stmt = sqliteDB.prepare("INSERT OR IGNORE INTO patterns (name, description, metadata, template) VALUES (?, ?, ?, ?)");
    stmt.run(pattern.name, pattern.description || "", JSON.stringify(pattern.metadata || {}), pattern.template || "");
    return;
  }

  const raw = await fsp.readFile(JSON_PATH, "utf-8");
  const data = JSON.parse(raw);
  if (!data.patterns.some((p: any) => p.name === pattern.name)) {
    pattern["id"] = data.patterns.length ? Math.max(...data.patterns.map((p: any) => p.id || 0)) + 1 : 1;
    data.patterns.push(pattern);
    await fsp.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
  }
}

export async function removePattern(name: string) {
  if (usingSqlite && sqliteDB) {
    const stmt = sqliteDB.prepare("DELETE FROM patterns WHERE name = ?");
    const info = stmt.run(name);
    return info.changes > 0;
  }

  const raw = await fsp.readFile(JSON_PATH, "utf-8");
  const data = JSON.parse(raw);
  const before = data.patterns.length;
  data.patterns = data.patterns.filter((p: any) => p.name !== name);
  if (data.patterns.length === before) return false;
  await fsp.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
  return true;
}

