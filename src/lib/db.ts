import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "ariscode.db");
let db: Database.Database | null = null;

export function getDB() {
  if (db) return db;
  const init = !fs.existsSync(DB_PATH);
  db = new Database(DB_PATH);
  if (init) {
    db.exec(`
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
  return db;
}
