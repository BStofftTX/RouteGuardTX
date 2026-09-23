import { useMemo, useState } from "react";
import { createRoutingSession } from "./adapters/routingFactory";
import { appleMapsUrl, googleMapsUrl, launchLimit } from "./adapters/mapLaunch";
import {
  DEFAULT_CONSTRAINTS,
  PROFILES,
  validateRequest,
  type RouteOption,
  type RouteProfileId,
  type RouteRequest,
  type VehicleConstraints,
} from "./domain/route";

const routing = createRoutingSession();

const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label className="toggle">
    <span>{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
);

export default function App() {
  const [origin, setOrigin] = useState("Junction, TX");
  const [destination, setDestination] = useState("Phoenix, AZ");
  const [profile, setProfile] = useState<RouteProfileId>("heavy-load");
  const [constraints, setConstraints] =
    useState<VehicleConstraints>(DEFAULT_CONSTRAINTS);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const request = useMemo<RouteRequest>(
    () => ({ origin, destination, profile, constraints }),
    [origin, destination, profile, constraints],
  );
  const setConstraint = <K extends keyof VehicleConstraints>(
    key: K,
    value: VehicleConstraints[K],
  ) => setConstraints((current) => ({ ...current, [key]: value }));

  async function plan() {
    const nextErrors = validateRequest(request);
    setErrors(nextErrors);
    if (nextErrors.length) return;
    setLoading(true);
    try {
      setRoutes(await routing.adapter.compute(request));
    } catch (error) {
      setRoutes([]);
      setErrors([
        error instanceof Error ? error.message : "Unable to calculate routes.",
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="hero">
        <div className="brand">
          <span className="brand-mark">RG</span>
          <div>
            <strong>RouteGuardTX</strong>
            <small>by MacroStofft</small>
          </div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Choose the road that fits the vehicle</p>
          <h1>
            Plan with purpose.
            <br />
            <em>Drive with judgment.</em>
          </h1>
          <p>
            Compare routes against vehicle needs, road preferences, and
            operational risk before opening your navigation app.
          </p>
        </div>
      </header>

      <section className="planner">
        <div className="panel route-inputs">
          <div className="section-title">
            <span>01</span>
            <h2>Trip</h2>
          </div>
          <label>
            Starting point
            <input value={origin} onChange={(e) => setOrigin(e.target.value)} />
          </label>
          <label>
            Destination
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </label>
        </div>

        <div className="panel profile-panel">
          <div className="section-title">
            <span>02</span>
            <h2>Route profile</h2>
          </div>
          <div className="profiles">
            {PROFILES.map((item) => (
              <button
                key={item.id}
                className={profile === item.id ? "profile selected" : "profile"}
                onClick={() => setProfile(item.id)}
              >
                <b>
                  {item.icon} {item.label}
                </b>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="panel constraints">
          <div className="section-title">
            <span>03</span>
            <h2>Vehicle & constraints</h2>
          </div>
          <div className="measurements">
            <label>
              Height (ft)
              <input
                type="number"
                step="0.1"
                value={constraints.heightFt}
                onChange={(e) =>
                  setConstraint("heightFt", Number(e.target.value))
                }
              />
            </label>
            <label>
              Weight (lb)
              <input
                type="number"
                value={constraints.weightLbs}
                onChange={(e) =>
                  setConstraint("weightLbs", Number(e.target.value))
                }
              />
            </label>
            <label>
              Length (ft)
              <input
                type="number"
                value={constraints.lengthFt}
                onChange={(e) =>
                  setConstraint("lengthFt", Number(e.target.value))
                }
              />
            </label>
            <label>
              Width (ft)
              <input
                type="number"
                step="0.1"
                value={constraints.widthFt}
                onChange={(e) =>
                  setConstraint("widthFt", Number(e.target.value))
                }
              />
            </label>
          </div>
          <div className="toggles">
            <Toggle
              label="Avoid sharp turns"
              checked={constraints.avoidSharpTurns}
              onChange={(v) => setConstraint("avoidSharpTurns", v)}
            />
            <Toggle
              label="Require turnaround room"
              checked={constraints.requireTurnaround}
              onChange={(v) => setConstraint("requireTurnaround", v)}
            />
            <Toggle
              label="Avoid low clearances"
              checked={constraints.avoidLowClearance}
              onChange={(v) => setConstraint("avoidLowClearance", v)}
            />
            <Toggle
              label="Avoid weight-restricted bridges"
              checked={constraints.avoidWeightRestrictedBridges}
              onChange={(v) => setConstraint("avoidWeightRestrictedBridges", v)}
            />
            <Toggle
              label="Avoid highways"
              checked={constraints.avoidHighways}
              onChange={(v) => setConstraint("avoidHighways", v)}
            />
            <Toggle
              label="Avoid tolls"
              checked={constraints.avoidTolls}
              onChange={(v) => setConstraint("avoidTolls", v)}
            />
          </div>
          {errors.length > 0 && (
            <div className="errors">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
          <button className="plan" onClick={plan} disabled={loading}>
            {loading ? "Comparing…" : "Compare route candidates"}
          </button>
        </div>
      </section>

      {routes.length > 0 && (
        <section className="results">
          <div className="results-head">
            <p className="eyebrow">
              {routing.live ? "Live provider routes" : "Offline prototype"}
            </p>
            <h2>Route candidates</h2>
            <p>{routing.notice}</p>
          </div>
          <div className="cards">
            {routes.map((route) => (
              <article className="route-card" key={route.id}>
                <div className="score">
                  {route.score}
                  <small>fit score</small>
                </div>
                <h3>{route.name}</h3>
                {route.provider && <small>{route.provider}</small>}
                <p>{route.summary}</p>
                <div className="metrics">
                  <strong>{route.distanceMiles} mi</strong>
                  <strong>
                    {Math.floor(route.durationMinutes / 60)}h{" "}
                    {route.durationMinutes % 60}m
                  </strong>
                </div>
                {route.warnings.map((w) => (
                  <p className={`warning ${w.severity}`} key={w.message}>
                    {w.message}
                  </p>
                ))}
              </article>
            ))}
          </div>
          <div className="launch">
            <p>{launchLimit}</p>
            <div>
              <a href={googleMapsUrl(request)} target="_blank">
                Open destination in Google Maps
              </a>
              <a href={appleMapsUrl(request)} target="_blank">
                Open destination in Apple Maps
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="safety">
        <strong>Important safety notice</strong>
        <p>
          RouteGuardTX is a planning aid, not a guarantee of road legality or
          vehicle clearance. Posted signs, permits, official restrictions,
          dispatch instructions, and driver judgment always control.
        </p>
      </section>
      <footer>
        © 2026 MacroStofft · Prototype software · No credentials included
      </footer>
    </main>
  );
}
