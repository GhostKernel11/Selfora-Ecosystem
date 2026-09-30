const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
const source = process.env.DB_PATH || path.join(__dirname,'..','data','academic.sqlite');
const outDir = process.env.OPS_SNAPSHOT_DIR || path.join(__dirname,'..','ops-snapshots');
fs.mkdirSync(outDir,{recursive:true});
const db=new Database(source,{readonly:true});
try {
  const integrity=db.prepare('PRAGMA integrity_check').get().integrity_check;
  const schemaVersion=db.prepare('SELECT MAX(version) version FROM schema_migrations').get().version||0;
  const snapshot={generatedAt:new Date().toISOString(),node:process.version,database:{path:source,integrity,schemaVersion,sizeBytes:fs.statSync(source).size},counts:{users:db.prepare('SELECT COUNT(*) c FROM users').get().c,openReports:db.prepare("SELECT COUNT(*) c FROM reports WHERE status='open'").get().c}};
  const file=path.join(outDir,`ops-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  fs.writeFileSync(file,JSON.stringify(snapshot,null,2)+'\n');
  console.log(`Operational snapshot created: ${file}`);
} finally { db.close(); }
