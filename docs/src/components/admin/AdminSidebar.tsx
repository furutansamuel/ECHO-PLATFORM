import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  CalendarDays,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";


interface AdminSidebarProps {
  mobile?: boolean;
  closeMenu?: () => void;
}


const AdminSidebar = ({
  mobile,
  closeMenu,
}: AdminSidebarProps) => {

  const { signOut } = useAuth();


  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: FileText,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Cleanup Events",
      path: "/admin/events",
      icon: CalendarDays,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];



  const handleNavigation = () => {
    if (mobile && closeMenu) {
      closeMenu();
    }
  };



  return (
    <div
      className="
        w-full
        h-full
        bg-white
        border-r
        border-border
        flex
        flex-col
      "
    >


      {/* Logo */}
      <div
        className="
          h-20
          px-6
          flex
          items-center
          border-b
          border-border
        "
      >

        <div>
          <h1
            className="
              text-xl
              font-bold
              text-primary
            "
          >
            ECHO
          </h1>

          <p
            className="
              text-xs
              text-muted-foreground
            "
          >
            Admin Portal
          </p>

        </div>

      </div>




      {/* Navigation */}
      <nav
        className="
          flex-1
          p-4
          space-y-2
        "
      >

        {menuItems.map((item) => {

          const Icon = item.icon;


          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              onClick={handleNavigation}

              className={({isActive}) =>
                `
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                transition-all

                ${
                  isActive
                  ? `
                    bg-primary
                    text-white
                  `
                  :
                  `
                    text-foreground
                    hover:bg-muted
                  `
                }
                `
              }
            >

              <Icon size={20}/>

              <span
                className="
                  font-medium
                  text-sm
                "
              >
                {item.name}
              </span>


            </NavLink>
          );

        })}

      </nav>




      {/* Admin Profile / Logout */}
      <div
        className="
          p-4
          border-t
          border-border
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            mb-4
            px-3
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-full
              bg-primary
              text-white
              flex
              items-center
              justify-center
            "
          >
            <ShieldCheck size={20}/>
          </div>


          <div>
            <p
              className="
                text-sm
                font-semibold
              "
            >
              Administrator
            </p>

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              ECHO System
            </p>
          </div>


        </div>



        <button
          onClick={signOut}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-error
            hover:bg-error-subtle
            transition
          "
        >

          <LogOut size={20}/>

          <span>
            Logout
          </span>

        </button>


      </div>



    </div>
  );
};


export default AdminSidebar;
