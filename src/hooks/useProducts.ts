import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StoreProduct, ProductFormData } from '@/types/store';
import { toast } from 'sonner';

export const useProducts = (categoryId?: string, featured?: boolean) => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('store_products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (featured) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('store_products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      return null;
    }
  };

  const createProduct = async (productData: ProductFormData) => {
    try {
      const { error } = await supabase
        .from('store_products')
        .insert(productData);

      if (error) throw error;

      await fetchProducts();
      toast.success('Product created successfully!');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const updateProduct = async (id: string, updates: Partial<ProductFormData>) => {
    try {
      const { error } = await supabase
        .from('store_products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchProducts();
      toast.success('Product updated successfully!');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('store_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const uploadProductImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const timestamp = new Date().getTime();
      const fileName = 'product-' + timestamp + '.' + fileExt;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId, featured]);

  return {
    products,
    loading,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    refetch: fetchProducts,
  };
};
