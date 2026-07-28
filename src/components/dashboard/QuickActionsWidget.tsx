import { Link } from "react-router-dom";
import { AlertTriangle, Users, Map, Award } from "lucide-react";

const actions = [
  {
    title: "Report Hazard",
    icon: AlertTriangle,
    href: "/report",
    tone: "bg-destructive/10 text-destructive hover:bg-destructive/15 border-destructive/20",
  },
  {
    title: "Join Cleanup",
    icon: Users,
    href: "/cleanup-events",
    tone: "bg-secondary/10 text-secondary hover:bg-secondary/15 border-secondary/20",
  },
  {
    title: "View Live Map",
    icon: Map,
    href: "/map",
    tone: "bg-info/10 text-info hover:bg-info/15 border-info/20",
  },
  {
    title: "Impact Center",
    icon: Award,
    href: "/rewards",
    tone: "bg-primary/10 text-primary hover:bg-primary/15 border-primary/20",
  },
];

export function QuickActionsWidget() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.title}
          to={action.href}
          aria-label={action.title}
          className={`group flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-3 text-center text-xs font-semibold shadow-premium transition-all hover:-translate-y-0.5 hover:shadow-lg sm:min-h-[104px] sm:text-sm ${action.tone}`}
        >
          <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="leading-tight">{action.title}</span>
        </Link>
      ))}
    </div>
  );
}
