import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HeroConfig, HeroConfigFormData } from '@/types/home';
import { toast } from 'sonner';

export const useHeroConfig = () => {
  const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchHeroConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setHeroConfig(data);
    } catch (error: any) {
      console.error('Error fetching hero config:', error);
      toast.error('Failed to load hero configuration');
    } finally {
      setLoading(false);
    }
  };

  const updateHeroConfig = async (updates: Partial<HeroConfigFormData>) => {
    if (!heroConfig) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('hero_config')
        .update(updates)
        .eq('id', heroConfig.id);

      if (error) throw error;

      await fetchHeroConfig();
      toast.success('Hero configuration updated!');
    } catch (error: any) {
      console.error('Error updating hero config:', error);
      toast.error('Failed to update hero configuration');
    } finally {
      setSaving(false);
    }
  };

  const uploadHeroMedia = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const timestamp = new Date().getTime();
      const fileName = 'hero-' + timestamp + '.' + fileExt;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('hero-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('hero-media')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
      return null;
    }
  };

  useEffect(() => {
    fetchHeroConfig();
  }, []);

  return {
    heroConfig,
    loading,
    saving,
    updateHeroConfig,
    uploadHeroMedia,
    refetch: fetchHeroConfig,
  };
};
