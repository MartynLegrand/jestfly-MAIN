import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/store';
import { toast } from 'sonner';

const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from('store_cart')
        .select('*, product:store_products(*)');

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setCartItems(data || []);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1, price: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const sessionId = !user ? getSessionId() : undefined;

      const existingItem = cartItems.find(item => item.product_id === productId);

      if (existingItem) {
        await updateCartQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        const { error } = await supabase
          .from('store_cart')
          .insert({
            user_id: user?.id,
            session_id: sessionId,
            product_id: productId,
            quantity,
            price_snapshot: price,
          });

        if (error) throw error;

        await fetchCart();
        toast.success('Added to cart!');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      const { error } = await supabase
        .from('store_cart')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;

      await fetchCart();
      toast.success('Cart updated!');
    } catch (error: any) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('store_cart')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      await fetchCart();
      toast.success('Removed from cart!');
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase.from('store_cart').delete();

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId);
      }

      const { error } = await query;

      if (error) throw error;

      await fetchCart();
      toast.success('Cart cleared!');
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price_snapshot * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cartItems,
    loading,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    refetch: fetchCart,
  };
};
