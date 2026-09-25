# Contributing to RouteGuardTX

RouteGuardTX welcomes focused bug reports and proposals that improve route-planning usability, safety communication, accessibility, testing, or provider abstraction.

## Before contributing

1. Search existing issues before opening a new one.
2. Open or reference an issue for substantial changes.
3. Do not submit credentials, private trip data, proprietary restriction datasets, or other sensitive information.
4. The project is currently all rights reserved. Discuss code contributions with the maintainers before investing substantial effort.

## Development setup

```bash
npm ci
npm run dev
```

Run the local quality gates before opening a pull request:

```bash
npm test
npm run build
npm run lint
npm run format:check
npm run test:e2e
```

## Pull requests

- Use a focused branch such as `feat/description`, `fix/description`, or `docs/description`.
- Explain the user need, implementation, tests, and safety implications.
- Include screenshots for visible changes using synthetic route data.
- Keep provider credentials server-side and document any new network behavior.
- Do not imply that planning preferences are verified legal or physical restrictions.

Prefer small, meaningful commits. Do not manufacture activity, backdate work, or split trivial changes for contribution counts.
