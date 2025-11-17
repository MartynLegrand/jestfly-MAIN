import { useEffect } from 'react';
import * as THREE from 'three';
import { ModelParameters, defaultModelParams } from '../types/model';

const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
};

const getDeviceCapabilities = () => {
  const mobile = isMobile();
  const pixelRatio = window.devicePixelRatio || 1;

  return {
    isMobile: mobile,
    isLowEnd: mobile && pixelRatio < 2,
    pixelRatio: mobile ? Math.min(pixelRatio, 1.5) : Math.min(pixelRatio, 2),
    subdivisions: mobile ? (pixelRatio < 2 ? 0 : 1) : 2,
    enableAntialiasing: !mobile || pixelRatio >= 2,
  };
};

export const useCrystalScene = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  parameters: ModelParameters = defaultModelParams
) => {
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const capabilities = getDeviceCapabilities();

    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: capabilities.enableAntialiasing,
      alpha: true,
      powerPreference: capabilities.isMobile ? 'low-power' : 'high-performance',
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(capabilities.pixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = parameters.lightIntensity || 1.5;

    console.log('[3D Scene] Device capabilities:', capabilities);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0x8B5CF6, 2, 10);
    purpleLight.position.set(-1.5, 2, 2);
    scene.add(purpleLight);

    const greenLight = new THREE.PointLight(0x4ade80, 2, 10);
    greenLight.position.set(2, -1.5, 2);
    scene.add(greenLight);

    const geometry = new THREE.IcosahedronGeometry(1, capabilities.subdivisions);
    console.log(`[3D Scene] Using LOD level: ${capabilities.subdivisions} (triangles: ${geometry.attributes.position.count / 3})`);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(parameters.color || defaultModelParams.color),
      metalness: parameters.metalness ?? defaultModelParams.metalness,
      roughness: parameters.roughness ?? defaultModelParams.roughness,
      transmission: parameters.transmission ?? defaultModelParams.transmission,
      thickness: parameters.thickness ?? defaultModelParams.thickness,
      envMapIntensity: parameters.envMapIntensity ?? defaultModelParams.envMapIntensity,
      clearcoat: parameters.clearcoat ?? defaultModelParams.clearcoat,
      clearcoatRoughness: parameters.clearcoatRoughness ?? defaultModelParams.clearcoatRoughness,
      ior: parameters.ior ?? defaultModelParams.ior,
      reflectivity: parameters.reflectivity ?? defaultModelParams.reflectivity,
      iridescence: parameters.iridescence ?? defaultModelParams.iridescence,
      iridescenceIOR: parameters.iridescenceIOR ?? defaultModelParams.iridescenceIOR,
      transparent: true,
      opacity: parameters.opacity ?? defaultModelParams.opacity,
      wireframe: parameters.wireframe ?? defaultModelParams.wireframe
    });

    const crystalMesh = new THREE.Mesh(geometry, material);
    scene.add(crystalMesh);

    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    let time = 0;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    let fps = 60;

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      time += 0.01;
      frameCount++;

      const now = performance.now();
      if (now - lastFpsUpdate > 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
        console.log(`[3D Scene Performance] FPS: ${fps}`);
        frameCount = 0;
        lastFpsUpdate = now;
      }

      crystalMesh.rotation.y += 0.003;
      crystalMesh.rotation.x = Math.sin(time * 0.1) * 0.05;
      crystalMesh.rotation.z = Math.cos(time * 0.15) * 0.02;

      const scale = 1 + Math.sin(time) * 0.01;
      crystalMesh.scale.set(scale, scale, scale);

      if (!capabilities.isLowEnd) {
        purpleLight.position.x = Math.sin(time * 0.7) * 3;
        purpleLight.position.y = Math.cos(time * 0.5) * 3;
        greenLight.position.x = Math.sin(time * 0.3 + 2) * 3;
        greenLight.position.y = Math.cos(time * 0.4 + 1) * 3;
      }

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
  }, [parameters]);
};
