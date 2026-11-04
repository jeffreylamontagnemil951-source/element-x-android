# MIKE GRAM Cloudflare API Gateway

This is the first backend foundation for MIKE GRAM. It is intentionally separate from Matrix message transport: Matrix remains responsible for messaging and end-to-end encrypted content. This Worker stores only support directory metadata, API-token metadata, and administrative audit events.

## Components

- Cloudflare Workers: HTTPS API edge.
- Cloudflare D1: volunteer directory, token hashes, and audit log.
- Matrix: messaging, rooms, and end-to-end encrypted conversations.
- Android app: connects to Matrix directly for chats and calls this gateway only for public support metadata and privileged management operations.

## Local setup

1. Install Node.js 20+.
2. Run `npm install` in this directory.
3. Create a D1 database with `npx wrangler d1 create mikegram-core` and replace the placeholder `database_id` in `wrangler.toml` with the returned ID.
4. Apply the schema locally with `npm run db:local`; apply it to the Cloudflare database with `npm run db:remote` only after reviewing the target account and database.
5. Set `OWNER_KEY_SHA256` as a Worker secret. Its value must be the lowercase SHA-256 hex digest of a long, randomly generated owner API key. Keep the original key outside the repository.
6. Set `CORS_ORIGIN` to the exact production app/web origin before deployment. Do not use a wildcard origin with privileged endpoints.
7. Run `npm run typecheck`, then `npm run dev` and check `GET /health`.
8. Deploy only after the security checklist below is complete, using `npm run deploy`.

## API

- `GET /health`: Worker and D1 health check.
- `GET /v1/support/volunteers`: public list of active, owner-verified volunteers.
- `GET /v1/admin/volunteers`: authenticated admin list.
- `POST /v1/admin/volunteers`: owner-only volunteer creation. A verified badge is shown publicly only when the owner sets `verified: true`.
- `GET /v1/admin/audit`: owner-only recent audit events.

Admin requests use `Authorization: Bearer <token>`. The bootstrap owner key is stored only as a Cloudflare secret in hashed form. Additional admin/support/bot token records store SHA-256 token hashes, never raw tokens.

## Security boundaries

- Never put owner keys, bot tokens, or service credentials in Android source code or Git.
- Do not route Matrix plaintext or decryption keys through this Worker.
- Do not give volunteers access to owner endpoints.
- Use least-privilege API tokens, HTTPS, exact-origin CORS, and audit logs.
- The official badge is server-controlled metadata; it is not a Telegram/Matrix platform verification mark.
- Before production, add rate limiting, token-rotation/revocation UI, alerting, security tests, and a reviewed owner bootstrap process.

## Deployment status

Not deployed. The D1 database ID, owner secret, and production origin must be configured in the Cloudflare account before deployment. This folder does not claim a live endpoint exists.
