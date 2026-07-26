import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  MapPin,
  Navigation,
  Compass,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search as SearchIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from 'react-leaflet';

import L from 'leaflet';
import { ReportFormData } from '../report-schema';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useGeolocation } from '@/hooks/use-geolocation';


const markerIcon = new L.Icon({
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


function LocationMarker({
  position,
  setPosition
}: {
  position: [number, number];
  setPosition: (pos:[number,number])=>void;
}) {

  useMapEvents({
    click(e) {
      setPosition([
        e.latlng.lat,
        e.latlng.lng
      ]);
    },
  });


  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable
      eventHandlers={{
        dragend(e){
          const marker = e.target;
          const pos = marker.getLatLng();

          setPosition([
            pos.lat,
            pos.lng
          ]);
        }
      }}
    />
  );
}



export default function LocationStep(){

const {
 register,
 setValue,
 watch,
 formState:{errors}
}=useFormContext<ReportFormData>();


const {
 status: geoStatus,
 coords: sharedCoords,
 errorMessage: geoError,
 requestLocation,
} = useGeolocation();

const [isLocating,setIsLocating]=useState(false);
const [locationFound,setLocationFound]=useState(false);


const location = watch('location');


const [position,setPosition]=useState<[number,number]>([
  location.lat || 9.0765,
  location.lng || 7.3986
]);



const [searchQuery, setSearchQuery] = useState('');
const [isSearching, setIsSearching] = useState(false);

const searchLocation = async () => {
  if (!searchQuery.trim()) return;
  setIsSearching(true);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ng&q=${encodeURIComponent(searchQuery)}`
    );
    const results = await response.json();
    if (!results || results.length === 0) {
      toast.error("Couldn't find that location. Try a more specific address.");
      return;
    }
    const lat = parseFloat(results[0].lat);
    const lng = parseFloat(results[0].lon);
    applyCoords(lat, lng);
  } catch {
    toast.error("Location search failed. Please try again.");
  } finally {
    setIsSearching(false);
  }
};

const reverseGeocode = async(
 lat:number,
 lng:number
)=>{

try{

const response =
await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
);


const data = await response.json();


const address=data.address || {};


setValue(
'location.address',
data.display_name || ''
);


setValue(
'location.state',
address.state || ''
);


setValue(
'location.lga',
address.county || 
address.city_district ||
''
);


setValue(
'location.landmark',
address.suburb ||
address.neighbourhood ||
''
);


}catch(error){

console.error(
"Reverse geocode failed",
error
);

}

};





const detectLocation=async()=>{

if(geoStatus === 'unsupported'){
  toast.error("GPS is not supported on this device");
  return;
}

// Already have a fresh position from elsewhere in the app (e.g. the
// dashboard's location card) — reuse it instantly instead of firing a
// brand new browser request. This is the fix for the report page
// appearing to "ask for permission again" after it was already granted.
if(geoStatus === 'granted' && sharedCoords){
  applyCoords(sharedCoords.lat, sharedCoords.lng);
  return;
}

setIsLocating(true);

const coords = await requestLocation();

setIsLocating(false);

if(coords){
  applyCoords(coords.lat, coords.lng);
  return;
}

// requestLocation() resolved to null — the shared hook already knows why
// (denied / timeout / unavailable) via geoStatus/geoError.
if (geoStatus === 'denied') {
  toast.error("Location access denied. You can still enter your address, ward, and LGA manually below.");
} else {
  toast.error(geoError || "Couldn't detect your location. Enter your address manually below.");
}

};

const applyCoords = (lat: number, lng: number) => {
  setPosition([lat, lng]);
  setValue('location.lat', lat);
  setValue('location.lng', lng);
  reverseGeocode(lat, lng);
  setLocationFound(true);
};

// Silent auto-fill: only runs if permission is already 'granted'
// elsewhere in the app (so this triggers zero new browser prompts) and
// the form doesn't already have coordinates the user set some other way.
useEffect(() => {
  if (geoStatus === 'granted' && sharedCoords && !location.lat && !location.lng) {
    applyCoords(sharedCoords.lat, sharedCoords.lng);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [geoStatus, sharedCoords]);




return (

<div className="space-y-6">

<Button
  type="button"
  onClick={detectLocation}
  disabled={isLocating}
  className="w-full gap-2 h-12 text-base font-semibold"
>
  <Navigation className={cn("h-5 w-5", isLocating && "animate-spin")} />
  {isLocating ? 'Getting GPS...' : locationFound ? '✅ Location detected successfully' : '📍 Use My Current Location'}
</Button>

<div className="flex gap-2">
  <Input
    placeholder="Search Location (e.g. Shabu, Lafia)"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchLocation())}
  />
  <Button type="button" variant="outline" onClick={searchLocation} disabled={isSearching}>
    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
  </Button>
</div>

<div className="relative h-64 rounded-xl overflow-hidden border shadow">


<MapContainer

center={position}

zoom={15}

className="h-full w-full"

>

<TileLayer

url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

/>


<LocationMarker

position={position}

setPosition={(pos)=>{

setPosition(pos);

setValue(
'location.lat',
pos[0]
);

setValue(
'location.lng',
pos[1]
);


reverseGeocode(
pos[0],
pos[1]
);


}}

/>


</MapContainer>



<div className="absolute bottom-4 left-4 right-4 z-[1000] bg-background/90 backdrop-blur p-3 rounded-lg border flex justify-between">


<div className="flex gap-3 items-center">

<Compass className="text-primary"/>


<div>

<p className="text-xs text-muted-foreground">
Coordinates
</p>


<p className="font-mono text-xs">

{position[0].toFixed(6)},
{position[1].toFixed(6)}

</p>

</div>

</div>


{
locationFound &&
<div className="text-primary flex gap-1 items-center text-xs font-bold">

<CheckCircle2 size={14}/>

GPS ACTIVE

</div>
}



</div>



</div>




<div className="grid md:grid-cols-2 gap-6">


<div className="space-y-4">


<div>

<Label>
Address
</Label>


<Input
{...register('location.address')}
/>

</div>



<div className="grid grid-cols-2 gap-4">

<div>

<Label>
Ward
</Label>

<Input
{...register('location.ward')}
/>

</div>


<div>

<Label>
LGA
</Label>

<Input
{...register('location.lga')}
/>

</div>


</div>


</div>





<div className="space-y-4">


<div className="grid grid-cols-2 gap-4">


<div>

<Label>
State
</Label>


<Input
{...register('location.state')}
/>


</div>



<div>

<Label>
Landmark
</Label>


<Input
{...register('location.landmark')}
/>


</div>


</div>




<div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3">


<AlertCircle className="text-primary"/>


<p className="text-xs text-primary">

GPS detects your actual position. Drag the marker to adjust the hazard location.

</p>


</div>


</div>


</div>


</div>

);


}
