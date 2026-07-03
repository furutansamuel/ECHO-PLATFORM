import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

const actions = [
  {
    title: "Report Hazard",
    icon: Icons.alertTriangle,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    hover: "hover:bg-red-500/20",
  },
  {
    title: "Join Cleanup",
    icon: Icons.users,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    hover: "hover:bg-green-500/20",
  },
  {
    title: "View Live Map",
    icon: Icons.map,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    hover: "hover:bg-blue-500/20",
  },
  {
    title: "Impact Center",
    icon: Icons.award,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    hover: "hover:bg-purple-500/20",
  },
];

export function QuickActionsWidget() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 col-span-full">
        {actions.map((action, index) => (
            <Button key={index} variant="outline" className={`flex flex-col h-24 items-center justify-center gap-2 text-sm font-semibold rounded-lg premium-shadow transition-all ${action.color} ${action.hover}`}>
                <action.icon className="h-6 w-6" />
                <span>{action.title}</span>
            </Button>
        ))}
    </div>
  );
}
