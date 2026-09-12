export type RouteProfileId = 'fastest' | 'heavy-load' | 'scenic' | 'motorcycle' | 'towing-rv';

export interface VehicleConstraints {
  heightFt: number;
  weightLbs: number;
  lengthFt: number;
  widthFt: number;
  avoidSharpTurns: boolean;
  requireTurnaround: boolean;
  avoidLowClearance: boolean;
  avoidWeightRestrictedBridges: boolean;
  avoidHighways: boolean;
  avoidTolls: boolean;
}

export interface RouteRequest {
  origin: string;
  destination: string;
  profile: RouteProfileId;
  constraints: VehicleConstraints;
}

export interface RouteWarning {
  severity: 'info' | 'caution' | 'critical';
  message: string;
}

export interface RouteOption {
  id: string;
  name: string;
  distanceMiles: number;
  durationMinutes: number;
  score: number;
  summary: string;
  warnings: RouteWarning[];
  waypoints?: string[];
  provider?: string;
  restrictionCoverage?: Array<'height' | 'weight' | 'length' | 'width' | 'commercial' | 'hazmat'>;
}

export interface RoutingAdapter {
  readonly id: string;
  readonly label: string;
  readonly capability: 'offline-demo' | 'consumer-launch' | 'route-compute';
  compute(request: RouteRequest): Promise<RouteOption[]>;
}

export interface RoutingSession {
  adapter: RoutingAdapter;
  live: boolean;
  notice: string;
}

export const DEFAULT_CONSTRAINTS: VehicleConstraints = {
  heightFt: 13.5,
  weightLbs: 80000,
  lengthFt: 72,
  widthFt: 8.5,
  avoidSharpTurns: true,
  requireTurnaround: true,
  avoidLowClearance: true,
  avoidWeightRestrictedBridges: true,
  avoidHighways: false,
  avoidTolls: false,
};

export const PROFILES: Array<{ id: RouteProfileId; label: string; description: string; icon: string }> = [
  { id: 'fastest', label: 'Fastest', description: 'Prioritize time and major roads', icon: '⚡' },
  { id: 'heavy-load', label: 'Heavy load', description: 'Vehicle dimensions and restrictions', icon: '🚛' },
  { id: 'scenic', label: 'Scenic', description: 'Prefer quieter, interesting roads', icon: '🏞️' },
  { id: 'motorcycle', label: 'Motorcycle', description: 'Balance curves, pace, and road quality', icon: '🏍️' },
  { id: 'towing-rv', label: 'Towing / RV', description: 'Room to maneuver and safer approaches', icon: '🚐' },
];

export function validateRequest(request: RouteRequest): string[] {
  const errors: string[] = [];
  if (!request.origin.trim()) errors.push('Enter an origin.');
  if (!request.destination.trim()) errors.push('Enter a destination.');
  const { heightFt, weightLbs, lengthFt, widthFt } = request.constraints;
  if (heightFt <= 0 || weightLbs <= 0 || lengthFt <= 0 || widthFt <= 0) {
    errors.push('Vehicle dimensions and weight must be positive.');
  }
  return errors;
}
