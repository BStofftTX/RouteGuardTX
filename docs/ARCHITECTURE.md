# RouteGuard architecture

## MVP

The runnable prototype is a responsive React/TypeScript web application. It separates the user-facing route profile from routing providers:

1. `RouteRequest` captures origin, destination, profile, dimensions, and preferences.
2. `RoutingAdapter` defines a provider-neutral compute contract.
3. `MockRoutingAdapter` produces deterministic offline candidates for development and tests.
4. `GoogleRoutesAdapter` maps supported inputs to a server-proxy request shape.
5. Map-launch helpers open Google Maps or Apple Maps with only their documented URL parameters.

## Production topology

- Web/mobile client: route profiles, vehicle garage, comparisons, advisories.
- RouteGuard API: credential isolation, normalization, provider selection, audit logs.
- Provider adapters: Google Routes/Navigation SDK where provisioned; MapKit for Apple-native conventional routes; additional licensed truck-restriction datasets when contracted.
- Constraint evaluator: compares returned geometry/steps with authoritative restriction data.

## Why a proxy is required

Provider credentials must not be shipped in browser/mobile source. The frontend calls a RouteGuard-controlled API, which holds credentials in a protected secret store and returns a normalized result.

## Safety model

- Preserve provider flags such as partially ignored restrictions.
- Never hide unresolved or missing data.
- Mark mock, conventional, and restriction-aware routes distinctly.
- Require driver acknowledgement before navigation handoff.
- Treat posted signs and legal restrictions as controlling.
