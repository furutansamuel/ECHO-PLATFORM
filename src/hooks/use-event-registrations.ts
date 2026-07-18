import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

/** Tracks the current user's own event registrations and provides
 * register/unregister actions that actually write to event_registrations
 * (RLS: a user can only insert/delete their own row). Replaces every
 * previous "Register" button that only flipped local React state. */
export function useEventRegistrations() {
  const { user } = useAuth();
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !user) {
      setRegisteredIds(new Set());
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', user.id);
    if (!error && data) {
      setRegisteredIds(new Set(data.map((r: any) => r.event_id)));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const register = async (eventId: string) => {
    if (!supabase || !user) {
      toast.error('Sign in to register for events.');
      return;
    }
    setPendingId(eventId);
    const { error } = await supabase
      .from('event_registrations')
      .insert({ event_id: eventId, user_id: user.id });
    setPendingId(null);
    if (error) {
      toast.error('Failed to register: ' + error.message);
      return;
    }
    setRegisteredIds((prev) => new Set(prev).add(eventId));
    toast.success("You're registered! See you there.");
  };

  const unregister = async (eventId: string) => {
    if (!supabase || !user) return;
    setPendingId(eventId);
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);
    setPendingId(null);
    if (error) {
      toast.error('Failed to cancel registration: ' + error.message);
      return;
    }
    setRegisteredIds((prev) => {
      const next = new Set(prev);
      next.delete(eventId);
      return next;
    });
    toast.success('Registration cancelled.');
  };

  return { registeredIds, register, unregister, pendingId, loading, refresh };
}
