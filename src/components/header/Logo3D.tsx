import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Logo3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
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

    const size = window.innerWidth < 640 ? 40 : 60;
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
      '/models/logo-3d.glb',
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
      },
      undefined,
      (error) => {
        console.warn('Logo 3D não carregado, usando fallback:', error);
        setLoadError(true);

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
      const newSize = window.innerWidth < 640 ? 40 : 60;
      renderer.setSize(newSize, newSize);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.clear();
    };
  }, [isHovered]);

  return (
    <Link
      to="/"
      className="flex items-center relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="transition-all duration-300 ease-out"
        style={{
          filter: isHovered ? 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))' : 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))'
        }}
      />

      <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
};

export default Logo3D;
