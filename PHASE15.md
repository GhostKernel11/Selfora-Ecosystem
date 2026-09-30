# Phase 15 — Production Deployment & Public Launch

Phase 15 moves the Academic Ecosystem from deployment-ready infrastructure to a repeatable production launch workflow.

## Included

- Release version `15.0.0`.
- Production deployment checklist and post-deploy verification.
- Render Blueprint configuration for a Docker web service.
- Persistent disk configuration for the SQLite database and backups.
- `/api/health` and `/api/ready` verification through `npm run deploy:verify`.
- A `phase15:check` release audit.
- PORT-aware Docker health checks.
- Docker installation no longer depends on a missing `package-lock.json`.
- Phase 15 database metadata migration.

## Validation

Run:

```bash
npm run check
npm test
npm run release:check
npm run phase15:check
npm run release:manifest
```

## Actual public launch

This package does not claim a public URL until an authorized hosting account is connected and the deployment succeeds. The intended production path is the included Render Blueprint, followed by environment verification and application QA.
