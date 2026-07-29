import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Map as MapIcon, ChevronRight } from 'lucide-react';
import type { HazardReport } from '@/types/reports';

// The real map pulls in Leaflet + marker clustering — lazy-load it so it
// never blocks first paint of the rest of the dashboard.
const EnvironmentalMap = lazy(() => import('@/components/intelligence/EnvironmentalMap/EnvironmentalMap'));

interface CommunityMapPreviewProps {
  reports: HazardReport[];
}

export function CommunityMapPreview({ reports }: CommunityMapPreviewProps) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <MapIcon className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold">Community Map</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-safe" /> Safe</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-warning" /> Watch</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> Critical</span>
        </div>
      </div>

      <div className="relative h-56 w-full overflow-hidden rounded-2xl">
        <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted/40" />}>
          <EnvironmentalMap reports={reports} />
        </Suspense>
      </div>

      <div className="mt-4 flex justify-end">
        <Link to="/map" className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-primary">
          Open Full Map <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default React.memo(CommunityMapPreview);
