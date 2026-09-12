import type { RoutingSession } from '../domain/route';
import { MockRoutingAdapter } from './mockAdapter';
import { ProviderProxyAdapter } from './providerProxy';

export function createRoutingSession(env: Record<string, unknown> = import.meta.env): RoutingSession {
  const endpoint = typeof env.VITE_ROUTEGUARD_PROXY_URL === 'string'
    ? env.VITE_ROUTEGUARD_PROXY_URL.trim()
    : '';
  if (endpoint) return {
    adapter: new ProviderProxyAdapter(endpoint),
    live: true,
    notice: 'Live provider enabled through the secure RouteGuard proxy.',
  };
  return {
    adapter: new MockRoutingAdapter(),
    live: false,
    notice: 'Planning demo active. Configure VITE_ROUTEGUARD_PROXY_URL for verified live routes.',
  };
}
