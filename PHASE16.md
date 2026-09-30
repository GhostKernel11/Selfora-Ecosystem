# Phase 16 — Post-Launch Operations & Reliability

Phase 16 moves the Academic Ecosystem from a production release package into a maintainable production operation. It adds recovery-oriented tooling, backup retention, integrity verification, operator snapshots, and a protected on-demand backup endpoint.

## Included

- Release version `16.0.0`.
- Protected `POST /api/ops/backup` endpoint using `OPS_TOKEN`.
- Backup integrity verification immediately after an on-demand backup.
- `npm run backup:prune` for configurable backup retention (`BACKUP_RETENTION`, default 14).
- `npm run restore:check` to validate the newest SQLite backup without modifying it.
- `npm run ops:snapshot` for a local operational snapshot.
- Expanded `/api/ops/status` backup information.
- Phase 16 release validation through `npm run phase16:check`.
- Health/readiness responses now identify Phase 16.

## Production storage model

The application continues using the Render persistent disk mounted at `/var/data`. The SQLite database and local backup directory therefore remain under the persistent mount. Render documents that persistent disks preserve filesystem changes across deploys and restarts, but also notes that a service with a persistent disk is limited to one instance and does not receive zero-downtime deploy behavior. citeturn0search1turn0search3

## Backup operations

Create an application backup locally:

```bash
npm run backup
```

Prune older backups:

```bash
npm run backup:prune
```

Verify the newest backup:

```bash
npm run restore:check
```

Create an operational snapshot:

```bash
npm run ops:snapshot
```

The protected HTTP backup endpoint can also create and immediately integrity-check a backup. It requires the `OPS_TOKEN` operator credential.

## Important Render limitation

Render cron jobs cannot access a persistent disk, so a separate Render cron service should not be used to write directly into `/var/data/backups`. citeturn0search0

This phase therefore keeps backup creation on the persistent-disk-backed application service. For off-site disaster recovery, a future phase should add an external object-storage backup workflow rather than pretending the local disk alone is sufficient.

## Validation

Run:

```bash
npm run check
npm test
npm run release:check
npm run phase16:check
npm run restore:check
npm run release:manifest
```

Actual public deployment still requires an authorized hosting account and deployment action.
