import { supabase } from '@/integrations/supabase/client';
import type { NFTProduct, NFTProductFilters, CreateNFTProductInput } from '@/types/nftTypes';

export const nftProductsService = {
  async getProducts(filters?: NFTProductFilters) {
    let query = supabase
      .from('nft_products')
      .select('*, category:nft_categories(*)')
      .eq('is_active', true);

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.product_type) {
      query = query.eq('product_type', filters.product_type);
    }

    if (filters?.payment_method) {
      query = query.eq('payment_methods', filters.payment_method);
    }

    if (filters?.rarity) {
      query = query.eq('rarity', filters.rarity);
    }

    if (filters?.min_price_jestcoin !== undefined) {
      query = query.gte('price_jestcoin', filters.min_price_jestcoin);
    }

    if (filters?.max_price_jestcoin !== undefined) {
      query = query.lte('price_jestcoin', filters.max_price_jestcoin);
    }

    if (filters?.min_price_money !== undefined) {
      query = query.gte('price_money', filters.min_price_money);
    }

    if (filters?.max_price_money !== undefined) {
      query = query.lte('price_money', filters.max_price_money);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    if (filters?.in_stock) {
      query = query.or('unlimited_stock.eq.true,stock_quantity.gt.0');
    }

    switch (filters?.sort_by) {
      case 'price_asc':
        query = query.order('price_jestcoin', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price_jestcoin', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('total_sold', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as NFTProduct[];
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('nft_products')
      .select('*, category:nft_categories(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data as NFTProduct | null;
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('nft_products')
      .select('*, category:nft_categories(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as NFTProduct | null;
  },

  async getFeaturedProducts(limit = 6) {
    const { data, error } = await supabase
      .from('nft_products')
      .select('*, category:nft_categories(*)')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as NFTProduct[];
  },

  async createProduct(input: CreateNFTProductInput) {
    const { data, error } = await supabase
      .from('nft_products')
      .insert({
        ...input,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as NFTProduct;
  },

  async updateProduct(id: string, updates: Partial<CreateNFTProductInput>) {
    const { data, error } = await supabase
      .from('nft_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as NFTProduct;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('nft_products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async incrementViews(id: string) {
    const { error } = await supabase.rpc('increment_product_views', { product_id: id });
    if (error) console.error('Error incrementing views:', error);
  },
};