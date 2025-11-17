import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface Hero3DProps {
  modelId: string;
}

const Hero3D = ({ modelId }: Hero3DProps) => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="purple" metalness={0.8} roughness={0.2} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3D;
