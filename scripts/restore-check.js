const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
const dir = process.env.BACKUP_DIR || path.join(__dirname,'..','backups');
if (!fs.existsSync(dir)) throw new Error(`Backup directory not found: ${dir}`);
const files=fs.readdirSync(dir).filter(f=>/^academic-.*\.sqlite$/.test(f)).sort().reverse();
if(!files.length) throw new Error(`No SQLite backup found in ${dir}`);
const file=path.join(dir,files[0]);
const db=new Database(file,{readonly:true});
try {
  const integrity=db.prepare('PRAGMA integrity_check').get().integrity_check;
  const users=db.prepare("SELECT COUNT(*) c FROM users").get().c;
  const migrations=db.prepare('SELECT MAX(version) version FROM schema_migrations').get().version||0;
  if(integrity!=='ok') throw new Error(`Integrity check failed: ${integrity}`);
  console.log(JSON.stringify({ok:true,file:path.basename(file),integrity,users,schemaVersion:migrations},null,2));
} finally { db.close(); }
