import { supabase } from '@/lib/supabase';
import type { CartItem } from '@/lib/types/database';

export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from('cart')
    .select('*, product:products(*)')
    .eq('user_id', userId);
  
  return { data, error };
}

export async function addToCart(userId: string, productId: string, quantity = 1, customizationNotes?: string) {
  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();
    return { data, error };
  }

  // Insert new item
  const { data, error } = await supabase
    .from('cart')
    .insert([{
      user_id: userId,
      product_id: productId,
      quantity,
      customization_notes: customizationNotes,
    }])
    .select()
    .single();
  
  return { data, error };
}

export async function updateCartItem(id: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

export async function removeFromCart(id: string) {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', id);
  
  return { error };
}

export async function clearCart(userId: string) {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId);
  
  return { error };
}
