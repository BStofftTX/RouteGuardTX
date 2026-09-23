import { describe, expect, it } from "vitest";
import { googleMapsUrl, appleMapsUrl } from "../src/adapters/mapLaunch";
import {
  DEFAULT_CONSTRAINTS,
  validateRequest,
  type RouteRequest,
} from "../src/domain/route";
import { MockRoutingAdapter } from "../src/adapters/mockAdapter";
import { feetToMeters, poundsToKilograms } from "../src/adapters/providerProxy";
import { createRoutingSession } from "../src/adapters/routingFactory";

const request: RouteRequest = {
  origin: "Junction, TX",
  destination: "Phoenix, AZ",
  profile: "heavy-load",
  constraints: DEFAULT_CONSTRAINTS,
};

describe("route request", () => {
  it("validates required places", () =>
    expect(validateRequest({ ...request, origin: "" })).toContain(
      "Enter an origin.",
    ));
  it("creates deterministic offline candidates", async () => {
    const adapter = new MockRoutingAdapter();
    expect(await adapter.compute(request)).toEqual(
      await adapter.compute(request),
    );
  });
  it("builds supported Google Maps URL fields", () => {
    const url = googleMapsUrl(request);
    expect(url).toContain("api=1");
    expect(url).toContain("travelmode=driving");
  });
  it("builds an Apple driving link", () =>
    expect(appleMapsUrl(request)).toContain("dirflg=d"));
  it("converts truck dimensions for routing providers", () => {
    expect(feetToMeters(13.5)).toBe(4.115);
    expect(poundsToKilograms(80000)).toBe(36287);
  });
  it("uses the offline adapter without a configured proxy", () => {
    const session = createRoutingSession({});
    expect(session.live).toBe(false);
    expect(session.adapter.capability).toBe("offline-demo");
  });
  it("uses the provider proxy when configured", () => {
    const session = createRoutingSession({
      VITE_ROUTEGUARD_PROXY_URL: "http://localhost:8787/api/routes",
    });
    expect(session.live).toBe(true);
    expect(session.adapter.capability).toBe("route-compute");
  });
});
