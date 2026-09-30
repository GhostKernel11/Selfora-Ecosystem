const fs = require('node:fs');
const path = require('node:path');
const dir = process.env.BACKUP_DIR || path.join(__dirname,'..','backups');
const keep = Math.max(1, Number(process.env.BACKUP_RETENTION || 14));
if (!fs.existsSync(dir)) { console.log(`No backup directory: ${dir}`); process.exit(0); }
const files = fs.readdirSync(dir).filter(f=>/^academic-.*\.sqlite$/.test(f)).map(name=>({name,mtime:fs.statSync(path.join(dir,name)).mtimeMs})).sort((a,b)=>b.mtime-a.mtime);
const removed=files.slice(keep);
for (const file of removed) fs.rmSync(path.join(dir,file.name));
console.log(`Backup retention complete: kept=${Math.min(files.length,keep)} removed=${removed.length}`);
