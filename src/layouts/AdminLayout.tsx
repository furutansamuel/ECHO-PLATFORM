import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";


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


  // Protect admin area
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
      <aside className="
        hidden
        md:flex
        w-72
        fixed
        inset-y-0
        left-0
        z-40
      ">
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

        <div className="
          flex
          justify-end
          p-4
          border-b
        ">
          <button
            onClick={() => setMobileOpen(false)}
            className="
              p-2
              rounded-lg
              hover:bg-gray-100
            "
          >
            <X size={22} />
          </button>
        </div>


        <AdminSidebar
          mobile
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
        <header
          className="
            md:hidden
            h-16
            bg-white
            border-b
            flex
            items-center
            px-4
            sticky
            top-0
            z-30
          "
        >

          <button
            onClick={() => setMobileOpen(true)}
            className="
              p-2
              rounded-lg
              hover:bg-gray-100
            "
          >
            <Menu size={24} />
          </button>


          <h1 className="
            ml-4
            font-semibold
            text-[#1B5E20]
          ">
            ECHO Admin
          </h1>

        </header>



        <div className="
          p-4
          md:p-6
        ">
          <Outlet />
        </div>


      </main>


    </div>
  );
};


export default AdminLayout;
