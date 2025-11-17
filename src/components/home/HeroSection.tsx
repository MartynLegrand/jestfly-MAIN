import { useHeroConfig } from '@/hooks/useHeroConfig';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import HeroVideo from './HeroVideo';
import Hero3D from './Hero3D';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { heroConfig, loading } = useHeroConfig();

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-black">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!heroConfig) {
    return null;
  }

  const contentPositionClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {heroConfig.media_type === 'video' && heroConfig.media_url && (
        <HeroVideo
          videoUrl={heroConfig.media_url}
          autoplay={heroConfig.animation_settings.autoplay}
          loop={heroConfig.animation_settings.loop}
        />
      )}

      {heroConfig.media_type === '3d' && heroConfig.model_id && (
        <Hero3D modelId={heroConfig.model_id} />
      )}

      {heroConfig.media_type === 'image' && heroConfig.media_url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: 'url(' + heroConfig.media_url + ')'}}
        />
      )}

      <div
        className="absolute inset-0 bg-black transition-opacity"
        style={{ opacity: heroConfig.overlay_opacity }}
      />

      <div className={'relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 ' + contentPositionClasses[heroConfig.content_position]}>
        <div className="max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white animate-fade-in glow-text">
            {heroConfig.title}
          </h1>

          {heroConfig.subtitle && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-purple-300 animate-fade-in animation-delay-200">
              {heroConfig.subtitle}
            </h2>
          )}

          {heroConfig.description && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl animate-fade-in animation-delay-400">
              {heroConfig.description}
            </p>
          )}

          <div className="pt-4 animate-fade-in animation-delay-600">
            <Link to={heroConfig.cta_link}>
              <Button
                size={heroConfig.cta_style.size || 'lg'}
                variant={heroConfig.cta_style.variant || 'default'}
                className="text-lg px-8 py-6 glow-purple hover:scale-105 transition-all"
              >
                {heroConfig.cta_text}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
