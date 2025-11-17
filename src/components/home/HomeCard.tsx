import { HomepageCard } from '@/types/home';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';

interface HomeCardProps {
  card: HomepageCard;
}

const HomeCard = ({ card }: HomeCardProps) => {
  const getSocialIcon = (network: string) => {
    const icons = {
      instagram: Instagram,
      twitter: Twitter,
      facebook: Facebook,
      linkedin: Linkedin,
      youtube: Youtube,
    };
    const Icon = icons[network.toLowerCase() as keyof typeof icons];
    return Icon ? <Icon className="w-8 h-8" /> : null;
  };

  const hoverEffect = card.visual_effects?.hover || 'scale';
  const hoverClasses = {
    scale: 'hover:scale-105',
    rotate: 'hover:rotate-1',
    glow: 'hover:shadow-2xl hover:shadow-purple-500/50',
    none: '',
  };

  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'zoom': 'animate-zoom-in',
    'none': '',
  };

  const CardWrapper = card.link_url ? Link : 'div';
  const cardProps = card.link_url
    ? { to: card.link_url, target: card.link_url.startsWith('http') ? '_blank' : undefined }
    : {};

  return (
    <CardWrapper {...cardProps}>
      <Card
        className={'glass-morphism group cursor-pointer transition-all duration-300 ' + 
          hoverClasses[hoverEffect] + ' ' + 
          animationClasses[card.visual_effects?.animation || 'fade-in']}
      >
        <CardContent className="p-6 space-y-4">
          {card.image_url && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={card.image_url}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}

          {card.card_type === 'social' && card.social_network && (
            <div className="flex items-center justify-center text-purple-400">
              {getSocialIcon(card.social_network)}
            </div>
          )}

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">{card.title}</h3>
            {card.description && (
              <p className="text-white/70">{card.description}</p>
            )}
          </div>

          {card.card_type === 'nft' && (
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm">
                NFT
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export default HomeCard;
