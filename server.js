const express = require('express');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = Number(process.env.PORT || 3000);
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
const SECRET = process.env.SESSION_SECRET || 'change-this-session-secret-before-production';
const OPS_TOKEN = process.env.OPS_TOKEN || '';
const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'academic.sqlite');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');
db.pragma('synchronous = NORMAL');

function applyMigrations() {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`);
  const hasV1 = db.prepare('SELECT 1 FROM schema_migrations WHERE version=1').get();
  if (!hasV1) db.prepare("INSERT INTO schema_migrations(version,name) VALUES(1,'normalized-core-schema')").run();
  const migrations = [
    [2, 'production-indexes-and-metadata', () => db.exec(`
      CREATE TABLE IF NOT EXISTS system_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON tasks(user_id, due, completed);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_expires ON sessions(user_id, expires_at);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created);
      CREATE INDEX IF NOT EXISTS idx_events_target_created ON realtime_events(target_user_id, created);
      CREATE INDEX IF NOT EXISTS idx_audit_user_created ON audit_log(user_id, created_at);
      INSERT OR IGNORE INTO system_metadata(key,value) VALUES('schema_name','academic-ecosystem');
    `)],
    [3, 'operational-fields', () => db.exec(`
      CREATE TABLE IF NOT EXISTS deployment_checks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        check_name TEXT NOT NULL,
        status TEXT NOT NULL,
        details TEXT,
        checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      INSERT OR IGNORE INTO system_metadata(key,value) VALUES('phase','12');
    `)],
    [4, 'operations-and-launch-validation', () => db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);
      CREATE INDEX IF NOT EXISTS idx_reports_status_created ON reports(status,created_at);
      CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(id);
      CREATE INDEX IF NOT EXISTS idx_questions_created ON community_questions(id);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('phase','13',CURRENT_TIMESTAMP);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('operations_schema','1',CURRENT_TIMESTAMP);
    `)]
    , [5, 'production-deployment-workflow', () => db.exec(`
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('phase','15',CURRENT_TIMESTAMP);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('release_version','15.0.0',CURRENT_TIMESTAMP);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('deployment_workflow','production-launch',CURRENT_TIMESTAMP);
    `)]
    , [6, 'production-feedback-and-client-observability', () => db.exec(`
      CREATE TABLE IF NOT EXISTS user_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        message TEXT NOT NULL,
        page TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS client_errors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        message TEXT NOT NULL,
        source TEXT,
        page TEXT,
        stack TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_feedback_user_created ON user_feedback(user_id,created_at);
      CREATE INDEX IF NOT EXISTS idx_client_errors_created ON client_errors(created_at);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('phase','17',CURRENT_TIMESTAMP);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('release_version','17.0.0',CURRENT_TIMESTAMP);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('observability','feedback-and-client-errors',CURRENT_TIMESTAMP);
    `)]
    , [7, 'production-launch-validation', () => db.exec(`
      CREATE TABLE IF NOT EXISTS performance_samples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        method TEXT NOT NULL,
        path TEXT NOT NULL,
        status INTEGER NOT NULL,
        duration_ms REAL NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_performance_samples_created ON performance_samples(created_at);
      CREATE INDEX IF NOT EXISTS idx_performance_samples_path_created ON performance_samples(path,created_at);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('phase','20',CURRENT_TIMESTAMP);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('release_version','20.0.0',CURRENT_TIMESTAMP);
      INSERT OR REPLACE INTO system_metadata(key,value,updated_at) VALUES('launch_state','production-validation',CURRENT_TIMESTAMP);
    `)]
  ];
  for (const [version, name, fn] of migrations) {
    if (db.prepare('SELECT 1 FROM schema_migrations WHERE version=?').get(version)) continue;
    const tx = db.transaction(() => { fn(); db.prepare('INSERT INTO schema_migrations(version,name) VALUES(?,?)').run(version,name); });
    tx();
  }
}

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS academic_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  program TEXT NOT NULL DEFAULT 'Computer Science Student',
  initials TEXT NOT NULL DEFAULT 'S'
);
CREATE TABLE IF NOT EXISTS academic_metrics (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  reputation INTEGER NOT NULL DEFAULT 0,
  study_streak INTEGER NOT NULL DEFAULT 0,
  task_streak INTEGER NOT NULL DEFAULT 0,
  review_streak INTEGER NOT NULL DEFAULT 0,
  challenge_streak INTEGER NOT NULL DEFAULT 0,
  community_streak INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS subject_topics (
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  PRIMARY KEY(subject_id, topic)
);
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  due TEXT,
  minutes INTEGER NOT NULL DEFAULT 0,
  priority TEXT,
  completed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  deadline TEXT
);
CREATE TABLE IF NOT EXISTS study_sessions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT,
  topic TEXT,
  minutes INTEGER NOT NULL DEFAULT 0,
  date TEXT,
  started_at TEXT,
  type TEXT
);
CREATE TABLE IF NOT EXISTS schedule_items (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  date TEXT,
  time TEXT,
  duration INTEGER NOT NULL DEFAULT 0,
  type TEXT
);
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT,
  subject TEXT,
  topic TEXT,
  updated TEXT,
  favorite INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS resource_tags (
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY(resource_id, tag)
);
CREATE TABLE IF NOT EXISTS flashcards (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT,
  topic TEXT,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  confidence INTEGER NOT NULL DEFAULT 0,
  due TEXT,
  reviews INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS practice_questions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT,
  topic TEXT,
  question TEXT NOT NULL,
  answer INTEGER NOT NULL,
  explanation TEXT
);
CREATE TABLE IF NOT EXISTS practice_options (
  question_id INTEGER NOT NULL REFERENCES practice_questions(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  option_text TEXT NOT NULL,
  PRIMARY KEY(question_id, option_index)
);
CREATE TABLE IF NOT EXISTS mistakes (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT,
  topic TEXT,
  prompt TEXT,
  cause TEXT,
  correction TEXT,
  status TEXT
);
CREATE TABLE IF NOT EXISTS review_history (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT,
  topic TEXT,
  mode TEXT,
  correct INTEGER NOT NULL DEFAULT 0,
  date TEXT
);
CREATE TABLE IF NOT EXISTS community_questions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author TEXT,
  initials TEXT,
  subject TEXT,
  topic TEXT,
  title TEXT NOT NULL,
  body TEXT,
  answers INTEGER NOT NULL DEFAULT 0,
  votes INTEGER NOT NULL DEFAULT 0,
  solved INTEGER NOT NULL DEFAULT 0,
  created TEXT
);
CREATE TABLE IF NOT EXISTS community_answers (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES community_questions(id) ON DELETE CASCADE,
  author TEXT,
  initials TEXT,
  body TEXT,
  votes INTEGER NOT NULL DEFAULT 0,
  created TEXT
);
CREATE TABLE IF NOT EXISTS circles (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  members INTEGER NOT NULL DEFAULT 0,
  joined INTEGER NOT NULL DEFAULT 0,
  activity TEXT
);
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  subject TEXT,
  topic TEXT,
  members INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 1,
  focus_seconds INTEGER NOT NULL DEFAULT 0,
  joined INTEGER NOT NULL DEFAULT 0,
  status TEXT
);
CREATE TABLE IF NOT EXISTS community_posts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author TEXT,
  initials TEXT,
  type TEXT,
  text TEXT,
  time TEXT,
  likes INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS workspaces (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  status TEXT,
  progress INTEGER NOT NULL DEFAULT 0,
  tasks INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  updated TEXT
);
CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  PRIMARY KEY(workspace_id, member_name)
);
CREATE TABLE IF NOT EXISTS peer_reviews (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  author TEXT,
  status TEXT,
  requested TEXT
);
CREATE TABLE IF NOT EXISTS peer_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER NOT NULL REFERENCES peer_reviews(id) ON DELETE CASCADE,
  author TEXT,
  score INTEGER,
  comment TEXT
);
CREATE TABLE IF NOT EXISTS shared_resources (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  type TEXT,
  owner TEXT,
  downloads INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  shared TEXT
);
CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  initials TEXT,
  text TEXT,
  time TEXT
);
CREATE TABLE IF NOT EXISTS recommendations (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT,
  type TEXT,
  priority TEXT
);
CREATE TABLE IF NOT EXISTS study_methods (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  best_for TEXT
);
CREATE TABLE IF NOT EXISTS study_method_steps (
  method_id INTEGER NOT NULL REFERENCES study_methods(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_text TEXT NOT NULL,
  PRIMARY KEY(method_id, step_order)
);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON study_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_questions_user ON community_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_user_due ON flashcards(user_id, due);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity(user_id);


CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read INTEGER NOT NULL DEFAULT 0,
  created TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS realtime_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  actor_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  created TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS room_presence (
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_seen TEXT NOT NULL,
  PRIMARY KEY(room_id,user_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  csrf_token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen TEXT NOT NULL,
  user_agent TEXT,
  ip_hash TEXT
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL,
  UNIQUE(reporter_user_id,target_type,target_id)
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_user_time ON audit_log(user_id,created_at);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status,created_at);

CREATE INDEX IF NOT EXISTS idx_events_target_id ON realtime_events(target_user_id,id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id,read,id);
`);

// Apply versioned schema migrations after the base tables exist.
applyMigrations();

app.disable('x-powered-by');
app.disable('etag');
app.use((req,res,next)=>{
  const started=process.hrtime.bigint();
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(),microphone=(),geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy','same-origin');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  res.on('finish',()=>{
    const durationMs=Number(process.hrtime.bigint()-started)/1e6;
    if(req.path.startsWith('/api')){
      try{ db.prepare('INSERT INTO performance_samples(method,path,status,duration_ms) VALUES(?,?,?,?)').run(req.method,req.path,res.statusCode,durationMs); }catch{}
    }
    res.setHeader('Server-Timing',`app;dur=${durationMs.toFixed(1)}`);
  });
  next();
});
app.use('/css',express.static(path.join(__dirname,'css'),{maxAge:'7d',immutable:true,etag:true,setHeaders:(res)=>res.setHeader('Cache-Control','public, max-age=604800, immutable')}));
app.use('/js',express.static(path.join(__dirname,'js'),{maxAge:'7d',immutable:true,etag:true,setHeaders:(res)=>res.setHeader('Cache-Control','public, max-age=604800, immutable')}));
app.use(express.json({ limit: '256kb' }));

const rateBuckets = new Map();
function rateLimit({windowMs=60_000,max=60,key=(req)=>`${req.ip}:${req.path}`}={}){
  return (req,res,next)=>{
    const now=Date.now(), k=key(req), item=rateBuckets.get(k);
    if(!item || now-item.start>=windowMs){ rateBuckets.set(k,{start:now,count:1}); return next(); }
    item.count++;
    if(item.count>max){ res.setHeader('Retry-After',Math.ceil((windowMs-(now-item.start))/1000)); return res.status(429).json({error:'Too many requests. Please try again later.'}); }
    next();
  };
}
app.use('/api/auth', rateLimit({windowMs:15*60_000,max:30,key:req=>`${req.ip}:auth`}));
app.use('/api', rateLimit({windowMs:60_000,max:180,key:req=>`${req.ip}:api`}));

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return { hash: crypto.scryptSync(password, salt, 64).toString('hex'), salt };
}
function verifyPassword(password, hash, salt) {
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return derived.length === hash.length && crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(hash, 'hex'));
}
function sha256(value){ return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function nowIso(){ return new Date().toISOString(); }
function randomToken(){ return crypto.randomBytes(32).toString('base64url'); }
function parseCookies(req){ return Object.fromEntries((req.headers.cookie||'').split(';').filter(Boolean).map(pair=>{const i=pair.indexOf('=');return [pair.slice(0,i).trim(),decodeURIComponent(pair.slice(i+1))];})); }
function setCookie(res,name,value,maxAge,opts=''){ res.setHeader('Set-Cookie',`${name}=${encodeURIComponent(value)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${opts}`); }
function setCsrfCookie(res,value){ res.append('Set-Cookie',`ae_csrf=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=604800`); }
function createSession(res,userId,req){
  const raw=randomToken(), csrf=randomToken(), now=nowIso(), expires=new Date(Date.now()+7*24*60*60*1000).toISOString();
  db.prepare('INSERT INTO sessions(user_id,token_hash,csrf_token,expires_at,created_at,last_seen,user_agent,ip_hash) VALUES(?,?,?,?,?,?,?,?)').run(userId,sha256(raw),csrf,expires,now,now,String(req.get('user-agent')||'').slice(0,300),sha256(req.ip||''));
  setCookie(res,'ae_session',raw,604800);
  setCsrfCookie(res,csrf);
}
function clearSession(res){ res.append('Set-Cookie','ae_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0'); res.append('Set-Cookie','ae_csrf=; Path=/; SameSite=Lax; Max-Age=0'); }
function getSession(req){
  const raw=parseCookies(req).ae_session; if(!raw) return null;
  const row=db.prepare('SELECT s.*,u.id uid,u.name,u.email,u.created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').get(sha256(raw),nowIso());
  if(!row) return null;
  db.prepare('UPDATE sessions SET last_seen=? WHERE id=?').run(nowIso(),row.id);
  return row;
}
function getUserId(req){ const session=getSession(req); return session?Number(session.uid):null; }
function auth(req,res,next){
  const session=getSession(req); if(!session)return res.status(401).json({error:'Authentication required.'});
  req.session=session; req.user={id:session.uid,name:session.name,email:session.email,created_at:session.created_at}; next();
}
function requireCsrf(req,res,next){
  if(!['POST','PUT','PATCH','DELETE'].includes(req.method)) return next();
  if(req.path === '/auth/register' || req.path === '/auth/login' || req.path === '/client-errors') return next();
  const session=req.session || getSession(req);
  if(!session)return res.status(401).json({error:'Authentication required.'});
  const supplied=req.get('X-CSRF-Token'), cookie=parseCookies(req).ae_csrf;
  if(!supplied || !cookie || supplied!==cookie || supplied!==session.csrf_token)return res.status(403).json({error:'CSRF validation failed.'});
  next();
}
function audit(userId,action,targetType=null,targetId=null,metadata={}){ db.prepare('INSERT INTO audit_log(user_id,action,target_type,target_id,metadata,created_at) VALUES(?,?,?,?,?,?)').run(userId,action,targetType,targetId==null?null:String(targetId),JSON.stringify(metadata||{}),nowIso()); }
function cleanText(value,max=5000){ return String(value??'').trim().slice(0,max); }
function validEmail(value){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||'')); }
function assertId(value){ const n=Number(value); return Number.isSafeInteger(n)&&n>0?n:null; }
function publicUser(user) { return { id: user.id, name: user.name, email: user.email, createdAt: user.created_at }; }
function bool(v) { return v ? 1 : 0; }
function num(v, fallback = 0) { const n = Number(v); return Number.isFinite(n) ? n : fallback; }

const TABLES = [
  'subjects','subject_topics','tasks','goals','study_sessions','schedule_items','resources','resource_tags','flashcards',
  'practice_questions','practice_options','mistakes','review_history','community_questions','community_answers','circles',
  'rooms','community_posts','workspaces','workspace_members','peer_reviews','peer_feedback','shared_resources','activity',
  'recommendations','study_methods','study_method_steps'
];
function clearUserData(userId) {
  for (const table of TABLES) {
    if (table === 'subject_topics') db.prepare('DELETE FROM subject_topics WHERE subject_id IN (SELECT id FROM subjects WHERE user_id = ?)').run(userId);
    else if (table === 'resource_tags') db.prepare('DELETE FROM resource_tags WHERE resource_id IN (SELECT id FROM resources WHERE user_id = ?)').run(userId);
    else if (table === 'practice_options') db.prepare('DELETE FROM practice_options WHERE question_id IN (SELECT id FROM practice_questions WHERE user_id = ?)').run(userId);
    else if (table === 'community_answers') db.prepare('DELETE FROM community_answers WHERE user_id = ? OR question_id IN (SELECT id FROM community_questions WHERE user_id = ?)').run(userId, userId);
    else if (table === 'workspace_members') db.prepare('DELETE FROM workspace_members WHERE workspace_id IN (SELECT id FROM workspaces WHERE user_id = ?)').run(userId);
    else if (table === 'peer_feedback') db.prepare('DELETE FROM peer_feedback WHERE review_id IN (SELECT id FROM peer_reviews WHERE user_id = ?)').run(userId);
    else if (table === 'study_method_steps') db.prepare('DELETE FROM study_method_steps WHERE method_id IN (SELECT id FROM study_methods WHERE user_id = ?)').run(userId);
    else db.prepare(`DELETE FROM ${table} WHERE user_id = ?`).run(userId);
  }
}

function saveNormalizedState(userId, state) {
  if (!state || typeof state !== 'object') throw new Error('A state object is required.');
  const tx = db.transaction(() => {
    clearUserData(userId);
    const profile = state.profile || {};
    const metrics = state.streaks || {};
    db.prepare(`INSERT INTO academic_profiles(user_id,program,initials) VALUES(?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET program=excluded.program, initials=excluded.initials`).run(userId, profile.program || 'Computer Science Student', profile.initials || String(profile.name || 'S').charAt(0).toUpperCase());
    db.prepare(`INSERT INTO academic_metrics(user_id,xp,reputation,study_streak,task_streak,review_streak,challenge_streak,community_streak)
      VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET xp=excluded.xp,reputation=excluded.reputation,study_streak=excluded.study_streak,task_streak=excluded.task_streak,review_streak=excluded.review_streak,challenge_streak=excluded.challenge_streak,community_streak=excluded.community_streak`)
      .run(userId, num(state.xp), num(state.reputation), num(metrics.study), num(metrics.tasks), num(metrics.review), num(metrics.challenge), num(metrics.community));

    const subject = db.prepare('INSERT INTO subjects(id,user_id,name,code,progress) VALUES(?,?,?,?,?)');
    const topic = db.prepare('INSERT INTO subject_topics(subject_id,topic) VALUES(?,?)');
    for (const x of state.subjects || []) { subject.run(num(x.id, Date.now()), userId, x.name || '', x.code || '', num(x.progress)); for (const t of x.topics || []) topic.run(num(x.id), String(t)); }
    const task = db.prepare('INSERT INTO tasks(id,user_id,title,subject,due,minutes,priority,completed) VALUES(?,?,?,?,?,?,?,?)');
    for (const x of state.tasks || []) task.run(num(x.id, Date.now()), userId, x.title || '', x.subject || '', x.due || '', num(x.minutes), x.priority || '', bool(x.completed));
    const goal = db.prepare('INSERT INTO goals(id,user_id,title,progress,deadline) VALUES(?,?,?,?,?)');
    for (const x of state.goals || []) goal.run(num(x.id, Date.now()), userId, x.title || '', num(x.progress), x.deadline || '');
    const session = db.prepare('INSERT INTO study_sessions(id,user_id,subject,topic,minutes,date,started_at,type) VALUES(?,?,?,?,?,?,?,?)');
    for (const x of state.sessions || []) session.run(num(x.id, Date.now()), userId, x.subject || '', x.topic || '', num(x.minutes), x.date || '', x.startedAt || '', x.type || 'Study');
    const schedule = db.prepare('INSERT INTO schedule_items(id,user_id,title,subject,date,time,duration,type) VALUES(?,?,?,?,?,?,?,?)');
    for (const x of state.schedule || []) schedule.run(num(x.id, Date.now()), userId, x.title || '', x.subject || '', x.date || '', x.time || '', num(x.duration), x.type || 'Study');
    const resource = db.prepare('INSERT INTO resources(id,user_id,title,type,subject,topic,updated,favorite) VALUES(?,?,?,?,?,?,?,?)');
    const tag = db.prepare('INSERT INTO resource_tags(resource_id,tag) VALUES(?,?)');
    for (const x of state.resources || []) { resource.run(num(x.id, Date.now()), userId, x.title || '', x.type || '', x.subject || '', x.topic || '', x.updated || '', bool(x.favorite)); for (const t of x.tags || []) tag.run(num(x.id), String(t)); }
    const card = db.prepare('INSERT INTO flashcards(id,user_id,subject,topic,front,back,confidence,due,reviews) VALUES(?,?,?,?,?,?,?,?,?)');
    for (const x of state.flashcards || []) card.run(num(x.id, Date.now()), userId, x.subject || '', x.topic || '', x.front || '', x.back || '', num(x.confidence), x.due || '', num(x.reviews));
    const pq = db.prepare('INSERT INTO practice_questions(id,user_id,subject,topic,question,answer,explanation) VALUES(?,?,?,?,?,?,?)');
    const po = db.prepare('INSERT INTO practice_options(question_id,option_index,option_text) VALUES(?,?,?)');
    for (const x of state.practice || []) { pq.run(num(x.id, Date.now()), userId, x.subject || '', x.topic || '', x.question || '', num(x.answer), x.explanation || ''); (x.options || []).forEach((o,i)=>po.run(num(x.id),i,String(o))); }
    const mistake = db.prepare('INSERT INTO mistakes(id,user_id,subject,topic,prompt,cause,correction,status) VALUES(?,?,?,?,?,?,?,?)');
    for (const x of state.mistakes || []) mistake.run(num(x.id, Date.now()), userId, x.subject || '', x.topic || '', x.prompt || '', x.cause || '', x.correction || '', x.status || 'Review');
    const review = db.prepare('INSERT INTO review_history(id,user_id,subject,topic,mode,correct,date) VALUES(?,?,?,?,?,?,?)');
    for (const x of state.reviewHistory || []) review.run(num(x.id, Date.now()), userId, x.subject || '', x.topic || '', x.mode || '', bool(x.correct), x.date || '');
    const cq = db.prepare('INSERT INTO community_questions(id,user_id,author,initials,subject,topic,title,body,answers,votes,solved,created) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)');
    for (const x of state.communityQuestions || []) cq.run(num(x.id, Date.now()), userId, x.author || '', x.initials || '', x.subject || '', x.topic || '', x.title || '', x.body || '', num(x.answers), num(x.votes), bool(x.solved), x.created || '');
    const ca = db.prepare('INSERT INTO community_answers(id,user_id,question_id,author,initials,body,votes,created) VALUES(?,?,?,?,?,?,?,?)');
    for (const x of state.communityAnswers || []) ca.run(num(x.id, Date.now()), userId, num(x.questionId), x.author || '', x.initials || '', x.body || '', num(x.votes), x.created || '');
    const circle = db.prepare('INSERT INTO circles(id,user_id,name,subject,description,members,joined,activity) VALUES(?,?,?,?,?,?,?,?)');
    for (const x of state.circles || []) circle.run(num(x.id, Date.now()), userId, x.name || '', x.subject || '', x.description || '', num(x.members), bool(x.joined), x.activity || '');
    const room = db.prepare('INSERT INTO rooms(id,user_id,name,type,subject,topic,members,capacity,focus_seconds,joined,status) VALUES(?,?,?,?,?,?,?,?,?,?,?)');
    for (const x of state.rooms || []) room.run(num(x.id, Date.now()), userId, x.name || '', x.type || '', x.subject || '', x.topic || '', num(x.members), num(x.capacity,1), num(x.focusSeconds), bool(x.joined), x.status || 'Open');
    const post = db.prepare('INSERT INTO community_posts(id,user_id,author,initials,type,text,time,likes) VALUES(?,?,?,?,?,?,?,?)');
    for (const x of state.communityPosts || []) post.run(num(x.id, Date.now()), userId, x.author || '', x.initials || '', x.type || 'discussion', x.text || '', x.time || '', num(x.likes));
    const ws = db.prepare('INSERT INTO workspaces(id,user_id,name,subject,description,status,progress,tasks,completed,updated) VALUES(?,?,?,?,?,?,?,?,?,?)');
    const wm = db.prepare('INSERT INTO workspace_members(workspace_id,member_name) VALUES(?,?)');
    for (const x of state.workspaces || []) { ws.run(num(x.id, Date.now()), userId, x.name || '', x.subject || '', x.description || '', x.status || 'Planning', num(x.progress), num(x.tasks), num(x.completed), x.updated || ''); for (const m of x.members || []) wm.run(num(x.id), String(m)); }
    const pr = db.prepare('INSERT INTO peer_reviews(id,user_id,title,subject,author,status,requested) VALUES(?,?,?,?,?,?,?)');
    const pf = db.prepare('INSERT INTO peer_feedback(review_id,author,score,comment) VALUES(?,?,?,?)');
    for (const x of state.peerReviews || []) { pr.run(num(x.id, Date.now()), userId, x.title || '', x.subject || '', x.author || '', x.status || 'Open', x.requested || ''); for (const f of x.feedback || []) pf.run(num(x.id), f.author || '', num(f.score), f.comment || ''); }
    const sr = db.prepare('INSERT INTO shared_resources(id,user_id,title,subject,type,owner,downloads,likes,description,shared) VALUES(?,?,?,?,?,?,?,?,?,?)');
    for (const x of state.sharedResources || []) sr.run(num(x.id, Date.now()), userId, x.title || '', x.subject || '', x.type || '', x.owner || '', num(x.downloads), num(x.likes), x.description || '', x.shared || '');
    const act = db.prepare('INSERT INTO activity(user_id,initials,text,time) VALUES(?,?,?,?)');
    for (const x of state.activity || []) act.run(userId, x.initials || '', x.text || '', x.time || '');
    const rec = db.prepare('INSERT INTO recommendations(id,user_id,text,type,priority) VALUES(?,?,?,?,?)');
    for (const x of state.recommendations || []) rec.run(num(x.id, Date.now()), userId, x.text || '', x.type || '', x.priority || '');
    const method = db.prepare('INSERT INTO study_methods(id,user_id,name,description,best_for) VALUES(?,?,?,?,?)');
    const step = db.prepare('INSERT INTO study_method_steps(method_id,step_order,step_text) VALUES(?,?,?)');
    for (const x of state.studyMethods || []) { method.run(num(x.id, Date.now()), userId, x.name || '', x.description || '', x.bestFor || ''); (x.steps || []).forEach((s,i)=>step.run(num(x.id),i,String(s))); }
  });
  tx();
}

function loadNormalizedState(userId) {
  const profile = db.prepare('SELECT p.program,p.initials,u.name FROM academic_profiles p JOIN users u ON u.id=p.user_id WHERE p.user_id=?').get(userId) || { name: db.prepare('SELECT name FROM users WHERE id=?').get(userId)?.name || 'Student', program: 'Computer Science Student', initials: 'S' };
  const metrics = db.prepare('SELECT * FROM academic_metrics WHERE user_id=?').get(userId) || {};
  const state = {
    profile: { name: profile.name, program: profile.program, initials: profile.initials },
    xp: num(metrics.xp), reputation: num(metrics.reputation),
    streaks: { study:num(metrics.study_streak), tasks:num(metrics.task_streak), review:num(metrics.review_streak), challenge:num(metrics.challenge_streak), community:num(metrics.community_streak) },
    subjects: db.prepare('SELECT id,name,code,progress FROM subjects WHERE user_id=?').all(userId).map(x=>({...x,topics:db.prepare('SELECT topic FROM subject_topics WHERE subject_id=? ORDER BY topic').all(x.id).map(t=>t.topic)})),
    tasks: db.prepare('SELECT id,title,subject,due,minutes,priority,completed FROM tasks WHERE user_id=?').all(userId).map(x=>({...x,completed:Boolean(x.completed)})),
    goals: db.prepare('SELECT id,title,progress,deadline FROM goals WHERE user_id=?').all(userId),
    sessions: db.prepare('SELECT id,subject,topic,minutes,date,started_at AS startedAt,type FROM study_sessions WHERE user_id=? ORDER BY date DESC').all(userId),
    schedule: db.prepare('SELECT id,title,subject,date,time,duration,type FROM schedule_items WHERE user_id=? ORDER BY date,time').all(userId),
    resources: db.prepare('SELECT id,title,type,subject,topic,updated,favorite FROM resources WHERE user_id=?').all(userId).map(x=>({...x,favorite:Boolean(x.favorite),tags:db.prepare('SELECT tag FROM resource_tags WHERE resource_id=? ORDER BY tag').all(x.id).map(t=>t.tag)})),
    flashcards: db.prepare('SELECT id,subject,topic,front,back,confidence,due,reviews FROM flashcards WHERE user_id=?').all(userId),
    practice: db.prepare('SELECT id,subject,topic,question,answer,explanation FROM practice_questions WHERE user_id=?').all(userId).map(x=>({...x,options:db.prepare('SELECT option_text FROM practice_options WHERE question_id=? ORDER BY option_index').all(x.id).map(o=>o.option_text)})),
    mistakes: db.prepare('SELECT id,subject,topic,prompt,cause,correction,status FROM mistakes WHERE user_id=?').all(userId),
    reviewHistory: db.prepare('SELECT id,subject,topic,mode,correct,date FROM review_history WHERE user_id=?').all(userId).map(x=>({...x,correct:Boolean(x.correct)})),
    communityQuestions: db.prepare('SELECT id,author,initials,subject,topic,title,body,answers,votes,solved,created FROM community_questions WHERE user_id=?').all(userId).map(x=>({...x,solved:Boolean(x.solved)})),
    communityAnswers: db.prepare('SELECT id,question_id AS questionId,author,initials,body,votes,created FROM community_answers WHERE user_id=?').all(userId),
    circles: db.prepare('SELECT id,name,subject,description,members,joined,activity FROM circles WHERE user_id=?').all(userId).map(x=>({...x,joined:Boolean(x.joined)})),
    rooms: db.prepare('SELECT id,name,type,subject,topic,members,capacity,focus_seconds AS focusSeconds,joined,status FROM rooms WHERE user_id=?').all(userId).map(x=>({...x,joined:Boolean(x.joined)})),
    communityPosts: db.prepare('SELECT id,author,initials,type,text,time,likes FROM community_posts WHERE user_id=?').all(userId),
    workspaces: db.prepare('SELECT id,name,subject,description,status,progress,tasks,completed,updated FROM workspaces WHERE user_id=?').all(userId).map(x=>({...x,members:db.prepare('SELECT member_name FROM workspace_members WHERE workspace_id=? ORDER BY member_name').all(x.id).map(m=>m.member_name)})),
    peerReviews: db.prepare('SELECT id,title,subject,author,status,requested FROM peer_reviews WHERE user_id=?').all(userId).map(x=>({...x,feedback:db.prepare('SELECT author,score,comment FROM peer_feedback WHERE review_id=? ORDER BY id').all(x.id)})),
    sharedResources: db.prepare('SELECT id,title,subject,type,owner,downloads,likes,description,shared FROM shared_resources WHERE user_id=?').all(userId),
    activity: db.prepare('SELECT initials,text,time FROM activity WHERE user_id=? ORDER BY id DESC').all(userId),
    recommendations: db.prepare('SELECT id,text,type,priority FROM recommendations WHERE user_id=?').all(userId),
    studyMethods: db.prepare('SELECT id,name,description,best_for AS bestFor FROM study_methods WHERE user_id=?').all(userId).map(x=>({...x,steps:db.prepare('SELECT step_text FROM study_method_steps WHERE method_id=? ORDER BY step_order').all(x.id).map(s=>s.step_text)}))
  };
  return state;
}

function migrateLegacyUser(userId, stateJson) {
  if (!stateJson) return false;
  try { saveNormalizedState(userId, JSON.parse(stateJson)); return true; } catch (e) { console.error('Legacy migration failed:', e.message); return false; }
}

app.post('/api/auth/register', (req,res)=>{
  const name=String(req.body.name||'').trim(), email=String(req.body.email||'').trim().toLowerCase(), password=String(req.body.password||'');
  if(name.length<2)return res.status(400).json({error:'Name must be at least 2 characters.'});
  if(!/^\S+@\S+\.\S+$/.test(email))return res.status(400).json({error:'Enter a valid email address.'});
  if(password.length<8)return res.status(400).json({error:'Password must be at least 8 characters.'});
  if(db.prepare('SELECT id FROM users WHERE email=?').get(email))return res.status(409).json({error:'An account with that email already exists.'});
  const {hash,salt}=hashPassword(password);
  const info=db.prepare('INSERT INTO users(name,email,password_hash,password_salt) VALUES(?,?,?,?)').run(name,email,hash,salt);
  db.prepare('INSERT INTO academic_profiles(user_id,program,initials) VALUES(?,?,?)').run(info.lastInsertRowid,'Computer Science Student',name.charAt(0).toUpperCase());
  db.prepare('INSERT INTO academic_metrics(user_id) VALUES(?)').run(info.lastInsertRowid);
  const user=db.prepare('SELECT id,name,email,created_at FROM users WHERE id=?').get(info.lastInsertRowid); setSession(res,user.id); res.status(201).json({user:publicUser(user),hasState:false});
});
app.post('/api/auth/login',(req,res)=>{
  const email=String(req.body.email||'').trim().toLowerCase(),password=String(req.body.password||'');
  const user=db.prepare('SELECT * FROM users WHERE email=?').get(email); if(!user||!verifyPassword(password,user.password_hash,user.password_salt))return res.status(401).json({error:'Email or password is incorrect.'});
  if(!db.prepare('SELECT 1 FROM academic_profiles WHERE user_id=?').get(user.id)){db.prepare('INSERT INTO academic_profiles(user_id,program,initials) VALUES(?,?,?)').run(user.id,'Computer Science Student',user.name.charAt(0).toUpperCase());db.prepare('INSERT OR IGNORE INTO academic_metrics(user_id) VALUES(?)').run(user.id);}
  setSession(res,user.id); res.json({user:publicUser(user),hasState:Boolean(db.prepare('SELECT 1 FROM subjects WHERE user_id=? LIMIT 1').get(user.id)||db.prepare('SELECT 1 FROM tasks WHERE user_id=? LIMIT 1').get(user.id))});
});
app.post('/api/auth/logout',(req,res)=>{clearSession(res);res.json({ok:true});});
app.get('/api/auth/sessions',auth,(req,res)=>res.json({sessions:db.prepare('SELECT id,created_at,last_seen,expires_at,user_agent FROM sessions WHERE user_id=? ORDER BY last_seen DESC').all(req.user.id).map(s=>({...s,current:s.id===req.session.id}))}));
app.delete('/api/auth/sessions/:id',auth,(req,res)=>{const id=assertId(req.params.id);const info=db.prepare('DELETE FROM sessions WHERE id=? AND user_id=?').run(id,req.user.id);if(!info.changes)return res.status(404).json({error:'Session not found.'});audit(req.user.id,'auth.session_revoked','session',id);res.json({ok:true});});

app.get('/api/auth/me',auth,(req,res)=>res.json({user:publicUser(req.user),hasState:Boolean(db.prepare('SELECT 1 FROM academic_profiles WHERE user_id=?').get(req.user.id)&&db.prepare('SELECT COUNT(*) c FROM tasks WHERE user_id=?').get(req.user.id).c)}));

app.get('/api/state',auth,(req,res)=>res.json({state:loadNormalizedState(req.user.id)}));
app.put('/api/state',auth,(req,res)=>{
  if(!req.body||typeof req.body.state!=='object')return res.status(400).json({error:'A state object is required.'});
  try { saveNormalizedState(req.user.id,req.body.state); res.json({ok:true,storage:'normalized-sqlite',updatedAt:new Date().toISOString()}); }
  catch(e){ console.error(e); res.status(500).json({error:'Unable to save academic state.'}); }
});

// Focused entity APIs: Phase 8 starts exposing normalized resources directly.
app.get('/api/tasks',auth,(req,res)=>res.json({tasks:db.prepare('SELECT id,title,subject,due,minutes,priority,completed FROM tasks WHERE user_id=? ORDER BY completed,due,id').all(req.user.id).map(x=>({...x,completed:Boolean(x.completed)}))}));
app.post('/api/tasks',auth,(req,res)=>{const b=req.body||{},id=Date.now();db.prepare('INSERT INTO tasks(id,user_id,title,subject,due,minutes,priority,completed) VALUES(?,?,?,?,?,?,?,?)').run(id,req.user.id,String(b.title||''),String(b.subject||''),String(b.due||''),num(b.minutes),String(b.priority||'Medium'),bool(b.completed));res.status(201).json({id});});
app.patch('/api/tasks/:id',auth,(req,res)=>{const id=assertId(req.params.id);if(!id)return res.status(400).json({error:'Invalid task id.'});const old=db.prepare('SELECT * FROM tasks WHERE id=? AND user_id=?').get(id,req.user.id);if(!old)return res.status(404).json({error:'Task not found.'});const b=req.body||{};db.prepare('UPDATE tasks SET title=?,subject=?,due=?,minutes=?,priority=?,completed=? WHERE id=? AND user_id=?').run(b.title??old.title,b.subject??old.subject,b.due??old.due,num(b.minutes,old.minutes),b.priority??old.priority,b.completed===undefined?old.completed:bool(b.completed),id,req.user.id);res.json({ok:true});});
app.delete('/api/tasks/:id',auth,(req,res)=>{const id=assertId(req.params.id);if(!id)return res.status(400).json({error:'Invalid task id.'});const info=db.prepare('DELETE FROM tasks WHERE id=? AND user_id=?').run(id,req.user.id);if(!info.changes)return res.status(404).json({error:'Task not found.'});res.json({ok:true});});
app.get('/api/flashcards/due',auth,(req,res)=>res.json({flashcards:db.prepare(`SELECT id,subject,topic,front,back,confidence,due,reviews FROM flashcards WHERE user_id=? AND (due='' OR due<=date('now')) ORDER BY due,id`).all(req.user.id)}));
app.get('/api/community/questions',auth,(req,res)=>res.json({questions:db.prepare('SELECT id,author,initials,subject,topic,title,body,answers,votes,solved,created FROM community_questions WHERE user_id=? ORDER BY id DESC').all(req.user.id).map(x=>({...x,solved:Boolean(x.solved)}))}));
app.get('/api/resources/shared',auth,(req,res)=>res.json({resources:db.prepare('SELECT id,title,subject,type,owner,downloads,likes,description,shared FROM shared_resources WHERE user_id=? ORDER BY id DESC').all(req.user.id)}));
app.get('/api/analytics/summary',auth,(req,res)=>{
  const u=req.user.id;
  const studyMinutes=db.prepare('SELECT COALESCE(SUM(minutes),0) total FROM study_sessions WHERE user_id=?').get(u).total;
  const completed=db.prepare('SELECT COALESCE(SUM(completed),0) c,COUNT(*) total FROM tasks WHERE user_id=?').get(u);
  const attempts=db.prepare('SELECT COUNT(*) total,COALESCE(SUM(correct),0) correct FROM review_history WHERE user_id=?').get(u);
  const openMistakes=db.prepare("SELECT COUNT(*) c FROM mistakes WHERE user_id=? AND status!='Mastered'").get(u).c;
  const subjects=db.prepare('SELECT name,progress FROM subjects WHERE user_id=? ORDER BY progress').all(u);
  res.json({studyMinutes,taskCompletion:completed.total?completed.c/completed.total:0,practiceAccuracy:attempts.total?attempts.correct/attempts.total:0,openMistakes,subjects});
});

const realtimeClients = new Map();
function emitEvent(targetUserId, type, payload, actorUserId=null){
  const created=nowIso();
  const info=db.prepare('INSERT INTO realtime_events(target_user_id,actor_user_id,type,payload,created) VALUES(?,?,?,?,?)').run(targetUserId||null,actorUserId,type,JSON.stringify(payload||{}),created);
  const event={id:info.lastInsertRowid,type,payload:payload||{},created};
  const targets=[];
  if(targetUserId){ if(realtimeClients.has(Number(targetUserId))) targets.push(...realtimeClients.get(Number(targetUserId))); }
  else { for(const list of realtimeClients.values()) targets.push(...list); }
  for(const res of targets){ try{ res.write(`id: ${event.id}\nevent: ${type}\ndata: ${JSON.stringify(event)}\n\n`); }catch{} }
  return event;
}
function notify(userId,type,title,body,actorUserId=null){
  const id=Date.now()+Math.floor(Math.random()*1000);
  db.prepare('INSERT INTO notifications(id,user_id,type,title,body,created) VALUES(?,?,?,?,?,?)').run(id,userId,type,title,body||'',nowIso());
  emitEvent(userId,'notification.created',{id,type,title,body:body||''},actorUserId);
}

app.get('/api/realtime/stream',auth,(req,res)=>{
  res.setHeader('Content-Type','text/event-stream'); res.setHeader('Cache-Control','no-cache'); res.setHeader('Connection','keep-alive'); res.flushHeaders?.();
  const uid=req.user.id; if(!realtimeClients.has(uid)) realtimeClients.set(uid,new Set()); realtimeClients.get(uid).add(res);
  res.write(`event: connected\ndata: ${JSON.stringify({userId:uid,created:nowIso()})}\n\n`);
  const keep=setInterval(()=>{ try{res.write(`event: heartbeat\ndata: ${JSON.stringify({created:nowIso()})}\n\n`);}catch{} },25000);
  req.on('close',()=>{ clearInterval(keep); const set=realtimeClients.get(uid); if(set){set.delete(res);if(!set.size)realtimeClients.delete(uid);} });
});
app.get('/api/notifications',auth,(req,res)=>res.json({notifications:db.prepare('SELECT id,type,title,body,read,created FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 50').all(req.user.id).map(n=>({...n,read:Boolean(n.read)}))}));
app.patch('/api/notifications/:id/read',auth,(req,res)=>{db.prepare('UPDATE notifications SET read=1 WHERE id=? AND user_id=?').run(num(req.params.id),req.user.id);res.json({ok:true});});
app.post('/api/presence/rooms/:id',auth,(req,res)=>{const roomId=num(req.params.id);const room=db.prepare('SELECT id,name FROM rooms WHERE id=?').get(roomId);if(!room)return res.status(404).json({error:'Room not found.'});db.prepare('INSERT INTO room_presence(room_id,user_id,last_seen) VALUES(?,?,?) ON CONFLICT(room_id,user_id) DO UPDATE SET last_seen=excluded.last_seen').run(roomId,req.user.id,nowIso());emitEvent(null,'room.presence.updated',{roomId},req.user.id);res.json({ok:true});});
app.delete('/api/presence/rooms/:id',auth,(req,res)=>{db.prepare('DELETE FROM room_presence WHERE room_id=? AND user_id=?').run(num(req.params.id),req.user.id);emitEvent(null,'room.presence.updated',{roomId:num(req.params.id)},req.user.id);res.json({ok:true});});
app.get('/api/presence/rooms/:id',auth,(req,res)=>{const roomId=num(req.params.id);const cutoff=new Date(Date.now()-90000).toISOString();const rows=db.prepare('SELECT u.id,u.name,rp.last_seen FROM room_presence rp JOIN users u ON u.id=rp.user_id WHERE rp.room_id=? AND rp.last_seen>? ORDER BY u.name').all(roomId,cutoff);res.json({roomId,members:rows});});
app.get('/api/community/feed',auth,(req,res)=>{const posts=db.prepare(`SELECT id,author,initials,type,text,time,likes FROM community_posts ORDER BY id DESC LIMIT 50`).all();const questions=db.prepare(`SELECT id,author,initials,subject,topic,title,body,answers,votes,solved,created FROM community_questions ORDER BY id DESC LIMIT 50`).all().map(x=>({...x,solved:Boolean(x.solved)}));res.json({posts,questions});});
app.post('/api/community/posts',auth,(req,res)=>{const b=req.body||{};const id=Date.now();const initials=String(req.user.name||'U').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();db.prepare('INSERT INTO community_posts(id,user_id,author,initials,type,text,time,likes) VALUES(?,?,?,?,?,?,?,0)').run(id,req.user.id,req.user.name,initials,String(b.type||'Discussion'),String(b.text||''),'Just now');emitEvent(null,'community.post.created',{id,author:req.user.name,initials,type:b.type||'Discussion',text:b.text||''},req.user.id);res.status(201).json({id});});
app.post('/api/community/questions',auth,(req,res)=>{const b=req.body||{};const id=Date.now();const initials=String(req.user.name||'U').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();db.prepare('INSERT INTO community_questions(id,user_id,author,initials,subject,topic,title,body,created) VALUES(?,?,?,?,?,?,?,?,?)').run(id,req.user.id,req.user.name,initials,String(b.subject||''),String(b.topic||''),String(b.title||''),String(b.body||''),nowIso());emitEvent(null,'community.question.created',{id,author:req.user.name,title:b.title||'',subject:b.subject||''},req.user.id);res.status(201).json({id});});
app.post('/api/community/questions/:id/answers',auth,(req,res)=>{const qid=num(req.params.id);const q=db.prepare('SELECT * FROM community_questions WHERE id=?').get(qid);if(!q)return res.status(404).json({error:'Question not found.'});const b=req.body||{};const id=Date.now();const initials=String(req.user.name||'U').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();db.prepare('INSERT INTO community_answers(id,user_id,question_id,author,initials,body,created) VALUES(?,?,?,?,?,?,?)').run(id,req.user.id,qid,req.user.name,initials,String(b.body||''),nowIso());db.prepare('UPDATE community_questions SET answers=answers+1 WHERE id=?').run(qid);if(q.user_id!==req.user.id)notify(q.user_id,'answer.created','New answer',`${req.user.name} answered your question.`,req.user.id);emitEvent(null,'community.answer.created',{id,questionId:qid,author:req.user.name},req.user.id);res.status(201).json({id});});

app.post('/api/reports',auth,(req,res)=>{
  const b=req.body||{}, type=cleanText(b.targetType,40), id=assertId(b.targetId), reason=cleanText(b.reason,500);
  const allowed=['community_post','community_question','community_answer','shared_resource','workspace'];
  if(!allowed.includes(type)||!id||reason.length<3)return res.status(400).json({error:'Valid targetType, targetId, and reason are required.'});
  try{const info=db.prepare('INSERT INTO reports(reporter_user_id,target_type,target_id,reason,created_at) VALUES(?,?,?,?,?)').run(req.user.id,type,id,reason,nowIso());audit(req.user.id,'moderation.report',type,id,{reason});res.status(201).json({id:info.lastInsertRowid,status:'open'});}catch(e){if(String(e.message).includes('UNIQUE'))return res.status(409).json({error:'You already reported this item.'});throw e;}
});
app.get('/api/moderation/my-reports',auth,(req,res)=>res.json({reports:db.prepare('SELECT id,target_type,target_id,reason,status,created_at FROM reports WHERE reporter_user_id=? ORDER BY id DESC').all(req.user.id)}));
app.get('/api/audit/me',auth,(req,res)=>res.json({events:db.prepare('SELECT action,target_type,target_id,metadata,created_at FROM audit_log WHERE user_id=? ORDER BY id DESC LIMIT 100').all(req.user.id)}));

app.post('/api/feedback',auth,(req,res)=>{
  const b=req.body||{};
  const allowed=['bug','idea','usability','content','other'];
  const category=cleanText(b.category,30);
  const message=cleanText(b.message,1000);
  const page=cleanText(b.page,120);
  if(!allowed.includes(category)||message.length<3)return res.status(400).json({error:'Choose a valid category and provide a message.'});
  const info=db.prepare('INSERT INTO user_feedback(user_id,category,message,page,created_at) VALUES(?,?,?,?,?)').run(req.user.id,category,message,page,nowIso());
  audit(req.user.id,'feedback.created','user_feedback',info.lastInsertRowid,{category,page});
  res.status(201).json({ok:true,id:info.lastInsertRowid});
});
app.get('/api/feedback/mine',auth,(req,res)=>res.json({feedback:db.prepare('SELECT id,category,message,page,created_at FROM user_feedback WHERE user_id=? ORDER BY id DESC LIMIT 50').all(req.user.id)}));
app.post('/api/client-errors',(req,res)=>{
  const b=req.body||{};
  const message=cleanText(b.message,500);
  if(message.length<2)return res.status(400).json({error:'Error message is required.'});
  const session=parseCookies(req).ae_session;
  let userId=null;
  try { if(session){ const row=db.prepare('SELECT user_id FROM sessions WHERE token_hash=? AND expires_at>CURRENT_TIMESTAMP').get(sha256(session)); userId=row?.user_id||null; } } catch {}
  const source=cleanText(b.source,160), page=cleanText(b.page,160), stack=cleanText(b.stack,2000);
  const info=db.prepare('INSERT INTO client_errors(user_id,message,source,page,stack,created_at) VALUES(?,?,?,?,?,?)').run(userId,message,source,page,stack,nowIso());
  res.status(201).json({ok:true,id:info.lastInsertRowid});
});
app.get('/api/health',(_req,res)=>res.json({ok:true,service:'academic-ecosystem',database:'sqlite',storage:'normalized-relational',phase:20,uptime:Math.round(process.uptime())}));
app.get('/api/ready',(_req,res)=>{
  try { db.prepare('SELECT 1 AS ok').get(); const integrity=db.prepare('PRAGMA integrity_check').get(); const migrations=db.prepare('SELECT MAX(version) version FROM schema_migrations').get().version||0; const ready=integrity.integrity_check==='ok'; res.status(ready?200:503).json({ok:ready,ready,phase:20,schemaVersion:migrations}); }
  catch { res.status(503).json({ok:false,ready:false,phase:20}); }
});
function requireOps(req,res,next){
  if(!OPS_TOKEN) return res.status(503).json({error:'Operational endpoint is disabled until OPS_TOKEN is configured.'});
  const supplied=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  if(!supplied || !crypto.timingSafeEqual(Buffer.from(supplied),Buffer.from(OPS_TOKEN))) return res.status(401).json({error:'Unauthorized.'});
  next();
}
app.get('/api/ops/status',requireOps,(_req,res)=>{
  try {
    const integrity=db.prepare('PRAGMA integrity_check').get().integrity_check;
    const schemaVersion=db.prepare('SELECT MAX(version) version FROM schema_migrations').get().version||0;
    const users=db.prepare('SELECT COUNT(*) c FROM users').get().c;
    const sessions=db.prepare('SELECT COUNT(*) c FROM sessions WHERE expires_at>CURRENT_TIMESTAMP').get().c;
    const reports=db.prepare("SELECT COUNT(*) c FROM reports WHERE status='open'").get().c;
    const dbBytes=fs.statSync(DB_PATH).size;
    res.json({ok:integrity==='ok',phase:20,node:process.version,uptime:Math.round(process.uptime()),database:{integrity,schemaVersion,sizeBytes:dbBytes},counts:{users,activeSessions:sessions,openReports:reports},backup:{directory:BACKUP_DIR,files:fs.existsSync(BACKUP_DIR)?fs.readdirSync(BACKUP_DIR).filter(f=>f.endsWith('.sqlite')).length:0}});
  } catch(error){ res.status(503).json({ok:false,error:'Operational status unavailable.'}); }
});
app.post('/api/ops/backup',requireOps,async(_req,res)=>{
  try {
    fs.mkdirSync(BACKUP_DIR,{recursive:true});
    const stamp=new Date().toISOString().replace(/[:.]/g,'-');
    const target=path.join(BACKUP_DIR,`academic-${stamp}.sqlite`);
    await db.backup(target);
    const integrity=new Database(target,{readonly:true});
    try {
      const check=integrity.prepare('PRAGMA integrity_check').get();
      if(check.integrity_check!=='ok') throw new Error('Backup integrity check failed.');
    } finally { integrity.close(); }
    res.status(201).json({ok:true,backup:path.basename(target),createdAt:new Date().toISOString()});
  } catch(error) {
    res.status(503).json({ok:false,error:'Backup could not be created.'});
  }
});

app.get('/api/metrics',auth,(req,res)=>{
  const userId=req.user.id;
  const counts={
    tasks:db.prepare('SELECT COUNT(*) c FROM tasks WHERE user_id=?').get(userId).c,
    studySessions:db.prepare('SELECT COUNT(*) c FROM study_sessions WHERE user_id=?').get(userId).c,
    flashcards:db.prepare('SELECT COUNT(*) c FROM flashcards WHERE user_id=?').get(userId).c,
    mistakes:db.prepare('SELECT COUNT(*) c FROM mistakes WHERE user_id=?').get(userId).c,
    notifications:db.prepare('SELECT COUNT(*) c FROM notifications WHERE user_id=? AND read=0').get(userId).c
  };
  res.json({counts,uptime:Math.round(process.uptime()),phase:19});
});
app.get('/api/performance',auth,(req,res)=>{
  const rows=db.prepare(`SELECT path,COUNT(*) count,ROUND(AVG(duration_ms),2) avgMs,ROUND(MAX(duration_ms),2) maxMs,SUM(CASE WHEN status>=500 THEN 1 ELSE 0 END) errors FROM performance_samples WHERE created_at>=datetime('now','-1 hour') GROUP BY path ORDER BY avgMs DESC LIMIT 50`).all();
  res.json({window:'1h',samples:rows});
});
app.get('/api/system/migrations',auth,(req,res)=>res.json({migrations:db.prepare('SELECT version,name,applied_at FROM schema_migrations ORDER BY version').all()}));

app.get('*splat',(_req,res)=>res.sendFile(path.join(__dirname,'index.html')));

const server = app.listen(PORT,()=>console.log(`Academic Ecosystem Phase 19 running at http://localhost:${PORT}`));
function shutdown(signal){
  console.log(`${signal}: shutting down`);
  server.close(()=>{ try{ db.close(); } finally { process.exit(0); } });
  setTimeout(()=>process.exit(1),10000).unref();
}
process.on('SIGINT',()=>shutdown('SIGINT'));
process.on('SIGTERM',()=>shutdown('SIGTERM'));
process.on('uncaughtException',(error)=>{ console.error('Uncaught exception:',error); shutdown('uncaughtException'); });
process.on('unhandledRejection',(error)=>{ console.error('Unhandled rejection:',error); });
