import { supabase } from '@/lib/supabase';

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase?: number;
  max_discount?: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
}

export async function validateCoupon(code: string, orderTotal: number) {
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !coupon) {
    throw new Error('Geçersiz kupon kodu');
  }

  const now = new Date();
  const validFrom = new Date(coupon.valid_from);
  const validUntil = new Date(coupon.valid_until);

  if (now < validFrom || now > validUntil) {
    throw new Error('Kupon süresi dolmuş');
  }

  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    throw new Error('Kupon kullanım limiti doldu');
  }

  if (coupon.min_purchase && orderTotal < coupon.min_purchase) {
    throw new Error(`Minimum ${coupon.min_purchase}π alışveriş gereklidir`);
  }

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = orderTotal * (coupon.discount_value / 100);
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else {
    discount = coupon.discount_value;
  }

  return {
    coupon,
    discount: Math.min(discount, orderTotal),
  };
}

export async function applyCoupon(couponId: string) {
  const { error } = await supabase
    .from('coupons')
    .update({ used_count: supabase.raw('used_count + 1') })
    .eq('id', couponId);

  if (error) throw error;
}

export async function getActiveCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .gte('valid_until', new Date().toISOString())
    .order('discount_value', { ascending: false });

  if (error) throw error;
  return data as Coupon[];
}
