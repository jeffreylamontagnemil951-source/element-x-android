# MIKE GRAM Android — Foundation

MIKE GRAM is an independent Android Matrix client derived from Element X Android.
It uses the existing Matrix Rust SDK integration and Android application architecture.

## Product identity

- Display name: MIKE GRAM
- Android application ID: `com.mikegram.android`
- Minimum Android version: inherited from the upstream project (Android 7.0 / API 24)
- Visual direction: midnight navy, electric cyan, and white
- Messaging network: public Matrix homeservers
- API gateway: `https://mikegram-api-gateway.growref-admin.workers.dev`

## Development principles

1. Preserve Matrix end-to-end encryption and the upstream security model.
2. Do not add administrator access to encrypted message content.
3. Keep owner and volunteer privileges server-authorized and least-privilege.
4. Do not embed backend secrets or bot tokens in the Android application.
5. Treat premium features as optional; core messaging and privacy remain available to all users.
6. Preserve upstream copyright notices and comply with the repository's applicable license.

## Planned implementation sequence

1. Application identity, branding, and reproducible CI build.
2. MIKE GRAM visual theme and settings integration.
3. Official Volunteer Support conversation, backed by a real Matrix account/room.
4. Owner Control Center with server-verified roles and audited privileged actions.
5. Cloudflare MG API Gateway and bot developer platform.
6. Privacy review, security tests, and release hardening.

## Infrastructure status

The Cloudflare D1 database `mikegram-core` has been created and its initial schema applied. The `mikegram-api-gateway` Worker has been uploaded and bound to D1. The Android build-time configuration now contains the public gateway URL.

The owner bootstrap secret is not configured, the web CORS origin is intentionally unset, and external health-check plus Android request verification remain pending. The official support Matrix identity and production homeserver are also not configured. These must be completed before related user-facing features are enabled.
