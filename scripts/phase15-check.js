const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const required = [
  'package.json', 'server.js', 'index.html', 'Dockerfile', 'docker-compose.yml',
  'render.yaml', '.env.example', 'DEPLOYMENT.md', 'PHASE15.md',
  'scripts/deploy-verify.js', 'scripts/release-check.js', 'scripts/migrate.js'
];
for (const file of required) {
  if (!fs.existsSync(path.join(process.cwd(), file))) throw new Error(`Missing ${file}`);
}
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (pkg.version !== '15.0.0') throw new Error(`Expected release version 15.0.0, found ${pkg.version}`);
if (!pkg.scripts['phase15:check']) throw new Error('Missing phase15:check script');
const docker = fs.readFileSync('Dockerfile', 'utf8');
if (!docker.includes('npm install --omit=dev')) throw new Error('Dockerfile still requires npm ci without a lockfile.');
if (!docker.includes('process.env.PORT||3000')) throw new Error('Docker healthcheck is not PORT-aware.');
const render = fs.readFileSync('render.yaml', 'utf8');
for (const needle of ['healthCheckPath: /api/ready', 'DB_PATH', '/var/data/academic.sqlite', 'disk:', 'autoDeploy: true']) {
  if (!render.includes(needle)) throw new Error(`render.yaml missing ${needle}`);
}
cp.execFileSync(process.execPath, ['--check', 'server.js'], { stdio: 'inherit' });
cp.execFileSync(process.execPath, ['--check', 'scripts/migrate.js'], { stdio: 'inherit' });
cp.execFileSync(process.execPath, ['--check', 'scripts/phase15-check.js'], { stdio: 'inherit' });
console.log('Phase 15 release checks passed.');
