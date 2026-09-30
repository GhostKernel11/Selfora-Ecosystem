const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ignore = new Set(['node_modules','.git','backups','data']);
const root = process.cwd();
const files=[];
function walk(dir){
  for(const name of fs.readdirSync(dir)){
    if(ignore.has(name)) continue;
    const full=path.join(dir,name); const st=fs.statSync(full);
    if(st.isDirectory()) walk(full);
    else {
      const rel=path.relative(root,full).replaceAll(path.sep,'/');
      const hash=crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
      files.push({path:rel,bytes:st.size,sha256:hash});
    }
  }
}
walk(root); files.sort((a,b)=>a.path.localeCompare(b.path));
const out={generatedAt:new Date().toISOString(),files};
fs.writeFileSync('RELEASE-MANIFEST.json',JSON.stringify(out,null,2)+'\n');
console.log(`Release manifest written: ${files.length} files`);
