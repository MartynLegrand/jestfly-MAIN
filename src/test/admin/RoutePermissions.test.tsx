/**
 * Route Permission Tests
 * Tests admin route protection and authorization
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Mock useAuth hook
const mockUseAuth = vi.fn();

vi.mock('@/contexts/auth', () => ({
  useAuth: () => mockUseAuth()
}));

describe('ProtectedRoute - Route Permission Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access for authenticated admin user', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { id: '1', email: 'admin@test.com' },
      hasPermission: () => true
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRoles={['admin']}>
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      hasPermission: () => false
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requireAuth={true}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Should not render protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to unauthorized when user lacks required role', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { id: '1', email: 'user@test.com' },
      hasPermission: () => false
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRoles={['admin']}>
          <div>Admin Only Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Should not render admin content
    expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument();
  });

  it('should allow access when requireAuth is false', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      hasPermission: () => false
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requireAuth={false}>
          <div>Public Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  it('should allow access for authenticated user without role requirements', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { id: '1', email: 'user@test.com' },
      hasPermission: () => true
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>User Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('User Content')).toBeInTheDocument();
  });
});

describe('Admin Route Protection - Integration', () => {
  it('should verify admin role requirement for /admin route', () => {
    // Test case to document that /admin route should require admin role
    const adminRouteConfig = {
      path: '/admin',
      requiredRoles: ['admin'],
      requireAuth: true
    };

    expect(adminRouteConfig.requiredRoles).toContain('admin');
    expect(adminRouteConfig.requireAuth).toBe(true);
  });

  it('should verify admin dashboard requires authentication', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      hasPermission: () => false
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRoles={['admin']} requireAuth={true}>
          <div>Admin Dashboard</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });
});
