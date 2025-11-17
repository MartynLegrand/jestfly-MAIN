import React from 'react';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import ScrollFadeIn from './effects/ScrollFadeIn';
import Card3D from './effects/Card3D';
import { useIsMobile } from '../hooks/use-mobile';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

const EventsSection: React.FC = () => {
  const isMobile = useIsMobile();

  const events: Event[] = [
    {
      id: 'e001',
      title: 'SOUND REALM EXPERIENCE',
      date: 'JUL 15, 2023',
      time: '22:00',
      location: 'Neo Arena, Tokyo',
      image: '/assets/imagem1.jpg'
    },
    {
      id: 'e002',
      title: 'DIGITAL FRONTIER TOUR',
      date: 'AUG 23, 2023',
      time: '20:30',
      location: 'Tech Pavilion, San Francisco',
      image: '/assets/imagem1.jpg'
    },
    {
      id: 'e003',
      title: 'CRYSTAL VIBES FESTIVAL',
      date: 'SEP 05, 2023',
      time: '18:00',
      location: 'Quantum Field, London',
      image: '/assets/imagem1.jpg'
    }
  ];

  return (
    <section className="w-full py-20 relative overflow-hidden glass-morphism-subtle">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollFadeIn>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tighter">
                UPCOMING <span className="text-gradient-animate">EVENTS</span>
              </h2>
              <p className="text-white/70 max-w-md">
                Experience the future of entertainment with our immersive live performances.
              </p>
            </div>
            
            <div className="mt-6 md:mt-0">
              <button className="group flex items-center space-x-2 px-5 py-2.5 rounded-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors btn-magnetic ripple">
                <span className="text-sm font-medium uppercase">View All Events</span>
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronRight className="h-3 w-3 text-black" />
                </div>
              </button>
            </div>
          </div>
        </ScrollFadeIn>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <ScrollFadeIn key={event.id} delay={index * 100}>
              {isMobile ? (
                <div className="group relative overflow-hidden rounded-lg neo-blur border border-white/10 hover:border-white/20 transition-all hover-lift-enhanced shimmer glow-cursor-area">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-md border border-white/10 text-white text-xs font-medium">
                      {event.date}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">{event.title}</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-white/70">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      
                      <div className="flex items-center text-white/70">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    
                    <button className="mt-4 w-full py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm uppercase font-medium transition-colors ripple">
                      Reserve Spot
                    </button>
                  </div>
                  
                  <div className="absolute top-0 left-6 w-px h-3 bg-purple-500/50"></div>
                  <div className="absolute top-0 left-10 w-px h-5 bg-blue-500/50"></div>
                  <div className="absolute bottom-0 right-6 w-px h-3 bg-purple-500/50"></div>
                  <div className="absolute bottom-0 right-10 w-px h-5 bg-blue-500/50"></div>
                </div>
              ) : (
                <Card3D intensity={8} className="group relative overflow-hidden rounded-lg neo-blur border border-white/10 hover:border-white/20 transition-all hover-lift-enhanced shimmer glow-cursor-area">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-md border border-white/10 text-white text-xs font-medium">
                      {event.date}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">{event.title}</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-white/70">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      
                      <div className="flex items-center text-white/70">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    
                    <button className="mt-4 w-full py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm uppercase font-medium transition-colors ripple">
                      Reserve Spot
                    </button>
                  </div>
                  
                  <div className="absolute top-0 left-6 w-px h-3 bg-purple-500/50"></div>
                  <div className="absolute top-0 left-10 w-px h-5 bg-blue-500/50"></div>
                  <div className="absolute bottom-0 right-6 w-px h-3 bg-purple-500/50"></div>
                  <div className="absolute bottom-0 right-10 w-px h-5 bg-blue-500/50"></div>
                </Card3D>
              )}
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
