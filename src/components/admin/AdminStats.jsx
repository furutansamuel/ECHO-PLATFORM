import React from "react";
import {
  ClipboardList,
  AlertTriangle,
  Users,
  CalendarCheck,
} from "lucide-react";


// ===============================
// Admin Dashboard Statistics Cards
// ===============================

const stats = [
  {
    title: "Total Reports",
    value: "1,245",
    icon: ClipboardList,
  },
  {
    title: "Active Hazards",
    value: "34",
    icon: AlertTriangle,
  },
  {
    title: "Registered Users",
    value: "8,520",
    icon: Users,
  },
  {
    title: "Cleanup Events",
    value: "76",
    icon: CalendarCheck,
  },
];


const AdminStats = () => {

  return (
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
      gap-4
    ">

      {stats.map((stat) => {

        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              bg-white
              border
              rounded-xl
              p-5
              flex
              items-center
              justify-between
              shadow-sm
            "
          >

            <div>
              <p className="
                text-sm
                text-gray-500
              ">
                {stat.title}
              </p>


              <h3 className="
                text-2xl
                font-bold
                text-gray-800
                mt-1
              ">
                {stat.value}
              </h3>

            </div>


            <div className="
              h-12
              w-12
              rounded-xl
              bg-[#1B5E20]
              text-white
              flex
              items-center
              justify-center
            ">

              <Icon size={24}/>

            </div>

          </div>
        );

      })}

    </div>
  );
};


export default AdminStats;
