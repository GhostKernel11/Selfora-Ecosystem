const fs = require('fs');
const path = require('path');
const required = ['package.json','server.js','index.html','Dockerfile','docker-compose.yml','render.yaml','.env.example','DEPLOYMENT.md'];
const missing = required.filter(f => !fs.existsSync(path.join(process.cwd(), f)));
if (missing.length) { console.error('Missing release files:', missing.join(', ')); process.exit(1); }
const pkg = require('../package.json');
if (pkg.scripts?.start !== 'node server.js') { console.error('Unexpected start script.'); process.exit(1); }
if (!pkg.scripts?.test || !pkg.scripts?.check) { console.error('Required validation scripts are missing.'); process.exit(1); }
console.log('Release package check: PASS');
console.log(`Application: ${pkg.name}`);
console.log(`Version: ${pkg.version}`);
