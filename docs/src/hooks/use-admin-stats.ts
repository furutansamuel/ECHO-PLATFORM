import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


// ===============================
// Admin Statistics Hook
// ===============================

export function useAdminStats() {

  const [users, setUsers] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [monitoredAreas, setMonitoredAreas] = useState<any[]>([]);


  useEffect(() => {

    async function fetchStats() {

      try {

        const [
          usersRes,
          volunteersRes,
          eventsRes,
          alertsRes,
          aiRes,
          areasRes

        ] = await Promise.all([


          // All users
          supabase
            .from("profiles")
            .select("*"),


          // Volunteers
          supabase
            .from("profiles")
            .select("*")
            .eq("role","volunteer"),


          // Events
          supabase
            .from("events")
            .select("*"),


          // Critical alerts
          supabase
            .from("environmental_alerts")
            .select("*")
            .eq("severity","critical"),


          // AI processed reports
          supabase
            .from("hazard_reports")
            .select("*")
            .not("ai_summary","is",null),


          // Unique monitored locations
          supabase
            .from("hazard_reports")
            .select(
              "ward,lga,state"
            )

        ]);



        setUsers(
          usersRes.data || []
        );


        setVolunteers(
          volunteersRes.data || []
        );


        setEvents(
          eventsRes.data || []
        );


        setCriticalAlerts(
          alertsRes.data || []
        );


        setAiInsights(
          aiRes.data || []
        );


        setMonitoredAreas(
          areasRes.data || []
        );


      }

      catch(error){

        console.error(
          "Admin Stats Error:",
          error
        );

      }

    }


    fetchStats();


  },[]);



  return {

    users,
    volunteers,
    events,
    criticalAlerts,
    aiInsights,
    monitoredAreas,

  };

}
