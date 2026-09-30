# Phase 20 — Live Production Launch & Validation

Phase 20 is the production-launch package. It does not claim that a public service is live until an authorized hosting account actually deploys the release and the remote smoke test passes.

## Release
- Version: `20.0.0`
- Target: Render web service
- Persistent data: `/var/data`
- Database: `/var/data/academic.sqlite`
- Backups: `/var/data/backups`
- Health check: `/api/ready`

## Local preflight
```bash
npm run check
npm test
npm run launch:preflight
npm run phase20:check
npm run release:check
npm run release:manifest
```

## Deploy
Set `RENDER_API_KEY` and `RENDER_SERVICE_ID` only in a private shell/CI secret environment, then:
```bash
npm run render:deploy:wait
```
Optional `RENDER_COMMIT_ID=<commit-sha>` pins the deployment to a known commit.

## Verify the live service
```text
BASE_URL=https://your-service.onrender.com
```
Then:
```bash
npm run production:verify
npm run production:smoke
```

The smoke test checks the API, readiness, HTML, CSS, and JavaScript routes and validates content types.

## Production acceptance
- [ ] Authorized Render service exists.
- [ ] Production secrets are configured privately.
- [ ] Persistent disk is mounted at `/var/data`.
- [ ] `/api/ready` returns HTTP 200 and `ready: true`.
- [ ] `/api/health` returns HTTP 200.
- [ ] `/`, `/css/styles.css`, and `/js/app.js` return expected content.
- [ ] Registration/login/logout work.
- [ ] Data survives restart/redeploy.
- [ ] Separate accounts remain isolated.
- [ ] Community and real-time features work.
- [ ] Feedback and backup workflows work.
- [ ] No production secrets are committed.
- [ ] A known-good deploy ID is recorded.

## Rollback
Set `RENDER_API_KEY`, `RENDER_SERVICE_ID`, and `RENDER_DEPLOY_ID=<known-good-deploy-id>`, then:
```bash
npm run render:rollback
BASE_URL=https://your-service.onrender.com npm run production:smoke
```
An API-triggered rollback does not automatically disable autodeploys, so automatic deployment settings must be handled deliberately during emergency rollback.

## Architecture limit
The current SQLite persistent-disk design is intentionally single-instance. If horizontal scaling is needed later, move shared data to a shared/managed datastore first.

## Launch state
Phase 20 provides the production release and verification tooling. A real public URL exists only after the authorized hosting deployment succeeds.
