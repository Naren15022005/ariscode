import { initDB } from "./db";

export interface ErrorSolution {
  id?: number;
  pattern: string;
  title: string;
  explanation: string;
  fix: string;
  framework?: string;
  confidence?: number;
}

export async function searchErrorSolutions(errorMsg: string): Promise<ErrorSolution[]> {
  const db: any = await initDB();

  if (!db) {
    return searchInHardcodedErrors(errorMsg);
  }

  const exactMatches = searchExact(db, errorMsg);
  if (exactMatches.length > 0) return exactMatches.map((e: any) => ({ ...e, confidence: 1.0 }));

  const keywords = extractKeywords(errorMsg);
  const keywordMatches = searchByKeywords(db, keywords);
  if (keywordMatches.length > 0) return keywordMatches.map((e: any) => ({ ...e, confidence: 0.7 }));

  const fuzzyMatches = searchFuzzy(db, errorMsg);
  return fuzzyMatches.map((e: any) => ({ ...e, confidence: 0.5 }));
}

function searchExact(db: any, errorMsg: string): ErrorSolution[] {
  try {
    const stmt = db.prepare(`
      SELECT * FROM error_solutions 
      WHERE LOWER(pattern) = LOWER(?)
      LIMIT 3
    `);
    return stmt.all(errorMsg) || [];
  } catch {
    return [];
  }
}

function searchByKeywords(db: any, keywords: string[]): ErrorSolution[] {
  if (keywords.length === 0) return [];
  try {
    const conditions = keywords.map(() => `LOWER(pattern) LIKE ?`).join(" OR ");
    const stmt = db.prepare(`
      SELECT * FROM error_solutions 
      WHERE ${conditions}
      ORDER BY id DESC
      LIMIT 5
    `);
    const params = keywords.map((k) => `%${k.toLowerCase()}%`);
    return stmt.all(...params) || [];
  } catch {
    return [];
  }
}

function searchFuzzy(db: any, errorMsg: string): ErrorSolution[] {
  try {
    const stmt = db.prepare(`
      SELECT * FROM error_solutions 
      WHERE LOWER(pattern) LIKE ?
         OR LOWER(title) LIKE ?
         OR LOWER(explanation) LIKE ?
      LIMIT 5
    `);
    const pattern = `%${errorMsg.toLowerCase()}%`;
    return stmt.all(pattern, pattern, pattern) || [];
  } catch {
    return [];
  }
}

function extractKeywords(errorStr: string): string[] {
  return errorStr
    .replace(/['"()]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);
}

function searchInHardcodedErrors(errorMsg: string): ErrorSolution[] {
  const q = (errorMsg || '').toLowerCase();
  const keywords = extractKeywords(errorMsg);

  const matched = INITIAL_ERRORS.filter((e) => {
    const hay = `${e.pattern} ${e.title} ${e.explanation}`.toLowerCase();
    if (q && hay.includes(q)) return true;
    for (const k of keywords) {
      if (hay.includes(k.toLowerCase())) return true;
    }
    return false;
  });

  return matched.map((e) => ({ ...e, confidence: 0.6 }));
}

export const INITIAL_ERRORS: ErrorSolution[] = [
  {
    pattern: "Cannot find module",
    title: "Módulo no instalado",
    explanation: "La dependencia no está en node_modules. Necesitas instalarla.",
    fix: "npm install <nombre-del-modulo>\n# o con pnpm:\npnpm add <nombre-del-modulo>",
    framework: "Node.js",
  },
  {
    pattern: "EADDRINUSE",
    title: "Puerto ya en uso",
    explanation: "Otro proceso está usando el puerto especificado.",
    fix: "# Windows (PowerShell):\nGet-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process\n\n# Linux/Mac:\nlsof -ti:3000 | xargs kill -9",
    framework: "General",
  },
  {
    pattern: "TS2307",
    title: "TypeScript: módulo no encontrado",
    explanation: "TypeScript no puede resolver el import. Falta @types o path incorrecto.",
    fix: "# Instalar tipos:\nnpm install --save-dev @types/<nombre>\n\n# O verificar tsconfig.json paths",
    framework: "TypeScript",
  },
  {
    pattern: "Nest can't resolve dependencies",
    title: "NestJS: inyección de dependencias falla",
    explanation: "Un provider no está registrado en el módulo correcto.",
    fix: "@Module({\n  providers: [TuService],\n  exports: [TuService] // si se usa en otros módulos\n})",
    framework: "NestJS",
  },
  {
    pattern: "CORS",
    title: "Error CORS bloqueando petición",
    explanation: "El servidor no permite peticiones desde tu origen.",
    fix: "// NestJS:\napp.enableCors({ origin: true });\n\n// Express:\nconst cors = require('cors');\napp.use(cors());",
    framework: "NestJS/Express",
  },
  {
    pattern: "ENOENT",
    title: "Archivo o directorio no existe",
    explanation: "El path especificado no existe o es incorrecto.",
    fix: "// Verificar que el path existe:\nconst fs = require('fs');\nif (fs.existsSync(path)) {\n  // continuar\n}",
    framework: "Node.js",
  },
  {
    pattern: "ERR_REQUIRE_ESM",
    title: "Módulo ESM importado con require",
    explanation: "Estás usando require() con un módulo ESM. Usa import.",
    fix: "// Cambiar de:\nconst module = require('module');\n\n// A:\nimport module from 'module';",
    framework: "Node.js",
  },
];

export async function initErrorsTable() {
  const db: any = await initDB();
  if (!db) return false;

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS error_solutions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pattern TEXT NOT NULL,
        title TEXT NOT NULL,
        explanation TEXT,
        fix TEXT,
        framework TEXT,
        times_helped INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const count = db.prepare('SELECT COUNT(*) as count FROM error_solutions').get();
    if (!count || count.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO error_solutions (pattern, title, explanation, fix, framework)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const error of INITIAL_ERRORS) {
        stmt.run(error.pattern, error.title, error.explanation, error.fix, error.framework);
      }

      console.log(`✓ ${INITIAL_ERRORS.length} errores iniciales cargados en DB`);
    }

    return true;
  } catch (err) {
    console.error('Error inicializando tabla error_solutions:', err);
    return false;
  }
}
