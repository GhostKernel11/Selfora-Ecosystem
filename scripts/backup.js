const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const source = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'academic.sqlite');
const outDir = process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups');
fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(source)) throw new Error(`Database not found: ${source}`);
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const target = path.join(outDir, `academic-${stamp}.sqlite`);
const db = new Database(source, { readonly: true });
(async()=>{ try { await db.backup(target); console.log(`Backup created: ${target}`); } finally { db.close(); } })().catch(error=>{ console.error(error.message); process.exit(1); });
