export type MediaType = 'video' | '3d' | 'image';
export type ContentPosition = 'left' | 'center' | 'right';
export type CardType = 'social' | 'nft' | 'custom' | 'link';

export interface HeroConfig {
  id: string;
  media_type: MediaType;
  media_url?: string;
  model_id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta_text: string;
  cta_link: string;
  cta_style: {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'default' | 'lg';
  };
  overlay_opacity: number;
  content_position: ContentPosition;
  animation_settings: {
    autoplay?: boolean;
    loop?: boolean;
    speed?: number;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageCard {
  id: string;
  order_index: number;
  card_type: CardType;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  social_network?: string;
  nft_id?: string;
  visual_effects: {
    hover?: 'scale' | 'rotate' | 'glow' | 'none';
    animation?: 'fade-in' | 'slide-up' | 'zoom' | 'none';
  };
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroConfigFormData {
  media_type: MediaType;
  media_url?: string;
  model_id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta_text: string;
  cta_link: string;
  overlay_opacity: number;
  content_position: ContentPosition;
}

export interface CardFormData {
  card_type: CardType;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  social_network?: string;
  nft_id?: string;
  is_published: boolean;
}
