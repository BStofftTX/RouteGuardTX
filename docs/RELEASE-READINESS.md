# Release readiness

Assessed against `main` commit `bb21d6a` on 2026-11-16 with Node.js 22.

## Demonstrated behavior

The current planning MVP demonstrably:

- validates that an origin, destination, and positive vehicle dimensions are present;
- records one of five route profiles plus height, weight, length, width, and avoidance preferences;
- produces two repeatable comparison candidates from synthetic offline data when no provider proxy is configured;
- switches to a RouteGuardTX-controlled provider proxy when `VITE_ROUTEGUARD_PROXY_URL` is configured;
- converts entered feet and pounds to metric values before sending a live proxy request;
- opens Google Maps or Apple Maps with only their documented origin, destination, and travel-mode fields; and
- presents an explicit planning-aid warning and identifies offline candidates as demo data.

The unit suite proves request validation, deterministic offline output, metric conversion, adapter selection, and supported consumer-map URL generation. The browser suite verifies that the rendered homepage has no serious or critical axe accessibility violations and that offline planning is labeled as synthetic while custom constraints remain absent from consumer-map links.

## Authoritative and safety limitations

The offline adapter is deterministic synthetic data. It does **not** query road geometry, clearance, bridge-weight, construction, private-road, legal, permit, or turnaround data. Its distance, duration, fit score, and warnings are demonstration output, not verified routing facts.

Configuring a provider proxy changes the compute source, but RouteGuardTX still cannot claim authoritative restriction coverage unless the proxy supplies current licensed data and preserves unresolved or partially ignored restriction flags. The present frontend does not independently verify returned route restrictions.

Google Maps and Apple Maps launch links do not carry RouteGuardTX's vehicle dimensions or custom safety preferences. Posted signs, law, permits, official restrictions, dispatch instructions, and driver judgment always control. RouteGuardTX is not a certified navigation system and is not ready for safety-critical or production route decisions.

## Verification matrix

| Gate                            | Result      | Evidence                                                                                                         |
| ------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| Unit tests                      | Pass        | 1 file, 7 tests                                                                                                  |
| TypeScript and production build | Pass        | Vite production bundle created                                                                                   |
| ESLint                          | Pass        | No lint findings                                                                                                 |
| Prettier                        | Pass        | All tracked files match style                                                                                    |
| Browser behavior/accessibility  | Pass        | 2 Chromium tests: synthetic-planning disclosure/map-link boundary plus no serious or critical axe violations     |
| Production dependency audit     | Pass        | 0 vulnerabilities with `npm audit --omit=dev`                                                                    |
| Full dependency audit           | Conditional | 7 moderate development-only findings remain in the latest `typescript-eslint` toolchain through minimatch 10.2.6 |

## Dependency decision

ESLint 10.15.0 is a compatible patch update and moves ESLint's minimatch dependency to the fixed 11.x line. The remaining advisory is [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) through `typescript-eslint` 8.72.2, which is the current release and still declares minimatch 10.x.

Do not apply npm's suggested `typescript-eslint` 8.36.0 downgrade or force minimatch 11 under an unsupported transitive range merely to clear the audit count. Monitor for an upstream `typescript-eslint` release that adopts minimatch 11.0.1 or later, then rerun all gates.

## Release decision

This revision is suitable for continued local demonstration and engineering review. It is **not approved for publication or production use**. A release decision still requires live-provider contract tests, authoritative-data coverage evidence, abuse and privacy controls for the proxy, operational monitoring, and an approved deployment plan.

Rollback for this readiness patch is a normal revert of the patch commit; it changes development tooling and documentation only, not runtime routing behavior.
