import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NFTModelProps {
  modelType: string;
}

const NFTModel: React.FC<NFTModelProps> = ({ modelType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const greenLight = new THREE.PointLight(0x4ade80, 0.8, 10);
    greenLight.position.set(2, 1, -1);
    scene.add(greenLight);

    const purpleLight = new THREE.PointLight(0x8B5CF6, 0.8, 10);
    purpleLight.position.set(-2, -1, 1);
    scene.add(purpleLight);

    let geometry;

    switch(modelType) {
      case '001':
        geometry = new THREE.IcosahedronGeometry(1.2, 0);
        break;
      case '002':
        geometry = new THREE.TorusGeometry(1, 0.5, 16, 32);
        break;
      case '003':
        geometry = new THREE.IcosahedronGeometry(1.3, 1);
        break;
      default:
        geometry = new THREE.SphereGeometry(1, 32, 32);
    }

    let material: THREE.MeshPhysicalMaterial;

    switch(modelType) {
      case '001':
        material = new THREE.MeshPhysicalMaterial({
          color: 0x8B5CF6,
          metalness: 0.6,
          roughness: 0.2,
          transparent: true,
          opacity: 0.9,
          emissive: 0x8B5CF6,
          emissiveIntensity: 0.2,
          transmission: 0.8,
          thickness: 0.5,
          iridescence: 0.8,
          iridescenceIOR: 1.3
        });
        break;
      case '002':
        material = new THREE.MeshPhysicalMaterial({
          color: 0x0EA5E9,
          metalness: 0.9,
          roughness: 0.1,
          emissive: 0x0EA5E9,
          emissiveIntensity: 0.5,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        });
        break;
      case '003':
        material = new THREE.MeshPhysicalMaterial({
          color: 0x4ade80,
          metalness: 0.7,
          roughness: 0.3,
          emissive: 0x4ade80,
          emissiveIntensity: 0.3,
          wireframe: true
        });
        break;
      default:
        material = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0.5,
          roughness: 0.5
        });
    }

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    let time = 0;
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      time += 0.01;

      mesh.rotation.y += 0.01;
      mesh.rotation.x = Math.sin(time * 0.5) * 0.1;

      greenLight.position.x = Math.sin(time * 0.7) * 3;
      greenLight.position.y = Math.cos(time * 0.5) * 3;

      purpleLight.position.x = Math.sin(time * 0.3 + 2) * 3;
      purpleLight.position.y = Math.cos(time * 0.4 + 1) * 3;

      renderer.render(scene, camera);
      return animationId;
    };

    const animationId = animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.clear();
    };
  }, [modelType]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-transparent"
    />
  );
};

export default NFTModel;
