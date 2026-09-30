# Phase 14 Project Structure

- `server.js` — production Express application
- `index.html` — frontend shell
- `css/` — styles
- `js/` — frontend application and backend client
- `scripts/migrate.js` — database migrations
- `scripts/backup.js` — SQLite backup
- `scripts/backup-verify.js` — backup integrity check
- `scripts/launch-check.js` — launch readiness check
- `scripts/release-check.js` — release artifact validation
- `scripts/release-manifest.js` — SHA-256 release manifest
- `scripts/deploy-verify.js` — post-deployment health/readiness check
- `Dockerfile` — production container
- `docker-compose.yml` — local production-style deployment
- `render.yaml` — Render deployment blueprint
- `DEPLOYMENT.md` — deployment and rollback procedure
- `PHASE14.md` — phase notes
