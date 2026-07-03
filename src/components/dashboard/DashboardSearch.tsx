import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";

export function DashboardSearch() {
  return (
    <div className="relative">
      <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search reports, communities, or hazards..."
        className="pl-10 w-full bg-background/60 backdrop-blur-sm premium-shadow"
      />
    </div>
  );
}
