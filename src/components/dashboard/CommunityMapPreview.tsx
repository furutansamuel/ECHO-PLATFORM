import React, { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { Map as MapIcon, ChevronRight, ChevronDown, Filter } from 'lucide-react';
import type { HazardReport } from '@/types/reports';

const EnvironmentalMap = lazy(() => import('@/components/intelligence/EnvironmentalMap/EnvironmentalMap'));

interface CommunityMapPreviewProps {
  reports: HazardReport[];
}

export function CommunityMapPreview({ reports }: CommunityMapPreviewProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <MapIcon className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold">Community Map</h3>
        </div>

        {/* Collapsible Filter Toggle & Content */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-1.5 rounded-lg border bg-muted/30 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label="Toggle map filters"
          >
            <Filter className="h-3 w-3" />
            <span>Legend</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${
                isFilterOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Collapsible Legend Items */}
          {isFilterOpen && (
            <div className="flex items-center gap-3 text-[10px] font-bold animate-in fade-in slide-in-from-top-1 duration-150 bg-card border rounded-lg px-2.5 py-1 shadow-sm">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-status-safe" /> Safe
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-status-warning" /> Watch
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive" /> Critical
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative h-56 w-full overflow-hidden rounded-2xl">
        <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted/40" />}>
          <EnvironmentalMap reports={reports} />
        </Suspense>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to="/map"
          className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-primary hover:underline"
        >
          Open Full Map <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// Default export added so both import styles work
export default React.memo(CommunityMapPreview);
