import { useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STORAGE_KEY = 'echo-location-prompt-dismissed';

/**
 * Asks for browser geolocation exactly once, and only after the user taps
 * "Allow" — never on page load. If they dismiss it ("Not now"), we don't
 * ask again on this browser. Coordinates are stashed in localStorage so
 * the map and report form can auto-center / prefill without asking again.
 */
export function LocationPermissionCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    const hasLocation = localStorage.getItem('echo-user-location');
    if (!dismissed && !hasLocation && 'geolocation' in navigator) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const allow = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        localStorage.setItem(
          'echo-user-location',
          JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        );
        dismiss();
      },
      () => {
        // Denied or unavailable — don't nag again, manual location entry
        // remains available in the report form and map search.
        dismiss();
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  if (!visible) return null;

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
            <Button size="sm" onClick={allow}>Allow Location</Button>
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

