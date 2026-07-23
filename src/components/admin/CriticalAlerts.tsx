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
          text-gray-800
        ">
          Critical Alerts
        </h2>


        <AlertTriangle
          size={20}
          className="text-red-500"
        />

      </div>



      <div className="space-y-4">


        {alerts.length === 0 && (

          <p className="
            text-sm
            text-gray-500
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
              bg-red-50
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
                  text-gray-800
                ">
                  {alert.title}
                </h3>


                <p className="
                  text-sm
                  text-gray-600
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
                bg-red-600
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
              text-gray-500
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
