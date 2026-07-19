import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'report' | 'ai' | 'alert' | 'event' | 'reward';
  report_id?: string;
  is_read: boolean;
  created_at: string;
}

/** Real per-user notifications from the `notifications` table. Replaces
 * every previous mock/hardcoded notification UI in the app. */
export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setLoading(false);
    if (!error && data) {
      setNotifications(data as Notification[]);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const markAsRead = async (id: string) => {
    if (!supabase) return;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllAsRead = async () => {
    if (!supabase || !user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
  };

  const deleteNotification = async (id: string) => {
    if (!supabase) return;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from('notifications').delete().eq('id', id);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, refresh };
}
