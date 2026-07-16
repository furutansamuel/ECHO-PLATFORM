import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto">
      <Card className="overflow-hidden">
        <div className="h-40 bg-muted" />

        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />

            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>

          <Skeleton className="h-40 rounded-2xl" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
