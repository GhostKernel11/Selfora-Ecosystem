const base = process.env.BASE_URL || 'http://localhost:3000';
(async()=>{
  for (const endpoint of ['/api/health','/api/ready']) {
    const res=await fetch(base+endpoint);
    if(!res.ok) throw new Error(`${endpoint} returned HTTP ${res.status}`);
    const body=await res.json();
    console.log(`${endpoint}: PASS`, body.status || 'ok');
  }
  console.log('Deployment verification: PASS');
})().catch(err=>{ console.error('Deployment verification: FAIL'); console.error(err.message); process.exit(1); });
