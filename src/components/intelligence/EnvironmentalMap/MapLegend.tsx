import React from 'react';

// Kept in sync with getHazardIcon in EnvironmentalMap.tsx — if this
// changes, update that too.
const legendItems = [
    { color: '#1B5E20', label: 'Low Severity' },
    { color: '#F59E0B', label: 'Medium Severity' },
    { color: '#EA580C', label: 'High Severity' },
    { color: '#DC2626', label: 'Critical Severity' },
];

const MapLegend = () => {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-card p-4 rounded-2xl shadow-lg glass-green">
      <h3 className="font-bold mb-2">Legend</h3>
      <div className="space-y-2">
        {legendItems.map(item => (
            <div key={item.label} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium">{item.label}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
