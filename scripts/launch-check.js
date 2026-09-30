const http = require('node:http');
const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
async function get(path){ const r=await fetch(`${base}${path}`); const body=await r.json().catch(()=>({})); return {status:r.status,body}; }
(async()=>{
  const health=await get('/api/health');
  const ready=await get('/api/ready');
  if(health.status!==200 || !health.body.ok) throw new Error('Health check failed.');
  if(ready.status!==200 || !ready.body.ready) throw new Error('Readiness check failed.');
  console.log(`Launch checks passed: ${base} schema=${ready.body.schemaVersion}`);
})().catch(err=>{ console.error(`Launch checks failed: ${err.message}`); process.exit(1); });
