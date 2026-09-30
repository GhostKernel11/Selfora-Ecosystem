# Production Deployment — Phase 20

## Validate
```bash
npm run check
npm test
npm run launch:preflight
npm run phase20:check
npm run release:check
npm run release:manifest
```

## Deploy to Render
Set `RENDER_API_KEY` and `RENDER_SERVICE_ID` privately:
```bash
npm run render:deploy:wait
```
Optional commit pin: `RENDER_COMMIT_ID=<sha>`.

## Verify
```bash
BASE_URL=https://your-service.onrender.com npm run production:verify
BASE_URL=https://your-service.onrender.com npm run production:smoke
```

## Rollback
```bash
RENDER_API_KEY=... RENDER_SERVICE_ID=... RENDER_DEPLOY_ID=<known-good-deploy-id> npm run render:rollback
BASE_URL=https://your-service.onrender.com npm run production:smoke
```

## Storage/scaling
The service uses SQLite on `/var/data` and is intentionally single-instance. Do not enable multiple instances with this local SQLite design; move to a shared database before horizontal scaling.
