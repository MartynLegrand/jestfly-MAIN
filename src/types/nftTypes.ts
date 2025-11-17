export type ProductType = 'digital' | 'physical' | 'hybrid';
export type ProductRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'jestcoin' | 'money' | 'hybrid';
export type DeliveryStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface NFTCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface NFTProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_id?: string;
  product_type: ProductType;
  price_jestcoin: number;
  price_money: number;
  payment_methods: PaymentMethod;
  image_url?: string;
  images: string[];
  video_url?: string;
  model_3d_url?: string;
  metadata: Record<string, any>;
  attributes: Record<string, any>;
  rarity: ProductRarity;
  stock_quantity: number;
  unlimited_stock: boolean;
  max_per_user: number;
  is_limited_edition: boolean;
  edition_size?: number;
  edition_number?: number;
  is_active: boolean;
  is_featured: boolean;
  featured_order: number;
  tags: string[];
  total_sold: number;
  views_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  category?: NFTCategory;
}

export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface UserNFTInventory {
  id: string;
  user_id: string;
  product_id: string;
  purchase_price_jestcoin: number;
  purchase_price_money: number;
  payment_method: PaymentMethod;
  token_id?: string;
  certificate_url?: string;
  qr_code?: string;
  is_redeemed: boolean;
  redeemed_at?: string;
  is_showcased: boolean;
  showcase_order: number;
  acquired_at: string;
  product?: NFTProduct;
}

export interface ProductTransaction {
  id: string;
  user_id: string;
  product_id?: string;
  inventory_id?: string;
  transaction_type: string;
  amount_jestcoin: number;
  amount_money: number;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  error_message?: string;
  payment_intent_id?: string;
  payment_gateway?: string;
  metadata: Record<string, any>;
  created_at: string;
  completed_at?: string;
  product?: NFTProduct;
}

export interface PhysicalItem {
  id: string;
  inventory_id: string;
  recipient_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  tracking_number?: string;
  carrier?: string;
  status: DeliveryStatus;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  price_alert_jestcoin?: number;
  price_alert_money?: number;
  notify_on_availability: boolean;
  added_at: string;
  product?: NFTProduct;
}

export interface ShoppingCart {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_payment_method?: PaymentMethod;
  added_at: string;
  updated_at: string;
  product?: NFTProduct;
}

export interface RewardsMission {
  id: string;
  title: string;
  description?: string;
  mission_type: string;
  reward_amount: number;
  requirements: Record<string, any>;
  is_daily: boolean;
  is_active: boolean;
  max_completions?: number;
  created_at: string;
  updated_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  mission_id: string;
  reward_amount: number;
  completed_at: string;
  mission?: RewardsMission;
}

export interface NFTProductFilters {
  category?: string;
  product_type?: ProductType;
  payment_method?: PaymentMethod;
  rarity?: ProductRarity;
  min_price_jestcoin?: number;
  max_price_jestcoin?: number;
  min_price_money?: number;
  max_price_money?: number;
  tags?: string[];
  search?: string;
  is_featured?: boolean;
  in_stock?: boolean;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'name';
}

export interface CreateNFTProductInput {
  name: string;
  slug: string;
  description?: string;
  category_id?: string;
  product_type: ProductType;
  price_jestcoin: number;
  price_money: number;
  payment_methods: PaymentMethod;
  image_url?: string;
  images?: string[];
  video_url?: string;
  model_3d_url?: string;
  metadata?: Record<string, any>;
  attributes?: Record<string, any>;
  rarity?: ProductRarity;
  stock_quantity?: number;
  unlimited_stock?: boolean;
  max_per_user?: number;
  is_limited_edition?: boolean;
  edition_size?: number;
  tags?: string[];
}

export interface PurchaseNFTInput {
  product_id: string;
  quantity: number;
  payment_method: PaymentMethod;
  shipping_address?: {
    recipient_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  };
}

export interface NFTStoreStats {
  total_products: number;
  total_sales: number;
  total_revenue_jestcoin: number;
  total_revenue_money: number;
  active_users: number;
  trending_products: NFTProduct[];
  recent_transactions: ProductTransaction[];
}