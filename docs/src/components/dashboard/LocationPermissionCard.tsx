import { useState } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/use-geolocation';

const DISMISSED_KEY = 'echo-location-card-dismissed';

/**
 * Single dashboard entry point for the shared useGeolocation() state.
 * Only ever visible when status is 'prompt' or 'idle' (Permissions API
 * genuinely doesn't know yet) — never shows once the browser reports
 * 'granted' or 'denied', because the shared hook already knows that
 * without needing its own duplicate localStorage bookkeeping.
 *
 * "Not now" only hides it for this browser tab session (sessionStorage),
 * not permanently — a permanent dismissal would mean the app could never
 * pick up the user granting permission later some other way.
 */
export function LocationPermissionCard() {
  const { status, requestLocation } = useGeolocation();
  const [dismissedThisSession, setDismissedThisSession] = useState(
    () => sessionStorage.getItem(DISMISSED_KEY) === '1'
  );

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setDismissedThisSession(true);
  };

  const allow = () => {
    requestLocation();
  };

  const shouldShow = (status === 'prompt' || status === 'idle') && !dismissedThisSession;
  if (!shouldShow) return null;

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5 shadow-sm">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-primary/10 shrink-0">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-sm">Enable Location Access</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Allow ECHO to detect your location for nearby environmental hazards,
            accurate reports, and local alerts.
          </p>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={allow} disabled={status === 'locating'}>
              {status === 'locating' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                'Allow Location'
              )}
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>Not Now</Button>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}
