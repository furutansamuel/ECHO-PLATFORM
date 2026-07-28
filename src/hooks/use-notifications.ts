import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

// Mirrors public.notifications (see
// supabase/migrations/20260115120200_create_notifications.sql):
// id, user_id, title, message, type (CHECK'd to these 5 values),
// report_id, is_read, created_at.
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'report' | 'ai' | 'alert' | 'event' | 'reward';
  report_id: string | null;
  is_read: boolean;
  created_at: string;
}

/** Real notifications from public.notifications for the signed-in user,
 * with mark-read / mark-all-read / delete actions that write straight to
 * the table (RLS: a user can only touch their own rows). Previously this
 * file accidentally contained a duplicate copy of NotificationsPage.tsx
 * instead of this hook, so `useNotifications`/`Notification` didn't
 * actually exist. */
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
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && data) {
      setNotifications(data as Notification[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const markAsRead = async (id: string) => {
    if (!supabase || !user) return;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id).eq('user_id', user.id);
  };

  const markAllAsRead = async () => {
    if (!supabase || !user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
  };

  const deleteNotification = async (id: string) => {
    if (!supabase || !user) return;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from('notifications').delete().eq('id', id).eq('user_id', user.id);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification };
}
