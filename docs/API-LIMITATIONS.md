# Provider capabilities and limitations

Verified against official documentation on 2026-09-11.

## Google

- Maps URLs can open Google Maps with origin, destination, waypoints, and documented travel modes. They do not carry RouteGuard's custom height, weight, turnaround, or sharp-turn controls.
- Google Routes API documents `DRIVE`, `TWO_WHEELER`, and `TRUCK` modes and route modifiers.
- Large Vehicle Routing accepts dimensions, actual weight, trailer information, and supported hazardous-goods classes, but is available only to a limited set of provisioned customers.
- Google describes large-vehicle routing as best-effort, may flag `routeRestrictionsPartiallyIgnored`, and explicitly warns that drivers must not rely on it as the sole source of safety or legality.
- Two-wheeler availability varies by geography.

Official sources:
- https://developers.google.com/maps/documentation/urls/get-started
- https://developers.google.com/maps/documentation/routes/lvr
- https://developers.google.com/maps/documentation/routes/reference/rest/v2/RouteModifiers

## Apple

- Apple Maps links support origin, destination, and standard driving/walking/transit flags.
- MapKit's public directions transport types include automobile, cycling, transit, walking, and any.
- `MKDirections.Request` exposes highway and toll preferences and alternate-route requests.
- The official public documentation reviewed does not expose custom truck dimensions, low-clearance, bridge-weight, sharp-turn, or turnaround controls for consumer Apple Maps route launches.

Official sources:
- https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
- https://developer.apple.com/documentation/mapkit/mkdirections
- https://developer.apple.com/documentation/mapkit/mkdirectionstransporttype

## Constraint data

Clearance, legal weight, seasonal restriction, private-road, construction, and turnaround data are incomplete and change over time. A production RouteGuard service needs licensed/current datasets, provider-specific coverage analysis, user reporting with verification, and explicit unresolved-risk warnings.
