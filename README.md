# RouteGuard

**A route-planning companion created and owned by MacroStofft.**

RouteGuard helps drivers compare route candidates using a selected operating profile: fastest, heavy load/truck, scenic, motorcycle, or towing/RV. It captures vehicle dimensions and preferences such as avoiding sharp turns, low clearances, weight-restricted bridges, poor turnaround access, highways, and tolls.

## What this prototype does

- Runs as a responsive cross-platform web app.
- Captures trip, profile, vehicle, and constraint inputs.
- Produces deterministic offline/mock route comparisons.
- Automatically uses a protected provider proxy when `VITE_ROUTEGUARD_PROXY_URL` is configured.
- Opens the destination in Google Maps or Apple Maps using documented link parameters.
- Defines a provider-neutral adapter and a Google Routes request mapper.
- Clearly distinguishes planning preferences from verified road restrictions.

## What it does not claim

RouteGuard is not currently a turn-by-turn navigation engine and does not claim that custom constraints transfer into consumer Google Maps or Apple Maps. The offline adapter does not validate real clearances or legal restrictions.

Google now documents a limited-access Large Vehicle Routing service, but it is provisioned to selected customers and remains best-effort. Apple’s public MapKit/Maps-link surface reviewed for this prototype does not expose truck dimension or clearance controls. See [API limitations](docs/API-LIMITATIONS.md).

## Run

```bash
npm install
npm run dev
```

Open the URL printed by Vite.

For live routing, copy `.env.example` to `.env.local` and point
`VITE_ROUTEGUARD_PROXY_URL` at a RouteGuard-controlled server proxy. The proxy
can use openrouteservice's free `driving-hgv` routing profile without exposing
its API credential to the browser.

## Proof

```bash
npm test
npm run build
```

## Structure

- `src/domain` — provider-neutral requests, profiles, constraints, results
- `src/adapters` — offline adapter, secure provider-proxy adapter, map-launch links, Google Routes mapper
- `docs/ARCHITECTURE.md` — production architecture and safety model
- `docs/API-LIMITATIONS.md` — verified provider constraints
- `docs/ROADMAP.md` — connected-routing and distribution plan
- `tests` — model, adapter, and launch-link tests

## Security

No provider credentials belong in this repository. Production API calls must go through a protected server-side proxy.

## Safety

This software is a planning aid. It cannot guarantee clearance, legal weight, road access, bridge capacity, construction status, or a safe turnaround. Posted signs, law, permits, official restrictions, dispatch instructions, and driver judgment always control.

## Ownership

Copyright © 2026 MacroStofft. RouteGuard is a MacroStofft product concept and software prototype.
