import React from "react";
import { MapPin, Clock } from "lucide-react";


// ===============================
// Recent Hazard Reports
// ===============================

interface RecentReportsProps {
  reports: any[];
}


const RecentReports = ({
  reports = [],
}: RecentReportsProps) => {


  return (
    <div className="
      bg-white
      border
      rounded-xl
      p-5
    ">


      <div className="
        flex
        justify-between
        items-center
        mb-4
      ">

        <h2 className="
          font-semibold
          text-foreground
        ">
          Recent Reports
        </h2>


        <span className="
          text-xs
          text-muted-foreground
        ">
          Latest submissions
        </span>

      </div>



      <div className="space-y-4">


        {reports.length === 0 && (

          <p className="
            text-sm
            text-muted-foreground
          ">
            No reports available
          </p>

        )}



        {reports
          .slice(0,5)
          .map((report)=>(


          <div
            key={report.id}
            className="
              flex
              justify-between
              items-center
              border-b
              pb-3
            "
          >


            <div>

              <p className="
                font-medium
                text-foreground
              ">
                {report.title}
              </p>


              <div className="
                flex
                items-center
                gap-2
                text-xs
                text-muted-foreground
                mt-1
              ">

                <MapPin size={13}/>

                {report.state || "Unknown location"}

              </div>

            </div>



            <div className="text-right">


              <span className="
                text-xs
                px-3
                py-1
                rounded-full
                bg-success-subtle
                text-success
              ">
                {report.status}
              </span>


              <div className="
                flex
                items-center
                gap-1
                text-xs
                text-muted-foreground
                mt-2
              ">

                <Clock size={12}/>

                {new Date(
                  report.created_at
                ).toLocaleDateString()}

              </div>


            </div>


          </div>


        ))}


      </div>


    </div>
  );
};


export default RecentReports;
