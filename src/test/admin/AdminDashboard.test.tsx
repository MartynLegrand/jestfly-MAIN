/**
 * Integration Tests for AdminDashboard
 * Tests navigation, tab switching, and overall dashboard functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '@/pages/AdminDashboard';

// Mock all admin section components
vi.mock('@/components/admin/sections/HomeConfigTab', () => ({
  default: () => <div>HomeConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/StoreConfigTab', () => ({
  default: () => <div>StoreConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/CommunityConfigTab', () => ({
  default: () => <div>CommunityConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/BookingsConfigTab', () => ({
  default: () => <div>BookingsConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/ResourcesConfigTab', () => ({
  default: () => <div>ResourcesConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/NotesConfigTab', () => ({
  default: () => <div>NotesConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/DemoConfigTab', () => ({
  default: () => <div>DemoConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/PressKitConfigTab', () => ({
  default: () => <div>PressKitConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/ProfileConfigTab', () => ({
  default: () => <div>ProfileConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/LiveStreamConfigTab', () => ({
  default: () => <div>LiveStreamConfigTab Mock</div>
}));

vi.mock('@/components/admin/sections/AirdropConfigTab', () => ({
  default: () => <div>AirdropConfigTab Mock</div>
}));

vi.mock('@/components/admin/NFTGeneratorTab', () => ({
  default: () => <div>NFTGeneratorTab Mock</div>
}));

vi.mock('@/components/admin/ColorsTab', () => ({
  default: () => <div>ColorsTab Mock</div>
}));

vi.mock('@/components/admin/FontsTab', () => ({
  default: () => <div>FontsTab Mock</div>
}));

vi.mock('@/components/admin/ModelTab', () => ({
  default: () => <div>ModelTab Mock</div>
}));

vi.mock('@/components/admin/MaterialTab', () => ({
  default: () => <div>MaterialTab Mock</div>
}));

vi.mock('@/components/admin/LayoutTab', () => ({
  default: () => <div>LayoutTab Mock</div>
}));

vi.mock('@/components/admin/ElementsTab', () => ({
  default: () => <div>ElementsTab Mock</div>
}));

vi.mock('@/components/admin/SettingsTab', () => ({
  default: () => <div>SettingsTab Mock</div>
}));

describe('AdminDashboard - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the admin dashboard', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('should display platform overview by default', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('Platform Overview')).toBeInTheDocument();
  });

  it('should render all page section tabs in sidebar', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Store')).toBeInTheDocument();
    expect(screen.getByText('NFT Store')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Demo Submission')).toBeInTheDocument();
    expect(screen.getByText('Press Kit')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Live Stream')).toBeInTheDocument();
    expect(screen.getByText('Airdrop')).toBeInTheDocument();
  });

  it('should render design section tabs in sidebar', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Fonts')).toBeInTheDocument();
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Elements')).toBeInTheDocument();
    expect(screen.getByText('3D Models')).toBeInTheDocument();
    expect(screen.getByText('Materials')).toBeInTheDocument();
  });

  it('should render system section tabs', () => {
    render(<AdminDashboard />);
    
    const settingsTabs = screen.getAllByText('Settings');
    expect(settingsTabs.length).toBeGreaterThanOrEqual(1);
  });

  it('should switch to home config tab when clicked', async () => {
    render(<AdminDashboard />);
    
    const homeTabs = screen.getAllByText('Home');
    fireEvent.click(homeTabs[0]);
    
    await waitFor(() => {
      expect(screen.getByText('HomeConfigTab Mock')).toBeInTheDocument();
    });
  });

  it('should switch to store config tab when clicked', async () => {
    render(<AdminDashboard />);
    
    const storeTabs = screen.getAllByText('Store');
    fireEvent.click(storeTabs[0]);
    
    await waitFor(() => {
      expect(screen.getByText('StoreConfigTab Mock')).toBeInTheDocument();
    });
  });

  it('should display dashboard overview cards', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Quick access to all configuration sections')).toBeInTheDocument();
    expect(screen.getByText('Design & Appearance')).toBeInTheDocument();
  });

  it('should have clickable overview cards', () => {
    render(<AdminDashboard />);
    
    // Check for card descriptions
    expect(screen.getByText('Configure homepage')).toBeInTheDocument();
    expect(screen.getByText('Manage store settings')).toBeInTheDocument();
    expect(screen.getByText('NFT marketplace')).toBeInTheDocument();
  });
});
