import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types/database';

export async function getProducts(limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, artisan:users!artisan_id(*)')
    .eq('id', id)
    .single();
  
  return { data, error };
}

export async function getProductsByCategory(category: string, limit = 20) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .limit(limit)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    .limit(50);
  
  return { data, error };
}

export async function getFeaturedProducts(limit = 8) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gte('rating', 4.5)
    .limit(limit)
    .order('review_count', { ascending: false });
  
  return { data, error };
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'rating' | 'review_count'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  
  return { data, error };
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  return { error };
}
