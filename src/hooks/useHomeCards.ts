import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HomepageCard, CardFormData } from '@/types/home';
import { toast } from 'sonner';

export const useHomeCards = () => {
  const [cards, setCards] = useState<HomepageCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async (includeUnpublished = false) => {
    try {
      setLoading(true);
      let query = supabase
        .from('homepage_cards')
        .select('*')
        .order('order_index', { ascending: true });

      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      setCards(data || []);
    } catch (error: any) {
      console.error('Error fetching cards:', error);
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (cardData: CardFormData) => {
    try {
      const maxOrder = Math.max(...cards.map(card => card.order_index), 0);

      const { error } = await supabase
        .from('homepage_cards')
        .insert({
          ...cardData,
          order_index: maxOrder + 1,
        });

      if (error) throw error;

      await fetchCards(true);
      toast.success('Card created successfully!');
    } catch (error: any) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
    }
  };

  const updateCard = async (id: string, updates: Partial<CardFormData>) => {
    try {
      const { error } = await supabase
        .from('homepage_cards')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchCards(true);
      toast.success('Card updated successfully!');
    } catch (error: any) {
      console.error('Error updating card:', error);
      toast.error('Failed to update card');
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('homepage_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCards(true);
      toast.success('Card deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    }
  };

  const reorderCards = async (newOrder: { id: string; order_index: number }[]) => {
    try {
      for (const item of newOrder) {
        const { error } = await supabase
          .from('homepage_cards')
          .update({ order_index: item.order_index })
          .eq('id', item.id);

        if (error) throw error;
      }

      await fetchCards(true);
      toast.success('Card order updated!');
    } catch (error: any) {
      console.error('Error reordering cards:', error);
      toast.error('Failed to reorder cards');
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    loading,
    createCard,
    updateCard,
    deleteCard,
    reorderCards,
    refetch: fetchCards,
  };
};
