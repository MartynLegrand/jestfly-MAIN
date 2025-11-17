
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import Logo3D from './header/Logo3D';
import WelcomeText from './header/WelcomeText';
import DesktopNav from './header/DesktopNav';
import MobileMenuToggle from './header/MobileMenuToggle';
import HeaderControls from './header/HeaderControls';
import MobileMenu from './header/MobileMenu';

interface MenuItem {
  label: string;
  href: string;
}

interface GlassHeaderProps {
  menuItems?: MenuItem[];
}

const GlassHeader: React.FC<GlassHeaderProps> = ({ menuItems = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  useEffect(() => {
    // Efeito inicial de glassmorphism ao navegar
    setScrolled(true);
    
    const timer = setTimeout(() => {
      setScrolled(false);
    }, 1000);
    
    // Monitorar o scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificação inicial
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [location.pathname]);
  
  // Fechar menu mobile quando a rota muda
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Classes de efeito de vidro com base no estado de scroll
  const glassEffect = scrolled
    ? "bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-500"
    : "bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-[16px] backdrop-saturate-[150%] transition-all duration-500";
  
  return (
    <header className={`fixed top-0 left-0 w-full z-50 ${glassEffect}`}>
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-12">
            <Logo3D />
            {!isMobile && <WelcomeText />}
          </div>
          
          {/* Navegação desktop */}
          <DesktopNav menuItems={menuItems} />
          
          {/* Controles e toggle do menu mobile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <HeaderControls />
            <MobileMenuToggle 
              isOpen={mobileMenuOpen} 
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
            />
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        menuItems={menuItems} 
        onItemClick={() => setMobileMenuOpen(false)} 
        activePathname={location.pathname}
      />
    </header>
  );
};

export default GlassHeader;
