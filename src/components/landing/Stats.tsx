import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Users,
  HeartPulse,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const icons = {
  reports: FileText,
  resolved: CheckCircle2,
  volunteers: Users,
  communities: HeartPulse,
};

function Count({ value }: { value: number }) {
  return <>{value.toLocaleString()}</>;
}

export function Stats() {
  const [data, setData] = useState({
    total_reports: 0,
    resolved_reports: 0,
    active_volunteers: 0,
    communities_reached: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase.rpc(
        "get_public_landing_stats"
      );

      console.log("Landing stats:", data);
      console.log("Stats error:", error);

      if (!error && data) {
        const result = Array.isArray(data)
          ? data[0]
          : typeof data === "string"
          ? JSON.parse(data)
          : data;

        setData(result);
      }
    }

    loadStats();
  }, []);


  const stats = [
    {
      icon: icons.reports,
      value: data.total_reports,
      label: "Reports Submitted",
    },
    {
      icon: icons.resolved,
      value: data.resolved_reports,
      label: "Cases Resolved",
    },
    {
      icon: icons.volunteers,
      value: data.active_volunteers,
      label: "Active Volunteers",
    },
    {
      icon: icons.communities,
      value: data.communities_reached,
      label: "Communities Reached",
    },
  ];


  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.5 }}
          className="
          rounded-3xl
          border
          border-border/40
          bg-background/70
          backdrop-blur-xl
          shadow-xl
          p-6
          md:p-10
          "
        >

          <div className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
          md:gap-6
          ">

          {stats.map((item,index)=>{

            const Icon = item.icon;

            return (
              <motion.div
              key={item.label}
              initial={{opacity:0,y:20}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true}}
              transition={{
                delay:index * 0.1
              }}
              className="
              rounded-2xl
              border
              border-border/40
              bg-card/50
              p-5
              "
              >

                <div className="
                mb-4
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-primary/10
                "
                >
                  <Icon className="h-5 w-5 text-primary"/>
                </div>


                <h3 className="
                text-3xl
                md:text-4xl
                font-black
                text-foreground
                ">
                  <Count value={item.value}/>
                </h3>


                <p className="
                mt-1
                text-sm
                text-muted-foreground
                ">
                  {item.label}
                </p>

              </motion.div>
            )

          })}

          </div>

        </motion.div>

      </div>
    </section>
  );
}

export default Stats;
