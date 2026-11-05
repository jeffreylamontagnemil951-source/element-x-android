# MIKE GRAM — Implementation and Acceptance Tracker

**Purpose:** Turn the remaining MIKE GRAM scope into verifiable engineering work.
**Status:** All items below are open until implementation and evidence are recorded. A deployed foundation or roadmap entry does not count as feature completion.

## Gate 1 — External runtime and Android connectivity

- [ ] Request the deployed Worker `GET /health` endpoint from an independent external client.
- [ ] Confirm the response checks both Worker execution and the intended D1 binding.
- [ ] Record timestamp, response status, sanitized response, and deployment version.
- [ ] Add an Android networking smoke test against the public gateway URL.
- [ ] Verify TLS, timeout behavior, error handling, offline behavior, and safe logging.
- [ ] Confirm no credentials or personal message content appear in diagnostics.

**Acceptance evidence:** reproducible external health-check result and passing Android connectivity test in CI or documented device test.

## Gate 2 — Owner authentication and role/token lifecycle

- [ ] Provision the owner bootstrap secret only through Cloudflare Worker secrets.
- [ ] Keep the raw secret out of Git, Android resources, build logs, screenshots, and client configuration.
- [ ] Define owner, admin, moderator, support volunteer, developer, and bot permissions.
- [ ] Implement server-side authorization for every privileged endpoint; never trust role claims supplied by Android.
- [ ] Issue scoped, expiring tokens and store only cryptographic hashes where applicable.
- [ ] Implement token rotation, revocation, session expiry, and emergency owner recovery.
- [ ] Require step-up verification for high-impact actions.
- [ ] Audit successful and denied privileged actions without logging secrets.
- [ ] Add rate limits, brute-force protections, and alerting.

**Acceptance evidence:** automated authorization matrix, token lifecycle tests, secret-leak scan, and audit-log verification.

## Gate 3 — Android UI and feature integrations

- [ ] Build the MIKE GRAM navigation shell and design system.
- [ ] Implement account/profile screens, usernames, bios, profile photos, sessions, and privacy settings.
- [ ] Implement chat list, conversation UI, message composer, media attachments, search, folders, and notifications.
- [ ] Add group and channel screens with role-aware management controls.
- [ ] Add stories and expressive features only after their API and privacy contracts are defined.
- [ ] Add support entry, volunteer directory, ticket flow, and official information channels.
- [ ] Add owner/admin screens backed by server-authorized APIs.
- [ ] Provide loading, empty, offline, permission-denied, and service-error states.
- [ ] Keep accessibility, scalable text, localization, reduced motion, and battery use in scope.

**Acceptance evidence:** implemented Android screens connected to real APIs, UI tests, and accessibility checks. Mock-only screens do not satisfy this gate.

## Gate 4 — Cloud-chat and optional Secret Chat architecture

- [ ] Write a technical design for cloud-synced default chats and optional end-to-end encrypted Secret Chats.
- [ ] Threat-model server access, device synchronization, backups, moderation, metadata, retention, export, and deletion.
- [ ] Document the trust boundary between Android clients, Matrix services, Cloudflare APIs, storage, and operators.
- [ ] Specify key generation, device binding, verification, recovery limitations, and key-change warnings for Secret Chats.
- [ ] Keep Secret Chat keys and decrypted content on user devices; do not send them to the Cloudflare gateway.
- [ ] Make encryption status visible in the UI and never silently downgrade or mislabel a chat.
- [ ] Review compatibility with the existing Element X/Matrix SDK before changing room defaults.
- [ ] Obtain a security review before production rollout.

**Acceptance evidence:** reviewed architecture decision record, threat model, protocol/security tests, and clear user-facing encryption indicators.

## Gate 5 — Product services

### Bots and developer platform
- [ ] User-accessible bot creation and management interface.
- [ ] One-time-visible bot token issuance, scoped permissions, rotation, and revocation.
- [ ] Documented Bot API, authenticated endpoints, webhook signatures, retries, idempotency, and update handling.
- [ ] Developer portal, test environment, logs, usage limits, quotas, and bot isolation.
- [ ] Abuse reporting, suspension, and appeal workflow.

### Groups and channels
- [ ] Group/channel creation, public/private access, invite links, join requests, and role permissions.
- [ ] Topics, polls, reactions, pins, scheduled posts, comments, and moderation tools.
- [ ] Admin audit events, anti-spam limits, and member safety controls.

### Stories and expressive features
- [ ] Story audience, expiry, replies/reactions, archive controls, reporting, and privacy enforcement.
- [ ] Animated emoji, stickers, custom emoji packs, GIF integration, themes, and wallpapers.
- [ ] Reduced-motion and data/battery-conscious behavior.

### Stars and optional paid tiers
- [ ] Define MIKE STARS product, ledger, receipts, refund/support process, and abuse controls.
- [ ] Verify platform/payment-provider rules and applicable legal requirements before enabling purchases.
- [ ] Keep essential messaging, privacy, security, and accessibility available without payment.
- [ ] Do not enable wallet, cash-out, or transferable-token behavior without a separate approved design.

### Support, trust, and operations
- [ ] In-app support conversation and ticket lifecycle.
- [ ] Server-controlled volunteer verification and clear badge meaning.
- [ ] Official Tips, News, Announcements, and service-status surfaces.
- [ ] Spam checker, reports, moderation queues, enforcement explanations, and appeals.
- [ ] Owner Control Center with least-privilege RBAC, audit logs, feature flags, maintenance mode, and emergency controls.

**Acceptance evidence:** each service has API contracts, database migrations, authorization tests, Android integration tests, abuse controls, and operational documentation.

## Gate 6 — CI, functional tests, privacy review, and release hardening

- [ ] Produce a successful reproducible Android debug build through GitHub Actions.
- [ ] Publish and verify the CI artifact; record the commit SHA and workflow run.
- [ ] Run Kotlin/Gradle validation, lint, unit tests, and relevant instrumentation/UI tests.
- [ ] Run Worker typecheck, migration checks, API tests, and deployment smoke tests.
- [ ] Test account lifecycle, chat sync, multiple devices, offline recovery, media, notifications, and deletion.
- [ ] Test authorization boundaries, token revocation, rate limits, webhook replay, and bot isolation.
- [ ] Complete privacy/data-retention review and Secret Chat threat-model review.
- [ ] Check dependency/license obligations and preserve upstream Element/Matrix notices.
- [ ] Add crash reporting with sensitive-data redaction, backup/restore drills, monitoring, and incident response.
- [ ] Complete performance, accessibility, localization, and battery checks.
- [ ] Complete release signing and supply-chain checks without exposing signing keys.

**Acceptance evidence:** successful CI run and artifact, passing test reports, security/privacy review records, and a release-readiness checklist signed off by maintainers.

## Completion policy

- Keep each checkbox open until its acceptance evidence exists.
- Implement in small vertical slices: Android UI + API + migration + tests + documentation.
- Do not mark a whole product area complete because a placeholder screen, schema, or endpoint exists.
- Do not publish a production-ready claim until all mandatory release gates pass.
- Update this tracker in the same pull request as the code that satisfies each gate.

## Current known baseline

The repository currently contains the Element X foundation, MIKE GRAM identity/initial artwork, a GitHub Actions workflow, initial Cloudflare D1 schema, a deployed API gateway, and the public gateway URL in Android build-time configuration. The gateway is still a limited support/admin foundation. External runtime health verification, Android connectivity verification, owner secret provisioning, the full UI, product services, and release acceptance remain open.
