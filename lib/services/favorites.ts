import { supabase } from '@/lib/supabase';

export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      products (
        *,
        artisans (name)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addToFavorites(userId: string, productId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([
      { user_id: userId, product_id: productId }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromFavorites(userId: string, productId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}

export async function isFavorite(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

export async function toggleFavorite(userId: string, productId: string) {
  const favorite = await isFavorite(userId, productId);
  
  if (favorite) {
    await removeFromFavorites(userId, productId);
    return false;
  } else {
    await addToFavorites(userId, productId);
    return true;
  }
}
