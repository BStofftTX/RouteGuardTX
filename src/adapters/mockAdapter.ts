import type {
  RouteOption,
  RouteRequest,
  RoutingAdapter,
} from "../domain/route";

const hash = (value: string) =>
  [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);

export class MockRoutingAdapter implements RoutingAdapter {
  readonly id = "mock";
  readonly label = "Offline planning demo";
  readonly capability = "offline-demo" as const;

  async compute(request: RouteRequest): Promise<RouteOption[]> {
    const seed = hash(`${request.origin}-${request.destination}`);
    const base = 48 + (seed % 95);
    const heavy =
      request.profile === "heavy-load" || request.profile === "towing-rv";
    const scenic =
      request.profile === "scenic" || request.profile === "motorcycle";
    return [
      {
        id: "recommended",
        name: heavy
          ? "Restriction-aware candidate"
          : scenic
            ? "Profile-balanced candidate"
            : "Fastest candidate",
        distanceMiles: base + (heavy ? 9 : scenic ? 16 : 0),
        durationMinutes: Math.round(
          (base + (heavy ? 9 : scenic ? 16 : 0)) * (scenic ? 1.25 : 1.05),
        ),
        score: 92,
        provider: "RouteGuardTX demo",
        summary: heavy
          ? "Prefers major roads and maneuverable approaches."
          : scenic
            ? "Trades some time for a profile-matched drive."
            : "Prioritizes travel time.",
        warnings: heavy
          ? [
              {
                severity: "caution",
                message:
                  "Demo data cannot verify bridge, clearance, or legal truck restrictions.",
              },
            ]
          : [],
      },
      {
        id: "alternate",
        name: "Alternate candidate",
        distanceMiles: base + 5,
        durationMinutes: Math.round((base + 5) * 1.18),
        score: 76,
        provider: "RouteGuardTX demo",
        summary: "A comparison route with a different distance/time tradeoff.",
        warnings: request.constraints.avoidSharpTurns
          ? [
              {
                severity: "info",
                message:
                  "Sharp-turn preference recorded; no verified turn geometry is available offline.",
              },
            ]
          : [],
      },
    ];
  }
}
