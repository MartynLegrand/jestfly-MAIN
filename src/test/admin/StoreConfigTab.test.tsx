/**
 * Smoke Tests for StoreConfigTab
 * Tests store configuration toggle functionality and data loading
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import StoreConfigTab from '@/components/admin/sections/StoreConfigTab';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              section: 'store',
              config: JSON.stringify({
                title: 'Store',
                description: 'Browse our collection',
                showCategories: true,
                showFilters: true,
                itemsPerPage: 12,
                enableCart: true,
                enableWishlist: true
              })
            },
            error: null
          }))
        }))
      })),
      upsert: vi.fn(() => Promise.resolve({ error: null }))
    }))
  }
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('StoreConfigTab - Smoke Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<StoreConfigTab />);
    expect(screen.getByText('Store Configuration')).toBeInTheDocument();
  });

  it('should display store configuration toggles', async () => {
    render(<StoreConfigTab />);
    
    await waitFor(() => {
      expect(screen.getByText('Show Categories')).toBeInTheDocument();
      expect(screen.getByText('Show Filters')).toBeInTheDocument();
      expect(screen.getByText('Enable Cart')).toBeInTheDocument();
      expect(screen.getByText('Enable Wishlist')).toBeInTheDocument();
    });
  });

  it('should load configuration from Supabase on mount', async () => {
    render(<StoreConfigTab />);
    
    await waitFor(() => {
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      expect(titleInput.value).toBe('Store');
    });
  });

  it('should have save and reset buttons', async () => {
    render(<StoreConfigTab />);
    
    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
  });

  it('should render all toggle switches', async () => {
    render(<StoreConfigTab />);
    
    await waitFor(() => {
      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThanOrEqual(4); // At least 4 toggles
    });
  });
});
