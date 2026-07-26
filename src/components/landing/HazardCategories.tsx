import React from "react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ArrowRight,
  Clock,
  MapPin,
  Eye,
  Trash2,
  Waves,
  Flame,
  Trees,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

const reports = [
  {
    id: 1,
    title: "Illegal Waste Dumping",
    location: "Ombi 2, Lafia",
    status: "Verified",
    time: "2 hours ago",
    icon: Trash2,
    badge: "bg-green-100 text-green-700 border-green-200",
  },
  {
    id: 2,
    title: "Flooded Drainage",
    location: "Shabu, Lafia",
    status: "Under Review",
    time: "Today",
    icon: Waves,
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    id: 3,
    title: "Bush Fire",
    location: "Mararaba Akunza",
    status: "Resolved",
    time: "Yesterday",
    icon: Flame,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: 4,
    title: "Illegal Tree Cutting",
    location: "Bukan Sidi",
    status: "Verified",
    time: "3 days ago",
    icon: Trees,
    badge: "bg-green-100 text-green-700 border-green-200",
  },
  {
    id: 5,
    title: "Air Pollution",
    location: "Lafia Central",
    status: "High Priority",
    time: "30 mins ago",
    icon: AlertTriangle,
    badge: "bg-red-100 text-red-700 border-red-200",
  },
];

export function HazardCategories() {
  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">
            Latest Community Reports
          </h2>

          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Stay informed with the latest environmental reports submitted by
            community members across ECHO.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>

            {reports.map((report) => (
              <CarouselItem key={report.id}>

                <Card className="rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300">

                  <CardContent className="p-8">

                    <div className="flex items-start justify-between">

                      <div className="flex gap-4">

                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                          <report.icon className="h-7 w-7 text-primary" />

                        </div>

                        <div>

                          <h3 className="text-xl font-bold">
                            {report.title}
                          </h3>

                          <div className="flex items-center text-muted-foreground mt-2">

                            <MapPin className="h-4 w-4 mr-2" />

                            {report.location}

                          </div>

                        </div>

                      </div>

                      <Badge className={report.badge}>

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

                    </div>

                    <div className="flex items-center justify-between mt-8">

                      <div className="flex items-center text-sm text-muted-foreground">

                        <Clock className="mr-2 h-4 w-4" />

                        Reported {report.time}

                      </div>

                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full"
                      >
                        <Link to={`/reports/${report.id}`}>
                          View Details
                        </Link>
                      </Button>

                    </div>

                  </CardContent>

                </Card>

              </CarouselItem>
            ))}

          </CarouselContent>
        </Carousel>

        {/* Bottom Button */}
        <div className="flex justify-center mt-10">

          <Button
            asChild
            size="lg"
            className="rounded-full gap-2"
          >
            <Link to="/reports">
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
