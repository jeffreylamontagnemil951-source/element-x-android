# MIKE GRAM Cloudflare API Gateway

This Worker is the first deployed backend foundation for MIKE GRAM. It is intentionally separate from Matrix message transport: Matrix remains responsible for messaging and end-to-end encrypted content. The Worker stores support-directory metadata, API-token metadata, and administrative audit events.

## Production components

- Cloudflare Worker: `mikegram-api-gateway`
- Worker URL: `https://mikegram-api-gateway.growref-admin.workers.dev`
- Cloudflare D1: `mikegram-core`
- D1 database ID: `decc735e-266b-453b-97a4-4bd0916b652a`
- Android application ID: `com.mikegram.android`
- Matrix: messaging, rooms, and end-to-end encrypted conversations.

## Deployment status

- [x] D1 database created in the connected Cloudflare account.
- [x] Initial schema applied: `api_tokens`, `support_volunteers`, and `audit_log`.
- [x] Worker deployed with the D1 binding and routed to 100% of production traffic.
- [x] Android build-time gateway base URL registered in `BuildTimeConfig`.
- [ ] Configure the owner bootstrap secret before enabling privileged management.
- [ ] Set an exact CORS origin when the MIKE GRAM web admin portal is deployed.
- [ ] Run an external `GET /health` smoke test and verify Android networking. The deployment record is confirmed, but the runtime URL could not be fetched from this tool session.
- [ ] Add rate limiting, token rotation/revocation UI, security tests, and alerting.

The Worker upload and D1 schema setup succeeded. A direct external health check has not yet been independently confirmed. The privileged admin API remains unavailable until the owner secret is configured.

## API

- `GET /health`: Worker and D1 health check.
- `GET /v1/support/volunteers`: public list of active, owner-verified volunteers.
- `GET /v1/admin/volunteers`: authenticated admin list.
- `POST /v1/admin/volunteers`: owner-only volunteer creation.
- `GET /v1/admin/audit`: owner-only recent audit events.

Admin requests use `Authorization: Bearer <token>`. The bootstrap owner key must be stored only as a Cloudflare secret in hashed form. Additional admin/support/bot token records store SHA-256 token hashes, never raw tokens.

## Security boundaries

- Never put owner keys, bot tokens, or service credentials in Android source code or Git.
- Do not route Matrix plaintext or decryption keys through this Worker.
- Do not give volunteers access to owner endpoints.
- Use least-privilege API tokens, HTTPS, exact-origin CORS, and audit logs.
- The official badge is server-controlled metadata; it is not a platform-issued Telegram/Matrix verification mark.
- Native Android requests do not require browser CORS. Configure the exact web origin only when the web admin portal is available.

## Local development

1. Install Node.js 20+.
2. Run `npm install` in this directory.
3. The production D1 binding is already recorded in `wrangler.toml`; do not replace it with a different database.
4. Apply migrations locally with `npm run db:local`. Apply remote migrations only after checking the active Cloudflare account and target database.
5. Set `OWNER_KEY_SHA256` as a Worker secret. Use a long, randomly generated owner API key and keep the original key outside the repository.
6. Run `npm run typecheck`, then `npm run dev` and check `GET /health`.
7. Deploy reviewed changes with `npm run deploy`.
