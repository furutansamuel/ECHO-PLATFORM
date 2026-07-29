import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  AlertTriangle,
  ChevronRight,
  FileText,
  Clock,
  ArrowUpDown,
  ListFilter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { HazardReport, ReportStatus } from "@/types/reports";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { VerificationBadge } from "@/components/verification/VerificationBadge";
import { toast } from "sonner";

const TrackReportsPage: React.FC = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchReports = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("hazard_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      setReports([]);
      setLoading(false);
      return;
    }

    setReports((data as HazardReport[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        report.reference_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        report.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        report.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    reports,
    searchTerm,
    statusFilter,
    categoryFilter,
  ]);

  const severityVariant = (
    severity: string
  ): "safe" | "warning" | "danger" => {
    switch (severity) {
      case "Low":
        return "safe";

      case "Medium":
        return "warning";

      case "High":
      case "Critical":
      default:
        return "danger";
    }
  };

  return (
  <div className="container mx-auto pb-20 animate-in fade-in duration-500">
    {/* Header */}
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          <FileText className="h-8 w-8 text-primary" />
          Track My Reports
        </h1>

        <p className="mt-1 text-muted-foreground">
          Monitor the progress of all environmental hazard reports you have
          submitted.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="gap-2"
          onClick={fetchReports}
        >
          <ArrowUpDown className="h-4 w-4" />
          Refresh
        </Button>

        <Button
          onClick={() => navigate("/report")}
          className="gap-2"
        >
          Report Hazard
        </Button>
      </div>
    </div>

    {/* Filters */}
    <Card className="mb-6 border-none bg-muted/30 shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search by title or reference number..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          {/* Status */}
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <ListFilter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Statuses
              </SelectItem>

              <SelectItem value="Pending">
                Pending
              </SelectItem>

              <SelectItem value="Submitted">
                Submitted
              </SelectItem>

              <SelectItem value="Under Review">
                Under Review
              </SelectItem>

              <SelectItem value="Verified">
                Verified
              </SelectItem>

              <SelectItem value="In Progress">
                In Progress
              </SelectItem>

              <SelectItem value="Resolved">
                Resolved
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Category */}
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Categories
              </SelectItem>

              {[...new Set(reports.map((r) => r.category))]
                .filter(Boolean)
                .sort()
                .map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                  >
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    {/* Loading */}
    {loading ? (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <>

                {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                onClick={() => navigate(`/reports/${report.id}`)}
                className="group cursor-pointer overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full bg-primary md:w-1 group-hover:md:w-2 transition-all" />

                  <CardContent className="flex-1 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-muted px-2 py-1 font-mono text-[10px] font-bold text-muted-foreground">
                            {report.reference_number}
                          </span>

                          <VerificationBadge
                            status={report.status as ReportStatus}
                            size="sm"
                          />
                        </div>

                        <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
                          {report.title}
                        </h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {report.location?.address || "Unknown location"}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(
                              report.created_at
                            ).toLocaleDateString()}
                          </span>

                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {report.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between gap-3 md:flex-col md:items-end">
                        <span
                          className={`beacon-badge beacon-badge--${severityVariant(
                            report.severity
                          )}`}
                        >
                          {report.severity} Severity
                        </span>

                        <div className="flex items-center text-sm font-bold text-primary">
                          Details

                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (

                  <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="text-xl font-semibold">
              No reports found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              No environmental hazard reports match your current search or
              filters.
            </p>

            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </>
    )}
  </div>
);

};

export default TrackReportsPage;
