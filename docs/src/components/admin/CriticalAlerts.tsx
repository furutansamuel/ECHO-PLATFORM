import React from "react";
import {
  AlertTriangle,
  MapPin,
  Clock,
} from "lucide-react";


// ===============================
// Critical Environmental Alerts
// ===============================

interface CriticalAlertsProps {
  alerts: any[];
}


const CriticalAlerts = ({
  alerts = [],
}: CriticalAlertsProps) => {


  return (

    <div className="
      bg-white
      border
      rounded-xl
      p-5
    ">


      {/* Header */}

      <div className="
        flex
        items-center
        justify-between
        mb-4
      ">

        <h2 className="
          font-semibold
          text-foreground
        ">
          Critical Alerts
        </h2>


        <AlertTriangle
          size={20}
          className="text-error"
        />

      </div>



      <div className="space-y-4">


        {alerts.length === 0 && (

          <p className="
            text-sm
            text-muted-foreground
          ">
            No critical alerts
          </p>

        )}



        {alerts
          .slice(0,5)
          .map((alert)=>(


          <div
            key={alert.id}
            className="
              border
              rounded-lg
              p-4
              bg-error-subtle
            "
          >


            <div className="
              flex
              justify-between
              gap-3
            ">


              <div>


                <h3 className="
                  font-medium
                  text-foreground
                ">
                  {alert.title}
                </h3>


                <p className="
                  text-sm
                  text-muted-foreground
                  mt-1
                ">
                  {alert.message}
                </p>


              </div>



              <span className="
                text-xs
                h-fit
                px-2
                py-1
                rounded-full
                bg-error
                text-white
              ">
                {alert.severity}
              </span>


            </div>



            <div className="
              flex
              gap-4
              mt-3
              text-xs
              text-muted-foreground
            ">


              <span className="
                flex
                items-center
                gap-1
              ">
                <MapPin size={12}/>
                Alert Zone
              </span>



              <span className="
                flex
                items-center
                gap-1
              ">
                <Clock size={12}/>
                {new Date(
                  alert.created_at
                ).toLocaleDateString()}
              </span>


            </div>


          </div>


        ))}


      </div>


    </div>

  );
};


export default CriticalAlerts;
