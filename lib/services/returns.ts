import { supabase } from '@/lib/supabase';

export interface Return {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  refund_amount: number;
  created_at: string;
  updated_at: string;
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export async function createReturn(returnData: {
  order_id: string;
  user_id: string;
  reason: string;
  description?: string;
  items: Return['items'];
  refund_amount: number;
}) {
  const { data, error } = await supabase
    .from('returns')
    .insert([{
      ...returnData,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Return;
}

export async function getReturns(userId: string) {
  const { data, error } = await supabase
    .from('returns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Return[];
}

export async function getReturnById(returnId: string) {
  const { data, error } = await supabase
    .from('returns')
    .select('*')
    .eq('id', returnId)
    .single();

  if (error) throw error;
  return data as Return;
}

export async function updateReturnStatus(
  returnId: string,
  status: Return['status']
) {
  const { data, error } = await supabase
    .from('returns')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', returnId)
    .select()
    .single();

  if (error) throw error;
  return data as Return;
}

export function getStatusText(status: Return['status']): string {
  const statusMap = {
    pending: 'Beklemede',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
    completed: 'Tamamlandı',
  };
  return statusMap[status];
}

export function getReasonText(reason: string): string {
  const reasonMap: Record<string, string> = {
    defective: 'Kusurlu Ürün',
    wrong_item: 'Yanlış Ürün',
    not_as_described: 'Açıklamaya Uygun Değil',
    changed_mind: 'Fikrim Değişti',
    other: 'Diğer',
  };
  return reasonMap[reason] || reason;
}
