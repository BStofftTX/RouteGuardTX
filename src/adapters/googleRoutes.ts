import type { RouteOption, RouteRequest, RoutingAdapter } from '../domain/route';

export interface GoogleRoutesProxy {
  compute(payload: unknown): Promise<RouteOption[]>;
}

export class GoogleRoutesAdapter implements RoutingAdapter {
  readonly id = 'google-routes';
  readonly label = 'Google Routes API';
  readonly capability = 'route-compute' as const;
  constructor(private readonly proxy: GoogleRoutesProxy) {}

  compute(request: RouteRequest): Promise<RouteOption[]> {
    const truck = request.profile === 'heavy-load' || request.profile === 'towing-rv';
    return this.proxy.compute({
      origin: request.origin,
      destination: request.destination,
      travelMode: truck ? 'TRUCK' : request.profile === 'motorcycle' ? 'TWO_WHEELER' : 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
      routeModifiers: {
        avoidTolls: request.constraints.avoidTolls,
        avoidHighways: request.constraints.avoidHighways,
        vehicleInfo: truck
          ? {
              totalHeightMm: Math.round(request.constraints.heightFt * 304.8),
              totalLengthMm: Math.round(request.constraints.lengthFt * 304.8),
              totalWidthMm: Math.round(request.constraints.widthFt * 304.8),
              totalWeightKg: Math.round(request.constraints.weightLbs * 0.453592),
            }
          : undefined,
      },
    });
  }
}
