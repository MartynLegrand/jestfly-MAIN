export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  parent_id?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  stock_quantity: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  featured_image?: string;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  is_active: boolean;
  is_digital: boolean;
  download_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  product_id: string;
  quantity: number;
  price_snapshot: number;
  created_at: string;
  updated_at: string;
  product?: StoreProduct;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface StoreOrder {
  id: string;
  order_number: string;
  user_id?: string;
  email: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_intent_id?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shipping_address?: Address;
  billing_address?: Address;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  sku?: string;
  featured_image?: string;
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  is_digital: boolean;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  parent_id?: string;
  is_active: boolean;
}

export interface CheckoutData {
  email: string;
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  customer_notes?: string;
}
