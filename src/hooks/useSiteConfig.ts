import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SiteConfig {
  [key: string]: any;
}

export const useSiteConfig = (section: string, defaultConfig: SiteConfig = {}) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('site_config')
          .select('config')
          .eq('section', section)
          .single();

        if (fetchError) {
          // If no config exists, use default
          if (fetchError.code === 'PGRST116') {
            setConfig(defaultConfig);
          } else {
            throw fetchError;
          }
        } else if (data) {
          const parsedConfig = typeof data.config === 'string' 
            ? JSON.parse(data.config) 
            : data.config;
          setConfig({ ...defaultConfig, ...parsedConfig });
        }
      } catch (err) {
        console.error(`Error loading config for section ${section}:`, err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setConfig(defaultConfig);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel(`site_config:${section}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_config',
          filter: `section=eq.${section}`,
        },
        (payload) => {
          if (payload.new && 'config' in payload.new) {
            const newConfig = typeof payload.new.config === 'string'
              ? JSON.parse(payload.new.config as string)
              : payload.new.config;
            setConfig({ ...defaultConfig, ...newConfig });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [section]);

  return { config, loading, error };
};

export default useSiteConfig;
