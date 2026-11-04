# MIKE GRAM Android — Foundation

MIKE GRAM is an independent Android Matrix client derived from Element X Android.
It uses the existing Matrix Rust SDK integration and Android application architecture.

## Product identity

- Display name: MIKE GRAM
- Android application ID: `com.mikegram.android`
- Minimum Android version: inherited from the upstream project (Android 7.0 / API 24)
- Visual direction: midnight navy, electric cyan, and white
- Messaging network: public Matrix homeservers

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

The Cloudflare services, official support Matrix identity, production homeserver, and owner authorization backend are not configured by this repository change. They must be provisioned and security-reviewed before the related features can be enabled.
