import React from 'react';

const legendItems = [
    { color: '#2563EB', label: 'Water-related' },
    { color: '#1B5E20', label: 'Low Severity' },
    { color: '#43A047', label: 'Medium Severity' },
    { color: '#F9A825', label: 'High Severity' },
    { color: '#C62828', label: 'Critical Severity' },
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
