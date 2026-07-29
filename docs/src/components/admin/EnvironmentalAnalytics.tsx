import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


// ===============================
// Environmental Analytics
// ===============================

interface EnvironmentalAnalyticsProps {
  reports: any[];
}


const EnvironmentalAnalytics = ({
  reports = [],
}: EnvironmentalAnalyticsProps) => {


  const categoryData = useMemo(() => {

    const result:any = {};


    reports.forEach((report)=>{

      const category =
        report.category || "Unknown";


      result[category] =
        (result[category] || 0) + 1;

    });


    return Object.keys(result).map(
      (key)=>({
        name:key,
        value:result[key],
      })
    );


  },[reports]);




  const severityData = useMemo(()=>{

    const result:any = {};


    reports.forEach((report)=>{

      const severity =
        report.severity || "Unknown";


      result[severity] =
        (result[severity] || 0)+1;

    });


    return Object.keys(result).map(
      (key)=>({
        name:key,
        value:result[key],
      })
    );


  },[reports]);



  return (

    <div className="
      grid
      lg:grid-cols-2
      gap-6
    ">


      {/* Category Chart */}

      <div className="
        bg-white
        border
        rounded-xl
        p-5
      ">

        <h2 className="
          font-semibold
          mb-4
        ">
          Reports by Category
        </h2>


        <ResponsiveContainer
          width="100%"
          height={250}
        >

          <BarChart data={categoryData}>

            <XAxis dataKey="name"/>

            <YAxis/>

            <Tooltip/>

            <Bar
              dataKey="value"
              fill="var(--primary)"
            />

          </BarChart>


        </ResponsiveContainer>


      </div>





      {/* Severity Chart */}

      <div className="
        bg-white
        border
        rounded-xl
        p-5
      ">


        <h2 className="
          font-semibold
          mb-4
        ">
          Hazard Severity
        </h2>


        <ResponsiveContainer
          width="100%"
          height={250}
        >

          <PieChart>

            <Pie
              data={severityData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
            >

              {severityData.map(
                (_,index)=>(
                  <Cell key={index}/>
                )
              )}

            </Pie>


            <Tooltip/>


          </PieChart>


        </ResponsiveContainer>


      </div>


    </div>

  );
};


export default EnvironmentalAnalytics;
