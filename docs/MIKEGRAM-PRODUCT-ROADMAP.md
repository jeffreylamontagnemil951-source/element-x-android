# MIKE GRAM — Complete Product Roadmap

**Status:** Product scope and implementation plan. Items below are requirements or planned work, not claims that features are already implemented.

## 1. Product direction

MIKE GRAM is an independent, Telegram-inspired communication platform built by heavily modifying the existing Element X Android foundation. Keep the upstream Android/Kotlin/Compose and Matrix SDK foundations where they are useful; do not restart from a blank project.

- Product identity: MIKE GRAM.
- Android application ID: `com.mikegram.android`.
- Visual language: midnight navy, electric cyan, clean white, polished motion and accessible contrast.
- Primary clients: Android first; design backend/API contracts so additional clients can be added later.
- Core experience: fast cloud-synced chats, communities, channels, stories, bots, and privacy controls.
- Infrastructure: Cloudflare Workers + D1 + KV + R2, with Matrix services retained where they fit the messaging and identity architecture.
- Commercial principle: core communication, account safety, and privacy controls must remain usable without payment. Premium is optional.

## 2. Messaging and account experience

### Accounts and identity
- Unique usernames and public profile links.
- Display name, profile photo, bio, presence, and last-seen controls.
- Multiple devices with cloud synchronization.
- Session/device list, remote logout, and new-login alerts.
- Account recovery flow with clearly explained limits.
- Optional passkeys/biometrics where supported.
- Two-step verification, recovery email/phone options where legally and operationally supported.
- Block, report, mute, restrict, and privacy exceptions.

### Private and group chats
- Telegram-like cloud chats as the default product experience: synchronized across a user's devices and not advertised as end-to-end encrypted.
- Optional Secret Chats with end-to-end encryption, explicit device/session scope, and clear security indicators.
- Do not silently downgrade or upgrade encryption. Explain when a chat is cloud-based versus a Secret Chat.
- Text, replies, forwards, edits, deletes, reactions, pins, mentions, typing indicators, read states, drafts, scheduled messages, saved messages, search, folders, archive, and chat wallpapers.
- Media/file sharing, voice messages, audio/video calls, link previews, and granular auto-download settings.
- Message delivery reliability, retry queues, offline composition, and sync conflict handling.
- Per-chat notification controls and quiet hours.

**Architecture gate:** the current Element X/Matrix foundation is not automatically equivalent to Telegram's cloud-chat model. Before implementing default cloud chats, design and threat-model the storage, device sync, server access, backup, moderation, and optional Secret Chat boundaries. Preserve cryptographic protections for Secret Chats; never claim cloud chats are end-to-end encrypted.

## 3. Groups, channels, and communities
- Public/private groups and channels, discoverable usernames/links, invite links, join requests, and member roles.
- Group topics, threads, pinned posts, polls, quizzes, reactions, slow mode, permissions, and member management.
- Channel admins, scheduled posts, drafts, post analytics, comments/discussion groups, and subscriber controls.
- Broadcast channels for product announcements, Tips, News, release notes, and community education.
- Anti-spam controls, report queues, join-rate limits, and administrator audit trails.
- Community guidelines, appeals, and transparent enforcement.

## 4. Stories and expressive features
- Stories with audience selection, expiry, replies/reactions, privacy controls, and reporting.
- Story archive/highlights only when enabled by the account owner.
- Animated emoji, expressive reactions, stickers, GIF search, custom emoji packs, and rich emoji picker.
- Theme, wallpaper, chat background, icon, and accessibility customization.
- Motion should be smooth and battery-aware, with reduced-motion support.

## 5. Bots and developer platform
- Bot creation is user-accessible through an official MIKE GRAM bot-creation interface, similar in concept to Telegram's BotFather. Do not require owner approval for every ordinary bot creation.
- Users create/manage their own bots, receive a one-time-visible token, rotate/revoke tokens, set bot profile/commands/webhooks, and inspect usage.
- Each bot has a verified owner, scoped permissions, rate limits, abuse reporting, suspension/appeal process, and audit history.
- Bot API with documented endpoints, SDK/examples, webhook signatures, retries, idempotency, update offsets, and per-bot quotas.
- Bot developer portal, test environment, logs, health, analytics, and optional paid usage tiers.
- Bot hosting: developers may host their own bot services; MIKE GRAM provides identity, API, webhook delivery, and optional managed hosting only if implemented and funded.
- Never expose bot tokens in logs, client analytics, public bot profiles, or Git history.
- Apply abuse prevention, spam checks, permission prompts, and rate limits before broad public launch.

## 6. MIKE STARS and optional premium
- MIKE STARS as an in-app digital feature/credit concept, subject to platform rules, payment-provider availability, local law, and a full fraud/refund review.
- Clear purchase confirmation, balance history, receipts, refund/support path, and anti-fraud controls.
- Optional Premium/Pro/Developer tiers may add higher limits, customization, creator tools, bot quotas, or analytics.
- Never sell basic privacy, account security, or essential accessibility.
- Do not launch a wallet, cash-out, or transferable token feature without a separate legal, security, and payment design.

## 7. Trust, safety, and spam protection
- Spam checker for suspicious links, repeated messages, bulk invitations, impersonation, and bot abuse.
- User reporting, block/mute tools, channel/group moderation queues, rate limits, and appeal handling.
- Account security alerts and suspicious-session detection.
- Privacy-preserving abuse signals; restrict staff access to content and use clear access controls.
- Owner/admin moderation tools must not bypass Secret Chat encryption.
- Anti-abuse decisions should be explainable and logged, with human review for serious enforcement.

## 8. Support, verification, and official communications
- In-app Support entry in Settings with a Telegram-like support conversation preview.
- Volunteer support directory with volunteer display name, availability, support hours, and a clearly defined official badge policy.
- Owner-controlled volunteer verification, activation/deactivation, and audit log.
- Do not imply that a volunteer is an official employee unless verified and authorized.
- Official Tips, News, Announcements, and service-status channels.
- Support ticket handoff, status updates, and safe handling of attachments.

## 9. Owner Control Center and RBAC
- Dedicated owner access with strong authentication, step-up verification for sensitive actions, and session/device visibility.
- Role-based permissions for owner, admin, moderator, support volunteer, developer, and bot.
- Least privilege: each role sees only the screens and APIs needed for its job.
- Manage users, roles, volunteers, bots, channels, reports, announcements, feature flags, maintenance mode, quotas, and service status.
- Audit logs for all privileged actions; include actor, action, target, timestamp, and outcome.
- Emergency revoke/suspend controls, key rotation, backups, restore drills, and incident response.
- No hard-coded owner credentials, Telegram IDs, bot tokens, or secrets in Android code or Git.
- Owner ID/identity must be verified and provisioned through a secure server-side process, not trusted from client input.

## 10. Cloudflare backend architecture

### Worker services
- API gateway for authenticated client and admin requests.
- Account/profile metadata and privacy settings APIs.
- Bot management/API gateway, webhook dispatch, quotas, and developer endpoints.
- Support directory, tickets, reports, announcements, and moderation APIs.
- Billing/Stars integration only after provider/legal/security approval.
- Health checks, structured logs, rate limiting, and service-level alerts.

### Storage responsibilities
- **D1:** relational records, roles, bot metadata, support records, configuration, audit events, and transactional state.
- **KV:** short-lived cache, feature flags, throttles, and non-authoritative ephemeral metadata.
- **R2:** user-approved media/object storage with access control, lifecycle rules, and upload validation.
- **Workers:** API execution, webhooks, background workflows, and scheduled maintenance.
- **Queues/Durable Objects:** introduce only where ordering, coordination, or reliable asynchronous processing requires them.

Do not use D1 as a substitute for Matrix message transport or encrypted media storage without a reviewed architecture. Keep secrets in Cloudflare secrets, not repository variables or Android builds.

## 11. Reliability, performance, and accessibility
- Offline-first UI states, robust retries, pagination, caching, and graceful service-degraded behavior.
- Push notifications, notification privacy, and device-specific delivery settings.
- Crash reporting and diagnostics with sensitive data redaction.
- Performance budgets for startup, scrolling, media, and battery.
- Accessibility labels, scalable text, contrast, screen-reader support, and reduced motion.
- Localization architecture; English first, then additional languages through reviewed translations.
- Backups, migrations, disaster recovery, data export, and account deletion.

## 12. Privacy, security, and compliance gates
- Threat model every new service and trust boundary.
- TLS in transit; encrypt sensitive server-side data at rest where appropriate.
- Secret Chats use end-to-end encryption; keys remain on user devices.
- Clear retention, export, deletion, and privacy policy.
- Data minimization, access logging, secure defaults, and incident response.
- Independent security review before public launch.
- Follow upstream Element/Matrix licensing and retain all required notices.
- Do not promise anonymity, perfect security, or encryption properties that have not been independently verified.

## 13. Delivery phases and acceptance gates

### Phase A — Foundation and reproducible builds
- Complete branding and application identity.
- Keep upstream build reproducible; CI must produce a verifiable debug APK.
- Document Cloudflare environment, migrations, secrets, and deployment.
- Verify Worker health and D1 connectivity from an external client.
- Add automated typecheck, migration checks, and security baseline tests.

### Phase B — Core account and messaging
- Implement username/profile, cloud sync, chat list, private/group conversations, media, search, notifications, and privacy settings.
- Decide and document the cloud-chat/Secret Chat architecture before changing encryption defaults.
- Test multiple devices, offline mode, account recovery, and data deletion.

### Phase C — Communities and expression
- Groups, channels, admin roles, topics, reactions, polls, stories, animated emoji, themes, and wallpapers.
- Add moderation, reporting, join requests, and rate limiting.

### Phase D — Support and operations
- Support conversation, volunteer directory, Tips/News/Announcements channels.
- Owner dashboard, RBAC, audit logs, feature flags, maintenance mode, and incident controls.

### Phase E — Bot ecosystem
- Bot-creation interface, bot tokens/scopes, Bot API, webhooks, developer portal, quotas, abuse review, and bot analytics.
- Test token revocation, duplicate update delivery, webhook retries, and bot isolation.

### Phase F — Monetization and scale
- MIKE STARS and optional premium tiers after payment, legal, fraud, refunds, and support readiness.
- Capacity tests, cost controls, observability, backup/restore, and independent security review.

## 14. Current status — do not overstate
The current modification is an early foundation, not a completed messenger:
- [x] Element X repository selected as the Android foundation.
- [x] MIKE GRAM application identity and initial launcher artwork added in the active PR.
- [x] Cloudflare D1 database and initial schema provisioned.
- [x] Initial API gateway Worker deployed and bound to D1.
- [x] Public gateway base URL added to Android build-time configuration.
- [ ] External runtime health check and Android API connectivity verification.
- [ ] Owner secret provisioning and secure role/token lifecycle.
- [ ] Android UI and feature integrations.
- [ ] Default cloud-chat architecture and optional Secret Chat design review.
- [ ] Bot API, stories, groups/channels, Stars, support UI, and owner dashboard implementation.
- [ ] Successful CI artifact, functional tests, privacy review, and release hardening.

A roadmap item is not implemented until code, tests, and acceptance evidence exist. Ship in small, reviewable increments; do not claim every feature is finished because it appears in this plan.
