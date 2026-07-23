import React from "react";
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  BookOpen,
  Users,
  UserCheck,
  CalendarCheck,
  BellRing,
  BrainCircuit,
  MapPin,
} from "lucide-react";


// ===============================
// Admin Dashboard Statistics
// ===============================

interface AdminStatsProps {
  hazardReports: any[];
  articles: any[];
  users: any[];
  volunteers: any[];
  events: any[];
  criticalAlerts: any[];
  aiInsights: any[];
  monitoredAreas: any[];
}


const AdminStats = ({
  hazardReports = [],
  articles = [],
  users = [],
  volunteers = [],
  events = [],
  criticalAlerts = [],
  aiInsights = [],
  monitoredAreas = [],
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
      title: "Critical Alerts",
      value: criticalAlerts.length,
      icon: BellRing,
    },


    {
      title: "Pending Review",
      value: hazardReports.filter(
        (report) =>
          report.status?.toLowerCase() === "pending"
      ).length,
      icon: Clock,
    },


    {
      title: "Verified Reports",
      value: hazardReports.filter(
        (report) =>
          report.status?.toLowerCase() === "verified"
      ).length,
      icon: CheckCircle,
    },


    {
      title: "Resolved Reports",
      value: hazardReports.filter(
        (report) =>
          report.status?.toLowerCase() === "resolved"
      ).length,
      icon: Wrench,
    },


    {
      title: "Registered Users",
      value: users.length,
      icon: Users,
    },


    {
      title: "Active Volunteers",
      value: volunteers.length,
      icon: UserCheck,
    },


    {
      title: "Cleanup Events",
      value: events.length,
      icon: CalendarCheck,
    },


    {
      title: "Knowledge Articles",
      value: articles.length,
      icon: BookOpen,
    },


    {
      title: "AI Insights",
      value: aiInsights.length,
      icon: BrainCircuit,
    },


    {
      title: "Monitored Areas",
      value: new Set(
  monitoredAreas.map(
    area => `${area.ward}-${area.lga}-${area.state}`
  )
).size
      icon: MapPin,
    },

  ];



  return (

    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      gap-4
    ">

      {stats.map((stat)=>{

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
              hover:shadow-md
              transition
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
              <Icon size={22}/>
            </div>


          </div>

        );

      })}

    </div>

  );
};


export default AdminStats;
