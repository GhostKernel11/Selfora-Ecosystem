const fs=require('node:fs');
const Database=require('better-sqlite3');
const path=require('node:path');
const dbPath=process.env.DB_PATH||path.join(__dirname,'..','data','academic.sqlite');
if(!fs.existsSync(dbPath)){ console.error(`Database not found: ${dbPath}`); process.exit(1); }
const db=new Database(dbPath,{readonly:true});
try{
  const rows=db.prepare(`SELECT path,COUNT(*) count,ROUND(AVG(duration_ms),2) avg_ms,ROUND(MAX(duration_ms),2) max_ms,SUM(CASE WHEN status>=500 THEN 1 ELSE 0 END) errors FROM performance_samples WHERE created_at>=datetime('now','-24 hours') GROUP BY path ORDER BY avg_ms DESC LIMIT 50`).all();
  console.log(JSON.stringify({window:'24h',generatedAt:new Date().toISOString(),routes:rows},null,2));
}finally{db.close();}
