import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'order' | 'message' | 'review' | 'product';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export async function getNotifications(userId: string, unreadOnly = false) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Notification[];
}

export async function markAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
}

export async function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  link?: string
) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        type,
        title,
        message,
        link,
        read: false
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
  return count || 0;
}
