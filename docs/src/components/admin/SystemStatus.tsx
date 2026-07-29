import React from "react";

const SystemStatus = () => {

  const systems = [
    { name: "Database", status: "Online" },
    { name: "AI Engine", status: "Active" },
    { name: "Map Service", status: "Online" },
    { name: "API Services", status: "Online" },
  ];


  return (
    <div className="
      bg-white
      rounded-xl
      border
      p-5
    ">

      <h2 className="
        font-semibold
        text-foreground
        mb-4
      ">
        System Status
      </h2>


      <div className="space-y-3">

        {systems.map((system)=>(
          <div
            key={system.name}
            className="
              flex
              justify-between
              text-sm
            "
          >

            <span className="text-muted-foreground">
              {system.name}
            </span>


            <span className="
              text-success
              font-medium
            ">
              ● {system.status}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
};


export default SystemStatus;
