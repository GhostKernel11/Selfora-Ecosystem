const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
const dir = process.env.BACKUP_DIR || path.join(__dirname,'..','backups');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f=>f.endsWith('.sqlite')).sort().reverse() : [];
if (!files.length) throw new Error(`No SQLite backups found in ${dir}`);
const file=path.join(dir,files[0]);
const db=new Database(file,{readonly:true});
try { const result=db.prepare('PRAGMA integrity_check').get(); if(result.integrity_check!=='ok') throw new Error('Backup integrity check failed.'); console.log(`Backup verified: ${file}`); }
finally { db.close(); }
