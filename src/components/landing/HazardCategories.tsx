import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  ArrowRight,
  Trash2,
  Waves,
  Flame,
  CheckCircle2,
  ShieldAlert,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const reports = [
  {
    id: 1,
    title: "Illegal Waste Dumping",
    location: "Ombi 2, Lafia",
    status: "Verified",
    time: "2 hours ago",
    icon: Trash2,
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    title: "Flooded Drainage",
    location: "Shabu, Lafia",
    status: "Under Review",
    time: "Today",
    icon: Waves,
    statusColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: 3,
    title: "Bush Fire",
    location: "Mararaba Akunza",
    status: "Resolved",
    time: "Yesterday",
    icon: Flame,
    statusColor: "bg-blue-100 text-blue-700",
  },
];

export function LatestCommunityReports() {
  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">
            Latest Community Reports
          </h2>

          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Stay informed about recently reported environmental hazards in your
            community and see how ECHO is helping drive action.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {reports.map((report) => (
            <Card
              key={report.id}
              className="group hover:shadow-lg transition-all duration-300 rounded-2xl border"
            >
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <report.icon className="h-6 w-6 text-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {report.title}
                      </h3>

                      <div className="flex items-center text-muted-foreground text-sm mt-1">
                        <MapPin className="mr-1 h-4 w-4" />
                        {report.location}
                      </div>
                    </div>

                  </div>

                </div>

                <div className="flex justify-between items-center mt-5">

                  <Badge className={report.statusColor}>
                    {report.status === "Verified" && (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    )}

                    {report.status === "Under Review" && (
                      <ShieldAlert className="mr-1 h-3 w-3" />
                    )}

                    {report.status === "Resolved" && (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    )}

                    {report.status}
                  </Badge>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {report.time}
                  </div>

                </div>

              </CardContent>
            </Card>
          ))}

        </div>

        <div className="flex justify-center mt-10">

          <Button asChild size="lg" className="rounded-full gap-2">

            <Link to="/map">
              <Eye className="h-4 w-4" />
              View All Reports
              <ArrowRight className="h-4 w-4" />
            </Link>

          </Button>

        </div>

      </div>
    </section>
  );
}
