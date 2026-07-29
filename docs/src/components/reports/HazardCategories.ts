import { 
  Trash2, 
  Droplets, 
  Waves, 
  Wind, 
  Flame, 
  TreePine, 
  Mountain, 
  AlertTriangle,
  CloudRain,
  Factory,
  Layers
} from 'lucide-react';
import { HazardCategory } from '@/hooks/use-reports-store';

export interface CategoryInfo {
  id: HazardCategory;
  title: string;
  icon: any;
  color: string;
  description: string;
}

export const HAZARD_CATEGORIES: CategoryInfo[] = [
  {
    id: 'Plastic Waste',
    title: 'Plastic Waste',
    icon: Trash2,
    color: 'bg-success',
    description: 'Improperly disposed plastic materials harming the local ecosystem.'
  },
  {
    id: 'Flood',
    title: 'Flood',
    icon: Waves,
    color: 'bg-info',
    description: 'Excessive water overflow affecting roads, homes, or farmland.'
  },
  {
    id: 'Blocked Drainage',
    title: 'Blocked Drainage',
    icon: Droplets,
    color: 'bg-warning',
    description: 'Clogged gutters or pipes causing water stagnation or overflow.'
  },
  {
    id: 'Illegal Dumpsite',
    title: 'Illegal Dumpsite',
    icon: Trash2,
    color: 'bg-error',
    description: 'Unauthorized dumping of domestic or industrial waste.'
  },
  {
    id: 'Stagnant Water',
    title: 'Stagnant Water',
    icon: CloudRain,
    color: 'bg-info',
    description: 'Pools of non-flowing water that can breed mosquitoes and diseases.'
  },
  {
    id: 'Water Pollution',
    title: 'Water Pollution',
    icon: Factory,
    color: 'bg-info',
    description: 'Contamination of rivers, streams, or ground water sources.'
  },
  {
    id: 'Air Pollution',
    title: 'Air Pollution',
    icon: Wind,
    color: 'bg-muted-foreground',
    description: 'Presence of smoke, chemicals, or dust affecting air quality.'
  },
  {
    id: 'Illegal Burning',
    title: 'Illegal Burning',
    icon: Flame,
    color: 'bg-warning',
    description: 'Unauthorized burning of waste or bushes causing air pollution.'
  },
  {
    id: 'Deforestation',
    title: 'Deforestation',
    icon: TreePine,
    color: 'bg-success',
    description: 'Unauthorized clearing of trees or forest cover.'
  },
  {
    id: 'Erosion',
    title: 'Erosion',
    icon: Mountain,
    color: 'bg-warning',
    description: 'Soil degradation or washing away of land by water or wind.'
  },
  {
    id: 'Open Sewage',
    title: 'Open Sewage',
    icon: Layers,
    color: 'bg-error',
    description: 'Exposed sewage pipes or flowing wastewater in public areas.'
  },
  {
    id: 'Other Environmental Hazard',
    title: 'Other',
    icon: AlertTriangle,
    color: 'bg-muted-foreground',
    description: 'Any other environmental issue not covered by the categories above.'
  }
];
