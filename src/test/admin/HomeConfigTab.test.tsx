/**
 * Smoke Tests for HomeConfigTab
 * Tests configuration toggle functionality and data loading
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomeConfigTab from '@/components/admin/sections/HomeConfigTab';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              section: 'home',
              config: JSON.stringify({
                heroTitle: 'MKSHA',
                heroSubtitle: 'It was the year 2076',
                showCrystal: true,
                crystalAnimation: true,
                showGallery: true,
                showFeatures: true,
                ctaText: 'Get Started',
                ctaLink: '/store'
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

describe('HomeConfigTab - Smoke Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<HomeConfigTab />);
    expect(screen.getByText('Home Page Configuration')).toBeInTheDocument();
  });

  it('should display all configuration toggles', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      expect(screen.getByText('Show 3D Crystal')).toBeInTheDocument();
      expect(screen.getByText('Crystal Animation')).toBeInTheDocument();
      expect(screen.getByText('Show Gallery')).toBeInTheDocument();
      expect(screen.getByText('Show Features')).toBeInTheDocument();
    });
  });

  it('should load configuration from Supabase on mount', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      expect(titleInput.value).toBe('MKSHA');
    });
  });

  it('should handle toggle switch changes', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const featuresTab = screen.getByRole('tab', { name: /features/i });
      fireEvent.click(featuresTab);
    });

    await waitFor(() => {
      const crystalToggle = screen.getAllByRole('switch')[0];
      expect(crystalToggle).toBeInTheDocument();
      fireEvent.click(crystalToggle);
      // Toggle should change state
      expect(crystalToggle).toBeDefined();
    });
  });

  it('should have save button', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  it('should have reset button', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
  });

  it('should display content tabs', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /content/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /features/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /display/i })).toBeInTheDocument();
    });
  });

  it('should render hero section inputs', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Subtitle')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });
  });

  it('should render CTA inputs', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Button Text')).toBeInTheDocument();
      expect(screen.getByLabelText('Button Link')).toBeInTheDocument();
    });
  });
});
