# Security Policy

## Reporting a vulnerability

Use GitHub's private vulnerability reporting feature for this repository. Do not disclose exploitable details, credentials, or private trip data in a public issue.

Include:

- the affected component and commit or version
- reproducible steps using synthetic route data
- the potential safety, privacy, or security impact
- any suggested mitigation

## Credential and data boundaries

- Provider credentials must remain in a protected server-side secret store.
- Browser and mobile clients must call a controlled proxy rather than provider APIs with embedded credentials.
- Logs and diagnostics should avoid retaining precise personal trip history unless explicitly required, disclosed, and protected.

## Safety scope

RouteGuardTX is a planning MVP, not a certified navigation or restriction-verification system. Security reports involving altered warnings, suppressed provider flags, or unsafe route presentation should be treated as potentially safety-relevant.
