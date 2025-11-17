import { useState, useEffect, useCallback } from 'react';

export type PreviewContext = 'marketplace' | 'hero' | 'banner' | 'stream';

export interface NFTCardStudioState {
  title: string;
  collection: string;
  year: string;
  gradientFrom: string;
  gradientTo: string;
  rotation: number;
  selectedPreset: string;
  imageUrl?: string;
  description: string;
  price: string;
  supply: string;
  previewContext: PreviewContext;
  targets: string[];
}

const DEFAULT_STATE: NFTCardStudioState = {
  title: 'CRYSTAL',
  collection: 'JESTFLY Premium',
  year: '2025',
  gradientFrom: '#ff3697',
  gradientTo: '#ff7b42',
  rotation: 0,
  selectedPreset: '1',
  imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
  description: 'Exclusive NFT card from the JESTFLY Premium collection. Limited edition with unique holographic effects.',
  price: '250',
  supply: '100',
  previewContext: 'marketplace',
  targets: ['marketplace', 'hero'],
};

const STORAGE_KEY = 'jestfly:nft-card-studio:last-draft';

function safeParse(json: string | null): NFTCardStudioState | null {
  if (!json) return null;
  
  try {
    const parsed = JSON.parse(json);
    // Validate that it has the expected structure
    if (
      typeof parsed === 'object' &&
      typeof parsed.title === 'string' &&
      typeof parsed.collection === 'string'
    ) {
      return { ...DEFAULT_STATE, ...parsed };
    }
    return null;
  } catch {
    return null;
  }
}

export function useNFTCardStudio() {
  const [state, setState] = useState<NFTCardStudioState>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = safeParse(stored);
      if (parsed) return parsed;
    }
    return DEFAULT_STATE;
  });

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save draft to localStorage:', error);
      }
    }
  }, [state]);

  const updateField = useCallback(
    <K extends keyof NFTCardStudioState>(
      field: K,
      value: NFTCardStudioState[K]
    ) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    state,
    setState,
    updateField,
    reset,
  };
}
