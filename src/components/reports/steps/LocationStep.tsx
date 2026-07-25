import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  MapPin,
  Navigation,
  Compass,
  CheckCircle2,
  AlertCircle
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


const [isLocating,setIsLocating]=useState(false);
const [locationFound,setLocationFound]=useState(false);


const location = watch('location');


const [position,setPosition]=useState<[number,number]>([
  location.lat || 9.0765,
  location.lng || 7.3986
]);



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





const detectLocation=()=>{


if(!navigator.geolocation){

alert(
"GPS is not supported on this device"
);

return;

}


setIsLocating(true);



navigator.geolocation.getCurrentPosition(

(position)=>{


const lat=
position.coords.latitude;


const lng=
position.coords.longitude;



setPosition([
lat,
lng
]);


setValue(
'location.lat',
lat
);


setValue(
'location.lng',
lng
);



reverseGeocode(
lat,
lng
);



setLocationFound(true);
setIsLocating(false);



},


(error)=>{

console.error(error);

if (error.code === error.PERMISSION_DENIED) {
  toast.error("Location access denied. You can still enter your address, ward, and LGA manually below.");
} else if (error.code === error.TIMEOUT) {
  toast.error("Location request timed out. Enter your address manually or try again.");
} else {
  toast.error("Couldn't detect your location. Enter your address manually below.");
}

setIsLocating(false);

},


{
enableHighAccuracy:true,
timeout:10000,
maximumAge:0
}


);



};




return (

<div className="space-y-6">


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



<Button

type="button"

size="icon"

variant="secondary"

className="absolute top-4 right-4 z-[1000]"

onClick={detectLocation}

disabled={isLocating}

>

<Navigation
className={cn(
"h-4 w-4 text-primary",
isLocating && "animate-spin"
)}
/>


</Button>




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

