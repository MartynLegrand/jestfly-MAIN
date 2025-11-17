import HeroSection from '@/components/home/HeroSection';
import CardGrid from '@/components/home/CardGrid';
import NFTSection from '@/components/NFTSection';
import EventsSection from '@/components/EventsSection';
import ShopPreview from '@/components/ShopPreview';
import ConnectionSection from '@/components/ConnectionSection';
import ArtistShowcase from '@/components/ArtistShowcase';

const HomePageNew = () => {
  return (
    <>
      <HeroSection />
      
      <CardGrid />
      
      <div className="w-full bg-black py-4 border-t border-b border-white/10 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS
          </div>
        </div>
      </div>
      
      <ArtistShowcase />
      
      <NFTSection />
      
      <EventsSection />
      
      <ShopPreview />
      
      <ConnectionSection />
    </>
  );
};

export default HomePageNew;
