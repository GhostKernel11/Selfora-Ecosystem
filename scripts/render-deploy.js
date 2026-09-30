const args=new Set(process.argv.slice(2));
const key=process.env.RENDER_API_KEY;
const serviceId=process.env.RENDER_SERVICE_ID;
if(!key||!serviceId){
  console.error('Missing RENDER_API_KEY or RENDER_SERVICE_ID. Create these only in your local/CI secret environment.');
  process.exit(2);
}
const body={clearCache:args.has('--clear-cache')?'clear':'do_not_clear',deployMode:'build_and_deploy'};
if(process.env.RENDER_COMMIT_ID) body.commitId=process.env.RENDER_COMMIT_ID;
fetch(`https://api.render.com/v1/services/${encodeURIComponent(serviceId)}/deploys`,{
  method:'POST',headers:{accept:'application/json','content-type':'application/json',authorization:`Bearer ${key}`},body:JSON.stringify(body)
}).then(async r=>{
  const data=await r.json().catch(()=>({}));
  if(!r.ok){console.error(`Render API returned ${r.status}`); console.error(JSON.stringify(data,null,2)); process.exit(1);}
  console.log(JSON.stringify({id:data.id,status:data.status,trigger:data.trigger,createdAt:data.createdAt},null,2));
  if(!args.has('--wait')) return;
  const deadline=Date.now()+Number(process.env.RENDER_DEPLOY_TIMEOUT_MS||900000);
  while(Date.now()<deadline){
    await new Promise(x=>setTimeout(x,10000));
    const q=await fetch(`https://api.render.com/v1/services/${encodeURIComponent(serviceId)}/deploys/${encodeURIComponent(data.id)}`,{headers:{accept:'application/json',authorization:`Bearer ${key}`}});
    const d=await q.json().catch(()=>({}));
    if(!q.ok){console.error(`Render status returned ${q.status}`);process.exit(1);}
    console.log(`deploy ${d.id}: ${d.status}`);
    if(['live','succeeded'].includes(String(d.status).toLowerCase())) process.exit(0);
    if(['failed','canceled','cancelled','deactivated'].includes(String(d.status).toLowerCase())) process.exit(1);
  }
  console.error('Timed out waiting for Render deploy completion.'); process.exit(1);
}).catch(e=>{console.error(e.message);process.exit(1);});
