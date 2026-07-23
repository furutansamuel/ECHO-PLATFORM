import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Calendar,
  HelpCircle,
  Bell,
  Users,
  BarChart3,
  Map,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";


const adminItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Reports", href: "/admin/reports", icon: ClipboardList },
  { name: "Knowledge Centre", href: "/admin/knowledge", icon: BookOpen },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Environmental Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Environmental Monitoring", href: "/admin/monitoring", icon: Map },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
];


interface AdminSidebarProps {
  mobile?: boolean;
  closeMenu?: () => void;
}


export default function AdminSidebar({
  mobile,
  closeMenu,
}: AdminSidebarProps) {

  const { logout } = useAuth();


  return (
    <div className="
      h-full
      w-full
      bg-white
      border-r
      border-gray-200
      flex
      flex-col
    ">

      {/* Logo */}
      <div className="
        h-20
        flex
        items-center
        px-6
        border-b
      ">
        <img
          src="/echo-wordmark.svg"
          alt="ECHO"
          className="h-8"
        />
      </div>


      {/* Navigation */}
      <nav className="
        flex-1
        overflow-y-auto
        p-4
        space-y-1
      ">

        {adminItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              onClick={closeMenu}
              className={({isActive}) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "bg-[#1B5E20] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >

              <Icon className="h-5 w-5" />

              <span>
                {item.name}
              </span>

            </NavLink>
          );

        })}

      </nav>


      {/* Logout */}
      <div className="
        border-t
        p-4
      ">

        <button
          onClick={logout}
          className="
            flex
            items-center
            gap-3
            w-full
            px-4
            py-3
            rounded-xl
            text-red-600
            hover:bg-red-50
            transition
          "
        >

          <LogOut className="h-5 w-5" />

          <span>
            Logout
          </span>

        </button>

      </div>


    </div>
  );
}
