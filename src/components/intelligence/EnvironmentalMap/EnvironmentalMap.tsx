import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import { Crosshair, Navigation, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import { HazardReport } from '@/types/reports';
import { HazardPopup } from './HazardPopup';
// @ts-ignore
import MarkerClusterGroup from 'react-leaflet-markercluster';

// Fix for default icon not showing in React-Leaflet
const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// GPS Tracking Component
const LocationMarker = () => {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", (e) => {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
    }, [map]);

    return position === null ? null : (
      <Marker position={position} icon={new L.Icon({ iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png', iconSize: [32, 32] })}>
        <Popup>You are here</Popup>
      </Marker>
    );
};

interface EnvironmentalMapProps {
  reports?: HazardReport[];
}

const getHazardIcon = (category: string, severity: string) => {
    // Beacon severity ramp for map pins — a real 4-step progression
    // (green → amber → orange → red) rather than the old scale, where
    // Low and Medium were both shades of green and barely distinguishable
    // at pin size, so a Medium hazard looked just as "safe" as a Low one.
    // Kept in sync with MapLegend.tsx — if this changes, update that too.
    let iconColor = 'var(--severity-low)';
    if (severity === 'Medium') iconColor = 'var(--severity-medium)';
    else if (severity === 'High') iconColor = 'var(--severity-high)';
    else if (severity === 'Critical') iconColor = 'var(--severity-critical)';

    // Category no longer overrides severity color: a Critical flood and
    // a Low stagnant-water report used to render as the same blue with
    // no severity cue at all. Category is still filterable via
    // MapFilters, so severity stays the thing color communicates here.

    const iconHtml = `
    <div style="background-color: ${iconColor};" class="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    </div>`;
    
    return new L.DivIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });
}

const EnvironmentalMap: React.FC<EnvironmentalMapProps> = ({ reports = [] }) => {
  const [showLocation, setShowLocation] = useState(false);
  const position: [number, number] = [9.0820, 8.6753]; // Nigeria center — initial overview viewport only; real user location is handled by LocationMarker below via map.locate()

  return (
    <div className="relative w-full h-full">
      <MapContainer center={position} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Eco Topography">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite View">
                <TileLayer
                    attribution='&copy; ESRI Satellite'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
            </LayersControl.BaseLayer>
            
            <LayersControl.Overlay checked name="Hazards">
                <MarkerClusterGroup>
                    {reports.map(report => (
                        <Marker 
                            key={report.id} 
                            position={[report.location.lat, report.location.lng]}
                            icon={getHazardIcon(report.category, report.severity)}
                        >
                            <Popup minWidth={240}>
                                <HazardPopup hazard={report} />
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </LayersControl.Overlay>
        </LayersControl>

        {showLocation && <LocationMarker />}
      </MapContainer>

      <div className="absolute bottom-8 right-4 z-[1000] flex flex-col gap-2">
        <button 
            onClick={() => setShowLocation(!showLocation)}
            className="p-3 bg-card text-primary rounded-full shadow-xl hover:bg-primary hover:text-white transition-all border border-primary/20"
            title="My Location"
        >
            <Crosshair className="h-5 w-5" />
        </button>
        <button 
            className="p-3 bg-card text-primary rounded-full shadow-xl hover:bg-primary hover:text-white transition-all border border-primary/20"
            title="Route Optimizer"
        >
            <Navigation className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default EnvironmentalMap;

