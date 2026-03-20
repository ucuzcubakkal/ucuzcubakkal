export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'artisan' | 'admin';
  profile_image?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  artisan_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  customizable: boolean;
  tags: string[];
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  product_count: number;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  customization_notes?: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed';
  shipping_address: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization_notes?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  product_id?: string;
  message: string;
  read: boolean;
  created_at: string;
}
