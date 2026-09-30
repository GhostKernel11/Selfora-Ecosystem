const Database=require('better-sqlite3');
const path=require('node:path');
const fs=require('node:fs');
const dbPath=process.env.DB_PATH||path.join(__dirname,'..','data','academic.sqlite');
if(!fs.existsSync(dbPath)){console.log(JSON.stringify({ok:true,feedback:0,clientErrors:0,categories:{}},null,2));process.exit(0);}
const db=new Database(dbPath,{readonly:true});
const categories=Object.fromEntries(db.prepare('SELECT category,COUNT(*) count FROM user_feedback GROUP BY category ORDER BY count DESC').all().map(x=>[x.category,x.count]));
const feedback=db.prepare('SELECT COUNT(*) count FROM user_feedback').get().count;
const clientErrors=db.prepare('SELECT COUNT(*) count FROM client_errors').get().count;
console.log(JSON.stringify({ok:true,feedback,clientErrors,categories},null,2));
db.close();
