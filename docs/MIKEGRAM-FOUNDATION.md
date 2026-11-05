# MIKE GRAM Android — Foundation

MIKE GRAM is an independent, Telegram-inspired Android communication platform built by heavily modifying the existing Element X Android project. It is not a from-scratch rewrite. The project retains the upstream Android/Kotlin/Compose and Matrix SDK foundation where appropriate.

## Product identity

- Display name: MIKE GRAM
- Android application ID: `com.mikegram.android`
- Minimum Android version: inherited from the upstream project (Android 7.0 / API 24)
- Visual direction: midnight navy, electric cyan, and white
- Primary client: Android first
- API gateway: `https://mikegram-api-gateway.growref-admin.workers.dev`

## Product requirements

The complete product requirements and phased acceptance plan are maintained in [MIKE GRAM Product Roadmap](MIKEGRAM-PRODUCT-ROADMAP.md). The roadmap covers accounts, cloud chats, optional Secret Chats, groups, channels, stories, animated emoji, MIKE STARS, optional premium, BotFather-style user bot creation, spam protection, in-app volunteer support, official Tips/News/Announcements, owner dashboard, RBAC, Cloudflare services, privacy, reliability, and release gates.

Important decisions:
- Default chat experience is intended to be Telegram-like cloud chats synchronized across devices, not represented as end-to-end encrypted.
- Optional Secret Chats must use end-to-end encryption with clear user-facing indicators and a documented security boundary.
- This is a substantial architectural change from typical Element X/Matrix encrypted-room defaults. Do not silently change encryption behavior. Complete a threat model and technical design before changing defaults.
- Ordinary users should be able to create bots through the official MIKE GRAM bot-creation system without per-bot owner approval. Abuse controls, scopes, quotas, verification, suspension, and appeals still apply.
- Core messaging, account security, and privacy controls remain usable without a paid subscription.
- The owner dashboard must use server-authorized roles and audited actions. Never trust client-supplied owner identity.

## Development and security principles

1. Continue modifying the existing Element X foundation; do not rebuild from scratch.
2. Keep Secret Chat encryption keys on user devices and never route decrypted message content through the Cloudflare gateway.
3. Design the cloud-chat model explicitly, including server access, storage, sync, backup, moderation, retention, and deletion.
4. Keep owner credentials, bot tokens, signing keys, and service secrets out of Android source and Git.
5. Apply least-privilege access, secure token rotation/revocation, rate limits, and audit logs.
6. Preserve upstream copyright notices and comply with the repository's applicable licenses.
7. A roadmap item is not complete until implementation, tests, and acceptance evidence exist.

## Infrastructure status

The Cloudflare D1 database `mikegram-core` has been created and its initial schema applied. The `mikegram-api-gateway` Worker has been deployed and bound to D1. The Android build-time configuration contains the public gateway URL.

The owner bootstrap secret is not configured, the web CORS origin is intentionally unset, and external health-check plus Android request verification remain pending. The official support Matrix identity and production homeserver are not configured. The app UI and product feature integrations remain future implementation work.

## Immediate next engineering gates

1. Verify the GitHub Actions Android build and produce a debug artifact.
2. Verify the deployed Worker health endpoint and D1 connectivity from an external client.
3. Configure owner authentication securely through Cloudflare secrets and implement token lifecycle controls.
4. Build a cloud-chat/Secret Chat architecture proposal and threat model before changing encryption defaults.
5. Implement the next vertical slice end-to-end, with Android UI, API, migrations, tests, and documentation together.
