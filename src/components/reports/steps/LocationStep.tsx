import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Compass,
  Map as MapIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportFormData } from '../report-schema';
import { cn } from '@/lib/utils';

export default function LocationStep() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ReportFormData>();
  const [isLocating, setIsLocating] = useState(false);
  const [locationFound, setLocationFound] = useState(false);

  const location = watch('location');

  const detectLocation = () => {
    setIsLocating(true);
    // Simulate GPS detection
    setTimeout(() => {
      setValue('location.lat', 6.4412);
      setValue('location.lng', 3.4215);
      setValue('location.address', '12 Industrial Way, Ikeja');
      setValue('location.ward', 'Ward 4');
      setValue('location.lga', 'Ikeja');
      setValue('location.state', 'Lagos');
      setValue('location.landmark', 'Near Gebeya Hub');
      
      setIsLocating(false);
      setLocationFound(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Map Preview Mockup */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden border bg-muted shadow-inner group">
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/3.3792,6.5244,12,0/600x400?access_token=mock')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <MapPin className="h-10 w-10 text-primary animate-bounce fill-primary/20" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[1px]" />
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button 
            type="button" 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 rounded-full shadow-md"
            onClick={detectLocation}
            disabled={isLocating}
          >
            <Navigation className={cn("h-4 w-4 text-primary", isLocating && "animate-pulse")} />
          </Button>
          <Button 
            type="button" 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 rounded-full shadow-md"
          >
            <MapIcon className="h-4 w-4 text-primary" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg border shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Compass className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Coordinates</p>
              <p className="text-xs font-mono font-medium">
                {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
              </p>
            </div>
          </div>
          {locationFound && (
            <div className="flex items-center gap-1 text-primary text-[10px] font-bold">
              <CheckCircle2 className="h-3 w-3" />
              GPS ACTIVE
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Manual Address Entry</Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="Enter street name and number"
                {...register('location.address')}
                className={errors.location?.address ? 'border-destructive' : ''}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.location?.address && <p className="text-xs text-destructive">{errors.location.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ward">Ward</Label>
              <Input
                id="ward"
                placeholder="e.g. Ward 4"
                {...register('location.ward')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lga">LGA</Label>
              <Input
                id="lga"
                placeholder="e.g. Ikeja"
                {...register('location.lga')}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="e.g. Lagos"
                {...register('location.state')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Nearest Landmark</Label>
              <Input
                id="landmark"
                placeholder="e.g. Gebeya Hub"
                {...register('location.landmark')}
              />
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3 mt-2">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-primary/80 leading-relaxed">
              <p className="font-bold mb-1">GPS Accuracy</p>
              Your current location is being detected within 5-10 meters. Use the map marker to fine-tune the exact hazard location.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
