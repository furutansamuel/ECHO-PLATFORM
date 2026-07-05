import { Link } from "react-router-dom";
import { AlertTriangle, Users, Map, Award } from "lucide-react";

const actions = [
  {
    title: "Report Hazard",
    icon: AlertTriangle,
    href: "/report",
    tone: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 border-rose-500/20",
  },
  {
    title: "Join Cleanup",
    icon: Users,
    href: "/community-insights",
    tone: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 border-emerald-500/20",
  },
  {
    title: "View Live Map",
    icon: Map,
    href: "/map",
    tone: "bg-sky-500/10 text-sky-600 hover:bg-sky-500/15 border-sky-500/20",
  },
  {
    title: "Impact Center",
    icon: Award,
    href: "/rewards",
    tone: "bg-violet-500/10 text-violet-600 hover:bg-violet-500/15 border-violet-500/20",
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
