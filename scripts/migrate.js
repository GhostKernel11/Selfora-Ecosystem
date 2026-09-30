const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'academic.sqlite');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);`);
const migrations = [
 [1,'normalized-core-schema',()=>{}],
 [2,'production-indexes-and-metadata',()=>db.exec(`CREATE TABLE IF NOT EXISTS system_metadata(key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON tasks(user_id,due,completed); CREATE INDEX IF NOT EXISTS idx_sessions_user_expires ON sessions(user_id,expires_at); CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id,created); CREATE INDEX IF NOT EXISTS idx_events_target_created ON realtime_events(target_user_id,created); CREATE INDEX IF NOT EXISTS idx_audit_user_created ON audit_log(user_id,created_at); INSERT OR IGNORE INTO system_metadata(key,value) VALUES('schema_name','academic-ecosystem');`)],
 [3,'operational-fields',()=>db.exec(`CREATE TABLE IF NOT EXISTS deployment_checks(id INTEGER PRIMARY KEY AUTOINCREMENT,check_name TEXT NOT NULL,status TEXT NOT NULL,details TEXT,checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); INSERT OR IGNORE INTO system_metadata(key,value) VALUES('phase','12');`)],
 [4,'operations-and-launch-validation',()=>db.exec(`CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at); CREATE INDEX IF NOT EXISTS idx_reports_status_created ON reports(status,created_at); CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(id); CREATE INDEX IF NOT EXISTS idx_questions_created ON community_questions(id); INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('phase','13',CURRENT_TIMESTAMP); INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('operations_schema','1',CURRENT_TIMESTAMP);`)],
 [5,'production-deployment-workflow',()=>db.exec(`INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('phase','15',CURRENT_TIMESTAMP); INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('release_version','15.0.0',CURRENT_TIMESTAMP); INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('deployment_workflow','production-launch',CURRENT_TIMESTAMP);`)]
];
for (const [version,name,fn] of migrations) {
 if (db.prepare('SELECT 1 FROM schema_migrations WHERE version=?').get(version)) continue;
 const tx=db.transaction(()=>{fn();db.prepare('INSERT INTO schema_migrations(version,name) VALUES(?,?)').run(version,name);}); tx(); console.log(`Applied migration ${version}: ${name}`);
}
db.close();
