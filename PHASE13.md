# Phase 13 — Launch Validation & Operational Excellence

Phase 13 adds the operational layer needed after deployment infrastructure exists.

## Features
- Protected operator status endpoint: `GET /api/ops/status`
- SQLite integrity and readiness checks
- Schema version reporting
- Runtime/database/user/session/report operational counts
- Launch smoke check: `npm run launch:check`
- Latest-backup integrity verification: `npm run backup:verify`
- Migration 4 with operational indexes and metadata
- `OPS_TOKEN` and `BASE_URL` production configuration

## Production flow
1. Configure `SESSION_SECRET`, `OPS_TOKEN`, `DB_PATH`, and persistent storage.
2. Start the service.
3. Run `npm test` and `npm run check`.
4. Run `npm run launch:check` against the deployed URL.
5. Create a backup with `npm run backup`.
6. Verify it with `npm run backup:verify`.
7. Keep the operator endpoint protected; never expose the token in client code.
