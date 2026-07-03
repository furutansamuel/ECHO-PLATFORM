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
  Stethoscope,
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
    color: 'bg-green-500',
    description: 'Improperly disposed plastic materials harming the local ecosystem.'
  },
  {
    id: 'Flood',
    title: 'Flood',
    icon: Waves,
    color: 'bg-blue-500',
    description: 'Excessive water overflow affecting roads, homes, or farmland.'
  },
  {
    id: 'Blocked Drainage',
    title: 'Blocked Drainage',
    icon: Droplets,
    color: 'bg-orange-500',
    description: 'Clogged gutters or pipes causing water stagnation or overflow.'
  },
  {
    id: 'Illegal Dumpsite',
    title: 'Illegal Dumpsite',
    icon: Trash2,
    color: 'bg-red-500',
    description: 'Unauthorized dumping of domestic or industrial waste.'
  },
  {
    id: 'Stagnant Water',
    title: 'Stagnant Water',
    icon: CloudRain,
    color: 'bg-blue-600',
    description: 'Pools of non-flowing water that can breed mosquitoes and diseases.'
  },
  {
    id: 'Water Pollution',
    title: 'Water Pollution',
    icon: Factory,
    color: 'bg-blue-700',
    description: 'Contamination of rivers, streams, or ground water sources.'
  },
  {
    id: 'Air Pollution',
    title: 'Air Pollution',
    icon: Wind,
    color: 'bg-gray-500',
    description: 'Presence of smoke, chemicals, or dust affecting air quality.'
  },
  {
    id: 'Illegal Burning',
    title: 'Illegal Burning',
    icon: Flame,
    color: 'bg-orange-600',
    description: 'Unauthorized burning of waste or bushes causing air pollution.'
  },
  {
    id: 'Deforestation',
    title: 'Deforestation',
    icon: TreePine,
    color: 'bg-green-700',
    description: 'Unauthorized clearing of trees or forest cover.'
  },
  {
    id: 'Erosion',
    title: 'Erosion',
    icon: Mountain,
    color: 'bg-orange-700',
    description: 'Soil degradation or washing away of land by water or wind.'
  },
  {
    id: 'Open Sewage',
    title: 'Open Sewage',
    icon: Layers,
    color: 'bg-red-700',
    description: 'Exposed sewage pipes or flowing wastewater in public areas.'
  },
  {
    id: 'Other Environmental Hazard',
    title: 'Other',
    icon: AlertTriangle,
    color: 'bg-gray-700',
    description: 'Any other environmental issue not covered by the categories above.'
  }
];
