import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Diamond } from 'lucide-react';

type LogoType = 'video' | '3d' | 'icon';

interface LogoMediaProps {
  type?: LogoType;
  videoSrc?: string;
  modelSrc?: string;
}

const LogoMedia: React.FC<LogoMediaProps> = ({
  type = '3d',
  videoSrc = '/assets/videos/oculos2.mp4',
  modelSrc = '/models/logo-3d.glb'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (type === 'video') {
      const video = videoRef.current;
      if (video) {
        video.addEventListener('loadeddata', () => setMediaLoaded(true));
        video.addEventListener('error', () => {
          setMediaError(true);
          console.warn('Video failed to load');
        });
      }
    } else if (type === '3d') {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });

      const size = window.innerWidth < 640 ? 40 : window.innerWidth < 768 ? 50 : 60;
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const spotLight = new THREE.SpotLight(0x8B5CF6, 2);
      spotLight.position.set(5, 5, 5);
      scene.add(spotLight);

      const rimLight = new THREE.PointLight(0x06B6D4, 1.5);
      rimLight.position.set(-3, 2, -3);
      scene.add(rimLight);

      let model: THREE.Object3D | null = null;
      let animationId: number;

      const loader = new GLTFLoader();
      loader.load(
        modelSrc,
        (gltf) => {
          model = gltf.scene;
          model.scale.set(1.5, 1.5, 1.5);

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (mesh.material) {
                const material = mesh.material as THREE.MeshStandardMaterial;
                material.metalness = 0.9;
                material.roughness = 0.1;
                material.envMapIntensity = 1.5;
              }
            }
          });

          scene.add(model);
          setMediaLoaded(true);
        },
        undefined,
        (error) => {
          console.warn('Logo 3D não carregado, usando fallback:', error);
          setMediaError(true);

          const fallbackGeometry = new THREE.IcosahedronGeometry(1.5, 1);
          const fallbackMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8B5CF6,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.9,
            envMapIntensity: 1.5
          });
          model = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
          scene.add(model);
          setMediaLoaded(true);
        }
      );

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        if (model) {
          if (isHovered) {
            model.rotation.y += 0.05;
            model.rotation.x += 0.02;
          } else {
            model.rotation.y += 0.01;
          }
        }

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        const newSize = window.innerWidth < 640 ? 40 : window.innerWidth < 768 ? 50 : 60;
        renderer.setSize(newSize, newSize);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        scene.clear();
      };
    }
  }, [type, isHovered, videoSrc, modelSrc]);

  const renderLogo = () => {
    if (mediaError || type === 'icon') {
      return (
        <Diamond className="h-8 w-8 sm:h-10 sm:w-10 text-white glow-purple animate-pulse-glow" />
      );
    }

    if (type === 'video') {
      return (
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden">
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              filter: isHovered ? 'brightness(1.2) saturate(1.5)' : 'brightness(1)',
              transition: 'filter 0.3s ease'
            }}
          />
          <div className="absolute inset-0 rounded-full border-2 border-primary-500/50" />
        </div>
      );
    }

    if (type === '3d') {
      return (
        <canvas
          ref={canvasRef}
          className="transition-all duration-300 ease-out"
          style={{
            filter: isHovered
              ? 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))'
              : 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))'
          }}
        />
      );
    }
  };

  return (
    <Link
      to="/"
      className="flex items-center relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderLogo()}

      <div
        className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ transform: 'scale(1.5)' }}
      />
    </Link>
  );
};

export default LogoMedia;
