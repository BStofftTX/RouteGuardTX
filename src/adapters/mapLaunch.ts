import type { RouteRequest } from '../domain/route';

const encode = encodeURIComponent;

export function googleMapsUrl(request: RouteRequest): string {
  const params = new URLSearchParams({
    api: '1',
    origin: request.origin,
    destination: request.destination,
    travelmode: request.profile === 'motorcycle' ? 'two-wheeler' : 'driving',
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function appleMapsUrl(request: RouteRequest): string {
  return `https://maps.apple.com/?saddr=${encode(request.origin)}&daddr=${encode(request.destination)}&dirflg=d`;
}

export const launchLimit =
  'Opening a consumer map transfers only the supported origin, destination, and travel mode. RouteGuard safety constraints are not transferred.';
