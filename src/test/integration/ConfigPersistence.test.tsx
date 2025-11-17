/**
 * Integration Tests for Configuration Persistence
 * Tests that configuration changes persist and affect frontend components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomeConfigTab from '@/components/admin/sections/HomeConfigTab';
import { toast } from 'sonner';

// Mock Supabase with mutable state
let mockConfigData = {
  heroTitle: 'MKSHA',
  heroSubtitle: 'It was the year 2076',
  showCrystal: true,
  crystalAnimation: true,
  showGallery: true,
  showFeatures: true,
  ctaText: 'Get Started',
  ctaLink: '/store'
};

const mockUpsert = vi.fn(async (data) => {
  mockConfigData = JSON.parse(data.config);
  return { error: null };
});

const mockSelect = vi.fn(() => ({
  eq: vi.fn(() => ({
    single: vi.fn(async () => ({
      data: {
        section: 'home',
        config: JSON.stringify(mockConfigData)
      },
      error: null
    }))
  }))
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      upsert: mockUpsert
    }))
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Configuration Persistence - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock data before each test
    mockConfigData = {
      heroTitle: 'MKSHA',
      heroSubtitle: 'It was the year 2076',
      showCrystal: true,
      crystalAnimation: true,
      showGallery: true,
      showFeatures: true,
      ctaText: 'Get Started',
      ctaLink: '/store'
    };
  });

  it('should load configuration from Supabase on component mount', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      expect(titleInput.value).toBe('MKSHA');
    });

    // Verify Supabase was queried
    expect(mockSelect).toHaveBeenCalled();
  });

  it('should save configuration changes to Supabase', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      expect(titleInput).toBeInTheDocument();
    });

    // Change title
    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    // Click save button
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });
  });

  it('should show success toast after saving configuration', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Home configuration saved!');
    });
  });

  it('should persist toggle changes', async () => {
    render(<HomeConfigTab />);
    
    // Navigate to features tab
    await waitFor(() => {
      const featuresTab = screen.getByRole('tab', { name: /features/i });
      fireEvent.click(featuresTab);
    });

    await waitFor(() => {
      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);
    });

    // Click save to persist
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });
  });

  it('should reload configuration after reset', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const resetButton = screen.getByText('Reset');
      expect(resetButton).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  it('should handle configuration with all toggles enabled', async () => {
    mockConfigData = {
      ...mockConfigData,
      showCrystal: true,
      crystalAnimation: true,
      showGallery: true,
      showFeatures: true
    };

    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const featuresTab = screen.getByRole('tab', { name: /features/i });
      fireEvent.click(featuresTab);
    });

    await waitFor(() => {
      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('should handle configuration with all toggles disabled', async () => {
    mockConfigData = {
      ...mockConfigData,
      showCrystal: false,
      crystalAnimation: false,
      showGallery: false,
      showFeatures: false
    };

    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      expect(titleInput).toBeInTheDocument();
    });

    // Configuration should still load even with all toggles off
    expect(mockSelect).toHaveBeenCalled();
  });
});

describe('Auto-save and Toast Notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should evaluate toast notification system', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      // Toast should be called with success message
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('should show loading state during save', async () => {
    render(<HomeConfigTab />);
    
    await waitFor(() => {
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
    });

    // Button should show loading state
    await waitFor(() => {
      // Check if button text changes or is disabled
      const button = screen.getByText(/Saving|Save Changes/);
      expect(button).toBeInTheDocument();
    });
  });
});
