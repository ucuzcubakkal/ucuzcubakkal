import { supabase } from '@/lib/supabase';

export interface ShippingStatus {
  id: string;
  order_id: string;
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered';
  tracking_number?: string;
  carrier?: string;
  estimated_delivery?: string;
  current_location?: string;
  updated_at: string;
  history: Array<{
    status: string;
    location?: string;
    timestamp: string;
    description: string;
  }>;
}

export async function getShippingStatus(orderId: string): Promise<ShippingStatus | null> {
  const { data, error } = await supabase
    .from('shipping_status')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as ShippingStatus;
}

export async function updateShippingStatus(
  orderId: string,
  status: ShippingStatus['status'],
  details: {
    tracking_number?: string;
    carrier?: string;
    location?: string;
    description: string;
  }
) {
  const currentStatus = await getShippingStatus(orderId);
  
  const historyEntry = {
    status,
    location: details.location,
    timestamp: new Date().toISOString(),
    description: details.description,
  };

  const history = currentStatus?.history || [];
  history.push(historyEntry);

  const updateData: any = {
    status,
    current_location: details.location,
    history,
    updated_at: new Date().toISOString(),
  };

  if (details.tracking_number) {
    updateData.tracking_number = details.tracking_number;
  }
  if (details.carrier) {
    updateData.carrier = details.carrier;
  }

  if (currentStatus) {
    const { error } = await supabase
      .from('shipping_status')
      .update(updateData)
      .eq('order_id', orderId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('shipping_status')
      .insert([{
        order_id: orderId,
        ...updateData,
      }]);

    if (error) throw error;
  }
}

export function getStatusText(status: ShippingStatus['status']): string {
  const statusMap = {
    preparing: 'Hazırlanıyor',
    shipped: 'Kargoya Verildi',
    in_transit: 'Yolda',
    delivered: 'Teslim Edildi',
  };
  return statusMap[status];
}
