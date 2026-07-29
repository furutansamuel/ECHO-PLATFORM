import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden border-none shadow-lg">
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-9 w-full rounded-full mt-2" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function FeaturedEventSkeleton() {
  return (
    <Card className="overflow-hidden border-none shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Skeleton className="h-64 md:h-full w-full rounded-none" />
        <div className="p-8 space-y-4">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-40 rounded-full mt-4" />
        </div>
      </div>
    </Card>
  );
}
