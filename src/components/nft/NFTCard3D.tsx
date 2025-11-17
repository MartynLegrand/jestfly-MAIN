import { Canvas, useThree } from '@react-three/fiber';
import { PresentationControls, useTexture } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

interface NFTCard3DProps {
  title?: string;
  collection?: string;
  year?: string;
  gradientFrom?: string;
  gradientTo?: string;
  rotation?: number;
  imageUrl?: string;
  className?: string;
}

function Card3DScene({
  title = 'CRYSTAL',
  collection = 'JESTFLY Premium',
  year = '2025',
  gradientFrom = '#ff3697',
  gradientTo = '#ff7b42',
  rotation = 0,
  imageUrl,
}: Omit<NFTCard3DProps, 'className'>) {
  const { viewport } = useThree();
  const [cardTexture, setCardTexture] = useState<THREE.Texture | null>(null);
  const [overlayTexture, setOverlayTexture] = useState<THREE.Texture | null>(null);

  // Calculate scale based on viewport
  const scale = useMemo(() => {
    const baseScale = Math.min(viewport.width / 5, 1);
    return baseScale;
  }, [viewport.width]);

  // Generate card texture
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // White border (8px)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    // Gradient at bottom
    const gradient = ctx.createLinearGradient(0, canvas.height - 200, 0, canvas.height);
    gradient.addColorStop(0, gradientFrom + '00');
    gradient.addColorStop(1, gradientTo);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height - 200, canvas.width, 200);

    // Text rendering - Space Grotesk style (using system font as fallback)
    ctx.font = 'bold 64px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 120);

    ctx.font = '24px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(collection, canvas.width / 2, 160);

    ctx.font = '20px "Space Grotesk", sans-serif';
    ctx.fillText(year, canvas.width / 2, 190);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    setCardTexture(texture);
  }, [title, collection, year, gradientFrom, gradientTo]);

  // Load overlay image
  useEffect(() => {
    if (!imageUrl) {
      setOverlayTexture(null);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      imageUrl,
      (texture) => {
        setOverlayTexture(texture);
      },
      undefined,
      (error) => {
        console.warn('Failed to load overlay image:', error);
        setOverlayTexture(null);
      }
    );
  }, [imageUrl]);

  return (
    <PresentationControls
      global
      rotation={[(rotation * Math.PI) / 180, 0, 0]}
      polar={[-Math.PI / 4, Math.PI / 4]}
      azimuth={[-Math.PI / 4, Math.PI / 4]}
      config={{ mass: 2, tension: 400 }}
      snap={{ mass: 4, tension: 400 }}
    >
      <group scale={scale}>
        {/* Main card */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 4.5, 0.1]} />
          <meshStandardMaterial
            map={cardTexture}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Overlay image */}
        {overlayTexture && (
          <mesh position={[0, 0.5, 0.051]}>
            <planeGeometry args={[2.6, 2.6]} />
            <meshStandardMaterial
              map={overlayTexture}
              transparent
              opacity={0.92}
            />
          </mesh>
        )}

        {/* Holographic effect */}
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[3.05, 4.55]} />
          <meshPhysicalMaterial
            metalness={1}
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            transparent
            opacity={0.08}
            color="#ffffff"
          />
        </mesh>
      </group>
    </PresentationControls>
  );
}

export function NFTCard3D({
  className = '',
  ...props
}: NFTCard3DProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full text-white/60">
          Rendering preview…
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <Card3DScene {...props} />
      </Canvas>
    </div>
  );
}

export default NFTCard3D;
