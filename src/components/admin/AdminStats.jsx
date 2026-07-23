import React from "react";
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  BookOpen,
} from "lucide-react";


// ===============================
// Live Admin Statistics Cards
// ===============================

interface AdminStatsProps {
  hazardReports: {
    id?: string;
    status?: string;
  }[];

  articles: {
    id?: string;
  }[];
}


const AdminStats = ({
  hazardReports,
  articles,
}: AdminStatsProps) => {


  const stats = [
    {
      title: "Total Reports",
      value: hazardReports.length,
      icon: ClipboardList,
    },

    {
      title: "Active Hazards",
      value: hazardReports.filter(
        (report) =>
          report.status?.toLowerCase() !== "resolved"
      ).length,
      icon: AlertTriangle,
    },

    {
      title: "Resolved Reports",
      value: hazardReports.filter(
        (report) =>
          report.status?.toLowerCase() === "resolved"
      ).length,
      icon: CheckCircle,
    },

    {
      title: "Knowledge Articles",
      value: articles.length,
      icon: BookOpen,
    },
  ];


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
              <Icon size={22} />
            </div>

          </div>
        );

      })}

    </div>
  );
};


export default AdminStats;
