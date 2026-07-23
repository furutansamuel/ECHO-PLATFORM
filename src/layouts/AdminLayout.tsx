import React, { useState } from "react";
import { Outlet, Navigate, NavLink } from "react-router-dom";
import {
  Menu,
  X,
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
  { name: "Notifications", href: "/admin/notifications", icon: Bell, badge:3 },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Environmental Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Environmental Monitoring", href: "/admin/monitoring", icon: Map },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
];


// Sidebar Component
const AdminSidebar = ({ closeMenu }) => {

  const { logout } = useAuth();

  return (
    <div
      className="
        h-full
        w-full
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
      "
    >

      {/* Logo */}
      <div
        className="
          h-20
          flex
          items-center
          px-6
          border-b
        "
      >
        <img
          src="/echo-wordmark.svg"
          alt="ECHO"
          className="h-8"
        />
      </div>

      {/* Admin Profile */}

<div className="px-6 py-4 border-b">

  <div className="flex items-center gap-3">

    <div className="
      h-10
      w-10
      rounded-full
      bg-[#1B5E20]
      text-white
      flex
      items-center
      justify-center
      font-semibold
    ">
      A
    </div>


    <div>
      <p className="text-sm font-semibold text-gray-800">
        Administrator
      </p>

      <p className="text-xs text-gray-500">
        System Manager
      </p>
    </div>

  </div>

</div>


      {/* Navigation */}
      <nav
        className="
          flex-1
          overflow-y-auto
          p-4
          space-y-1
        "
      >

        {adminItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              onClick={closeMenu}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "bg-[#1B5E20] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >

              <Icon className="h-5 w-5" />

              <div className="flex items-center justify-between flex-1">

  <span>
    {item.name}
  </span>


  {item.badge && (
    <span className="
      text-xs
      bg-red-500
      text-white
      rounded-full
      px-2
      py-0.5
    ">
      {item.badge}
    </span>
  )}

</div>

            </NavLink>
          );

        })}

      </nav>


      {/* Logout */}
      <div
        className="
          border-t
          p-4
        "
      >

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

          <span>Logout</span>

        </button>

      </div>

    </div>
  );
};



// Main Admin Layout
const AdminLayout = () => {

  const { profile, user, loading } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">
          Loading admin dashboard...
        </div>
      </div>
    );
  }


  // Protect admin route
  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }


  if (
    profile.role !== "administrator" &&
    profile.role !== "admin"
  ) {
    return <Navigate to="/dashboard" replace />;
  }


  return (
    <div className="min-h-screen bg-gray-50 flex">


      {/* Desktop Sidebar */}
      <aside
        className="
          hidden
          md:flex
          w-72
          fixed
          inset-y-0
          left-0
          z-40
        "
      >
        <AdminSidebar />
      </aside>



      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            z-40
            md:hidden
          "
          onClick={() => setMobileOpen(false)}
        />
      )}



      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          w-72
          bg-white
          z-50
          transform
          transition-transform
          duration-300
          md:hidden
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <div
          className="
            flex
            justify-end
            p-4
            border-b
          "
        >

          <button
            onClick={() => setMobileOpen(false)}
            className="
              p-2
              rounded-lg
              hover:bg-gray-100
            "
          >
            <X size={22}/>
          </button>

        </div>


        <AdminSidebar
          closeMenu={() => setMobileOpen(false)}
        />

      </aside>




      {/* Main Content */}
      <main
        className="
          flex-1
          md:ml-72
          min-h-screen
        "
      >


        {/* Mobile Header */}
<header className="md:hidden h-16 bg-white border-b flex items-center px-4 sticky top-0 z-30">

  <button
    onClick={() => setMobileOpen(true)}
    className="p-2 rounded-lg hover:bg-gray-100"
  >
    <Menu size={24} />
  </button>


  <div className="ml-4 leading-tight">
    <h1 className="text-sm font-semibold text-[#1B5E20]">
      ECHO Admin
    </h1>

    <p className="text-[11px] text-gray-500">
      Environmental Intelligence Control Center
    </p>
  </div>

</header>


        <div
          className="
            p-4
            md:p-6
          "
        >
          <Outlet />
        </div>


      </main>


    </div>
  );
};


export default AdminLayout;
