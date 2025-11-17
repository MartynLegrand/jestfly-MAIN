import React, { useState, useEffect } from 'react';
import CrystalComponent from '../CrystalComponent';
import { ModelParameters, defaultModelParams } from '../types/model';
import { Calendar } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import GlassAudioPlayer from './GlassAudioPlayer';
import JestCoinTicker from './JestCoinTicker';
import ParticlesBackground from './effects/ParticlesBackground';
import ScrollIndicator from './effects/ScrollIndicator';

interface CrystalHeroProps {
  title?: string;
  subtitle?: string;
  crystalParams?: Partial<ModelParameters>;
  className?: string;
}

const CrystalHero: React.FC<CrystalHeroProps> = ({
  title = "JESTFLY",
  subtitle = "Descubra efeitos de vidro hiper-realista",
  crystalParams = defaultModelParams,
  className = ""
}) => {
  const isMobile = useIsMobile();
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallaxOffset = scrollPosition * 0.5;

  return (
    <section className={'hero relative h-screen flex flex-col pt-20 overflow-hidden ' + className + ' scanlines'}>
      {/* Aurora Background Effect */}
      <div className="aurora-bg" />
      
      {/* Particles Effect */}
      {!isMobile && <ParticlesBackground count={30} />}
      
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-900/20 via-black to-black z-0"></div>

      {/* Animated blobs with parallax */}
      <div 
        className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-primary-500/15 blur-[120px] animate-float animate-pulse-glow blob z-10"
        style={{ transform: 'translateY(' + parallaxOffset * 0.3 + 'px)' }}
      ></div>
      <div 
        className="absolute bottom-[5%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-accent-500/15 blur-[120px] animate-float blob z-10" 
        style={{
          animationDelay: '-5s',
          transform: 'translateY(' + -parallaxOffset * 0.2 + 'px)'
        }}
      ></div>

      <div className="absolute inset-0 opacity-30 pointer-events-none z-10" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(139, 92, 246, 0.1) 100%)'
      }}></div>
      
      {/* Side captions with enhanced animation */}
      <div className="absolute top-1/3 left-4 sm:left-8 z-30 hidden md:block animate-slide-up">
        <div className="p-3 rounded-lg mb-3 card-modern hover-lift-enhanced glass-morphism-enhanced shimmer glow-cursor-area">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 text-gradient-animate">bangers only</h2>
          <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
            <p>IT'S ALWAYS TIME</p>
            <p>TO ENJOY</p>
          </div>
        </div>
      </div>

      <div className="absolute top-1/3 right-4 sm:right-8 z-30 text-right hidden md:block animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="card-modern hover-lift-enhanced glass-morphism-enhanced p-3 rounded-lg shimmer glow-cursor-area">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 text-gradient-animate">inspired</h2>
          <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
            <p>FROM 10:00</p>
            <p>TO 19:00</p>
          </div>
        </div>
      </div>
      
      {/* Crystal with parallax effect */}
      <div 
        className="hero-crystal relative z-20 w-full h-3/4 flex items-center justify-center parallax-layer"
        style={{ transform: 'translateY(' + -scrollPosition * 0.2 + 'px)' }}
      >
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl h-full">
          <CrystalComponent parameters={crystalParams} />
        </div>
      </div>
      
      {/* Glassmorphism audio player */}
      <GlassAudioPlayer isMinimized={isPlayerMinimized} setIsMinimized={setIsPlayerMinimized} />
      
      {/* JestCoin ticker for mobile */}
      <div className="absolute top-24 right-4 z-30 md:hidden">
        <JestCoinTicker compact={true} />
      </div>
      
      {/* Fuller JestCoin ticker at the bottom */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center z-30">
        <div className="shimmer">
          <JestCoinTicker />
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
      
      {/* Footer information */}
      <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-6 z-30 flex justify-between items-center text-xs text-white/70">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs">5/15/2023</span>
        </div>
        
        <div className="hidden md:block uppercase">BUS® ©2023</div>
        
        <div className="hidden md:block">50°05'36.2"N 14°26'51.3"E</div>
      </div>
    </section>
  );
};

export default CrystalHero;
