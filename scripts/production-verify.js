const base=(process.env.BASE_URL||'').replace(/\/$/,'');
if(!base){console.error('BASE_URL is required. Example: BASE_URL=https://your-service.onrender.com');process.exit(2);}
const paths=['/api/health','/api/ready'];
(async()=>{
 for(const p of paths){
  const r=await fetch(base+p,{headers:{accept:'application/json'}});
  const text=await r.text();
  if(!r.ok){console.error(`${p}: HTTP ${r.status}`);console.error(text.slice(0,1000));process.exit(1);}
  console.log(`${p}: HTTP ${r.status}`);
 }
 console.log(`Production verification passed for ${base}`);
})().catch(e=>{console.error(e.message);process.exit(1);});
