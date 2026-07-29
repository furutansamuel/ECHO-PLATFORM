import { Link } from "react-router-dom";
import { AlertTriangle, Users, Map, Award, ChevronRight } from "lucide-react";

const actions = [
  {
    title: "Report Hazard",
    icon: AlertTriangle,
    href: "/report",
    badge: "bg-destructive/15 text-destructive",
    arrowBg: "bg-destructive/10 text-destructive",
    hoverBorder: "hover:border-destructive/40",
  },
  {
    title: "Join Cleanup",
    icon: Users,
    href: "/cleanup-events",
    badge: "bg-secondary/15 text-secondary",
    arrowBg: "bg-secondary/10 text-secondary",
    hoverBorder: "hover:border-secondary/40",
  },
  {
    title: "View Live Map",
    icon: Map,
    href: "/map",
    badge: "bg-info/15 text-info",
    arrowBg: "bg-info/10 text-info",
    hoverBorder: "hover:border-info/40",
  },
  {
    title: "Impact Center",
    icon: Award,
    href: "/rewards",
    badge: "bg-primary/15 text-primary",
    arrowBg: "bg-primary/10 text-primary",
    hoverBorder: "hover:border-primary/40",
  },
];

export function QuickActionsWidget() {
  return (
    /* Constrains max width so cards don't stretch too wide on large screens */
    <div className="mx-auto w-full max-w-2xl"> 
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            aria-label={action.title}
            className={`group relative flex flex-col items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${action.hoverBorder}`}
          >
            {/* Centered Main Icon */}
            <div className={`p-2.5 rounded-full ${action.badge} transition-transform group-hover:scale-105 duration-200`}>
              <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            {/* Title */}
            <span className="my-1.5 text-xs font-bold text-foreground text-center line-clamp-1">
              {action.title}
            </span>

            {/* Bottom Arrow Indicator (matches screenshot style) */}
            <div className={`flex items-center justify-center h-5 w-5 rounded-full ${action.arrowBg} transition-transform group-hover:translate-y-0.5`}>
              <ChevronRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
