import React from "react";
import {
  UserPlus,
  ClipboardList,
  CalendarCheck,
  Clock,
} from "lucide-react";


// ===============================
// Recent Admin Activity Feed
// ===============================

interface RecentActivityProps {
  users: any[];
  reports: any[];
  events: any[];
}


const RecentActivity = ({
  users = [],
  reports = [],
  events = [],
}: RecentActivityProps) => {


  const activities = [

    ...users.map((user)=>({
      title: "New user registered",
      description: user.full_name || "New user",
      date: user.created_at,
      icon: UserPlus,
    })),


    ...reports.map((report)=>({
      title: "New hazard report",
      description: report.title || "Environmental report",
      date: report.created_at,
      icon: ClipboardList,
    })),


    ...events.map((event)=>({
      title: "New cleanup event",
      description: event.title || "Community event",
      date: event.created_at,
      icon: CalendarCheck,
    })),

  ]
  .sort(
    (a,b)=>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  )
  .slice(0,8);



  return (

    <div className="
      bg-white
      border
      rounded-xl
      p-5
    ">


      <h2 className="
        font-semibold
        text-foreground
        mb-5
      ">
        Recent Activity
      </h2>



      <div className="space-y-4">


        {activities.length === 0 && (

          <p className="
            text-sm
            text-muted-foreground
          ">
            No recent activity
          </p>

        )}



        {activities.map((activity,index)=>{


          const Icon = activity.icon;


          return (

            <div
              key={index}
              className="
                flex
                gap-3
                items-start
              "
            >

              <div className="
                h-9
                w-9
                rounded-full
                bg-primary
                text-white
                flex
                items-center
                justify-center
              ">

                <Icon size={16}/>

              </div>



              <div className="flex-1">

                <p className="
                  text-sm
                  font-medium
                  text-foreground
                ">
                  {activity.title}
                </p>


                <p className="
                  text-xs
                  text-muted-foreground
                ">
                  {activity.description}
                </p>


                <span className="
                  flex
                  items-center
                  gap-1
                  text-xs
                  text-muted-foreground
                  mt-1
                ">

                  <Clock size={12}/>

                  {new Date(
                    activity.date
                  ).toLocaleDateString()}

                </span>


              </div>


            </div>

          );

        })}


      </div>


    </div>

  );
};


export default RecentActivity;
