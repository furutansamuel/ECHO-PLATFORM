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

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    async function fetchAdminStats() {

      try {

        setLoading(true);


        const [
          usersRes,
          volunteersRes,
          eventsRes,
          alertsRes,
          insightsRes,
          areasRes,
        ] = await Promise.all([


          // Users
          supabase
            .from("profiles")
            .select("*"),


          // Volunteers
          supabase
            .from("profiles")
            .select("*")
            .eq("role", "volunteer"),


          // Events
          supabase
            .from("events")
            .select("*"),


          // Critical Alerts
          supabase
            .from("environmental_alerts")
            .select("*")
            .eq("severity", "critical"),


          // AI Insights
          supabase
            .from("ai_insights")
            .select("*"),


          // Monitoring Areas
          supabase
            .from("monitoring_areas")
            .select("*"),

        ]);



        setUsers(usersRes.data || []);

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
          insightsRes.data || []
        );

        setMonitoredAreas(
          areasRes.data || []
        );


      } catch(error) {

        console.error(
          "Admin stats error:",
          error
        );

      } finally {

        setLoading(false);

      }

    }


    fetchAdminStats();


  }, []);



  return {

    users,
    volunteers,
    events,
    criticalAlerts,
    aiInsights,
    monitoredAreas,
    loading,

  };

            }
