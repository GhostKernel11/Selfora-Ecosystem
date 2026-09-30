# Phase 14 — Production Deployment & Release Workflow

Phase 14 turns the Phase 13 production-ready package into a repeatable release/deployment workflow.

## Added
- Release package validation (`npm run release:check`)
- Reproducible SHA-256 release manifest (`npm run release:manifest`)
- Post-deployment health/readiness verification (`npm run deploy:verify`)
- Production release checklist and rollback guidance
- Explicit separation between build validation and live deployment

## Release flow

```text
Code change
  ↓
npm run check
  ↓
npm test
  ↓
npm run release:check
  ↓
npm run release:manifest
  ↓
Build/deploy image or service
  ↓
Run migrations
  ↓
npm run deploy:verify
  ↓
Backup verification
  ↓
Public launch
```

## Important
A public deployment still requires access to a hosting provider account and production credentials. This package does not pretend to create those resources without authorization.
