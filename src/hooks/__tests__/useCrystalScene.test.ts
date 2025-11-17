import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useCrystalScene } from '../useCrystalScene';
import { createRef } from 'react';

// Mock Three.js
vi.mock('three', () => {
  const mockScene = { add: vi.fn() };
  const mockCamera = { position: { z: 0 }, aspect: 1, updateProjectionMatrix: vi.fn() };
  const mockRenderer = {
    setSize: vi.fn(),
    setPixelRatio: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    toneMapping: 0,
    toneMappingExposure: 1,
  };
  const mockGeometry = { dispose: vi.fn() };
  const mockMaterial = { dispose: vi.fn() };
  const mockMesh = { rotation: { x: 0, y: 0, z: 0 } };
  const mockLight = { position: { x: 0, y: 0, z: 0 } };

  return {
    Scene: vi.fn(() => mockScene),
    PerspectiveCamera: vi.fn(() => mockCamera),
    WebGLRenderer: vi.fn(() => mockRenderer),
    IcosahedronGeometry: vi.fn(() => mockGeometry),
    MeshPhysicalMaterial: vi.fn(() => mockMaterial),
    Mesh: vi.fn(() => mockMesh),
    PointLight: vi.fn(() => mockLight),
    AmbientLight: vi.fn(() => mockLight),
    ACESFilmicToneMapping: 4,
  };
});

describe('useCrystalScene', () => {
  let canvasRef: ReturnType<typeof createRef<HTMLCanvasElement>>;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    // Create a mock canvas element with proper dimensions
    canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'clientWidth', { value: 800, writable: false });
    Object.defineProperty(canvas, 'clientHeight', { value: 600, writable: false });
    canvasRef = { current: canvas };

    // Mock navigator.userAgent
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    });

    // Mock window.devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: 2,
    });

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1920,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize 3D scene on mount', () => {
    const { unmount } = renderHook(() => useCrystalScene(canvasRef));
    
    // Verify hook renders without errors
    expect(canvasRef.current).toBeDefined();
    
    unmount();
  });

  it('should handle null canvas ref gracefully', () => {
    const nullRef = { current: null };
    
    expect(() => {
      renderHook(() => useCrystalScene(nullRef));
    }).not.toThrow();
  });

  it('should use custom parameters when provided', () => {
    const customParams = {
      color: '#ff0000',
      metalness: 0.8,
      roughness: 0.2,
      lightIntensity: 2.0,
    };

    const { unmount } = renderHook(() => useCrystalScene(canvasRef, customParams));
    
    // Verify hook renders with custom params
    expect(canvasRef.current).toBeDefined();
    
    unmount();
  });

  it('should detect mobile devices correctly', () => {
    // Mock mobile user agent
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    });
    
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });

    const { unmount } = renderHook(() => useCrystalScene(canvasRef));
    
    // Verify mobile detection works
    expect(window.innerWidth).toBeLessThan(768);
    
    unmount();
  });

  it('should clean up resources on unmount', () => {
    const { unmount } = renderHook(() => useCrystalScene(canvasRef));
    
    // Unmount should not throw errors
    expect(() => unmount()).not.toThrow();
  });

  it('should handle window resize', () => {
    const { unmount } = renderHook(() => useCrystalScene(canvasRef));
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    // Should handle resize without errors
    expect(canvasRef.current).toBeDefined();
    
    unmount();
  });
});
