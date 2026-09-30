# Phase 17 — Production Feedback & Client Observability

Phase 17 closes the post-launch feedback loop. It adds authenticated in-app feedback, lightweight client-error reporting, database-backed observability, and a summary command for operators.

## Added
- Release version 17.0.0
- Migration 6 for `user_feedback` and `client_errors`
- `POST /api/feedback` and `GET /api/feedback/mine`
- `POST /api/client-errors` for browser-side error reporting
- `/api/health` and `/api/ready` now identify Phase 17
- `npm run feedback:summary`
- `npm run phase17:check`

## Privacy
Feedback is associated with the signed-in account. Client error reports store only the supplied error message, source, page, stack, and optional authenticated user id. No passwords, session tokens, or request bodies are intentionally recorded.

## Validation limitation
The release and JavaScript syntax checks can run without the native SQLite module. Full database runtime verification requires successful installation of `better-sqlite3` in the target environment.
