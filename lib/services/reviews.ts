import { supabase } from '@/lib/supabase';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  artisan_id: string;
  rating: number;
  comment?: string;
  images?: string[];
  created_at: string;
  user_name?: string;
}

export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users (name)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(review => ({
    ...review,
    user_name: review.users?.name || 'Kullanıcı'
  })) as Review[];
}

export async function getArtisanReviews(artisanId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users (name),
      products (name)
    `)
    .eq('artisan_id', artisanId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createReview(review: {
  product_id: string;
  user_id: string;
  artisan_id: string;
  rating: number;
  comment?: string;
  images?: string[];
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single();

  if (error) throw error;
  
  await updateProductRating(review.product_id);
  await updateArtisanRating(review.artisan_id);
  
  return data as Review;
}

export async function updateProductRating(productId: string) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId);

  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await supabase
      .from('products')
      .update({
        rating: avgRating,
        review_count: reviews.length
      })
      .eq('id', productId);
  }
}

export async function updateArtisanRating(artisanId: string) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('artisan_id', artisanId);

  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await supabase
      .from('artisans')
      .update({
        rating: avgRating,
        review_count: reviews.length
      })
      .eq('id', artisanId);
  }
}

export async function hasUserReviewed(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}
