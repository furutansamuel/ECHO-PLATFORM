import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { HAZARD_CATEGORIES } from '@/components/reports/HazardCategories';

interface MapFiltersProps {
    onFilterChange: (filters: any) => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({ onFilterChange }) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] bg-card p-4 rounded-2xl shadow-lg w-72 space-y-4 glass-green">
        <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => onFilterChange({})}> <X className="h-4 w-4 mr-1" /> Reset</Button>
        </div>
        <div className="space-y-2">
            <Label>Search Location</Label>
            <Input placeholder="Enter address, ward, or LGA..." />
        </div>
      <div className="space-y-2">
        <Label>Hazard Category</Label>
        <Select onValueChange={(value) => onFilterChange({ category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {HAZARD_CATEGORIES.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Severity Level</Label>
        <Select onValueChange={(value) => onFilterChange({ severity: value })}>
          <SelectTrigger>
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MapFilters;
