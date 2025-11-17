import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';
import Card3D from './effects/Card3D';
import ScrollFadeIn from './effects/ScrollFadeIn';
import * as THREE from 'three';

const ArtistShowcase: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const artists = [
    {
      name: "NERO BLVCK",
      role: "DJ | Producer",
      image: "/assets/imagem1.jpg",
      description: "Pioneering the future of electronic music with cutting-edge sound design and immersive performances."
    },
    {
      name: "CRYSTAL WAVE",
      role: "Live Act | Visual Artist",
      image: "/assets/imagem1.jpg",
      description: "Blending audiovisual experiences that transport audiences to otherworldly dimensions."
    },
    {
      name: "PULSE SYNDICATE",
      role: "DJ Collective",
      image: "/assets/imagem1.jpg",
      description: "A collective of visionary DJs pushing the boundaries of dance music through collaborative innovation."
    }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0x8B5CF6, 2, 20);
    purpleLight.position.set(-5, 3, 2);
    scene.add(purpleLight);

    const greenLight = new THREE.PointLight(0x4ade80, 2, 20);
    greenLight.position.set(5, -2, -3);
    scene.add(greenLight);

    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const type = Math.floor(Math.random() * 3);
      let geometry;

      if (type === 0) {
        geometry = new THREE.IcosahedronGeometry(0.5 * Math.random() + 0.3, 0);
      } else if (type === 1) {
        geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8);
      } else {
        geometry = new THREE.SphereGeometry(0.4, 32, 32);
      }

      const colors = [0x8B5CF6, 0x4ade80, 0xE5DEFF];
      const material = new THREE.MeshPhysicalMaterial({
        color: colors[Math.floor(Math.random() * 3)],
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7,
        emissive: colors[Math.floor(Math.random() * 3)],
        emissiveIntensity: Math.random() > 0.5 ? 0.5 : 0
      });

      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      shapes.push(shape);
      scene.add(shape);
    }

    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      shapes.forEach((shape, i) => {
        shape.rotation.x = time * 0.1 * (i % 3);
        shape.rotation.y = time * 0.2 * ((i + 1) % 3);
        shape.position.y += Math.sin(time + i) * 0.002;
        shape.position.x += Math.cos(time * 0.7 + i) * 0.001;
      });

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
  }, []);

  return (
    <section className="relative w-full py-20 overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
              <span className="text-gradient-animate">MEET OUR</span> ARTISTS
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              The visionary talents redefining electronic music and pushing the boundaries of artistic expression.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {artists.map((artist, index) => (
            <ScrollFadeIn key={index} delay={index * 100}>
              {isMobile ? (
                <motion.div
                  className="relative overflow-hidden rounded-3xl group card-modern hover-lift-enhanced glass-morphism-enhanced"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div className="aspect-[2/3] w-full overflow-hidden shimmer">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <motion.div
                    className="absolute inset-0 backdrop-blur-md border border-white/20 transition-all duration-300"
                    animate={{
                      backdropFilter: activeCard === index ? "blur(0px)" : "blur(8px)",
                      backgroundColor: activeCard === index ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.5)"
                    }}
                  >
                    <div className="absolute w-16 h-16 right-4 top-4 opacity-50 rotate-45 rounded-lg bg-gradient-to-tr from-primary-500/30 to-transparent blob"></div>
                    <div className="absolute w-24 h-24 -left-6 bottom-10 opacity-30 rounded-full bg-gradient-to-tr from-accent-500/30 to-transparent blob"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{artist.name}</h3>
                      <p className="text-white/70 text-sm mb-3">{artist.role}</p>

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: activeCard === index ? 1 : 0,
                          height: activeCard === index ? "auto" : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mb-4">{artist.description}</p>
                        <button className="btn-modern btn-magnetic ripple">
                          DISCOVER MORE
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <Card3D className="relative overflow-hidden rounded-3xl group card-modern hover-lift-enhanced glass-morphism-enhanced" intensity={5}>
                  <div className="aspect-[2/3] w-full overflow-hidden shimmer">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <motion.div
                    className="absolute inset-0 backdrop-blur-md border border-white/20 transition-all duration-300"
                    onMouseEnter={() => setActiveCard(index)}
                    onMouseLeave={() => setActiveCard(null)}
                    animate={{
                      backdropFilter: activeCard === index ? "blur(0px)" : "blur(8px)",
                      backgroundColor: activeCard === index ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.5)"
                    }}
                  >
                    <div className="absolute w-16 h-16 right-4 top-4 opacity-50 rotate-45 rounded-lg bg-gradient-to-tr from-primary-500/30 to-transparent blob"></div>
                    <div className="absolute w-24 h-24 -left-6 bottom-10 opacity-30 rounded-full bg-gradient-to-tr from-accent-500/30 to-transparent blob"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{artist.name}</h3>
                      <p className="text-white/70 text-sm mb-3">{artist.role}</p>

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: activeCard === index ? 1 : 0,
                          height: activeCard === index ? "auto" : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mb-4">{artist.description}</p>
                        <button className="btn-modern btn-magnetic ripple">
                          DISCOVER MORE
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                </Card3D>
              )}
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistShowcase;
