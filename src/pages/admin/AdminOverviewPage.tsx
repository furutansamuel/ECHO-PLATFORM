import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Wrench,
} from "lucide-react";

import { useIntelligenceData } from "@/hooks/use-intelligence-data";
import AdminStats from "@/components/admin/AdminStats";
import SystemStatus from "@/components/admin/SystemStatus";
import { useAdminStats } from "@/hooks/use-admin-stats";

// ===============================
// Admin Overview Page
// ===============================

export default function AdminOverviewPage() {

  const {
  hazardReports,
  articles,
  loading
} = useIntelligenceData();


const {
  users,
  volunteers,
  events,
  criticalAlerts,
  aiInsights,
  monitoredAreas,
} = useAdminStats();


  const counts = useMemo(() => {

    return {
      total: hazardReports.length,
      pending: hazardReports.filter(
        (r) => r.status === "Pending"
      ).length,
      verified: hazardReports.filter(
        (r) => r.status === "Verified"
      ).length,
      resolved: hazardReports.filter(
        (r) => r.status === "Resolved"
      ).length,
      articles: articles.length,
    };

  }, [hazardReports, articles]);



  const cards = [
    {
      label: "Total Reports",
      value: counts.total,
      icon: ClipboardList,
      href: "/admin/reports",
    },
    {
      label: "Pending Review",
      value: counts.pending,
      icon: Clock,
      href: "/admin/reports",
    },
    {
      label: "Verified",
      value: counts.verified,
      icon: CheckCircle,
      href: "/admin/reports",
    },
    {
      label: "Resolved",
      value: counts.resolved,
      icon: Wrench,
      href: "/admin/reports",
    },
    {
      label: "Articles",
      value: counts.articles,
      icon: BookOpen,
      href: "/admin/knowledge",
    },
  ];



  return (

    <div className="space-y-6 p-4 md:p-6">


      {/* Page Header */}

      <div>
        <h1 className="
          text-2xl
          font-display
          font-bold
          text-primary
        ">
          Admin Dashboard
        </h1>

        <p className="
          text-muted-foreground
          text-sm
          mt-1
        ">
          Environmental Intelligence Control Center
        </p>
      </div>



      {/* New Admin Summary Cards */}

<AdminStats
  hazardReports={hazardReports}
  articles={articles}
  users={users}
  volunteers={volunteers}
  events={events}
  criticalAlerts={criticalAlerts}
  aiInsights={aiInsights}
  monitoredAreas={monitoredAreas}
/>



      {/* System Health */}

      <SystemStatus />



      {/* Quick Actions */}

      <div className="
        grid
        md:grid-cols-2
        gap-4
      ">


        <Link
          to="/admin/reports"
          className="
            card-premium
            p-6
            flex
            items-center
            gap-4
            hover:border-primary/30
            transition-colors
          "
        >

          <div className="
            icon-badge
            gradient-primary
            h-12
            w-12
          ">
            <ClipboardList className="h-5 w-5" />
          </div>


          <div>
            <p className="font-semibold">
              Manage Reports
            </p>

            <p className="
              text-xs
              text-muted-foreground
            ">
              Verify, reject, or resolve citizen submissions
            </p>
          </div>

        </Link>



        <Link
          to="/admin/knowledge"
          className="
            card-premium
            p-6
            flex
            items-center
            gap-4
            hover:border-primary/30
            transition-colors
          "
        >

          <div className="
            icon-badge
            gradient-analytics
            h-12
            w-12
          ">
            <BookOpen className="h-5 w-5" />
          </div>


          <div>
            <p className="font-semibold">
              Knowledge Centre
            </p>

            <p className="
              text-xs
              text-muted-foreground
            ">
              Create and publish articles
            </p>
          </div>

        </Link>


      </div>


    </div>

  );
}
