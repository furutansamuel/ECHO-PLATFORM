import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type EventFilterView = 'upcoming' | 'completed' | 'registered';

const CATEGORIES = ['Cleanup', 'Tree Planting', 'Workshop', 'Awareness Campaign', 'Other'] as const;

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  view: EventFilterView;
  onViewChange: (v: EventFilterView) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  registeredCount: number;
}

export function SearchBar({
  query,
  onQueryChange,
  view,
  onViewChange,
  category,
  onCategoryChange,
  registeredCount,
}: SearchBarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <Tabs value={view} onValueChange={(v) => onViewChange(v as EventFilterView)}>
        <TabsList className="rounded-full bg-muted/60 p-1">
          <TabsTrigger value="upcoming" className="rounded-full px-4 text-xs font-bold">Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-full px-4 text-xs font-bold">Completed</TabsTrigger>
          <TabsTrigger value="registered" className="rounded-full px-4 text-xs font-bold">
            My Events{registeredCount > 0 ? ` (${registeredCount})` : ''}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2 w-full lg:w-auto">
        <div className="relative flex-1 lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search events..."
            className="pl-9 rounded-full"
            aria-label="Search events"
          />
        </div>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-40 rounded-full shrink-0" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
