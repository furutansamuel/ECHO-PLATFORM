import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { EventRecord } from '@/types/reports';

export interface UpcomingEvent extends EventRecord {
  registered_count: number;
}

/** Real events from the `events` table (upcoming/ongoing only, soonest
 * first), joined with the public-safe registration-count view. Used by
 * both the public landing page and the dashboard widget — previously
 * each rendered its own hardcoded static array with no DB backing. */
export function useUpcomingEvents(limit?: number, statuses: string[] = ['upcoming', 'ongoing']) {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      const today = new Date().toISOString().split('T')[0];
      let query = supabase.from('events').select('*').in('status', statuses);
      query = statuses.includes('completed')
        ? query.order('event_date', { ascending: false })
        : query.gte('event_date', today).order('event_date', { ascending: true });

      const { data: eventsData, error } = limit ? await query.limit(limit) : await query;

      if (cancelled) return;
      if (error || !eventsData) {
        setLoading(false);
        return;
      }

      const { data: countsData } = await supabase.from('event_registration_counts').select('*');
      const countMap = new Map((countsData || []).map((c: any) => [c.event_id, c.registered_count]));

      setEvents(
        (eventsData as EventRecord[]).map((e) => ({
          ...e,
          registered_count: countMap.get(e.id) ?? 0,
        }))
      );
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [limit, statuses.join(',')]);

  return { events, loading };
}
