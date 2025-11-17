import React, { useEffect, useRef } from 'react';

interface ParticlesBackgroundProps {
  count?: number;
  className?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ 
  count = 50,
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const randomLeft = Math.random() * 100;
      const randomTop = Math.random() * 100;
      particle.style.left = randomLeft + '%';
      particle.style.top = randomTop + '%';
      
      const tx = (Math.random() - 0.5) * 200;
      const ty = (Math.random() - 0.5) * 200;
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      
      const randomDelay = Math.random() * 20;
      const randomDuration = 15 + Math.random() * 10;
      particle.style.animationDelay = randomDelay + 's';
      particle.style.animationDuration = randomDuration + 's';
      
      containerRef.current.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, [count]);

  return <div ref={containerRef} className={'particles-container ' + className} />;
};

export default ParticlesBackground;
