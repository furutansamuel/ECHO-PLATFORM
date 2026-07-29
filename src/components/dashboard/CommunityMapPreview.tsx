import React, { useState } from 'react';
import { Layers, ChevronDown, Filter, Eye, EyeOff } from 'lucide-react';

export function MapFilterOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    /* Absolute overlay on top of the Leaflet canvas */
    <div className="absolute top-3 right-3 z-[1000]">
      <div className="flex flex-col items-end gap-2">
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-xl bg-card/90 backdrop-blur-md px-3 py-2 text-xs font-bold shadow-lg border border-border/80 hover:bg-card transition-all"
        >
          <Filter className="h-3.5 w-3.5 text-primary" />
          <span>Filters & Legend</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Collapsible Panel */}
        {isOpen && (
          <div className="w-56 rounded-2xl bg-card/95 backdrop-blur-md p-3.5 border border-border/80 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
            
            {/* Status Legend */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">
                Status Legend
              </p>
              <div className="space-y-1.5 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-status-safe" />
                    <span>Safe / Resolved</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">🟢</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-status-warning" />
                    <span>Watch Needed</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">🟡</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                    <span>Critical Hazard</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">🔴</span>
                </div>
              </div>
            </div>

            <hr className="border-border/60" />

            {/* Quick Filter Controls */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">
                Filter Layers
              </p>
              <div className="space-y-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1.5 rounded-lg">
                  <input type="checkbox" defaultChecked className="rounded accent-primary h-3.5 w-3.5" />
                  <span>Show Verified Hazards</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1.5 rounded-lg">
                  <input type="checkbox" defaultChecked className="rounded accent-primary h-3.5 w-3.5" />
                  <span>Show Active Cleanups</span>
                </label>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
