import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type GeoStatus =
  | 'unsupported'   // navigator.geolocation doesn't exist
  | 'idle'          // Permissions API unavailable/unknown — haven't asked yet
  | 'prompt'        // Permissions API confirms: not yet decided
  | 'locating'      // a getCurrentPosition call is in flight
  | 'granted'       // permission granted (coords may or may not be populated yet)
  | 'denied'        // permission denied — never auto-prompt again
  | 'error';        // granted, but the last fetch failed (e.g. GPS/location services off)

export interface Coords {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface GeolocationState {
  status: GeoStatus;
  coords: Coords | null;
  errorMessage: string | null;
}

interface GeolocationContextValue extends GeolocationState {
  /** Call from a user gesture (button click). Reuses an in-flight request
   * instead of firing a second concurrent one. Resolves with coords or null. */
  requestLocation: () => Promise<Coords | null>;
  /** Re-fetch fresh coords without changing permission state — only
   * meaningful when status is already 'granted'. */
  refresh: () => Promise<Coords | null>;
}

const SESSION_CACHE_KEY = 'echo-geo-coords';
const GEO_OPTIONS: PositionOptions = { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 };

const GeolocationContext = createContext<GeolocationContextValue | null>(null);

function readCachedCoords(): Coords | null {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    return raw ? (JSON.parse(raw) as Coords) : null;
  } catch {
    return null;
  }
}

function writeCachedCoords(coords: Coords) {
  try {
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(coords));
  } catch {
    // sessionStorage unavailable (private mode etc.) — non-fatal, just skip caching
  }
}

/** Mount once near the app root. Every component that calls
 * useGeolocation() shares this single state — there is exactly one
 * permission check and at most one in-flight browser request at a time. */
export function GeolocationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GeolocationState>(() => ({
    status: typeof navigator !== 'undefined' && 'geolocation' in navigator ? 'idle' : 'unsupported',
    coords: readCachedCoords(),
    errorMessage: null,
  }));

  // Tracks a single in-flight getCurrentPosition call so concurrent
  // requestLocation()/refresh() callers share one browser prompt instead
  // of racing two separate ones.
  const inFlight = useRef<Promise<Coords | null> | null>(null);

  const fetchPosition = useCallback((): Promise<Coords | null> => {
    if (inFlight.current) return inFlight.current;

    const promise = new Promise<Coords | null>((resolve) => {
      setState((s) => ({ ...s, status: 'locating', errorMessage: null }));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: Coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          writeCachedCoords(coords);
          setState({ status: 'granted', coords, errorMessage: null });
          inFlight.current = null;
          resolve(coords);
        },
        (err) => {
          const message =
            err.code === err.PERMISSION_DENIED
              ? 'Location access denied.'
              : err.code === err.TIMEOUT
              ? 'Location request timed out.'
              : 'Location unavailable — check that GPS/location services are turned on.';
          setState((s) => ({
            status: err.code === err.PERMISSION_DENIED ? 'denied' : 'error',
            coords: s.coords, // keep any previously-known coords rather than wiping them
            errorMessage: message,
          }));
          inFlight.current = null;
          resolve(null);
        },
        GEO_OPTIONS
      );
    });

    inFlight.current = promise;
    return promise;
  }, []);

  // On mount: ask the Permissions API (not the browser prompt) what the
  // current status is. This is the piece that was missing everywhere in
  // the app — it's the only way to know "already granted" without
  // risking a visible prompt.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setState((s) => ({ ...s, status: 'unsupported' }));
      return;
    }
    if (!('permissions' in navigator) || !navigator.permissions?.query) {
      // Permissions API unsupported (older Safari) — we genuinely don't
      // know the status without prompting, so stay 'idle' and let the UI
      // ask via a user gesture rather than auto-prompting on load.
      return;
    }

    let status: PermissionStatus | null = null;

    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then((result) => {
        status = result;
        applyPermissionState(result.state);
        // Live updates if the user changes the permission from the
        // browser's own UI (e.g. the address-bar padlock) without a
        // reload — this is what makes "never asks again once granted,
        // and picks it up automatically if granted later" actually work.
        result.onchange = () => applyPermissionState(result.state);
      })
      .catch(() => {
        // Permissions API present but geolocation query unsupported by
        // this browser — fall back to 'idle' (ask via gesture only).
      });

    function applyPermissionState(permState: PermissionState) {
      if (permState === 'granted') {
        setState((s) => ({ ...s, status: 'granted' }));
        // Already granted — silently fetch coords with no visible
        // prompt, satisfying "auto-detect on startup" without nagging.
        fetchPosition();
      } else if (permState === 'denied') {
        setState((s) => ({ ...s, status: 'denied' }));
      } else {
        setState((s) => ({ ...s, status: 'prompt' }));
      }
    }

    return () => {
      if (status) status.onchange = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPosition]);

  const requestLocation = useCallback(() => fetchPosition(), [fetchPosition]);
  const refresh = useCallback(() => fetchPosition(), [fetchPosition]);

  return (
    <GeolocationContext.Provider value={{ ...state, requestLocation, refresh }}>
      {children}
    </GeolocationContext.Provider>
  );
}

/** The one hook every component should use for GPS — never call
 * navigator.geolocation directly outside this file. */
export function useGeolocation(): GeolocationContextValue {
  const ctx = useContext(GeolocationContext);
  if (!ctx) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return ctx;
}
