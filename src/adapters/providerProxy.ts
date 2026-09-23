import type {
  RouteOption,
  RouteRequest,
  RoutingAdapter,
} from "../domain/route";

interface ProxyResponse {
  routes: RouteOption[];
}

/** Calls a server-side provider proxy so credentials never reach the browser. */
export class ProviderProxyAdapter implements RoutingAdapter {
  readonly id = "provider-proxy";
  readonly label = "Live truck-routing service";
  readonly capability = "route-compute" as const;

  constructor(private readonly endpoint: string) {}

  async compute(request: RouteRequest): Promise<RouteOption[]> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...request,
        constraints: {
          ...request.constraints,
          heightMeters: feetToMeters(request.constraints.heightFt),
          lengthMeters: feetToMeters(request.constraints.lengthFt),
          widthMeters: feetToMeters(request.constraints.widthFt),
          weightKilograms: poundsToKilograms(request.constraints.weightLbs),
          commercialVehicle: request.profile === "heavy-load",
        },
      }),
    });
    if (!response.ok)
      throw new Error(`Live routing service failed (${response.status}).`);
    const payload = (await response.json()) as ProxyResponse;
    if (!Array.isArray(payload.routes) || payload.routes.length === 0) {
      throw new Error("Live routing service returned no route candidates.");
    }
    return payload.routes;
  }
}

export const feetToMeters = (feet: number) =>
  Number((feet * 0.3048).toFixed(3));
export const poundsToKilograms = (pounds: number) =>
  Math.round(pounds * 0.45359237);
