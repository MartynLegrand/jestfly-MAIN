import { supabase } from '@/integrations/supabase/client';

export type NFTStudioTarget = 'marketplace' | 'hero' | 'banner' | 'stream';

export interface NFTCardTemplateInput {
  title: string;
  collection: string;
  year: string;
  gradientFrom: string;
  gradientTo: string;
  rotation: number;
  imageUrl?: string;
  description: string;
  price: string;
  supply: string;
  targets: string[];
}

export interface NFTStudioActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fallback?: 'local';
}

interface LocalStorageTemplate {
  id: string;
  template: NFTCardTemplateInput;
  timestamp: number;
}

const LOCAL_STORAGE_KEY = 'jestfly:nft-card-templates';
const MAX_LOCAL_TEMPLATES = 25;

/**
 * Persist template locally when Supabase is unavailable
 */
function persistLocally(template: NFTCardTemplateInput): LocalStorageTemplate {
  const localTemplate: LocalStorageTemplate = {
    id: crypto.randomUUID(),
    template,
    timestamp: Date.now(),
  };

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const templates: LocalStorageTemplate[] = stored ? JSON.parse(stored) : [];
    
    // Add new template and keep only last 25
    templates.unshift(localTemplate);
    const trimmed = templates.slice(0, MAX_LOCAL_TEMPLATES);
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.warn('Failed to persist template locally:', error);
  }

  return localTemplate;
}

/**
 * Safe Supabase insert with local fallback
 */
async function safeSupabaseInsert<T = unknown>(
  table: string,
  payload: Record<string, unknown>
): Promise<NFTStudioActionResult<T>> {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn(`Supabase insert failed for ${table}:`, error);
      const localData = persistLocally(payload as NFTCardTemplateInput);
      return {
        success: true,
        fallback: 'local',
        data: localData as T,
      };
    }

    return { success: true, data: data as T };
  } catch (error) {
    console.warn(`Network error inserting into ${table}:`, error);
    const localData = persistLocally(payload as NFTCardTemplateInput);
    return {
      success: true,
      fallback: 'local',
      data: localData as T,
    };
  }
}

/**
 * Save NFT card template
 */
export async function saveNFTCardTemplate(
  template: NFTCardTemplateInput
): Promise<NFTStudioActionResult> {
  const payload = {
    title: template.title,
    collection: template.collection,
    year: template.year,
    gradient_from: template.gradientFrom,
    gradient_to: template.gradientTo,
    rotation: template.rotation,
    image_url: template.imageUrl,
    description: template.description,
    price: parseFloat(template.price) || 0,
    supply: parseInt(template.supply) || 0,
    targets: template.targets,
    created_at: new Date().toISOString(),
  };

  return safeSupabaseInsert('nft_card_templates', payload);
}

/**
 * Queue marketplace product creation
 */
export async function queueMarketplaceProduct(
  template: NFTCardTemplateInput
): Promise<NFTStudioActionResult> {
  const payload = {
    title: template.title,
    description: template.description,
    price: parseFloat(template.price) || 0,
    supply: parseInt(template.supply) || 0,
    image_url: template.imageUrl,
    template_data: {
      collection: template.collection,
      year: template.year,
      gradientFrom: template.gradientFrom,
      gradientTo: template.gradientTo,
      rotation: template.rotation,
    },
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  return safeSupabaseInsert('nft_marketplace_drafts', payload);
}

/**
 * Queue hero/onboarding assignment
 */
export async function queueHeroAssignment(
  template: NFTCardTemplateInput
): Promise<NFTStudioActionResult> {
  const payload = {
    card_title: template.title,
    card_data: {
      collection: template.collection,
      year: template.year,
      gradientFrom: template.gradientFrom,
      gradientTo: template.gradientTo,
      rotation: template.rotation,
      imageUrl: template.imageUrl,
    },
    active: false,
    priority: 0,
    created_at: new Date().toISOString(),
  };

  return safeSupabaseInsert('hero_nft_assignments', payload);
}

/**
 * Queue banner generation
 */
export async function queueBannerGeneration(
  template: NFTCardTemplateInput
): Promise<NFTStudioActionResult> {
  const payload = {
    title: template.title,
    card_data: {
      collection: template.collection,
      year: template.year,
      gradientFrom: template.gradientFrom,
      gradientTo: template.gradientTo,
      rotation: template.rotation,
      imageUrl: template.imageUrl,
      description: template.description,
    },
    status: 'pending',
    banner_type: 'nft_card',
    created_at: new Date().toISOString(),
  };

  return safeSupabaseInsert('marketing_banners_queue', payload);
}

/**
 * Get locally stored templates
 */
export function getLocalTemplates(): LocalStorageTemplate[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
