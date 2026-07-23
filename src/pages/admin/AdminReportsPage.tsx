import React, { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useIntelligenceData } from "@/hooks/use-intelligence-data";
import { supabase } from "@/integrations/supabase/client";
import { uploadImages } from "@/lib/storage-upload";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Wrench,
  Eye,
  MoreVertical,
  Calendar,
  TriangleAlert,
  FileText,
} from "lucide-react";

import type { HazardReport } from "@/types/reports";

const STATUS_OPTIONS = [
  "Pending",
  "Verified",
  "Assigned",
  "In Progress",
  "Resolved",
  "Rejected",
];

const SEVERITY_OPTIONS = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const RESOLVED_STATUSES = new Set([
  "Resolved",
  "Closed",
  "Rejected",
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

export default function AdminReportsPage() {
  const { user } = useAuth();

  const {
    hazardReports,
    loading,
    refetch,
  } = useIntelligenceData();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [severityFilter, setSeverityFilter] =
    useState("all");

  const [selected, setSelected] =
    useState<HazardReport | null>(null);

  const [resolutionNotes, setResolutionNotes] =
    useState("");

  const [resolutionFiles, setResolutionFiles] =
    useState<File[]>([]);

  const [saving, setSaving] =
    useState(false);

  const filtered = useMemo(() => {
    return hazardReports.filter((report) => {
      if (
        statusFilter !== "all" &&
        report.status !== statusFilter
      )
        return false;

      if (
        severityFilter !== "all" &&
        report.severity !== severityFilter
      )
        return false;

      if (search.trim()) {
        const q = search.toLowerCase();

        const searchable =
          `${report.reference_number}
           ${report.title}
           ${report.category}`
            .toLowerCase();

        if (!searchable.includes(q))
          return false;
      }

      return true;
    });
  }, [
    hazardReports,
    search,
    statusFilter,
    severityFilter,
  ]);

  async function updateStatus(
    report: HazardReport,
    status: string
  ) {
    if (!supabase || !user) return;

    setSaving(true);

    const update: Record<string, unknown> = {
      status,
    };

    if (status === "Verified") {
      update.verification_status =
        "completed";

      update.verifier_id = user.id;
    }

    const { error } = await supabase
      .from("hazard_reports")
      .update(update)
      .eq("id", report.id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(`Report marked ${status}`);

    refetch();
  }

  async function deleteReport(
    report: HazardReport
  ) {
    if (!supabase) return;

    if (
      !confirm(
        `Delete report ${report.reference_number}?`
      )
    )
      return;

    const { error } = await supabase
      .from("hazard_reports")
      .delete()
      .eq("id", report.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Report deleted");

    refetch();
  }

  async function resolveWithPhotos() {
    if (!selected || !supabase || !user)
      return;

    setSaving(true);

    let resolutionImageUrls: string[] = [];

    if (resolutionFiles.length > 0) {
      const { urls, errors } =
        await uploadImages(
          "report-images",
          resolutionFiles,
          selected.id
        );

      resolutionImageUrls = urls;

      errors.forEach((err) =>
        toast.error(err)
      );
    }

    const { error } = await supabase
      .from("hazard_reports")
      .update({
        status: "Resolved",
        resolution_notes:
          resolutionNotes || null,
        resolution_images:
          resolutionImageUrls.length
            ? resolutionImageUrls
            : selected.resolution_images,
      })
      .eq("id", selected.id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Report resolved");

    setSelected(null);
    setResolutionNotes("");
    setResolutionFiles([]);

    refetch();
}

    return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">
          Reports Management
        </h1>

        <p className="text-muted-foreground text-sm mt-1">
          Verify, reject, resolve, or remove citizen hazard reports.
        </p>
      </div>


      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">

        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />

          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-9"
          />
        </div>


        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All statuses
            </SelectItem>

            {STATUS_OPTIONS.map((status) => (
              <SelectItem
                key={status}
                value={status}
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>

        </Select>


        <Select
          value={severityFilter}
          onValueChange={setSeverityFilter}
        >

          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>


          <SelectContent>

            <SelectItem value="all">
              All severities
            </SelectItem>

            {SEVERITY_OPTIONS.map((severity) => (

              <SelectItem
                key={severity}
                value={severity}
              >
                {severity}
              </SelectItem>

            ))}

          </SelectContent>

        </Select>

      </div>



      {/* Loading */}
      {loading && (

        <div className="space-y-3">

          {[1,2,3,4].map((i)=>(

            <Skeleton
              key={i}
              className="h-28 rounded-xl"
            />

          ))}

        </div>

      )}



      {/* Empty */}
      {!loading &&
        filtered.length === 0 && (

        <div className="text-center py-16 text-muted-foreground">

          <FileText className="mx-auto h-8 w-8 mb-3"/>

          <p>
            No reports found.
          </p>

        </div>

      )}



      {/* ================= MOBILE CARDS ================= */}

      {!loading &&
        filtered.length > 0 && (

        <div className="space-y-4 md:hidden">

          {filtered.map((report)=>(


            <div
              key={report.id}
              className="border rounded-xl p-4 space-y-3 bg-card"
            >


              <div className="flex justify-between">

                <div>

                  <p className="font-mono text-xs text-muted-foreground">
                    {report.reference_number}
                  </p>

                  <h3 className="font-semibold mt-1">
                    {report.title}
                  </h3>

                </div>



                {/* Mobile Action Menu */}

                <DropdownMenu>

                  <DropdownMenuTrigger asChild>

                    <Button
                      size="icon"
                      variant="ghost"
                    >

                      <MoreVertical className="h-5 w-5"/>

                    </Button>

                  </DropdownMenuTrigger>


                  <DropdownMenuContent align="end">


                    <DropdownMenuItem
                      onClick={() =>
                        setSelected(report)
                      }
                    >
                      <Eye className="mr-2 h-4 w-4"/>
                      View
                    </DropdownMenuItem>


                    <DropdownMenuItem
                      onClick={() =>
                        updateStatus(
                          report,
                          "Verified"
                        )
                      }
                    >
                      <CheckCircle className="mr-2 h-4 w-4"/>
                      Verify
                    </DropdownMenuItem>


                    <DropdownMenuItem
                      onClick={() =>
                        updateStatus(
                          report,
                          "Rejected"
                        )
                      }
                    >
                      <XCircle className="mr-2 h-4 w-4"/>
                      Reject
                    </DropdownMenuItem>


                    <DropdownMenuItem
                      onClick={() =>
                        setSelected(report)
                      }
                    >
                      <Wrench className="mr-2 h-4 w-4"/>
                      Resolve
                    </DropdownMenuItem>


                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        deleteReport(report)
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4"/>
                      Delete
                    </DropdownMenuItem>


                  </DropdownMenuContent>

                </DropdownMenu>


              </div>



              <div className="flex flex-wrap gap-2">


                <span
                  className={`beacon-badge beacon-badge--${severityVariant(report.severity)}`}
                >
                  {report.severity}
                </span>



                <span
                  className={`beacon-badge beacon-badge--${
                    RESOLVED_STATUSES.has(report.status)
                    ? report.status === "Rejected"
                      ? "danger"
                      : "safe"
                    : "warning"
                  }`}
                >
                  {report.status}
                </span>


              </div>



              <div className="text-sm text-muted-foreground">

                <p>
                  {report.category}
                </p>

                <p className="flex items-center gap-1 mt-1">

                  <Calendar className="h-3 w-3"/>

                  {new Date(
                    report.created_at
                  ).toLocaleDateString()}

                </p>


              </div>


            </div>


          ))}


        </div>

      )}




      {/* ================= DESKTOP TABLE ================= */}

      {!loading &&
        filtered.length > 0 && (

        <div className="hidden md:block rounded-xl border overflow-hidden">

          <table className="w-full text-sm">


            <thead className="bg-muted/50 text-left text-[10px] uppercase tracking-widest text-muted-foreground">

              <tr>

                <th className="px-4 py-3">
                  Reference
                </th>

                <th className="px-4 py-3">
                  Title
                </th>

                <th className="hidden lg:table-cell px-4 py-3">
                  Category
                </th>

                <th className="px-4 py-3">
                  Severity
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

                <th className="hidden md:table-cell px-4 py-3">
                  Submitted
                </th>

                <th className="px-4 py-3 text-right">
                  Actions
                </th>

              </tr>

            </thead>



            <tbody className="divide-y">

              {filtered.map((report)=>(

                <tr
                  key={report.id}
                  className="hover:bg-muted/30"
                >

                  <td className="px-4 py-3 font-mono text-xs">
                    {report.reference_number}
                  </td>


                  <td className="px-4 py-3 font-medium">
                    {report.title}
                  </td>


                  <td className="hidden lg:table-cell px-4 py-3">
                    {report.category}
                  </td>


                  <td className="px-4 py-3">

                    <span
                      className={`beacon-badge beacon-badge--${severityVariant(report.severity)}`}
                    >
                      {report.severity}
                    </span>

                  </td>


                  <td className="px-4 py-3">

                    <span
                      className={`beacon-badge beacon-badge--${
                        RESOLVED_STATUSES.has(report.status)
                        ? report.status==="Rejected"
                          ? "danger"
                          : "safe"
                        : "warning"
                      }`}
                    >
                      {report.status}
                    </span>

                  </td>


                  <td className="hidden md:table-cell px-4 py-3 text-xs">

                    {new Date(
                      report.created_at
                    ).toLocaleDateString()}

                  </td>


                  <td className="px-4 py-3">

                    <div className="flex justify-end gap-1">


                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setSelected(report)
                        }
                      >
                        <Eye className="h-4 w-4"/>
                      </Button>


                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          updateStatus(
                            report,
                            "Verified"
                          )
                        }
                      >
                        <CheckCircle className="h-4 w-4"/>
                      </Button>


                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          deleteReport(report)
                        }
                      >
                        <Trash2 className="h-4 w-4"/>
                      </Button>


                    </div>

                  </td>


                </tr>

              ))}


            </tbody>


          </table>

        </div>

      )}

            {/* REPORT DETAILS / RESOLUTION DIALOG */}

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setResolutionNotes("");
            setResolutionFiles([]);
          }
        }}
      >

        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">

          <DialogHeader>

            <DialogTitle>
              {selected?.reference_number}
              {" — "}
              {selected?.title}
            </DialogTitle>

          </DialogHeader>



          {selected && (

            <div className="space-y-5">


              {/* Report Information */}

              <div className="grid grid-cols-2 gap-4 text-sm">


                <div>

                  <p className="text-xs text-muted-foreground">
                    Category
                  </p>

                  <p className="font-medium">
                    {selected.category}
                  </p>

                </div>



                <div>

                  <p className="text-xs text-muted-foreground">
                    Severity
                  </p>

                  <p>

                    <span
                      className={`beacon-badge beacon-badge--${severityVariant(selected.severity)}`}
                    >
                      {selected.severity}
                    </span>

                  </p>

                </div>



                <div>

                  <p className="text-xs text-muted-foreground">
                    Status
                  </p>

                  <p className="font-medium">
                    {selected.status}
                  </p>

                </div>



                <div>

                  <p className="text-xs text-muted-foreground">
                    Date
                  </p>

                  <p className="text-sm">
                    {new Date(
                      selected.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>



                <div className="col-span-2">

                  <p className="text-xs text-muted-foreground">
                    Location
                  </p>

                  <p>
                    {selected.location?.address ||
                      "No location provided"}
                  </p>

                </div>



                <div className="col-span-2">

                  <p className="text-xs text-muted-foreground">
                    Description
                  </p>

                  <p className="leading-relaxed">
                    {selected.description}
                  </p>

                </div>


              </div>





              {/* Evidence Images */}

              {selected.images &&
                selected.images.length > 0 && (

                <div>

                  <p className="text-sm font-semibold mb-2">
                    Evidence Photos
                  </p>


                  <div className="grid grid-cols-3 gap-2">

                    {selected.images.map((image) => (

                      <img
                        key={image}
                        src={image}
                        alt="Report evidence"
                        className="
                          aspect-square
                          rounded-lg
                          object-cover
                          border
                        "
                      />

                    ))}

                  </div>


                </div>

              )}





              {/* Resolution Section */}

              <div className="border-t pt-4 space-y-3">


                <div className="flex items-center gap-2">

                  <Wrench className="h-4 w-4"/>

                  <p className="font-semibold text-sm">
                    Resolve Report
                  </p>

                </div>



                <Textarea
                  placeholder="Resolution notes (optional)"
                  value={resolutionNotes}
                  onChange={(event) =>
                    setResolutionNotes(
                      event.target.value
                    )
                  }
                  rows={4}
                />



                <div>

                  <label className="text-xs text-muted-foreground">

                    Upload after-resolution photos
                    (optional)

                  </label>


                  <Input

                    type="file"

                    accept="image/*"

                    multiple

                    onChange={(event) =>
                      setResolutionFiles(
                        Array.from(
                          event.target.files || []
                        )
                      )
                    }

                  />

                </div>


              </div>



            </div>

          )}



          <DialogFooter>


            <Button

              variant="outline"

              onClick={() => {
                setSelected(null);
                setResolutionNotes("");
                setResolutionFiles([]);
              }}

            >

              Close

            </Button>




            <Button

              onClick={resolveWithPhotos}

              disabled={saving || !selected}

            >

              {saving ? (

                <Loader2
                  className="
                    h-4 w-4
                    animate-spin
                    mr-2
                  "
                />

              ) : (

                <Wrench
                  className="
                    h-4 w-4
                    mr-2
                  "
                />

              )}


              Mark Resolved

            </Button>


          </DialogFooter>


        </DialogContent>
      </Dialog>

    </div>
  );
}
